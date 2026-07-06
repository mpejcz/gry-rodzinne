# Gry — rodzinne projekty

To repozytorium służy do wspólnego tworzenia gier i aplikacji kreatywnych.

## Organizacja repozytorium

Na początku korzystamy z jednego repozytorium Git typu **monorepo**. Każda gra znajduje się w osobnym katalogu, ale wszystkie projekty pozostają razem w katalogu `Gry`.

```text
Gry/
├── README.md
├── pomysly-na-gry.md
├── pomysly-whatsapp.txt
├── projekty/
│   ├── spadajace-klocki/
│   │   ├── README.md
│   │   ├── PLAN.md
│   │   ├── src/
│   │   └── assets/
│   ├── sudoku/
│   └── kolorowanka/
└── wspolne/
    ├── grafiki/
    └── dzwieki/
```

## Struktura projektu

Każdy projekt powinien mieć:

- `README.md` — opis gry, zasady i sposób uruchomienia;
- `PLAN.md` — zakres MVP, zadania i pomysły na później;
- `src/` — kod źródłowy;
- `assets/` — grafiki, dźwięki i inne materiały.

W razie potrzeby projekt może mieć również własny plik `AGENTS.md` z zasadami pracy dla Codex.

## Praca równoległa

Każdy projekt otrzymuje:

- osobny katalog;
- osobny wątek Codex;
- osobną gałąź Git.

Przykład:

- projekt `projekty/sudoku` — gałąź `projekt/sudoku`;
- projekt `projekty/kolorowanka` — gałąź `projekt/kolorowanka`.

Zmiany z ukończonych etapów są scalane do głównej gałęzi. Ponieważ projekty znajdują się w różnych katalogach, ryzyko konfliktów jest małe.

## Zasady

1. Najpierw definiujemy małe, grywalne MVP.
2. Nie dodajemy rozszerzeń przed ukończeniem MVP.
3. Każdy ukończony etap zapisujemy w Git.
4. Kod wygenerowany z pomocą Codex przeglądamy i testujemy.
5. Wspólne materiały trafiają do katalogu `wspolne/` tylko wtedy, gdy rzeczywiście korzysta z nich więcej niż jeden projekt.

## Czego na razie nie robimy

Nie tworzymy zagnieżdżonych repozytoriów Git ani submodułów. Przy obecnym rozmiarze projektów zwiększałyby złożoność bez wyraźnej korzyści.

Osobne repozytorium dla konkretnej gry warto utworzyć dopiero wtedy, gdy:

- gra ma być publikowana niezależnie;
- potrzebuje osobnych wydań lub automatyzacji;
- ma innych współautorów;
- rozrosła się na tyle, że utrudnia pracę w monorepo.

## Katalog pomysłów

- [Pełny katalog projektów](./pomysly-na-gry.md)
- [Wersja do przesłania przez WhatsApp](./pomysly-whatsapp.txt)

## Rozpoczęte projekty

- [Łap kropkę](./projekty/lap-kropke/README.md) — prosta mobilna gra zręcznościowa przygotowana do publikacji jako strona internetowa.
