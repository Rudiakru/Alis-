// ============================================
// KONFETTI ANIMATION BEIM LADEN
// ============================================
window.addEventListener('load', () => {
    if (typeof confetti !== 'undefined') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#AED581', '#FFAB91', '#FFF176', '#ff6b9d', '#f8b500']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#AED581', '#FFAB91', '#FFF176', '#ff6b9d', '#f8b500']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
});

// ============================================
// BILDER-MANAGEMENT
// ============================================
let images = JSON.parse(localStorage.getItem('otisImages')) || [];
let slideshowImages = [];

// Automatisches Scannen von Bildern im img/ Ordner
async function scanImageFolder() {
    // Versuche Bilder aus dem img/ Ordner zu laden
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const commonNames = ['foto', 'photo', 'img', 'image', 'pic', 'picture'];
    
    // Versuche verschiedene Dateinamen-Kombinationen
    const possibleImages = [];
    for (let i = 1; i <= 50; i++) {
        for (const ext of imageExtensions) {
            possibleImages.push(`img/foto${i}${ext}`);
            possibleImages.push(`img/photo${i}${ext}`);
            possibleImages.push(`img/img${i}${ext}`);
            possibleImages.push(`img/pic${i}${ext}`);
        }
    }
    
    // Teste welche Bilder existieren
    const existingImages = [];
    for (const imgPath of possibleImages) {
        try {
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = () => resolve(imgPath);
                img.onerror = () => reject();
                img.src = imgPath;
                setTimeout(() => reject(), 100);
            });
            existingImages.push(imgPath);
        } catch (e) {
            // Bild existiert nicht, überspringen
        }
    }
    
    return existingImages;
}

// Initialisiere Slideshow mit Bildern aus img/ Ordner
async function initSlideshow() {
    const folderImages = await scanImageFolder();
    const uploadedImages = images.map(img => img.data);
    
    // Kombiniere Ordner-Bilder und hochgeladene Bilder
    slideshowImages = [...folderImages, ...uploadedImages];
    
    const slideshowWrapper = document.getElementById('slideshow-wrapper');
    if (!slideshowWrapper) return;
    
    if (slideshowImages.length === 0) {
        slideshowWrapper.innerHTML = `
            <div style="padding: 60px 20px; text-align: center; color: #999;">
                <div style="font-size: 4em; margin-bottom: 20px;">🦫</div>
                <p>Noch keine Bilder in der Slideshow</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Lade Bilder hoch oder füge sie in den img/ Ordner ein!</p>
            </div>
        `;
        return;
    }
    
    // Erstelle Slides
    slideshowWrapper.innerHTML = '';
    slideshowImages.forEach((imgSrc, index) => {
        const div = document.createElement('div');
        div.className = 'mySlides fade';
        if (index === 0) div.classList.add('active');
        div.innerHTML = `<img src="${imgSrc}" alt="Bild ${index + 1}" loading="lazy">`;
        slideshowWrapper.appendChild(div);
    });
    
    slideIndex = 1;
    showSlides(slideIndex);
    updateSlideCounter();
}

// Slideshow Navigation
let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
    updateSlideCounter();
}

function showSlides(n) {
    const slides = document.getElementsByClassName('mySlides');
    if (slides.length === 0) return;
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        slides[i].style.display = 'none';
    }
    
    slides[slideIndex - 1].classList.add('active');
    slides[slideIndex - 1].style.display = 'block';
}

function updateSlideCounter() {
    const counter = document.getElementById('slide-counter');
    if (counter && slideshowImages.length > 0) {
        counter.textContent = `${slideIndex} / ${slideshowImages.length}`;
    }
}

// Keyboard Navigation für Slideshow
document.addEventListener('keydown', function(e) {
    // Nur wenn Lightbox nicht offen ist
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        return; // Lightbox hat Priorität
    }
    
    if (e.key === 'ArrowLeft') {
        plusSlides(-1);
    } else if (e.key === 'ArrowRight') {
        plusSlides(1);
    }
});

