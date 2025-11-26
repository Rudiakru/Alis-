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
// WICHTIG: Lade images immer frisch aus localStorage
function getImages() {
    try {
        const stored = localStorage.getItem('otisImages');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Fehler beim Laden der Bilder:', e);
        return [];
    }
}

let images = getImages();
let slideshowImages = [];

// Cute Kawaii Capybara Bilder (Fallback wenn keine lokalen Bilder vorhanden)
const defaultCapybaraImages = [
    'https://media.giphy.com/media/HiTqXhX3h3uUg/giphy.gif',
    'https://media.giphy.com/media/k3c92Q7XmGj1xG7P5q/giphy.gif',
    'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif',
    'https://media.giphy.com/media/3o7aD2sa0qC3XtS0Q0/giphy.gif',
    'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',
    'https://images.unsplash.com/photo-1614027164689-a18d3c2c6c4a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
];

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
    
    // Wenn keine lokalen Bilder gefunden, verwende Default Capybara Bilder
    if (existingImages.length === 0) {
        return defaultCapybaraImages;
    }
    
    return existingImages;
}

// Initialisiere Slideshow mit Bildern aus img/ Ordner
async function initSlideshow() {
    // WICHTIG: Lade images frisch aus localStorage
    images = getImages();
    
    const folderImages = await scanImageFolder();
    const uploadedImages = images.map(img => img.data);
    
    // Kombiniere hochgeladene Bilder zuerst, dann Ordner-Bilder
    slideshowImages = [...uploadedImages, ...folderImages];
    
    // Falls keine Bilder vorhanden, verwende Default Capybara Bilder
    if (slideshowImages.length === 0) {
        slideshowImages = [...defaultCapybaraImages];
    }
    
    const slideshowWrapper = document.getElementById('slideshow-wrapper');
    if (!slideshowWrapper) return;
    
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
async function initGallery() {
    const gallery = document.getElementById('all-images-gallery');
    if (!gallery) {
        console.log('Galerie-Element nicht gefunden');
        return;
    }
    
    // WICHTIG: Lade images frisch aus localStorage
    images = getImages();
    console.log('Geladene Bilder aus localStorage:', images.length);
    
    // Hole alle Bilder: aus img/ Ordner + hochgeladene
    const folderImages = await scanImageFolder();
    console.log('Gefundene Ordner-Bilder:', folderImages.length);
    
    const uploadedImages = images.map((img, idx) => ({
        src: img.data,
        date: img.date,
        isUploaded: true,
        index: idx
    }));
    
    const folderImageObjects = folderImages.map((src, idx) => ({
        src: src,
        date: null,
        isUploaded: false,
        index: idx
    }));
    
    // Hochgeladene Bilder ZUERST, dann Ordner-Bilder
    const allImages = [...uploadedImages, ...folderImageObjects];
    console.log('Gesamt Bilder:', allImages.length);
    
    if (allImages.length === 0) {
        // Zeige Default Capybara Bilder wenn keine vorhanden
        const defaultImages = defaultCapybaraImages.map((src, idx) => ({
            src: src,
            date: null,
            isUploaded: false,
            index: idx
        }));
        
        gallery.innerHTML = defaultImages.map((imgObj, index) => {
            return `
                <div class="gallery-item" style="animation-delay: ${index * 0.1}s" onclick="openLightbox('${imgObj.src}')" role="button" tabindex="0" aria-label="Capybara Bild ${index + 1} öffnen" onkeypress="if(event.key==='Enter') openLightbox('${imgObj.src}')">
                    <img src="${imgObj.src}" alt="Cute Capybara ${index + 1}" loading="lazy" />
                    <div class="gallery-item-info">
                        <div class="gallery-item-date">🦫 Kawaii Capybara</div>
                    </div>
                </div>
            `;
        }).join('');
        return;
    }

    // Erstelle HTML für alle Bilder
    const galleryHTML = allImages.map((imgObj, index) => {
        const dateStr = imgObj.date ? new Date(imgObj.date).toLocaleDateString('de-DE', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Aus img/ Ordner';
        
        const deleteBtn = imgObj.isUploaded ? 
            `<button class="delete-btn" onclick="event.stopPropagation(); deleteImage(${imgObj.index})" aria-label="Bild löschen">🗑️ Löschen</button>` :
            '';
        
        // Escape HTML in src um XSS zu vermeiden
        const safeSrc = imgObj.src.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        
        return `
            <div class="gallery-item" style="animation-delay: ${index * 0.1}s" onclick="openLightbox('${safeSrc}')" role="button" tabindex="0" aria-label="Bild ${index + 1} öffnen" onkeypress="if(event.key==='Enter') openLightbox('${safeSrc}')">
                <img src="${safeSrc}" alt="Capybara Bild ${index + 1}" loading="lazy" onerror="this.src='https://media.giphy.com/media/HiTqXhX3h3uUg/giphy.gif'; this.onerror=null;" />
                <div class="gallery-item-info">
                    <div class="gallery-item-date">📅 ${dateStr}</div>
                    ${deleteBtn}
                </div>
            </div>
        `;
    }).join('');
    
    gallery.innerHTML = galleryHTML;
    console.log('Galerie aktualisiert mit', allImages.length, 'Bildern');
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
    reader.onload = async function(e) {
        try {
            const imageData = {
                data: e.target.result,
                date: new Date().toISOString()
            };
            
            // Lade aktuelle Bilder
            let currentImages = getImages();
            currentImages.unshift(imageData);
            
            // Speichere in localStorage
            localStorage.setItem('otisImages', JSON.stringify(currentImages));
            
            // WICHTIG: Lade images neu aus localStorage
            images = getImages();
            
            // Debug: Prüfe ob Bilder gespeichert wurden
            console.log('Bilder gespeichert:', images.length);
            
            // Aktualisiere beide Bereiche sofort
            await initGallery(); // Aktualisiert "Alle Bilder" Section
            await initSlideshow(); // Aktualisiert Slideshow (enthält hochgeladene Bilder)
        } catch (error) {
            console.error('Fehler beim Hochladen:', error);
            alert('Fehler beim Hochladen des Bildes. Bitte versuche es erneut.');
            return;
        }
        
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
        initGallery(); // Aktualisiert "Alle Bilder" (zeigt alle: hochgeladen + img/ Ordner)
        initSlideshow(); // Aktualisiert Slideshow (zeigt alle: hochgeladen + img/ Ordner)
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
// OPENSTREETMAP - Leaflet
// ============================================
function initMap() {
    const mapElement = document.getElementById('map');
    const placeholder = document.getElementById('map-placeholder');
    if (!mapElement) return;
    
    // Verstecke Placeholder wenn Karte geladen wird
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // Prüfe ob Leaflet verfügbar ist
    if (typeof L === 'undefined') {
        // Lade Leaflet CSS und JS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            createMap();
        };
        document.head.appendChild(script);
    } else {
        createMap();
    }
    
    function createMap() {
        // Startpunkt (Kaohsiung, Taiwan)
        const center = [22.6273, 120.3014];
        
        // Erstelle Karte
        const map = L.map(mapElement).setView(center, 13);
        
        // Füge OpenStreetMap Tile Layer hinzu
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Orte
        const spots = [
            {
                coords: [22.6273, 120.3014],
                title: "Kaohsiung",
                text: "Wo alles begann! ❤️",
                icon: '🦫'
            },
            {
                coords: [22.6200, 120.3100],
                title: "Lieblingsplatz",
                text: "Unser besonderer Ort 💕",
                icon: '💖'
            }
        ];
        
        spots.forEach((spot, index) => {
            // Erstelle Custom Icon
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="font-size: 2em; text-align: center;">${spot.icon}</div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });
            
            const marker = L.marker(spot.coords, { icon: customIcon }).addTo(map);
            marker.bindPopup(`
                <div style="text-align:center; font-family: 'Varela Round', sans-serif; padding: 10px;">
                    <h3 style="color:#8D6E63; margin:0 0 10px 0; font-size:1.3em;">${spot.icon} ${spot.title}</h3>
                    <p style="color:#666; margin:0;">${spot.text}</p>
                </div>
            `);
            
            // Auto-open first marker
            if (index === 0) {
                setTimeout(() => {
                    marker.openPopup();
                }, 1000);
            }
        });
    }
}

// Kommentar-Funktionen wurden entfernt

// ============================================
// INITIALISIERUNG
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Bildergalerie-Funktionen auskommentiert
    // initGallery();
    // initSlideshow();
    
    // OpenStreetMap wird nur geladen wenn Karte freigeschaltet ist
    // initMap(); - wird von Gacha-System gesteuert
});
