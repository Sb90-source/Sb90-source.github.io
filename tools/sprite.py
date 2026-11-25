"""Generate the pixel-art sprite (retro computer) as SVG and PNG favicon."""
import sys
from pathlib import Path

W, H = 32, 30
P = {
    'k': '#1b1b1b',  # outline
    'b': '#d8d2c2',  # beige case
    'h': '#f1ece0',  # highlight
    'd': '#a59e8c',  # shadow
    's': '#16261d',  # screen
    'g': '#7cf29a',  # phosphor
    'm': '#3f8f5a',  # dim phosphor
    'r': '#e8574a',  # power led
}
g = [['.'] * W for _ in range(H)]

def rect(x0, y0, x1, y1, c):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            g[y][x] = c

def box(x0, y0, x1, y1, fill):
    rect(x0, y0, x1, y1, 'k')
    rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, fill)

# monitor
box(3, 0, 28, 19, 'b')
rect(4, 1, 27, 1, 'h'); rect(4, 1, 4, 18, 'h')
rect(5, 18, 27, 18, 'd'); rect(27, 2, 27, 18, 'd')
box(6, 3, 25, 15, 's')
rect(7, 4, 7, 4, 'm')  # glare
# screen content: prompt lines
for x in (8, 9, 10): g[6][x] = 'm'
for x in range(12, 20): g[6][x] = 'm'
for x in (8, 9): g[8][x] = 'm'
for x in range(11, 23): g[8][x] = 'm'
for x in range(8, 15): g[10][x] = 'm'
# '>' glyph and cursor block
g[12][8] = 'g'; g[13][9] = 'g'; g[14][8] = 'g'
CURSOR = [(11, 12), (12, 12), (11, 13), (12, 13), (11, 14), (12, 14)]
# controls under screen
g[17][23] = 'r'; rect(20, 17, 21, 17, 'd'); rect(7, 17, 12, 17, 'd')
# stand
box(12, 19, 19, 21, 'd')
rect(13, 20, 18, 20, 'b')
# keyboard
box(1, 22, 30, 28, 'b')
rect(2, 23, 29, 23, 'h')
rect(2, 27, 29, 27, 'd')
for row, (y, start) in enumerate([(24, 3), (25, 4), (26, 3)]):
    x = start
    while x + 1 < 29:
        if row == 2 and 9 <= x <= 21:
            rect(9, y, 21, y, 'd'); x = 23; continue
        rect(x, y, x + 1, y, 'd'); x += 3

def svg(animated=True, scale=1):
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W*scale}" height="{H*scale}" shape-rendering="crispEdges" role="img" aria-label="Pixel art of a retro computer">']
    if animated:
        out.append('<style>@keyframes blink{50%{opacity:0}}.cur{animation:blink 1.1s steps(1) infinite}@media (prefers-reduced-motion:reduce){.cur{animation:none}}</style>')
    for c in P:
        cells = [(x, y) for y in range(H) for x in range(W) if g[y][x] == c]
        if cells:
            d = ''.join(f'M{x} {y}h1v1h-1z' for x, y in cells)
            out.append(f'<path fill="{P[c]}" d="{d}"/>')
    d = ''.join(f'M{x} {y}h1v1h-1z' for x, y in CURSOR)
    out.append(f'<path class="cur" fill="{P["g"]}" d="{d}"/>')
    out.append('</svg>')
    return ''.join(out)

dest = Path(sys.argv[1])
(dest / 'sprite.svg').write_text(svg(True))
try:
    from PIL import Image
    img = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    off = (W - H) // 2
    for y in range(H):
        for x in range(W):
            c = g[y][x]
            if c != '.':
                v = P[c].lstrip('#')
                img.putpixel((x, y + off), tuple(int(v[i:i+2], 16) for i in (0, 2, 4)) + (255,))
    for x, y in CURSOR:
        img.putpixel((x, y + off), (0x7c, 0xf2, 0x9a, 255))
    img.resize((128, 128), Image.NEAREST).save(dest / 'favicon.png')
    img.resize((512, 512), Image.NEAREST).save(dest / 'sprite-512.png')
    print('png ok')
except ImportError:
    print('no PIL')
print('svg ok')
