"""Extract product cards from the OPEL US brochure (Canva PDF) into products.json + images/."""
import json, re, sys, collections
from pathlib import Path
import pymupdf as fitz

PDF, OUT = Path('catalogue.pdf'), Path('out')
IMG = OUT / 'images'; IMG.mkdir(parents=True, exist_ok=True)
doc = fitz.open(PDF)

def spans(page):
    seen, out = set(), []
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                t = s['text'].strip()
                if not t or s['font'].startswith('Type3'): continue
                key = (t, round(s['bbox'][0]), round(s['bbox'][1] / 2))
                if key in seen: continue  # Canva prints some labels twice
                seen.add(key)
                out.append({'t': t, 'b': s['bbox'], 'size': round(s['size'], 1), 'font': s['font']})
    return out

def save_image(xref, name):
    name = re.sub(r'[^A-Za-z0-9_-]+', '_', name)
    path = IMG / f'{name}.png'
    if path.exists(): return path.name
    pix = fitz.Pixmap(doc, xref)
    info = doc.extract_image(xref)
    if info.get('smask'):
        pix = fitz.Pixmap(pix, fitz.Pixmap(doc, info['smask']))
    if pix.n - pix.alpha > 3: pix = fitz.Pixmap(fitz.csRGB, pix)
    pix.save(path)
    return path.name

products, review = [], []
for pno in range(len(doc)):
    page = doc[pno]
    sp = spans(page)
    W = page.rect.width
    heading = next((s['t'] for s in sorted(sp, key=lambda s: -s['size']) if s['size'] >= 16 and s['b'][1] < 100), None)
    # A card = model number in Anton ~10pt directly under a ~10.2pt name.
    models = [s for s in sp if s['font'].startswith('Anton') and 9 <= s['size'] <= 11]
    cards = []
    for m in models:
        name = min((s for s in sp if 'Arimo-Regular' in s['font'] and 9.5 <= s['size'] <= 11
                    and abs(s['b'][0] - m['b'][0]) < 6 and 0 < m['b'][1] - s['b'][1] < 20),
                   key=lambda s: m['b'][1] - s['b'][1], default=None)
        if name: cards.append({'name': name, 'model': m, 'col': 0 if m['b'][0] < W / 2 else 1})
    if not cards:
        review.append({'page': pno + 1, 'heading': heading, 'reason': 'no product-card layout (table / spares / intro page)'})
        continue
    imgs = [i for i in page.get_image_info(xrefs=True)
            if i['xref'] and (i['bbox'][2] - i['bbox'][0]) * (i['bbox'][3] - i['bbox'][1]) > 3000
            and (i['bbox'][2] - i['bbox'][0]) < W * 0.8]
    for c in cards:
        top = c['name']['b'][1] - 10
        below = [o['name']['b'][1] for o in cards if o['col'] == c['col'] and o['name']['b'][1] > c['name']['b'][1] + 5]
        bottom = min(min(below) - 10 if below else page.rect.height - 60, top + 175)  # card height cap: skips lifestyle photos below
        x0 = 0 if c['col'] == 0 else W / 2 - 20
        x1 = W / 2 + 20 if c['col'] == 0 else W
        cx = c['name']['b'][0]
        box = [s for s in sp if top <= s['b'][1] < bottom and cx - 6 <= s['b'][0] and s['b'][0] < x1]
        specs, watt = {}, []
        for s in box:
            if s in (c['name'], c['model']) or s['t'] in ('Technical', 'Specifications', 'Technical Specifications'): continue
            if ':' in s['t']:
                k, v = s['t'].split(':', 1); specs[k.strip()] = v.strip()
            elif 'Bold' in s['font'] and s['size'] < 7.5: watt.append(s['t'])
            else: specs.setdefault('_notes', []).append(s['t'])
        cand = [i for i in imgs if x0 <= (i['bbox'][0] + i['bbox'][2]) / 2 < cx and top - 20 <= (i['bbox'][1] + i['bbox'][3]) / 2 <= bottom]
        cand.sort(key=lambda i: -(i['bbox'][2] - i['bbox'][0]) * (i['bbox'][3] - i['bbox'][1]))
        model = c['model']['t']
        images = [save_image(i['xref'], f'{model}-{n}') for n, i in enumerate(cand[:1])]
        p = {'model': model, 'name': c['name']['t'], 'category': heading, 'power': list(dict.fromkeys(watt)) or None,
             'specs': {k: v for k, v in specs.items() if k != '_notes'}, 'notes': specs.get('_notes', []),
             'images': images, 'page': pno + 1}
        if not images or not p['specs']:
            review.append({'page': pno + 1, 'model': model, 'reason': 'no image' if not images else 'no specs'})
        products.append(p)

dups = [m for m, n in collections.Counter(p['model'] for p in products).items() if n > 1]
for m in dups: review.append({'model': m, 'reason': 'model appears more than once'})
(OUT / 'products.json').write_text(json.dumps(products, indent=2, ensure_ascii=False))
(OUT / 'review.json').write_text(json.dumps(review, indent=2, ensure_ascii=False))
print(len(products), 'products,', len(review), 'review items,', len(list(IMG.iterdir())), 'images')
