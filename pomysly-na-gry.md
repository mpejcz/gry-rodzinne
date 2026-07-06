# Rodzinne projekty: gry i aplikacje kreatywne

Roboczy katalog projektów do zrobienia wspólnie z dziećmi w wieku 11 i 15 lat.

## Jak czytać oceny

- **Trudność 1–10** oznacza trudność wykonania grywalnego MVP, a nie wersji komercyjnej.
- **1 dzień kodowania** to około 3 godzin wspólnej, skupionej pracy.
- Czas obejmuje programowanie, proste grafiki i testowanie. Nie obejmuje nauki narzędzia od zera ani publikacji w sklepie.
- MVP powinno mieć jedną kompletną pętlę: start, działanie gracza, wynik lub cel, zakończenie i restart.
- Każdy projekt może urosnąć wielokrotnie. Najpierw kończymy MVP, potem wybieramy rozszerzenia.

## Szybka rekomendacja

Najlepsze projekty na początek:

| Pomysł | Dlaczego warto | Trudność | Czas MVP |
|---|---|---:|---:|
| Pong z własnymi zasadami | Pierwsza grywalna wersja może powstać jednego dnia | 2/10 | 1–2 dni |
| Labirynt z kluczami | Łączy projektowanie poziomu, ruch i kolizje | 3/10 | 2–4 dni |
| Gra zbieracka | Szybko daje punkty, dźwięki i satysfakcjonujące efekty | 2/10 | 2–3 dni |
| Cyfrowa kolorowanka | Dobra ścieżka do grafiki, Canvas i zapisu plików | 4/10 | 4–6 dni |
| Quiz rodzinny | Treść można tworzyć wspólnie bez programowania każdej rundy | 4/10 | 4–6 dni |
| Gra dla dwóch osób | Naturalnie zachęca do wspólnego testowania | 5/10 | 4–7 dni |
| Interaktywny komiks | Pozwala rozdzielić role: tekst, grafika i kod | 3/10 | 3–5 dni |
| Spadające klocki | Bardzo dobry projekt algorytmiczny po ukończeniu prostszej gry | 6/10 | 7–10 dni |

---

# Cztery początkowe pomysły

## 1. Spadające klocki

**Trudność:** 6/10  
**Czas MVP:** 7–10 dni  
**Technologia startowa:** JavaScript + Canvas albo Godot 2D

### Cel MVP

Gracz przesuwa i obraca spadające klocki. Pełny rząd znika i daje punkty. Zapełnienie planszy kończy grę, którą można uruchomić ponownie.

### Moduły

- plansza zapisana jako dwuwymiarowa tablica;
- definicje kształtów;
- aktualny i następny klocek;
- ruch, obrót i automatyczne opadanie;
- wykrywanie kolizji;
- utrwalanie klocka na planszy;
- wykrywanie i usuwanie pełnych rzędów;
- wynik, poziom trudności, koniec gry i restart.

### Kolejność prac

1. Narysować pustą planszę i jeden klocek.
2. Dodać ruch w lewo, prawo i w dół.
3. Zatrzymywać klocek na podłodze i innych klockach.
4. Losować następny klocek.
5. Usuwać pełne rzędy.
6. Dodać obracanie.
7. Dodać wynik, przyspieszanie i koniec gry.

### Poza MVP

- cień pokazujący miejsce upadku;
- przechowywanie jednego klocka;
- efekty cząsteczkowe i kombinacje punktowe;
- lokalny tryb dwóch graczy;
- własne kształty i zasady.

## 2. Sudoku

**Trudność:** 5/10  
**Czas MVP:** 5–8 dni  
**Technologia startowa:** HTML, CSS i JavaScript

### Cel MVP

Gracz rozwiązuje jedną przygotowaną planszę 9×9. Program blokuje liczby początkowe, pokazuje konflikty i rozpoznaje poprawne ukończenie.

### Moduły

- model planszy 9×9;
- liczby początkowe i pola edytowalne;
- zaznaczanie pola i wpisywanie cyfr;
- sprawdzanie wiersza, kolumny i kwadratu 3×3;
- licznik czasu lub błędów;
- wykrycie zwycięstwa i restart.

