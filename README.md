# gral-preview: drafturile de prezentare, pe URL-uri publice (GitHub Pages)

Folderul e un repo git (local, gata de urcat) cu cele 3 pagini in lucru, fiecare intr-un singur fisier HTML (imaginile in pagina),
cu `noindex` (nu apar in Google). Contul GitHub folosit: cel autentificat pe acest calculator (`gh auth status`: VladimirMalii).

| Pagina                         | Fisier                   | Sursa (se regenereaza cu `pentru-livrare.py`)                                   | URL dupa publicare                                        |
| ------------------------------ | ------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Secția de Hematologie          | `hematologie/index.html` | `Gral-Hematologie/livrare/hematologie-gral-caloian.html`                        | https://vladimirmalii.github.io/gral-preview/hematologie/ |
| Îngrijiri paliative            | `paliatie/index.html`    | `Paliatie/livrare/ingrijiri-paliative-gral.html`                                | https://vladimirmalii.github.io/gral-preview/paliatie/    |
| Cancerul colorectal (OncoFort) | `colorectal/index.html`  | `ONCOFORT/Pagina cancere/decizie/web/livrare/cancerul-colorectal-oncofort.html` | https://vladimirmalii.github.io/gral-preview/colorectal/  |
| lista                          | `index.html`             |                                                                                 | https://vladimirmalii.github.io/gral-preview/             |

## Prima publicare (o data)

Dublu clic pe `PUBLICA.cmd`: creeaza repo-ul public `VladimirMalii/gral-preview`, urca fisierele, activeaza GitHub Pages.
In 1-3 minute URL-urile de mai sus merg de pe orice calculator, fara cont.

## Actualizare (dupa orice modificare a unei pagini)

1. Claude regenereaza fisierul din `livrare/` al paginii (`python scripts/pentru-livrare.py`).
2. Dublu clic pe `ACTUALIZEAZA.cmd`: copiaza cele 3 fisiere, pune noindex, commit, push. In 1-2 minute e live.

## Oprire

Repo-ul se poate face privat sau sterge oricand: https://github.com/VladimirMalii/gral-preview/settings (Danger Zone).
Alternativa fara GitHub: acelasi folder (fara `.git`, `*.cmd`, `noindex.py`) se urca in `public/preview/` pe gralmedical.ro:
`https://www.gralmedical.ro/preview/hematologie/` etc.
