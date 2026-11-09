"""Merge reviewed, per-module edits; fail closed on missing or duplicate cards."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
base = root / 'src/lib/events/computerNetworksEndterm'
public = root / 'public/events/computer-networks-endterm'
bank = json.loads((base/'bank.json').read_text())
supplements = json.loads((base/'question-supplements.json').read_text())
reviews=[]
for module in range(8,17):
    review=json.loads((base/f'audit/module-{module}.json').read_text())
    expected={q['id'] for q in bank if q['topic']==module}
    patches={q['id']:q for q in review['questions']}
    assert len(patches)==len(review['questions']) and set(patches)==expected, f'Missing/duplicate module {module}'
    for q in bank:
        if q['id'] not in patches: continue
        patch=patches[q['id']]
        for key in ['explanation','explanationEn']:
            assert len(patch[key])>90,(q['id'],key)
            q[key]=patch[key]
        for key,value in patch.get('correction',{}).items():
            assert key in ['answers','correct','answerText','eligible','caution','prompt'],key
            q[key]=value
        if q['eligible']:
            assert q['correct'] and not q['caution'],q['id']
            assert len(q['correct'])==len(q['answers']),q['id']
            assert all(0<=i<len(q['options']) for i in q['correct']),q['id']
    reviews.append(review)
(base/'bank.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
# Store audit additions separately from the video-season source notes.
extra={str(r['module']):r['notes'] for r in reviews}
(base/'course-supplements.json').write_text(json.dumps(extra,ensure_ascii=False,indent=2)+'\n')
for lang in ['ru','en']:
    notes=json.loads((base/('notes.json' if lang=='ru' else 'notes-en.json')).read_text())
    title='полный конспект' if lang=='ru' else 'full study notes'
    intro='Объяснения по материалам лекций 5–10 и доступному тексту NetAcad. Схемы, видео и PT-задания сверяй с оригиналом курса.' if lang=='ru' else 'Explanations based on lectures 5–10 and available NetAcad text. Consult the original course for diagrams, videos and Packet Tracer activities.'
    (public/f'notes-{lang}.md').write_text(f'# Computer Networks — {title}\n\n{intro}\n\n'+'\n\n---\n\n'.join(notes[str(m)]+'\n\n'+supplements[str(m)][lang]+'\n\n'+extra[str(m)][lang] for m in range(8,17))+'\n')
for filename,qs in [('question-bank.md',bank),('core-250.md',[q for q in bank if q['core']])]:
    chunks=['# Computer Networks — вопросы с разбором\n\nЭто доступный тематический отбор, а не гарантия вопросов экзамена. Карточки с оговорками сохранены для чтения; автоматические тесты используют только допустимые карточки.']
    for q in qs:
        s=f"### {q['id']}. {q['prompt']}\n\nИсточник: {q['source']}. Тема: модуль {q['topic']}.\n\n"+'\n'.join(f'{i+1}. {v}' for i,v in enumerate(q['options']))
        if q['caution']:s+='\n\n> '+q['caution']
        s+='\n\n**Ответ:** '+q['answerText']+'\n\n**Объяснение:** '+q['explanation']+'\n\n**Explanation in English:** '+q['explanationEn']
        chunks.append(s)
    (public/filename).write_text('\n\n'.join(chunks)+'\n')
cards=json.loads((base/'express.json').read_text())
(public/'express-prep.md').write_text('# Экспресс-подготовка к Computer Networks\n\nСначала ответь вслух, затем открой разбор. Это повторение ключевых тем, не прогноз состава квиза.\n\n## План на 3 часа\n35 минут TCP/UDP и приложения; 25 минут IOS/SSH; 30 минут адресация; 20 минут IP/ARP/ICMP; 10 минут безопасность; 45 минут пробная эндка; 15 минут ошибки.\n\n## План на 1 час\nПо 15 минут: транспорт/приложения; IOS/маршруты/SSH; адресация/ARP/ICMP; самопроверка.\n\n'+'\n\n'.join(f"## Модуль {c['module']} · {c['question']}\n\n{c['answer']}\n\n{c['english']}" for c in cards)+'\n')
report=['# Аудит подготовки · 9 ноября 2026','Проверены сохранённые тексты NetAcad от 7 ноября, лекции 5–10 и 558 карточек. Оглавление текущего курса повторно сверено в браузере; полный мультимедийный архив и выполнение PT не заявляются.']
for r in reviews:
    report.append(f"## Модуль {r['module']}\n\nКарточек: {len(r['questions'])}.\n\n### Покрытие источника\n"+'\n'.join('- '+json.dumps(c,ensure_ascii=False) for c in r['coverage'])+'\n\n### Замечания\n'+'\n'.join('- '+(c if isinstance(c,str) else json.dumps(c,ensure_ascii=False)) for c in r['issues']))
(public/'audit-report.md').write_text(('\n\n'.join(report)+'\n').replace('/home/yeahayat/Загрузки/комп нет/', ''))
for filename in ['notes-ru.md','notes-en.md']:
    p=public/filename
    p.write_text(p.read_text().rstrip()+'\n')
print('Reviewed',len(bank),'cards; excluded',sum(not q['eligible'] for q in bank))
