1. Admin API -endpointteihin tarkistus, että käyttäjä on ADMIN. // WIP

# Seuraavaksi

1. Tee jokin järkevä etusivu nykyisen planeettakuvan tilalle

# TODO

2. Järjestele koodia
3. Ehkä jonkilainen menu, josta voisi kirjautua sisään ja ulos. Ehkä rekistöröityä. Siellä olisi kotisivulle ja kauppaan linkit
4. Yhdistetään Cart ja User 1-1 relaatiolla
   4.1 Valmiina olevan kärryn yhdistäminen kirjautuvaan henkilöön, jonkinlainen tunnistus LocalStorage / Cookieiden kautta?
   Vaihtoehtoisesti vain kirjautuneena voi lisätä kärryyn tavaraa?
5. Lisää enemmän virhetekstejä / jokin virhetekstien käsittelijä. Esim. että "email was not unique" näytettäisiin käyttäjälle toastina
6. Sulje "Authentication Modal", jos klikataan jotain muuta kuin modalia itseään
7. AuthModal ei sulkeudu, jos klikkaa muuta kuin modalia. Tee tsekkaus, jos klikkaus ei ole modaliin, sulje modal
8. Tee /pages/api:n alle admin-kansio ja siirrä list-images, products ja upload sinne
9. lisää salasana-kenttiin mahdollisuus nähdä salasana
10. Päivitä "käyttäjätili luotu onnistuneesti" pareemmaksi
11. Muokkaa virheet englanniksi ja muutenkin sivu englanniksi nyt. Myöhemmin voi lisätä suomen
12. Lisää Authentication Modaliin jokin tieto, että kuka on kirjautunut sisään ja millä käyttäjällä
13. Vanhojen Cart:ien poistaminen

### Ideoita

1. Input tuotteen lukumäärään, että voi kirjoittaa haluamansa määrän?
