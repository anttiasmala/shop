1. Admin API -endpointteihin tarkistus, että käyttäjä on ADMIN. // WIP
2. Järjestele koodia
3. Ehkä jonkilainen menu, josta voisi kirjautua sisään ja ulos. Ehkä rekistöröityä. Siellä olisi kotisivulle ja kauppaan linkit
4. Yhdistetään Cart ja User 1-1 relaatiolla
   4.1 Valmiina olevan kärryn yhdistäminen kirjautuvaan henkilöön, jonkinlainen tunnistus LocalStorage / Cookieiden kautta?
   Vaihtoehtoisesti vain kirjautuneena voi lisätä kärryyn tavaraa?
5. Lisää enemmän virhetekstejä / jokin virhetekstien käsittelijä. Esim. että "email was not unique" näytettäisiin käyttäjälle toastina
6. Sulje "Authentication Modal", jos klikataan jotain muuta kuin modalia itseään
7. AuthModal ei sulkeudu, jos klikkaa muuta kuin modalia. Tee tsekkaus, jos klikkaus ei ole modaliin, sulje modal

### Ideoita

1. Input tuotteen lukumäärään, että voi kirjoittaa haluamansa määrän?
