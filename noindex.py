# -*- coding: utf-8 -*-
"""Pune <meta name="robots" content="noindex, nofollow"> in fiecare draft (sunt pagini in lucru, nu apar in Google)."""
import glob, io
for p in glob.glob('*/index.html'):
    t = io.open(p, encoding='utf-8').read()
    if 'name="robots"' not in t:
        t = t.replace('<head>\n', '<head>\n<meta name="robots" content="noindex, nofollow">\n', 1)
        io.open(p, 'w', encoding='utf-8').write(t)
    print(p, 'noindex' if 'name="robots"' in t else 'FARA NOINDEX')
