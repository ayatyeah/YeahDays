"""Descriptive participant-level analysis; no significance claims or interview uploads."""
import csv
import json
import statistics as stats
import sys
from pathlib import Path

source, destination = sys.argv[1:3]
data = json.loads(Path(source).read_text())
if data.get('dataset') != 'behavior':
    raise SystemExit('Use the behavior export; interviews stay in a separate restricted dataset.')
out = Path(destination)
out.mkdir(parents=True, exist_ok=True)
# The standalone pilot and the main application are distinct interface exposures.
# Preserve their raw exports, but do not silently pool them into the main trial.
all_participants = data['participants']
target_interface = 'main-app-v1' if any(p.get('interface_version') == 'main-app-v1' for p in all_participants) else 'standalone-v1'
excluded = [p for p in all_participants if p.get('mixed_interface') or p.get('interface_version', 'standalone-v1') != target_interface]
data['participants'] = [p for p in all_participants if p not in excluded]
(out / 'analysis-scope.json').write_text(json.dumps({'interface': target_interface, 'excluded_mixed_or_other_interface': len(excluded), 'excluded_participant_ids': [p['participant_id'] for p in excluded]}, indent=2))
rows = []
for p in data['participants']:
    for w in p['weeks']:
        rows.append({'participant_id': p['participant_id'], 'condition': p['condition'], **w})
if rows:
    with (out / 'participant-weeks.csv').open('w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
summary = {}
for condition in ['A', 'B']:
    participants = [p for p in data['participants'] if p['condition'] == condition]
    group = {'enrolled': len(participants), 'withdrawn': sum(p['withdrawn_at'] is not None for p in participants),
             'missing_interviews': sum(not p['interview_submitted'] for p in participants if not p['withdrawn_at']), 'weeks': []}
    for week in range(1, 5):
        # Do not treat unobserved/partial weeks as complete observations.
        observed = [r for r in rows if r['condition'] == condition and r['week'] == week and r['week_finished']]
        result = {'week': week, 'participants_with_full_week': len(observed)}
        for key in ['sessions', 'completion_rate', 'median_task_seconds']:
            values = [r[key] for r in observed if r[key] is not None]
            result[key] = {'n': len(values), 'mean': stats.mean(values) if values else None,
                           'median': stats.median(values) if values else None,
                           'sample_sd': stats.stdev(values) if len(values) > 1 else None}
        group['weeks'].append(result)
    group['total'] = {}
    finished = [p['total'] for p in participants if p.get('total') and p['total']['trial_finished']]
    for key in ['sessions', 'completion_rate', 'median_task_seconds']:
        values = [p[key] for p in finished if p[key] is not None]
        group['total'][key] = {'n': len(values), 'mean': stats.mean(values) if values else None,
                               'median': stats.median(values) if values else None,
                               'sample_sd': stats.stdev(values) if len(values) > 1 else None}
    summary[condition] = group
(out / 'group-summary.json').write_text(json.dumps(summary, indent=2))
# Static, portable weekly plot with missing observations shown as gaps.
svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="760" height="320" viewBox="0 0 760 320">',
       '<rect width="760" height="320" fill="white"/>',
       '<text x="40" y="30" font-family="sans-serif" font-size="18">Weekly mean sessions · full observed weeks only</text>']
values = [w['sessions']['mean'] for c in summary.values() for w in c['weeks'] if w['sessions']['mean'] is not None]
maximum = max(values + [1])
svg.append(f'<text x="10" y="65">{maximum:.1f}</text><text x="20" y="260">0</text>')
for condition, color in [('A', '#286c55'), ('B', '#6045a3')]:
    previous = None
    for w in summary[condition]['weeks']:
        value = w['sessions']['mean']
        if value is None:
            previous = None
            continue
        x, y = 100 + (w['week'] - 1) * 180, 255 - value / maximum * 190
        if previous:
            svg.append(f'<line x1="{previous[0]}" y1="{previous[1]}" x2="{x}" y2="{y}" stroke="{color}" stroke-width="3"/>')
        svg.append(f'<circle cx="{x}" cy="{y}" r="5" fill="{color}"/>')
        previous = (x, y)
    svg.append(f'<text x="{80 if condition == "A" else 380}" y="310" fill="{color}">Group {condition}</text>')
for w in range(1, 5):
    svg.append(f'<text x="{80 + (w-1)*180}" y="280">Week {w}</text>')
svg.append('</svg>')
(out / 'weekly-sessions.svg').write_text(''.join(svg))
print(f'Wrote descriptive tables and weekly plot to {out}. Repeated weeks are not independent participants.')
