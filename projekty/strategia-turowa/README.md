# Kraina Tur

[Zagraj online](https://mpejcz.github.io/gry-rodzinne/projekty/strategia-turowa/)

Przeglądarkowy prototyp rodzinnej strategii turowej inspirowanej klasycznymi grami 4X. Projekt rozwija własne zasady, świat i oprawę.

## Aktualny stan

Grywalne MVP zawiera:

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
- rozwój stolicy zwiększający przyszły dochód;
- wrogie miasto i jednostkę strażnika;
- punkty życia oraz atak zwiadowcy;
- odpowiedź strażnika po zakończeniu tury;
- przejęcie miasta po pokonaniu obrońcy;
- warunki zwycięstwa i porażki;
- automatyczną turę przeciwnika;
- wyznaczanie najkrótszej drogi po lądzie;
- pościg strażnika za zwiadowcą;
- informację o ruchu lub ataku przeciwnika;
- automatyczny zapis po ruchu, ataku, turze i rozwoju miasta;
- ręczny przycisk zapisu;
- wczytywanie pełnego stanu rozgrywki;
- wersjonowanie i walidację zapisanych danych.

## Balans MVP

- zwiadowca: 3 punkty życia, 2 obrażenia;
- strażnik: 3 punkty życia, 1 obrażenie;
- jednostka wykonuje jeden ruch albo atak na turę;
- strażnik przemieszcza się o jedno pole po zakończeniu tury gracza;
- stolica zaczyna z dochodem 2 monet, a pierwszy rozwój kosztuje 5 monet;
- poprawnie rozegrane starcie pozostawia zwiadowcę z 1 punktem życia.

Przycisk „Jak grać” w interfejsie pokazuje skrócone zasady i parametry jednostek.

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
- `src/storage.js` — wersjonowanie, walidacja i zapis stanu;
- `src/game.js` — stan tury, rysowanie oraz sterowanie.