// ============================================
// BILDER-UPLOAD FUNKTIONEN
// ============================================
function initGallery() {
    const gallery = document.getElementById('uploaded-gallery');
    if (!gallery) return;
    
    if (images.length === 0) {
        gallery.innerHTML = `
            <div class="empty-gallery">
                <div class="empty-gallery-icon">🦫</div>
                <p>Noch keine Bilder hochgeladen</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Lade das erste Bild von Otis hoch!</p>
            </div>
        `;
        return;
    }

    gallery.innerHTML = images.map((img, index) => `
        <div class="gallery-item" style="animation-delay: ${index * 0.1}s" onclick="openLightbox('${img.data}')" role="button" tabindex="0" aria-label="Bild ${index + 1} öffnen" onkeypress="if(event.key==='Enter') openLightbox('${img.data}')">
            <img src="${img.data}" alt="Otis Bild ${index + 1}" loading="lazy" />
            <div class="gallery-item-info">
                <div class="gallery-item-date">📅 ${new Date(img.date).toLocaleDateString('de-DE', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</div>
                <button class="delete-btn" onclick="event.stopPropagation(); deleteImage(${index})" aria-label="Bild ${index + 1} löschen">🗑️ Löschen</button>
            </div>
        </div>
    `).join('');
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Bitte wähle ein Bild aus!');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('Das Bild ist zu groß! Maximal 10MB erlaubt.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            data: e.target.result,
            date: new Date().toISOString()
        };
        images.unshift(imageData);
        localStorage.setItem('otisImages', JSON.stringify(images));
        
        // Aktualisiere beide Bereiche
        initGallery(); // Aktualisiert "Alle Bilder" Section
        initSlideshow(); // Aktualisiert Slideshow (enthält hochgeladene Bilder)
        
        // Erfolgs-Feedback
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50, #8bc34a);
            color: white;
            padding: 20px 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
            z-index: 10000;
            font-weight: 700;
            animation: slideInRight 0.5s ease;
        `;
        successMsg.innerHTML = '✨ Bild erfolgreich hochgeladen!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => successMsg.remove(), 500);
        }, 3000);
        
        // Konfetti für neuen Upload
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#AED581', '#FFAB91', '#ff6b9d']
            });
        }
    };
    reader.readAsDataURL(file);
}

function deleteImage(index) {
    if (confirm('Möchtest du dieses Bild wirklich löschen?')) {
        images.splice(index, 1);
        localStorage.setItem('otisImages', JSON.stringify(images));
        initGallery();
        initSlideshow(); // Aktualisiere auch Slideshow
    }
}

// File Input Handler (für Navigation Upload)
const fileInput = document.getElementById('fileInput');

if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag & Drop auf Body (optional - für Drag & Drop von überall)
    document.body.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes('Files')) {
            document.body.classList.add('drag-over');
        }
    });

    document.body.addEventListener('dragleave', (e) => {
        if (!e.relatedTarget || e.relatedTarget === document.body) {
            document.body.classList.remove('drag-over');
        }
    });

    document.body.addEventListener('drop', (e) => {
        e.preventDefault();
        document.body.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            fileInput.files = files;
            handleFileSelect({ target: { files: files } });
        }
    });
}

// ============================================
// LIGHTBOX FUNKTIONEN
// ============================================
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightbox && lightboxImage) {
        lightboxImage.src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Lightbox mit ESC schließen
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Lightbox außerhalb des Bildes schließen
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
}

// ============================================
// GOOGLE MAPS
// ============================================
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Prüfe ob Google Maps API verfügbar ist
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        mapElement.innerHTML = `
            <div class="map-placeholder">
                <div>
                    <p style="font-size: 3em; margin-bottom: 20px;">🗺️</p>
                    <p style="font-size: 1.3em; font-weight: bold; margin-bottom: 15px;">Google Maps API Key benötigt</p>
                    <p style="font-size: 1em; margin-bottom: 10px;">Um die Karte zu aktivieren:</p>
                    <p style="font-size: 0.9em; opacity: 0.9;">1. Gehe zu <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" style="color: white; text-decoration: underline;">Google Cloud Console</a></p>
                    <p style="font-size: 0.9em; opacity: 0.9;">2. Erstelle einen API Key</p>
                    <p style="font-size: 0.9em; opacity: 0.9;">3. Füge ihn in index.html ein (Zeile 116)</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Custom Map Style - Taiwan Capybara Stil
    const mapStyles = [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#C5E1A5" }] // Pastellgrünes Wasser
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{ "color": "#FFF8E1" }] // Yuzu Creme
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }, { "visibility": "simplified" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "visibility": "off" }] // Autobahnen verstecken
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#AED581" }] // Matcha Grün für Parks
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#8D6E63" }]
        }
    ];

    // Startpunkt (Kaohsiung, Taiwan)
    const center = { lat: 22.6273, lng: 120.3014 };

    const map = new google.maps.Map(mapElement, {
        zoom: 13,
        center: center,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    // Deine Orte - Hier kannst du deine persönlichen Orte eintragen
    const spots = [
        {
            coords: { lat: 22.6273, lng: 120.3014 },
            title: "Kaohsiung",
            text: "Wo alles begann! ❤️",
            icon: '🦫'
        },
        {
            coords: { lat: 22.6200, lng: 120.3100 },
            title: "Lieblingsplatz",
            text: "Unser besonderer Ort 💕",
            icon: '💖'
        }
        // Füge hier mehr Orte hinzu!
    ];

    spots.forEach(spot => {
        const marker = new google.maps.Marker({
            position: spot.coords,
            map: map,
            animation: google.maps.Animation.DROP,
            title: spot.title
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding:15px; text-align:center; font-family: 'Varela Round', sans-serif;">
                    <h3 style="color:#8D6E63; margin:0 0 10px 0; font-size:1.3em;">${spot.icon} ${spot.title}</h3>
                    <p style="color:#666; margin:0;">${spot.text}</p>
                </div>
            `
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
        
        // Auto-open first marker
        if (spots.indexOf(spot) === 0) {
            setTimeout(() => {
                infoWindow.open(map, marker);
            }, 1000);
        }
    });
}

// ============================================
// KOMMENTAR FUNKTIONEN
// ============================================
const commentsEl = document.getElementById("comments");
let comments = JSON.parse(localStorage.getItem('otisComments')) || [
    { name: "Anna", text: "Otis ist so süß! 🦫" },
    { name: "Markus", text: "Die beste Capybara-Galerie!" },
    { name: "Lena", text: "Ich liebe diese niedlichen Bilder 💕" }
];

function renderComments() {
    if (!commentsEl) return;
    
    commentsEl.innerHTML = "";
    if (comments.length === 0) {
        commentsEl.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Noch keine Kommentare. Sei der Erste!</p>';
        return;
    }
    comments.forEach((c, i) => {
        commentsEl.innerHTML += `
            <div class="comment" style="animation-delay: ${i * 0.08}s">
                <div class="avatar" aria-hidden="true">🦫</div>
                <div class="content">
                    <strong>${c.name}</strong>
                    <p>${c.text}</p>
                </div>
                <div class="like" onclick="toggleLike(this)" role="button" tabindex="0" aria-label="Gefällt mir" onkeypress="if(event.key==='Enter') toggleLike(this)">❤</div>
            </div>
        `;
    });
}

function addComment() {
    const input = document.getElementById("commentInput");
    if (!input || input.value.trim() === "") return;

    comments.unshift({ name: "Du", text: input.value });
    localStorage.setItem('otisComments', JSON.stringify(comments));
    input.value = "";
    renderComments();
    input.focus();
    
    // Kleines Konfetti für neuen Kommentar
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 20,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#ff6b9d', '#f8b500']
        });
    }
}

function toggleLike(el) {
    el.classList.toggle("liked");
    if (el.classList.contains('liked')) {
        el.setAttribute('aria-label', 'Gefällt mir aktiviert');
    } else {
        el.setAttribute('aria-label', 'Gefällt mir');
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        addComment();
    }
}

// ============================================
// INITIALISIERUNG
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initSlideshow();
    renderComments();
    
    // Google Maps wird asynchron geladen
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        initMap();
    } else {
        // Warte auf Google Maps API
        window.initMap = initMap;
    }
});
