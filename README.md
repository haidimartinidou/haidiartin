# Haidi Martinidou, art site

An arts-only portfolio: film photography, Nikon photography, acrylics, watercolour
and iPad drawing, plus an About page. Plain HTML, CSS and a little JS, no build step.

Theme: a sunset palette taken from @chadeaux's mountains drawing (golden `--sun`,
amber, terracotta `--rust`, olive hills, cobalt `--blue` for hand-lettering, plum
signature), a marker display font (Permanent Marker), handwritten captions
(Caveat), and Inter for body. All palette variables live at the top of
`css/style.css`.

## Pages

```
personal-website/
├── index.html        # landing + shortcuts into the five mediums
├── art.html          # gallery index: one cover per medium
├── film.html         # \
├── nikon.html        #  |
├── acrylics.html     #  |- one page per medium (with lightbox + medium switcher)
├── watercolour.html  #  |
├── ipad.html         # /
├── about.html        # About me
├── css/style.css     # theme + all styling (palette variables at the top)
├── js/main.js        # scroll reveal, image fallbacks, lightbox
├── images/           # << put your photos & paintings here (see below)
└── files/            # (spare, unused for now)
```

Click any image to open it full-screen (lightbox): arrow keys or the on-screen
arrows move between pictures, Esc or a click outside closes it.

## See it (local server)

```bash
cd ~/personal-website
python3 serve.py        # sends no-cache headers so edits show up on reload
# open http://localhost:8000
```

If a change doesn't appear, hard-refresh once: Cmd+Shift+R (Safari: Cmd+Option+R).

## Add your images

Save files into `images/` with these names and they appear automatically. Empty
slots show a tidy "add images/…" placeholder until you do.

| File name                       | Section / use        |
|---------------------------------|----------------------|
| `images/hero-mountains.jpg`     | landing hero (the "take the mountains" drawing) |
| `images/film-sea.jpg`           | Film photography     |
| `images/film-street.jpg`        | Film photography     |
| `images/dog.jpg`                | Nikon camera         |
| `images/painting-green-red.jpg` | Acrylics             |
| `images/ipad-eden.jpg`          | iPad ("what if it was Adam's idea?") |

Spare slots ready to fill (just drop files with these names): `nikon-2.jpg`,
`nikon-3.jpg`, `acrylic-2.jpg`, `acrylic-3.jpg`, `watercolour-1..3.jpg`,
`ipad-1..3.jpg`. Add or remove `<figure class="frame">` blocks in `art.html` to
change how many slots each section has.

## Personalise

Search the files for `[HAIDI: ...]` to fill in: your city, commission status,
Instagram URL, the name-vs-"chadeaux" choice, and the About copy.

## Theme

Edit the variables at the top of `css/style.css` to recolour everything. This will
be replaced once your design is applied.
