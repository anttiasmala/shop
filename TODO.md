# WIP

11. Korjaa /admin-sivun "laatikot" ettei teksti tule yli, kun ruutua pienennetään

# TODO

2. Järjestele koodia
3. Ehkä jonkilainen menu, josta voisi kirjautua sisään ja ulos. Ehkä rekistöröityä. Siellä olisi kotisivulle ja kauppaan linkit
4. Lisää enemmän virhetekstejä / jokin virhetekstien käsittelijä. Esim. että "email was not unique" näytettäisiin käyttäjälle toastina
5. Päivitä "käyttäjätili luotu onnistuneesti" pareemmaksi
6. Muokkaa virheet englanniksi ja muutenkin sivu englanniksi nyt. Myöhemmin voi lisätä suomen
7. Lisää Authentication Modaliin jokin tieto, että kuka on kirjautunut sisään ja millä käyttäjällä
8. Jos käyttäjän cartUUID on virheellinen (heittää 404 Erroria /cart:ssa) laita jokin nappula, joka resetoi käyttäjän kärryn tiedot
9. /admin/products kun muokkaa tuotetta, enter-näppäin ei tunnu hyväksyvän muokkauksia kuten pitäisi
10. Tarkista ja kokeile /admin/upload-images, että toimii. Lisää virheenkäsittelijät, tieto että kuva latautu palvelimelle yms
11. Kun kuvan nimi muokataan tai kuva poistetaan /admin/list-images:ssa, päivitä kuvat muokkauksen / poistamisen jälkeen
12. Jos tuote on asetettu kärryyn ja tuotetta yritetään poistaa tulee seuraava virhe `Foreign key constraint violated on the constraint: CartItem_productUUID_fkey`. Lisää kiertotapa ongelman korjaamiseksi. Esim. estä tuotteen löytyminen kaupasta tai sen lisääminen ostoskoriin. Esim. jokin "disable"-kenttä tietokantaan
13. Lisää virheenkäsittely /admin/products:in Delete-requestille

### Ideoita

1. Input tuotteen lukumäärään, että voi kirjoittaa haluamansa määrän?
2. Lisää GIF-kuvat sallittvaiksi /admin/upload-images:iin?
