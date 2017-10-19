Zie www.roburbox.nl/beeproger voor de live productie versie van deze code.

Welkom bij de source code van Robur's Todo List applicatie voor BeepRoger.
Hier vind u de belangrijke files die gebruikt zijn voor de Laravel server en de Angular 2 client.

Backend
De Laravel applicatie draait op mijn eigen server en gebruikt mysql als database.
De Laravel server serveert een enkele (Angular 2) pagina die te bereiken is op www.roburbox.nl en www.roburbox.nl/beeproger.
Daarnaast dient de Laravel server als REST service met een POST en een GET om de todolijst mee te beheren.

Frontend
De Angular 2 pagina is (natuurlijk) een Single Page Application met het Model View View-Model principe, waarbij de data persistent is dmv. de REST mogelijkheden van de Laravel server.
De code bestaat uit een "Todolist" component en een "Todoitem" component (master-detail interface pattern) om het overzicht te behouden voor de gebruiker en de ontwikkelaar.
Toegevoegd aan deze pagina is een voor de gebruiker zichtbare lijst features die alle functionaliteit van het scherm mededeelt.
Ik heb gebruik gemaakt van Bootstrap voor styling en vormgeving, en Dragula voor het stylen van het verslepen van items.

De volgende wensen zijn opgenomen:
Een lijst met items tonen;
Een item kunnen bewerken;
Een item kunnen afvinken (wordt groen, doorgestreept oid. aan jou de visuele keuze);
Een item kunnen verwijderen van de lijst;
De lijst versturen naar de backend;
De lijst na een herladen (van de pagina) actie de inhoud van de lijst kunnen ophalen van de backend. Hiermee kun je verder gaan waarmee je gebleven bent.

