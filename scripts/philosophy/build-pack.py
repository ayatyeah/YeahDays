"""Build an offline preparation pack from the same content used by the course.
Usage: python scripts/philosophy/build-pack.py SOURCE_PDF_DIRECTORY OUTPUT_DIRECTORY
"""
import hashlib
import html
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path
from urllib.parse import quote

repo = Path(__file__).resolve().parents[2]
source, destination = map(Path, sys.argv[1:3])
root = destination / 'Philosophy_Final_Preparation_2026-11-16'
root.mkdir(parents=True, exist_ok=True)
originals = root / 'LMS_Originals'
originals.mkdir(exist_ok=True)
notebook = json.loads((repo / 'src/lib/events/finals/philosophy.json').read_text())
guide = json.loads((repo / 'src/lib/philosophy/study-guide.json').read_text())
js = "import {WORKSHOP} from './src/lib/philosophy/workshop.ts'; import {CASES,RUBRIC} from './src/lib/philosophy/practice.ts'; console.log(JSON.stringify({WORKSHOP,CASES,RUBRIC}));"
practice = json.loads(subprocess.check_output(['node', '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON', '--input-type=module', '-e', js], cwd=repo, text=True))
e = html.escape
manifest = []
for record in notebook['sources']:
    matches = list(source.glob(record['id'] + '__*.pdf'))
    if not matches:
        if record.get('sha256') or record['id'] == '98636':
            raise ValueError('Missing required PDF: ' + record['id'])
        manifest.append({**record, 'status': 'Online activity / announcement; no local PDF'})
        continue
    file = matches[0]
    digest = hashlib.sha256(file.read_bytes()).hexdigest()
    if record.get('sha256') and record['sha256'] != digest:
        raise ValueError('Source hash mismatch: ' + file.name)
    shutil.copy2(file, originals / file.name)
    manifest.append({**record, 'file': 'LMS_Originals/' + file.name, 'sha256': digest})