### Kolejność prac

1. Wyświetlić gotową planszę.
2. Pozwolić wybierać pola i wpisywać cyfry.
3. Zablokować liczby początkowe.
4. Podświetlać konflikty.
5. Rozpoznawać poprawne rozwiązanie.
6. Dodać nową grę, czas i zapis wyniku.

### Poza MVP

- notatki z kandydatami;
- podpowiedzi;
- kilka poziomów trudności;
- generator układów — osobny, trudniejszy etap;
- codzienna plansza i seria zwycięstw.

## 3. Cyfrowa kolorowanka

**Trudność:** 4/10  
**Czas MVP:** 4–6 dni  
**Technologia startowa:** HTML, CSS, JavaScript i Canvas

### Cel MVP

Użytkownik wybiera obrazek i kolor, maluje pędzlem, może cofnąć ruch oraz zapisać gotową pracę jako PNG.

### Moduły

- płótno do rysowania;
- obrazek z konturami;
- paleta;
- pędzel o zmiennym rozmiarze;
- gumka;
- historia operacji i cofanie;
- eksport obrazu.

### Kolejność prac

1. Rysowanie kursorem po pustym płótnie.
2. Paleta i rozmiar pędzla.
3. Obrazek z konturami.
4. Gumka i cofanie.
5. Wybór kilku kolorowanek.
6. Zapis jako obraz.

### Poza MVP

- wypełnianie zamkniętego obszaru;
- stemple i tekstury;
- lustrzane rysowanie;
- wspólne rysowanie na dwóch urządzeniach;
- animowanie gotowego rysunku.

## 4. Nakładki na zdjęcia i kamerę

Nakładki na obraz z kamery są projektem AR, nie pełnym VR. Najpierw warto wykonać edytor nieruchomych zdjęć.

**Trudność edytora zdjęć:** 5/10  
**Czas MVP edytora:** 5–8 dni  
**Trudność nakładek śledzących twarz:** 8/10  
**Czas wersji AR:** dodatkowe 12–20 dni  
**Technologia startowa:** HTML, CSS, JavaScript i Canvas; później MediaPipe

### Cel MVP

Użytkownik wybiera zdjęcie, dodaje naklejki, przesuwa je, skaluje, obraca i zapisuje gotowy obraz.

### Moduły

- lokalne wczytywanie zdjęcia;
- płótno z warstwami;
- biblioteka naklejek;
- wybór, przesuwanie, skalowanie i obracanie;
- zmiana kolejności i usuwanie warstw;
- eksport obrazu.

### Kolejność prac

1. Wyświetlić wybrane zdjęcie.
2. Dodać jedną naklejkę.
3. Przesuwać i usuwać naklejki.
4. Skalować i obracać.
5. Obsłużyć wiele warstw.
6. Zapisać wynik.
7. Dopiero później dodać kamerę i śledzenie twarzy.

### Zasada prywatności

Zdjęcia i obraz kamery domyślnie pozostają na urządzeniu. Aplikacja nie wysyła ich na serwer.

---

# Więcej pomysłów

## Gry logiczne i planszowe

| ID | Pomysł | Grywalne MVP | Trudność | Czas MVP | Czego uczy |
|---:|---|---|---:|---:|---|
| 5 | 2048 z własnymi symbolami | Łączenie jednakowych kafelków, wynik i koniec gry | 3/10 | 2–4 dni | tablice, przesuwanie danych |
| 6 | Mastermind | Ukryty kod, próby i informacja o trafieniach | 3/10 | 2–3 dni | warunki, porównywanie |
| 7 | Saper | Losowe miny, liczby sąsiadów i przegrana | 5/10 | 4–6 dni | siatka, sąsiedzi, rekurencja |
| 8 | Puzzle przesuwane | Obraz podzielony na kafelki z jednym pustym miejscem | 3/10 | 2–3 dni | indeksy i zamiana elementów |
| 9 | Nonogram | Jedna plansza z podpowiedziami i sprawdzaniem rozwiązania | 5/10 | 5–7 dni | logika i reprezentacja danych |
| 10 | Łączenie rur | Obracanie kafelków, aż powstanie ciągłe połączenie | 4/10 | 3–5 dni | grafy w prostej postaci |
| 11 | Gra słowna na pięć prób | Odgadywanie hasła z kolorowymi podpowiedziami | 3/10 | 2–3 dni | tekst i walidacja |
| 12 | Kółko i krzyżyk z wariantami | Gra lokalna oraz plansze 4×4 lub specjalne pola | 2/10 | 1–2 dni | stan gry, reguły zwycięstwa |
| 13 | Warcaby mini | Ruch pionków, bicie i zwycięstwo na małej planszy | 6/10 | 7–10 dni | reguły ruchu i tury |
| 14 | Gra pamięciowa | Odkrywanie par kart, licznik ruchów i czas | 2/10 | 1–3 dni | stan interfejsu, losowanie |

