# Webanwendungen Aufgabe 2

- [X] Funktion zum erstellen der Karte mit 2 Parametern (Daten, [Optionen](https://www.freecodecamp.org/news/elegant-patterns-in-modern-javascript-roro-be01e7669cbd/))
- [X] Umrisse der karte mit SVG-Path darstellen
- [X] Farbe der Umrisse soll per Option änderbar sein (Standartwert schwarz)
- [X] Füllfarbe stellt dar wie stark der LK befallen ist. Farbe soll mit [HSL](https://wisotop.de/hsv-und-hsl-farbmodell.php) spezifiziert werden (Standardfarbe blau)
- [X] Die Helligkeit (Lightness) hängt von der Anzahl der Corona-Infizierten pro 100.000 Einwohner ab. Ist die Anzahl 0, so wird die Helligkeit auf 100% gesetzt, ist sie Deutschland-weit maximal, wird sie auf 50% gesetzt. Dazwischen wird linear interpoliert.
- [X] Der Benutzer kann wählen, ob die Anzahl der Fälle, die die Farbe bestimmt, die Anzahl der Infizierten pro 100.000 Einwohner (cases_per_100k) ist oder Anzahl der Infizierten pro 100.000 Einwohner der letzten 7 Tage (cases7_per_100k).
- [X] Bewegt der Benutzer die Maus über einen Kreis, so soll dessen Name als Tooltip angezeigt werden.
- [X] Klickt sie auf einen Kreis, so soll bei der Klickposition ein Popup-Fenster angezeigt werden, das tabellarisch folgende Informationen über den Kreis anzeigt:
    - Name des Kreises
    - Name des Bundeslandes
    - Einwohnerzahl des Kreises
    - Anzahl aller Infizierten
    - Anzahl der Infizierten pro 100.000 Einwohner
    - Anzahl der Infizierten pro 100.000 Einwohner der letzten 7 Tage
    - Anzahl der Toten
- [X] Verlässt die Maus den Kreis, so verschwindet dieses Popup-Fenster.
- [X] Die Karte ist so skaliert, dass Deutschland vollständig sichtbar ist und dadurch der zur Verfügung stehende Platz möglichst ausgeschöpft ist.
- [X] Es gibt eine Auswahlmöglichkeit für die Bundesländer bzw. alle Bundesländer (wie in der vorherigen Aufgabe)
- [X] Standardmäßig nur die ersten 5 Bundesländer anzeigen (per Option änderbar)
- [X] Die Balken werden deutschlandweit gleich skaliert
- [X] Farbe der Balken sollen änderbar sein
- [X] Balken sollen beim anzeigen animiert werden, d.h. ihre Länge ändert sich von 0 auf die betreffende Länge
- [X] Die Balken erscheinen nacheinander gemäß ihrer Reihenfolge.
- [X] Dabei werden die Kreise in der Karte hervorgehoben, indem ihr Umriss in rot (per Option änderbar) und mit dickerem Rand (Dicke per Option änderbar) dargestellt werden. Dies erfolgt gleichzeitig mit Beginn der Animation des jeweiligen Balkens. Die Änderung der Dicke des Umrisses erfolgt animiert.
- [X] Demonstrieren Sie die Änderung aller Optionen, indem Sie dem Benutzer eine Auswahlmöglichkeit geben, mit dem er entweder die Standardoptionen wählen kann oder einen festen Satz von Alternativoptionen. Für diese Aufgabe ist es nicht erforderlich, dass der Benutzer die Optionen selbst bestimmen kann.
