"""Build data/products.json, WebP images, page renders and a self-contained index.html for data review."""
import json, re, collections, html
from pathlib import Path
from PIL import Image
import pymupdf as fitz

OUT = Path('bundle')
prods = json.load(open('out/products.json'))
review = json.load(open('out/review.json'))
skipped = sorted({r['page'] for r in review if 'layout' in r['reason']})

counts = collections.Counter(p['model'] for p in prods)
MODEL_OK = re.compile(r'^[A-Z]{0,4}\d{2,5}[A-Z0-9-]*$')
seen = collections.Counter()
for p in prods:
    issues = []
    if not p['images']: issues.append('no image')
    if not p['specs']: issues.append('no specs')
    if not p['name']: issues.append('no name')
    if not MODEL_OK.match(p['model']): issues.append('odd model number')
    if counts[p['model']] > 1: issues.append(f"model appears {counts[p['model']]}x")
    seen[p['model']] += 1
    slug = re.sub(r'[^A-Za-z0-9_-]+', '-', p['model']).strip('-') or 'unknown'
    p['id'] = slug if counts[p['model']] == 1 else f"{slug}--p{p['page']}-{seen[p['model']]}"
    webps = []
    for i, f in enumerate(p['images']):
        im = Image.open('out/images/' + f); im.thumbnail((800, 800))
        name = f"{p['id']}-{i}.webp"; im.save(OUT / 'public/images/products' / name, 'WEBP', quality=82)
        webps.append(name)
    p['images'] = webps
    p['review'] = {'status': ('duplicate' if counts[p['model']] > 1 else 'check' if issues else 'ok'), 'issues': issues}

prods = [{k: p[k] for k in ('id', 'model', 'name', 'category', 'power', 'specs', 'notes', 'images', 'page', 'review')} for p in prods]
json.dump(prods, open(OUT / 'data/products.json', 'w'), indent=2, ensure_ascii=False)
json.dump({'skippedPages': skipped}, open(OUT / 'data/skipped_pages.json', 'w'), indent=2)

doc = fitz.open('catalogue.pdf')
for i in range(len(doc)):
    pix = doc[i].get_pixmap(dpi=90)
    Image.frombytes('RGB', (pix.width, pix.height), pix.samples).save(OUT / f'review/pages/p-{i+1:02d}.webp', 'WEBP', quality=70)

tpl = open('review_template.html').read()
data = json.dumps({'products': prods, 'skipped': skipped}, ensure_ascii=False).replace('</', '<\\/')
open(OUT / 'index.html', 'w').write(tpl.replace('/*DATA*/null', data))
c = collections.Counter(p['review']['status'] for p in prods)
print(len(prods), dict(c), 'skipped pages', len(skipped))
