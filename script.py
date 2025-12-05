import json
from pathlib import Path

pt_path = Path('public/locales/pt/common.json')
pt_data = json.loads(pt_path.read_text(encoding='utf-8'))
text_pt = pt_data['seo']['faq']['what_is_answer']

translations = {
    'public/locales/en/common.json': 'cortar carrossel',
    'public/locales/zh/common.json': 'cortar carrossel',
    'public/locales/hi/common.json': 'cortar carrossel',
    'public/locales/ru/common.json': 'cortar carrossel'
}