assert len([x for x in manifest if x.get('file')]) == 24
(root / 'Sources_manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
(root / 'Course_content.json').write_text(json.dumps({'guide': guide, 'notebook': notebook, 'practice': practice}, ensure_ascii=False, indent=2) + '\n')

readme = '''PHILOSOPHY — FINAL PREPARATION
Собрано 16 ноября 2026.

НАЧНИ ЗДЕСЬ
Распакуй ZIP целиком. Открой START_HERE.html в браузере: учебник работает без интернета.
Все материалы также сохранены в отдельных Markdown / TXT файлах.

ПОРЯДОК ПОДГОТОВКИ
1. Прочитай требования и «Учимся писать по шагам».
2. Прочитай английское эссе и русский разбор каждого абзаца.
3. Выучи первые три группы философов; затем повторяй остальные тройки.
4. Пройди объяснения лекций 1–10, отвечая до открытия подсказки.
5. Выбери новый кейс, составь план, напиши один абзац и получи разбор на сайте.
6. Напиши своё полное эссе, затем повтори от руки за 50 минут без подсказок.

ЧТО ВНУТРИ
24 оригинальных PDF LMS: syllabus, 10 лекций, 10 глав для чтения,
Final Exam Criteria, Exam Policy и все case studies из соответствующего PDF.
Авторские пояснения: полный пример эссе (406 слов), разбор каждого абзаца,
28 мыслителей в 13 тройках с повторением опорных имён, объяснения 10 тем,
5 адаптированных тренировочных кейсов, рубрика, английские связки и чек-лист.
Полные двуязычные конспекты, исходные данные и ссылки на ресурсы.

ГРАНИЦЫ
Учебные пояснения — не постраничный перевод всех слайдов и не официальный ответ.
28 мыслителей — состав текущего конспекта и практикума, не перечень всех имён в учебниках.
Английские фразы в карточках — учебные формулировки, не цитаты философов.
Исходные PDF скачаны 15 ноября; требования перепроверены в LMS 16 ноября.
Дата, время и аудитория очного экзамена не подтверждены. 4 декабря 23:00 в
Moodle — технический срок карточек, а не подтверждённое время экзамена.
Приложение расписания из объявления не удалось получить; ссылка есть в источниках.
ИИ-проверка работает только онлайн, после входа и согласия на отправку текста.
На самом экзамене ИИ, интернет, устройства, конспекты и словари запрещены.

ОНЛАЙН
https://yeahgrind.site/events/philosophy-final
https://yeahgrind.site/events/courses/philosophy
'''
(root / 'README_RU.txt').write_text(readme)

def save(name, text):
    (root / name).write_text(text + '\n')

def md_html(text):
    # Course notes use headings, list lines and paragraphs; no raw HTML needed.
    parts = []
    for block in text.split('\n\n'):
        for line in block.splitlines():
            if line.startswith('### '): parts.append('<h4>' + e(line[4:]) + '</h4>')
            elif line.startswith('## '): parts.append('<h3>' + e(line[3:]) + '</h3>')
            elif line.startswith('# '): parts.append('<h2>' + e(line[2:]) + '</h2>')
            elif line.startswith('- '): parts.append('<p class="bullet">• ' + e(line[2:]) + '</p>')
            elif line.strip(): parts.append('<p>' + e(line) + '</p>')
    return '\n'.join(parts)

sections = []
def section(id, title, body):
    sections.append('<section id="' + id + '"><h2>' + e(title) + '</h2>' + body + '</section>')

section('start', 'Как пользоваться', '<pre>' + e(readme) + '</pre>')
save('01_Final_requirements_RU.md', notebook['guide']['ru'])
section('rules', 'Требования к final', md_html(notebook['guide']['ru']))
workshop = '\n\n'.join('# '+x['title']['ru']+'\n\n'+x['notes']['ru'] for x in practice['WORKSHOP'])
save('02_Writing_from_zero_RU.md', workshop)
section('workshop', 'Учимся писать с нуля', md_html(workshop))
essay = '\n\n'.join(p['text'] for p in guide['essay']['paragraphs'])
save('03_Model_essay_EN.txt', guide['essay']['title']+'\n\n'+essay)
breakdown = '# '+guide['essay']['title']+'\n\n'+guide['essay']['case']+'\n\n'+guide['essay']['notice']+'\n\n'
body = '<p>'+e(guide['essay']['case'])+'</p><p>'+e(guide['essay']['notice'])+'</p><article lang="en"><h3>'+e(guide['essay']['title'])+'</h3>'+''.join('<p>'+e(p['text'])+'</p>' for p in guide['essay']['paragraphs'])+'</article>'
for p in guide['essay']['paragraphs']:
    text = '## '+p['title']+'\n\n'+p['text']+'\n\n'+p['explanation']+'\n\nКонструкция: '+p['structure']+'\n\nФраза: '+p['phrase']+'\n\nТвоя попытка: '+p['exercise']
    breakdown += text+'\n\n'
    body += '<details><summary>'+e(p['title'])+' — русский разбор</summary>'+md_html(text)+'</details>'
save('04_Essay_paragraph_breakdown_RU.md', breakdown)
section('essay', 'Полное эссе и разбор', body)
triads = '# Философы по трое\n\n'+guide['scope']+'\n\nАнглийские формулировки — учебные примеры, не цитаты.\n\n'
body = '<p>'+e(guide['scope'])+'</p>'
for group in guide['groups']:
    text = '## '+group['title']+'\n\n'+group['question']+'\n\n'
    for id in group['ids']:
        t = guide['thinkers'][id]
        text += '### '+t['name']+' / '+id+'\n\nИдея: '+t['idea']+'\n\nIT-пример: '+t['application']+'\n\nEnglish: '+t['english']+'\n\nНе перепутай: '+t['mistake']+'\n\n'
    triads += text
    body += '<details><summary>'+e(group['title'])+'</summary>'+md_html(text)+'</details>'
save('05_Thinkers_in_threes_RU_EN.md', triads)
section('thinkers', 'Философы по трое', body)
lessons = '# Лекции 1–10 простыми словами\n\n'+guide['scope']+'\n\n'
body = '<p>'+e(guide['scope'])+'</p>'
for lesson in guide['lessons']:
    title = str(lesson['number'])+'. '+lesson['title']
    text = '## '+title+'\n\n'+lesson['question']+'\n\n'+lesson['explanation']+'\n\n'+'\n'.join('- '+s for s in lesson['steps'])+'\n\nПрименение: '+lesson['application']+'\n\nОшибка: '+lesson['mistake']+'\n\nEnglish: '+lesson['english']+'\n\nЗадание: '+lesson['exercise']
    lessons += text+'\n\nВозможный ответ: '+lesson['answer']+'\n\n'
    body += '<details><summary>'+e(title)+'</summary>'+md_html(text)+'<details><summary>Проверить ответ</summary><p>'+e(lesson['answer'])+'</p></details></details>'
save('06_All_10_lectures_explained_RU.md', lessons)
section('lectures', 'Объяснения всех десяти тем', body)
for lang in ['ru','en']:
    notes = '\n\n'.join('# '+l['title'][lang]+'\n\n'+'\n\n'.join(p['notes'][lang] for p in l['parts']) for l in notebook['event']['lectures'])
    save('07_Full_course_notes_'+lang.upper()+'.md', notes)
    section('notes-'+lang, 'Полный конспект / '+lang.upper(), '<details><summary>Открыть полный конспект</summary>'+md_html(notes)+'</details>')
cases = '# Практика\n\nАдаптации учебных кейсов LMS, не будущие вопросы экзамена. Полный оригинальный набор — в LMS_Originals/98636__case-study.pdf.\n\n'
for c in practice['CASES']:
    cases += '## '+c['title']['ru']+'\n\n'+c['text']['ru']+'\n\n'+c['text']['en']+'\n\nИсточник: '+c['source']+'\n\n'
cases += '## План для любого кейса\n\n- Проблема: …\n- Ontology: что это? …\n- Epistemology: откуда мы знаем? …\n- Axiology: что важно? …\n- Моя позиция и условия: …\n\n## Каждый аналитический абзац\n\nТезис → идея философа → аргумент → возражение и ответ → деталь кейса → вывод.\n\n## Самопроверка\n\n- Есть все пять частей и минимум 350 слов?\n- Я анализирую конкретную новость?\n- Идея философа объяснена, а не просто названа?\n- Есть аргумент и контраргумент в каждом анализе?\n- Итог следует из рассуждения?\n- Почерк читается?\n\n## Рубрика\n\n'+'\n'.join('- '+r['ru']+': '+str(r['max'])+'%' for r in practice['RUBRIC'])+'\n\n## ИИ-проверка\n\nОткрой https://yeahgrind.site/events/philosophy-final → «Пишу и проверяю». Начни с плана или одного абзаца, выбери кейс, войди и дай согласие на передачу текста Google Gemini. Исправь три приоритетные проблемы и запроси новый разбор. Баллы ИИ — тренировочная оценка, не оценка преподавателя. Офлайн ИИ не работает.'
save('08_Practice_cases_checklist_RU_EN.md', cases)
section('practice', 'Кейсы, шаблон и самопроверка', md_html(cases))
links = '<p>Оригиналы хранятся в этой папке; внешние ссылки LMS могут требовать входа. Отсутствие приложения с расписанием отмечено отдельно.</p><ul>'
for s in manifest:
    links += '<li>'
    if s.get('file'): links += '<a href="'+quote(s['file'])+'">'+e(Path(s['file']).name)+'</a> · '
    else: links += e(s['title'])+' · '
    links += '<a href="'+e(s['url'], quote=True)+'">LMS</a></li>'
links += '</ul>'
section('sources', 'Оригиналы и источники', links)
css='''*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f4f1eb;color:#222;font:17px/1.8 system-ui,sans-serif}main{max-width:950px;margin:auto;padding:30px 24px 90px}h1{font-size:clamp(34px,6vw,60px);line-height:1.1;letter-spacing:-.04em}h2{font-size:30px;line-height:1.25}h3{font-size:22px;line-height:1.4}h4{font-size:19px}section{margin:50px 0;padding-top:16px;border-top:1px solid #bbb}nav{display:flex;flex-wrap:wrap;gap:12px}a{color:#245340;text-underline-offset:4px;overflow-wrap:anywhere}nav a{padding:8px 14px;border:1px solid #aaa;border-radius:12px}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere}details{padding:16px 22px;margin:16px 0;background:#fff;border:1px solid #ccc;border-radius:14px}summary{cursor:pointer;font-weight:650}article{font:20px/1.9 Georgia,serif;padding:20px;border-left:3px solid #58705e}p{overflow-wrap:anywhere}.bullet{padding-left:16px}li{margin:12px 0}:focus-visible{outline:3px solid #245340;outline-offset:4px}@media(max-width:550px){main{padding:20px 16px}details{padding:12px}article{padding:10px;font-size:18px}}@media print{body{background:white;font-size:11pt}nav{display:none}main{max-width:none;padding:0}section{break-before:page}details{border:0;padding:0}summary{font-size:16pt}a{color:#222}article{font-size:12pt}}'''
nav=''.join('<a href="#'+id+'">'+label+'</a>' for id,label in [('rules','Требования'),('workshop','С нуля'),('essay','Эссе'),('thinkers','Тройки'),('lectures','Лекции 1–10'),('practice','Практика'),('sources','PDF LMS')])
page='<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Philosophy Final — подготовка</title><style>'+css+'</style><main><p>YEAHGRIND / OFFLINE STUDY PACK</p><h1>Философия.<br>От первой мысли к эссе.</h1><p>50 минут · 350+ слов · три перспективы · пять частей</p><nav>'+nav+'</nav>'+''.join(sections)+'</main></html>'
save('START_HERE.html', page)
checksums = '\n'.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(root).as_posix() for p in sorted(root.rglob('*')) if p.is_file() and p.name != 'SHA256SUMS.txt')
save('SHA256SUMS.txt', checksums)
archive = destination / (root.name+'.zip')
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in sorted(root.rglob('*')):
        if p.is_file(): z.write(p, p.relative_to(destination))
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    print(json.dumps({'archive':str(archive),'files':len(z.namelist()),'original_pdfs':24,'size_mb':round(archive.stat().st_size/1024**2,2)},ensure_ascii=False))
