"""Render Puro's original vector mark and social card. No network access.

Uses the already-installed Pillow and macOS Helvetica. Deployment serves the
checked-in assets and does not need Python, Pillow, or this font.
"""
from pathlib import Path
from html import escape
import math
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
PUBLIC.mkdir(exist_ok=True)
(PUBLIC / 'icons').mkdir(exist_ok=True)
(PUBLIC / 'social').mkdir(exist_ok=True)

DEEP, LIME, PAPER = '#183c35', '#d5eea8', '#f5f7f2'
PATH = 'M13 15c17-9 26 0 9 9S13 39 34 32'
CURVES = [((13, 15), (30, 6), (39, 15), (22, 24)),
          ((22, 24), (5, 33), (13, 39), (34, 32))]

def points(curves=CURVES):
    out = []
    for p0, p1, p2, p3 in curves:
        for n in range(121):
            t, u = n / 120, 1 - n / 120
            out.append(tuple(u**3*p0[i] + 3*u*u*t*p1[i] + 3*u*t*t*p2[i] + t**3*p3[i] for i in (0, 1)))
    return out

def stroke(draw, coordinates, color, width):
    radius = width / 2
    # Dense overlapping discs avoid tiny gaps in Pillow's thick polyline joins.
    for x, y in coordinates:
        draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=color)

def icon(size, rounded=True, maskable=False):
    scale = 4
    im = Image.new('RGBA', (size*scale, size*scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, size*scale-1, size*scale-1), radius=size*scale*14/48 if rounded else 0, fill=DEEP)
    factor = size*scale/48 * (0.8 if maskable else 1)
    offset = size*scale*0.1 if maskable else 0
    stroke(d, [(x*factor+offset, y*factor+offset) for x, y in points()], LIME, factor*5)
    return im.resize((size, size), Image.Resampling.LANCZOS)

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>Puro</title><rect width="48" height="48" rx="14" fill="{DEEP}"/><path d="{PATH}" stroke="{LIME}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>\n'''
(PUBLIC / 'favicon.svg').write_text(svg)
icon(256).save(PUBLIC / 'favicon.ico', sizes=[(16,16), (32,32), (48,48)])
icon(96).save(PUBLIC / 'icons/favicon-96.png', optimize=True)
icon(180, rounded=False).convert('RGB').save(PUBLIC / 'apple-touch-icon.png', optimize=True)
for size in (192, 512):
    icon(size).save(PUBLIC / f'icons/icon-{size}.png', optimize=True)
icon(512, rounded=False, maskable=True).convert('RGB').save(PUBLIC / 'icons/icon-maskable-512.png', optimize=True)

# Render the same primitives to PNG and an editable SVG source.
S = 2
im = Image.new('RGB', (1200*S, 630*S), PAPER)
d = ImageDraw.Draw(im)
elements = [f'<rect width="1200" height="630" fill="{PAPER}"/>']
font_path = '/System/Library/Fonts/Helvetica.ttc'

def rect(x, y, w, h, color, radius=0):
    d.rounded_rectangle((x*S,y*S,(x+w)*S,(y+h)*S), radius=radius*S, fill=color)
    elements.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{color}"/>')

def text(content, x, y, size, color=DEEP, bold=False):
    font = ImageFont.truetype(font_path, size*S, index=1 if bold else 0)
    box = d.textbbox((0,0), content, font=font)
    d.text((x*S, y*S-box[1]), content, font=font, fill=color)
    elements.append(f'<text x="{x}" y="{y+size*.76}" fill="{color}" font-family="Helvetica, Arial, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}">{escape(content)}</text>')
    return (box[2]-box[0])/S

rect(872, 0, 328, 630, DEEP)
# Quiet stream lines echo the app's mark without relying on photographs.
for offset in (-84, -28, 28, 84):
    coords=[]
    for n in range(501):
        y = n*1.4 - 32
        x = 1036 + math.sin(y/128)*70 + offset
        coords.append((x*S,y*S))
    stroke(d, coords, '#295247', 1.5*S)
    path = 'M' + ' L'.join(f'{x/S:.2f} {y/S:.2f}' for x,y in coords)
    elements.append(f'<path d="{path}" fill="none" stroke="#295247" stroke-width="1.5"/>')

rect(956, 214, 160, 160, LIME, 47)
mark_scale, mark_x, mark_y = 160/48, 956, 214
stroke(d, [((x*mark_scale+mark_x)*S,(y*mark_scale+mark_y)*S) for x,y in points()], DEEP, 5*mark_scale*S)
elements.append(f'<path d="{PATH}" transform="translate({mark_x} {mark_y}) scale({mark_scale})" stroke="{DEEP}" stroke-width="5" fill="none" stroke-linecap="round"/>')
text('OPITAAN SUOMEA', 926, 427, 20, LIME)

text('puro.', 68, 61, 56, bold=True)
text('YOUR FINNISH LEARNING SPACE', 70, 161, 17, '#53665c')
headline_width = text('Your next chapter.', 64, 230, 76, bold=True)
assert headline_width < 740, headline_width
text('In Finnish.', 64, 324, 76, bold=True)
text('Guided lessons. Real-world practice.', 70, 449, 28, '#53665c')
rect(70, 529, 718, 1, '#dce4d9')
text('A1–C2 study path', 70, 560, 22)
text('A little, every day.', 610, 560, 22, '#53665c')

im.resize((1200,630), Image.Resampling.LANCZOS).save(PUBLIC / 'social/puro-og.png', optimize=True)
(PUBLIC / 'social/puro-og.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><title>Puro: Your next chapter. In Finnish.</title>' + ''.join(elements) + '</svg>\n')
print('Created SVG favicon, ICO (16/32/48), PNG (96/180/192/512), maskable icon, and 1200×630 OG image.')