## Gry zręcznościowe i akcji

| ID | Pomysł | Grywalne MVP | Trudność | Czas MVP | Czego uczy |
|---:|---|---|---:|---:|---|
| 15 | Pong z własnymi zasadami | Dwie paletki, piłka, punkty i restart | 2/10 | 1–2 dni | ruch, odbicia, kolizje |
| 16 | Snake | Wąż rośnie po zebraniu jedzenia i przegrywa po kolizji | 3/10 | 2–3 dni | kolejka pozycji, siatka |
| 17 | Labirynt z kluczami | Wyjście otwiera się po zebraniu kluczy | 3/10 | 2–4 dni | mapy kafelkowe, kolizje |
| 18 | Gra zbieracka | Zbieranie przedmiotów przed końcem czasu | 2/10 | 2–3 dni | obiekty, wynik, zegar |
| 19 | Breakout | Paletka odbija piłkę niszczącą cegły | 4/10 | 3–5 dni | fizyka odbić, poziomy |
| 20 | Endless runner | Bohater biegnie i omija generowane przeszkody | 4/10 | 3–5 dni | generowanie, prędkość, animacja |
| 21 | Lokalny pojedynek | Dwie postacie walczą lub zbierają ten sam cel | 5/10 | 4–7 dni | dwa zestawy sterowania, balans |
| 22 | Gra rytmiczna | Naciskanie klawiszy zgodnie z rytmem piosenki | 6/10 | 7–12 dni | czas, synchronizacja dźwięku |
| 23 | Wieża obronna mini | Jedna mapa, kilka fal i dwa typy wież | 7/10 | 10–15 dni | ścieżki, ekonomia, balans |
| 24 | Mini-roguelike | Losowe pokoje, walka turowa i jedno podejście | 8/10 | 15–25 dni | generowanie, systemy gry |
| 25 | Gra skradankowa 2D | Strażnicy z polem widzenia, cel i alarm | 7/10 | 10–16 dni | geometria, proste AI |
| 26 | Konstrukcje fizyczne | Ustawienie kilku elementów, by piłka dotarła do celu | 7/10 | 10–18 dni | fizyka i projektowanie zagadek |

## Historie, grafika i muzyka

| ID | Pomysł | Grywalne MVP | Trudność | Czas MVP | Czego uczy |
|---:|---|---|---:|---:|---|
| 27 | Interaktywny komiks | Kilka scen, wybory i dwa zakończenia | 3/10 | 3–5 dni | narracja rozgałęziona |
| 28 | Escape room | Jeden pokój, przedmioty i trzy zagadki | 5/10 | 5–8 dni | ekwipunek, zależności |
| 29 | Wirtualne zwierzątko | Karmienie, zabawa, trzy potrzeby i zapis stanu | 6/10 | 7–12 dni | czas, stan, zapis danych |
| 30 | Ubieranka postaci | Wybór postaci i nakładanie ubrań warstwami | 3/10 | 3–5 dni | warstwy i interfejs |
| 31 | Generator sztuki | Suwaki zmieniające kolory, figury i animację | 3/10 | 2–4 dni | matematyka, grafika generatywna |
| 32 | Edytor pixel art | Siatka pikseli, paleta, gumka i zapis PNG | 5/10 | 5–8 dni | narzędzia graficzne, eksport |
| 33 | Sekwencer muzyczny | Siatka taktów uruchamiająca kilka dźwięków | 5/10 | 5–8 dni | rytm, tablice, Web Audio |
| 34 | Studio efektów dźwiękowych | Nagranie lub wybór dźwięku i kilka transformacji | 5/10 | 5–9 dni | audio i przetwarzanie sygnałów |
| 35 | Kreator animowanych kartek | Tekst, grafika, ruch i eksport lub udostępnienie | 4/10 | 4–6 dni | animacja i kompozycja |
| 36 | Kreator poziomów | Układanie mapy i natychmiastowe testowanie jej postacią | 7/10 | 10–16 dni | edytory, serializacja danych |

