# NodeJS server
Dit is een simpele NodeJs server voor html-pagina's
***

## Opstarten
het opstarten is heel simpel:  
zorg dat je in de *Server* directory zit en typ in de console  
`node index`

## Config
In deze zelfde [directory](./Server/) zal je ook de [config](./Server/config.json) vinden.  
Hierin staat het volgende:
- default-page: naar welk bestand de server zal zoeken als je alleen een directory in de url hebt staan
- 404-page: de url naar de standaard 404-pagina (path is relatief aan de [Server](./Server/) directory)
- host: dit is het address van de server (standaard localhost)
- port: de port waar de server open op is (standaad op 80)
- base-path: de path waar de html-pagina's in staan (path is relatief aan de [Server](./Server/) directory)
- snippet-path: path waar alle [snippet-bestanden](##Snippets) staan (url is relatief aan de [Server](./Server/) directory)


## Snippets
Het is ook mogelijk om *snippets* te gebruiken.  
Een referentie naar een snippet in een pagina gaat als volgt:  
"%s" is de open en close *tag*. Alles ertussen is de naam van het snippet-bestand.  
Er is wel één regel: de naam van de snippet mag geen spaties bevatten.  
Hierom is dit correct:  
`%s nav %s`  
maar dit niet:  
`%s main nav %s`

***

Het aanmaken van een snippet bestand is simpel:  
eerst moet je zorgen dat hij in de correcte [snippet-path](##Config) staan.  
De naam van een snippet bestand begint met een underscore: \_ ; dan volgt de gegeven naam en als laatst logischerwijs de extensie ".html".  
Als je refereert naar een snippet, dan wordt dat stukje vervangen met **alles** wat er in het snippet-bestand staat. Het is dus niet handig als er een html-openingstag in staat, of head en body.