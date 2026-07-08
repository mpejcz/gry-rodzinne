# Kraina Tur

Przeglądarkowy prototyp rodzinnej strategii turowej inspirowanej klasycznymi grami 4X. Projekt rozwija własne zasady, świat i oprawę.

## Aktualny stan

Etap 3 zawiera:

- responsywną mapę izometryczną 10 × 10 pól;
- cztery rodzaje terenu: równiny, lasy, góry i wodę;
- losowe generowanie kolejnych map;
- wybieranie pól myszą lub dotykiem;
- panel z rodzajem terenu i współrzędnymi pola;
- zwiadowcę poruszającego się o jedno pole;
- podświetlenie dostępnych pól ruchu;
- blokadę ruchu przez wodę;
- jeden ruch jednostki na turę;
- zakończenie tury i licznik tur;
- stolicę umieszczoną na mapie;
- monety oraz dochód naliczany co turę;
- rozwój stolicy zwiększający przyszły dochód.

## Uruchomienie

Z katalogu głównego repozytorium uruchom:

```powershell
python -m http.server 8000
```

Następnie otwórz:

```text
http://localhost:8000/projekty/strategia-turowa/
```

Projekt nie wymaga instalowania zależności ani kompilacji.

## Pliki

- `index.html` — struktura ekranu gry;
- `style.css` — responsywny wygląd;
- `src/map.js` — rodzaje terenu i generator mapy;
- `src/units.js` — jednostki i reguły ruchu;
- `src/cities.js` — stolica, ceny rozwoju i gospodarka;
- `src/game.js` — stan tury, rysowanie oraz sterowanie.
