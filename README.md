# 🦫 Otis - Capybara Galerie

Eine vollständige, niedliche Capybara-Galerie Website im Taiwan Stil mit Slideshow, Google Maps, Bild-Upload und Kommentaren.

## ✨ Features

- 🎨 **Taiwan Capybara Design** - Pastellfarben, weiche Animationen, kawaii Stil
- 📸 **Slideshow** - Automatisches Scannen von Bildern im `img/` Ordner
- 📤 **Bild-Upload** - Drag & Drop oder Klick zum Hochladen
- 🗺️ **Google Maps** - Custom gestylte Karte mit persönlichen Orten
- 🎉 **Konfetti-Animation** - Beim Laden der Seite und bei Aktionen
- 💬 **Kommentar-System** - Mit Like-Funktion
- 🔍 **Lightbox** - Vollbildansicht für Bilder
- 📱 **Responsive** - Funktioniert auf allen Geräten
- ♿ **Accessibility** - ARIA-Labels, Keyboard-Navigation

## 🚀 Schnellstart

### 1. Bilder hinzufügen

Füge deine Bilder in den `img/` Ordner ein:
```
img/
  ├── foto1.jpg
  ├── foto2.jpg
  ├── foto3.jpg
  ...
```

Die Website scannt automatisch nach Bildern mit Namen wie:
- `foto1.jpg`, `foto2.jpg`, ...
- `photo1.jpg`, `photo2.jpg`, ...
- `img1.jpg`, `img2.jpg`, ...
- `pic1.jpg`, `pic2.jpg`, ...

### 2. Google Maps API Key (Optional)

1. Gehe zu [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Erstelle ein Projekt oder wähle ein bestehendes
3. Aktiviere die "Maps JavaScript API"
4. Erstelle einen API Key
5. Ersetze `DEIN_API_KEY_HIER` in `index.html` mit deinem API Key

**Ohne API Key:** Die Karte zeigt einen Platzhalter, aber die Website funktioniert trotzdem!

### 3. Orte auf der Karte hinzufügen

Öffne `js/script.js` und bearbeite das `spots` Array:

```javascript
const spots = [
    {
        coords: { lat: 22.6273, lng: 120.3014 },
        title: "Kaohsiung",
        text: "Wo alles begann! ❤️",
        icon: '🦫'
    },
    // Füge hier mehr Orte hinzu!
];
```

## 📁 Dateistruktur

```
/
├── index.html          # Haupt-HTML-Datei
├── css/
│   └── style.css       # Alle Styles
├── js/
│   └── script.js       # Alle JavaScript-Funktionen
├── img/                # Deine Bilder (wird automatisch gescannt)
└── README.md           # Diese Datei
```

## 🎨 Anpassungen

### Farben ändern

Bearbeite die CSS-Variablen in `css/style.css`:

```css
:root {
    --primary-pink: #ff6b9d;
    --accent: #AED581;
    --highlight: #FFAB91;
    ...
}
```

### Schriftarten ändern

Die Website nutzt Google Fonts:
- **Überschriften:** Mochiy Pop One
- **Text:** Varela Round

Ändere die Fonts in `index.html` und `css/style.css`.

## 💾 Daten-Speicherung

- **Bilder:** Werden im Browser-LocalStorage gespeichert (bis zu ~5-10MB)
- **Kommentare:** Werden im Browser-LocalStorage gespeichert
- **Hinweis:** Bei gelöschtem Browser-Cache gehen die Daten verloren

Für permanente Speicherung wäre ein Backend nötig.

## 🌐 GitHub Pages Deployment

Die Website ist bereits für GitHub Pages konfiguriert:

1. Push zu GitHub
2. Gehe zu Repository Settings → Pages
3. Wähle "GitHub Actions" als Source
4. Die Website wird automatisch deployed!

**URL:** `https://dein-username.github.io/repository-name/`

## 🛠️ Technologien

- **HTML5** - Semantisches Markup
- **CSS3** - Moderne Styles mit CSS-Variablen
- **Vanilla JavaScript** - Keine Frameworks nötig
- **Google Maps API** - Für die Karte
- **Canvas Confetti** - Für Konfetti-Animationen
- **LocalStorage** - Für Daten-Persistenz

## 📝 Cursor AI Prompt

Wenn du neue Bilder hinzugefügt hast, kannst du Cursor einfach sagen:

> "Ich habe neue Bilder in den img/ Ordner gelegt. Bitte aktualisiere die Slideshow, damit alle neuen Bilder angezeigt werden."

Cursor wird dann automatisch die `script.js` anpassen!

## 🎯 Nächste Schritte

- [ ] Google Maps API Key hinzufügen
- [ ] Eigene Orte auf der Karte eintragen
- [ ] Bilder in den `img/` Ordner legen
- [ ] Website auf GitHub Pages deployen
- [ ] Freunden teilen! 🎉

## 📄 Lizenz

Frei verwendbar für persönliche Projekte.

---

Made with ❤️ in Taiwan | 🦫 Otis Galerie