## Symulacje i gry o zarządzaniu

| ID | Pomysł | Grywalne MVP | Trudność | Czas MVP | Czego uczy |
|---:|---|---|---:|---:|---|
| 37 | Symulator sklepu | Kupowanie towaru, sprzedaż i prosty bilans dnia | 6/10 | 8–12 dni | ekonomia i dane |
| 38 | Restauracja na czas | Przyjmowanie i realizacja prostych zamówień | 6/10 | 7–12 dni | kolejki, czas, balans |
| 39 | Hodowla ogrodu | Sadzenie, wzrost w czasie i zbieranie plonów | 5/10 | 6–10 dni | zegar, zapis stanu |
| 40 | Mini-ekosystem | Rośliny i zwierzęta wpływają na swoją populację | 6/10 | 8–12 dni | symulacja i zależności |
| 41 | Kolonia mrówek | Mrówki szukają jedzenia i zostawiają ślady | 8/10 | 15–25 dni | zachowania emergentne, AI |
| 42 | Karciana walka | Mała talia, energia, przeciwnik i jedna bitwa | 7/10 | 10–18 dni | system efektów i balans |
| 43 | Menedżer drużyny | Skład, proste statystyki i symulacja meczu | 6/10 | 8–14 dni | model danych, prawdopodobieństwo |
| 44 | Cyfrowy pomocnik do planszówki | Losowanie wydarzeń, rundy i liczenie punktów | 4/10 | 3–6 dni | projektowanie interfejsu |

## Kamera, ruch i projekty fizyczne

| ID | Pomysł | Grywalne MVP | Trudność | Czas MVP | Czego uczy |
|---:|---|---|---:|---:|---|
| 45 | Łapanie obiektów ruchem głowy | Kamera steruje koszykiem zbierającym przedmioty | 7/10 | 8–12 dni | kamera, śledzenie pozycji |
| 46 | Taniec z wykrywaniem pozy | Gracz powtarza kilka prostych póz | 8/10 | 12–20 dni | rozpoznawanie pozy, tolerancja błędu |
| 47 | Fotobudka AR | Kamera, nakładki twarzy i zapis zdjęcia | 8/10 | 12–20 dni | punkty twarzy, transformacje |
| 48 | Gra refleksowa na micro:bit | Losowy sygnał i pomiar czasu naciśnięcia | 5/10 | 4–7 dni | sprzęt, zdarzenia i pomiar czasu |
| 49 | Własny kontroler | Przyciski lub czujniki sterują prostą grą | 7/10 | 8–14 dni | wejście sprzętowe, prototypowanie |
| 50 | Domowe poszukiwanie skarbu | Kolejne zagadki odblokowywane kodami QR | 4/10 | 4–6 dni | logika scenariusza, urządzenia mobilne |
| 51 | Studio poklatkowe | Zdjęcia z kamery tworzą odtwarzaną animację | 5/10 | 5–8 dni | kamera, klatki, eksport |
| 52 | Rodzinny automat arcade | Menu uruchamiające 3–5 ukończonych minigier | 7/10 | 8–14 dni po zrobieniu gier | integracja i prezentacja |

## Quizy, nauka i narzędzia do tworzenia

