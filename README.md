# jsramverk-project-socket

## Installation
Installera `mongodb` server lokalt.  
Installera jsramverk-project-API och kör `npm run migrate`

``npm install``  
Installerar samtliga moduler.

## Körning
``npm start``  
Startar en development server på port 3001.

## Val av teknik
- Socket&period;io  
Jag valde att fortsätta använda Socket&period;io från tidigare i kursen då jag redan känner att jag har koll på det istället för att börja med ett nytt paket för projektet. Jag använder sockets för att se till att användare som ansluter har de senaste priserna och för att sedan uppdatera priserna för samtliga aktier och skicka den datan till anslutna användare.
- Express  
Socket&period;io använder sig av express, utöver socketen så används inga express routes.
- NoSQL - Mongodb  
Jag valde att socket servern skulle prata dirket med database istället för att gå igenom API:et vilket betyder att socket servern kan stå på sina egna ben som en "micro-service". Eftersom jag redan använder mongodb för API:et så används det också för socket servern, likt API:et så finns db/database.js för att hantera anslutningen till databasen.

## Hur väl det fungerar
Min realtids micro-service gör det som den ska så jag tycker att den fungerar rätt så bra, det jag känner skulle kunna förbättras är min implementation på klient-sidan då det är väldigt många priser som skickas till klienten filtrerar jag så endast de senaste x timmar av data visas, då grafen på klienten får lite problem med ett antal tusen priser.
