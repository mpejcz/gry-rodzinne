# Plan projektu „Kraina Tur”

## Etap 1 — mapa i wybieranie pól

- [x] izometryczna mapa 10 × 10;
- [x] równiny, lasy, góry i woda;
- [x] generowanie nowego układu mapy;
- [x] podświetlenie pola pod kursorem;
- [x] wybór pola myszą lub dotykiem;
- [x] prezentacja rodzaju terenu i współrzędnych;
- [x] układ dopasowany do telefonu i komputera.

## Etap 2 — jednostka i tury

- [x] pierwsza jednostka gracza;
- [x] wskazywanie dostępnych pól ruchu;
- [x] wykonanie ruchu;
- [x] blokada ruchu przez wodę;
- [x] jeden ruch jednostki na turę;
- [x] przycisk zakończenia tury;
- [x] licznik tur.

## Etap 3 — stolica i gospodarka

- [x] stolica na mapie;
- [x] początkowy zapas monet;
- [x] dochód ze stolicy naliczany co turę;
- [x] panel informacji o mieście;
- [x] rozwój miasta za monety;
- [x] wzrost dochodu po rozwoju miasta.

## Etap 4 — przeciwnik i walka

- [x] wrogie miasto na osiągalnym polu;
- [x] jednostka strażnika;
- [x] punkty życia i atak;
- [x] odpowiedź strażnika po zakończeniu tury;
- [x] pokonanie wrogiej jednostki;
- [x] przejęcie miasta;
- [x] zwycięstwo i porażka.

## Etap 5 — przeciwnik sterowany przez AI

- [x] wyszukiwanie najkrótszej drogi po lądzie;
- [x] ruch strażnika w turze przeciwnika;
- [x] pościg za zwiadowcą;
- [x] atak po znalezieniu się obok gracza;
- [x] komunikat o działaniu przeciwnika.

## Etap 6 — zapis rozgrywki

- [x] wersjonowany format zapisu;
- [x] walidacja danych przed wczytaniem;
- [x] automatyczny zapis po zmianie stanu;
- [x] ręczny zapis;
- [x] wczytywanie pełnej rozgrywki;
- [x] komunikaty o stanie zapisu.

## Etap 7 — kandydat wydaniowy MVP

- [x] ekran „Jak grać”;
- [x] dostępne zamykanie pomocy klawiaturą i przyciskiem;
- [x] udokumentowane parametry balansu;
- [x] pełny test zwycięstwa i porażki;
- [x] test zapisu i wczytywania;
- [x] kontrola układu mobilnego.

## Późniejsze etapy

- dodatkowe jednostki;
- drzewko technologii;
- większe mapy i kolejne miasta;
- rozbudowane zachowanie AI.

## Definicja ukończenia etapu 1

Etap jest ukończony, gdy mapa prawidłowo skaluje się na komputerze i telefonie, a użytkownik może wygenerować nową mapę oraz wybrać dowolne pole, poznając jego teren i współrzędne.

## Definicja ukończenia etapu 2

Etap jest ukończony, gdy gracz może wybrać zwiadowcę, zobaczyć legalne pola, wykonać jeden ruch bez wchodzenia do wody, zakończyć turę i ponownie poruszyć jednostkę w następnej turze.

## Definicja ukończenia etapu 3

Etap jest ukończony, gdy stolica pojawia się na mapie, zapewnia monety po zakończeniu tury, a gracz może wydać zgromadzone środki na zwiększenie poziomu i przyszłego dochodu miasta.

## Definicja ukończenia etapu 4

Etap jest ukończony, gdy gracz może dotrzeć do wrogiego miasta, walczyć ze strażnikiem, stracić punkty życia podczas jego odpowiedzi i wygrać przez zajęcie miasta po pokonaniu obrońcy.

## Definicja ukończenia etapu 5

Etap jest ukończony, gdy strażnik po zakończeniu tury samodzielnie zbliża się najkrótszą dostępną drogą do zwiadowcy, a po osiągnięciu sąsiedniego pola atakuje go w kolejnych turach.

## Definicja ukończenia etapu 6

Etap jest ukończony, gdy gracz może zapisać rozgrywkę, rozpocząć inny układ mapy, a następnie odtworzyć mapę, jednostki, miasta, ekonomię, turę i wynik bez utraty stanu.

## Definicja ukończenia etapu 7

MVP jest gotowe do publikacji, gdy zasady są dostępne bez opuszczania gry, najważniejsze ścieżki przeszły testy na komputerze i telefonie, a publiczna wersja może zostać uruchomiona bez instalowania zależności.