| ID | Pomysł | Grywalne MVP | Trudność | Czas MVP | Czego uczy |
|---:|---|---|---:|---:|---|
| 53 | Quiz rodzinny | Pytania z pliku, wynik i podsumowanie | 4/10 | 4–6 dni | dane, formularze, losowanie |
| 54 | Quiz z własnym edytorem | Tworzenie zestawu pytań i późniejsza rozgrywka | 6/10 | 7–11 dni | CRUD, zapis danych |
| 55 | Nauka słówek | Fiszki, powtórki i statystyka poprawnych odpowiedzi | 4/10 | 4–7 dni | algorytm powtórek, dane |
| 56 | Matematyczny boss | Poprawne odpowiedzi osłabiają przeciwnika | 4/10 | 4–6 dni | łączenie edukacji z mechaniką |
| 57 | Programowalny robot na planszy | Układanie sekwencji ruchów prowadzących do celu | 5/10 | 5–8 dni | algorytmy i sekwencje |
| 58 | Generator przygód | Losuje bohatera, miejsce, problem i zwrot akcji | 3/10 | 2–4 dni | kombinowanie danych, tekst |
| 59 | Mapa rodzinnych historii | Punkty na mapie otwierają zdjęcia i opowieści | 5/10 | 5–9 dni | multimedia, dane przestrzenne |
| 60 | Projektant własnej gry karcianej | Edytowanie kart, druk arkusza i testowa talia | 6/10 | 7–12 dni | narzędzia autorskie, druk |

---

# Inne ścieżki niż budowanie gry od zera

| Ścieżka | Mały rezultat | Trudność | Czas |
|---|---|---:|---:|
| Modyfikacja gotowej gry | Zmiana grafiki, zasad i jednego poziomu | 2/10 | 1–3 dni |
| Rodzinny game jam | Ukończona mikrogra na zadany temat | 4/10 | 2–3 dni |
| Projekt papierowej planszówki | Grywalny prototyp z papieru | 2/10 | 1–3 dni |
| Digitalizacja planszówki | Komputerowa wersja najważniejszej mechaniki | 6/10 | 7–14 dni |
| Pakiet grafik do gier | Spójne postacie, przedmioty i tła | 3/10 | 3–6 dni |
| Pakiet muzyki i efektów | Motyw muzyczny i zestaw dźwięków do jednej gry | 4/10 | 3–6 dni |
| Kanał dziennika projektu | Krótkie nagrania pokazujące kolejne wersje | 3/10 | 1 dzień konfiguracji |
| Testowanie cudzej gry | Raport błędów i propozycje poprawy zasad | 2/10 | 1–2 dni |
| Interaktywna opowieść | Historia z wyborami i kilkoma zakończeniami | 3/10 | 3–5 dni |
| Projekt z AI jako bohaterem | Postać reagująca na ograniczony zestaw poleceń | 7/10 | 10–18 dni |

# Jak wybrać pierwszy projekt

Każda osoba wybiera pięć pomysłów i rozdziela między nie łącznie 10 punktów. Trzy najwyżej ocenione przechodzą do krótkiej rozmowy według poniższych pytań.

| Kryterium | Pytanie | Ocena 1–5 |
|---|---|---:|
| Frajda z tworzenia | Czy interesuje nas również budowanie, nie tylko gotowa gra? | |
| Frajda z grania | Czy będziemy chcieli zagrać więcej niż raz? | |
| Współpraca | Czy są zadania dla programisty, grafika, autora zasad i testera? | |
| Realność | Czy MVP zmieści się w maksymalnie 8 dniach? | |
| Rozwój | Czy po MVP widzimy 2–3 ciekawe rozszerzenia? | |

## Karta wybranego projektu

Po wyborze należy uzupełnić:

- **Nazwa robocza:**
- **Gracz może:**
- **Główne wyzwanie:**
- **Warunek zwycięstwa lub zakończenia:**
- **MVP jest gotowe, gdy:**
- **Na razie nie robimy:**
- **Technologia:**
- **Podział pierwszych zadań:**
- **Planowana liczba dni:**
- **Pomysły po MVP:**

## Proponowana kolejność rozwoju

1. Ukończyć projekt o trudności 2–3.
2. Ukończyć projekt kreatywny albo narracyjny o trudności 3–5.
3. Zrobić wspólnie projekt o trudności 5–6.
4. Dopiero później rozpocząć AR, rozbudowaną symulację lub grę sieciową.

Najważniejszą miarą sukcesu pierwszych projektów jest ukończenie działającej wersji, a nie liczba funkcji.
