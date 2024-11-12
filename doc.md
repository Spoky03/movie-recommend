# Dokumentacja Techniczna Aplikacji Fullstack

**Nazwa Aplikacji**:  Movie recommendations
**Wersja**:  0.0.1
**Data Utworzenia**:  11.11.2024
**Autor**:  Stefan Grzelec, Maks Buhai
**Repozytorium**:  https://github.com/Spoky03/movie-recommend

---

## 1. Wprowadzenie

### 1.1 Opis projektu
Aplikacja do oceniania i otrzymywania rekomendacji filmów na podstawie historii oglądania.

### 1.2 Cele aplikacji
- Ocenianie filmów.
- Rekomendacje
---

## 2. Architektura Systemu

### 2.1 Ogólny Przegląd
Diagram przedstawiający ogólną architekturę aplikacji (np. diagram komponentów lub przepływu danych).

### 2.2 Technologie
- **Frontend**: --
- **Backend**: Express.js
- **Baza Danych**: MongoDB

### 2.3 Wzorce Projektowe
Krótki opis kluczowych wzorców projektowych używanych w aplikacji (np. MVC, MVVM, CQRS).

---

## 3. Frontend

---

## 4. Backend

### 4.1 Struktura Plików
src/

- middleware: np authorization
- service: zapytania do TMDB API
- index: główny plik
- config: zmienne środowiskowe i konfiguracja

### 4.2 Technologie i Biblioteki
- Express.js
- MongoDB
- AXIOS
- JWT
- BCRYPT

### 4.3 Endpoints API
Dokumentacja endpointów API 

#### Przykład:

| Metoda | Endpoint            | Opis                                  | Parametry          |
|--------|----------------------|---------------------------------------|---------------------|
| POST    | `/api/register`        | Tworzy nowego użytkownika            | `username`, `password`    |
| POST   | `/api/login`        | Loguje użytkownika i zwraca JWT             | `username`, `password`    |
| GET   | `/api/search`        | Wyszukuje film po nazwie w bazie danych i wykonuje zapytanie do TMDB            | `query`,     |

### 4.4 Autoryzacja i Autentykacja
JWT, BCRYPT

### 4.5 Walidacja Danych


---

## 5. Baza Danych

### 5.1 Schemat Bazy Danych
Diagram ERD (Entity-Relationship Diagram)

### 5.2 Opis Tabel
Opis głównych tabel w bazie danych i ich pól.

### 5.3 Relacje



---

**Dokument przygotowany przez**: Stefan Grzelec 
**Data aktualizacji**: 12-11-2024
