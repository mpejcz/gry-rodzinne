# Łap kropkę

Najprostszy projekt startowy: mobilna gra zręcznościowa działająca jako statyczna strona internetowa.

## Zagraj online

Publiczna wersja: <https://mpejcz.github.io/gry-rodzinne/>

## Cel MVP

Gracz ma 20 sekund na dotknięcie jak największej liczby pojawiających się celów. Gra pokazuje wynik, zapamiętuje rekord na urządzeniu i pozwala rozpocząć kolejną rundę.

## Uruchomienie

Nie trzeba instalować zależności. Można otworzyć `index.html` bezpośrednio w przeglądarce.

Do testowania przez lokalny serwer:

```powershell
cd projekty/lap-kropke
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000`.

## Udostępnienie na telefonie

Projekt składa się wyłącznie z HTML, CSS i JavaScript, dlatego może być opublikowany w dowolnym hostingu stron statycznych.

Najprostsza ścieżka w tym monorepo to GitHub Pages:

1. Wypchnij repozytorium na GitHub.
2. Otwórz `Settings` → `Pages`.
3. Wybierz `Deploy from a branch`.
4. Wskaż główną gałąź i katalog `/(root)`.
5. Gra będzie dostępna pod adresem podobnym do:

```text
https://NAZWA-UZYTKOWNIKA.github.io/NAZWA-REPO/projekty/lap-kropke/
```

Po otwarciu opublikowanej gry przycisk „Udostępnij grę” uruchomi systemowe udostępnianie telefonu albo skopiuje link.

## Pliki

- `index.html` — struktura strony;
- `style.css` — wygląd i układ mobilny;
- `game.js` — zasady gry, wynik, czas i udostępnianie.
