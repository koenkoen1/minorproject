# minorproject
## Problem statement
Waar kan je het best leven in nederland als geld geen probleem is?  

## solution
met de data van de leefbaarometer, zou het mogelijk moeten zijn om makkelijk te zien waar het best geleefd wordt.  

### features (minimum viable product)
leefbaarheidkaart voor gemeentes in land  
leefbaarheidkaart voor wijken in gekozen gemeente  
leefbaarheidsgrafiek voor gekozen gemeente over bepaalde tijd  
leefbaarheidsgrafiek voor gekozen wijk over bepaalde tijd  
dropdownbox voor periodes van jaren  
dropdownbox voor keuze tussen modes op de kaart(huidige leefbaarheid of verandering in leefbaarheid)  

## prerequisites
### data source
https://data.overheid.nl/data/dataset/leefbaarometer-2-0---meting-2016  
de leefbaarometer score is afhankelijk van 100 indicatoren die in 5 dimensies zijn ingedeeld:
1. woningen (aantal woningen, aandeel vrijstaande woningen, etc)
2. bewoners (aandeel allochtonen, ouderen of eenoudergezinnen, etc)
3. voorzieningen (afstand tot voorziening, scholen en doctors binnen 1 km, verdwenen supermarkten, etc)
4. veiligheid (overlast, ordeverstoringen, geweld, inbraken)
5. fysieke omgeving (aantal monumenten, aandeel groen, aandeel water, natuurramp-risico, etc)  

om de vorm en naam van de gemeentes/wijken te krijgen, zal de shapefile geïnterpreteerd moeten worden.  
