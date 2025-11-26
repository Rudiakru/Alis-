// Gacha Machine JavaScript - "Collect 'em All" Edition

// Basis Items (Vorlagen)
// Wir entfernen die Wahrscheinlichkeiten hier teilweise, da die Logik jetzt auf "verbleibenden Items" basiert
let baseTemplates = [
    { id: 2, baseId: 2, name: "Hund Foto", icon: "🐶", rarity: "common", description: "Ein süßer Hund!", color: "#FFAB91", isCutePhoto: true },
    { id: 3, baseId: 3, name: "Katze Foto", icon: "🐱", rarity: "common", description: "Eine süße Katze!", color: "#FFB3D9", isCutePhoto: true },
    { id: 5, baseId: 5, name: "Kuss", icon: "💋", rarity: "common", description: "Ein süßer Kuss!", color: "#ff6b9d" }, // Einmalig
    { id: 7, baseId: 7, name: "Kaffee und Kuchen", icon: "☕🎂", rarity: "rare", description: "Leckerer Kaffee und Kuchen!", color: "#FFF176" },
    { id: 9, baseId: 9, name: "Geschenk 1", icon: "🎁", rarity: "epic", description: "Ein besonderes Geschenk!", color: "#ff6b9d" },
    { id: 11, baseId: 11, name: "Legendäre Musikbox", icon: "🎵✨", rarity: "legendary", description: "Eine wundervolle Musikbox!", color: "#9C27B0", unlocks: "music" },
    { id: 12, baseId: 12, name: "Fotosession", icon: "📸✨", rarity: "legendary", description: "Eine spezielle Fotosession!", color: "#ff6b9d", isCutePhoto: true },
    { id: 13, baseId: 13, name: "Geschenk 2", icon: "🧧", rarity: "legendary", description: "Ein Glücksumschlag!", color: "#DC143C", unlocks: "map" },
];

// Bekannte lokale Bilder
const localImages = {
    cat: ['img/cat/IMG_3374.jpeg', 'img/cat/IMG_3375.jpeg', 'img/cat/IMG_3376.jpeg'],
    dogs: ['img/dogs/IMG_3377.jpeg', 'img/dogs/IMG_3378.jpeg', 'img/dogs/IMG_3379.jpeg', 'img/dogs/IMG_3380.jpeg', 'img/dogs/IMG_3381.jpeg'],
    monster: ['img/monster/15e245b6-5314-40af-a89e-d3b49783902c.jpeg'],
    photo: ['img/photo/dfb37733-44e3-4e9f-bd06-1aa5adcf566d_Original.jpeg']
};

// ---------------------------------------------------------
// NEUE LOGIK: Erstelle eine Liste ALLER existierenden Karten
// ---------------------------------------------------------
function getAllPossibleItems() {
    let allItems = [];

    // 1. Einfache Items ohne Bilder (Kuss, Kaffee, Geschenke, Musikbox etc.)
    // Diese werden direkt übernommen.
    const simpleItems = baseTemplates.filter(t => !['Hund Foto', 'Katze Foto', 'Fotosession'].includes(t.name));
    allItems.push(...simpleItems);

    // 2. Hunde Fotos (Generiere ID 20000 + Index)
    const dogTemplate = baseTemplates.find(t => t.name === "Hund Foto");
    if (dogTemplate && localImages.dogs.length > 0) {
        localImages.dogs.forEach((img, index) => {
            allItems.push({
                ...dogTemplate,
                id: 20000 + index, // Einzigartige ID für jedes Bild
                imageData: img,
                // Leichte Namensvariation optional: name: `Hund Foto #${index+1}`
            });
        });
    }

    // 3. Katzen Fotos (Generiere ID 30000 + Index)
    const catTemplate = baseTemplates.find(t => t.name === "Katze Foto");
    if (catTemplate && localImages.cat.length > 0) {
        localImages.cat.forEach((img, index) => {
            allItems.push({
                ...catTemplate,
                id: 30000 + index,
                imageData: img
            });
        });
    }

    // 4. Fotosession (Generiere ID 12000 + Index)
    const photoTemplate = baseTemplates.find(t => t.name === "Fotosession");
    if (photoTemplate && localImages.photo.length > 0) {
        localImages.photo.forEach((img, index) => {
            allItems.push({
                ...photoTemplate,
                id: 12000 + index,
                imageData: img
            });
        });
    }

    // 5. Monster Gacha (Lokal) - ID 3000 + Index (Wie vorher, aber stabil)
    localImages.monster.forEach((imgPath, index) => {
        allItems.push({
            id: 3000 + index,
            name: "Monster-Gacha",
            icon: "👹",
            rarity: "legendary",
            description: "Ein mysteriöses Monster-Gacha!",
            color: "#E91E63",
            isMonsterGacha: true,
            imageData: imgPath
        });
    });

    // 6. Monster Gacha (Uploads) - ID 1000 + Index
    try {
        const uploadedImages = JSON.parse(localStorage.getItem('otisImages')) || [];
        uploadedImages.forEach((img, index) => {
            allItems.push({
                id: 1000 + index,
                name: "Monster-Gacha",
                icon: "👹",
                rarity: "legendary",
                description: "Ein mysteriöses Monster-Gacha!",
                color: "#E91E63",
                isMonsterGacha: true,
                imageData: img.data,
                imageDate: img.date
            });
        });
    } catch (e) {
        console.error('Fehler beim Laden der Uploads:', e);
    }

    return allItems;
}


// Stats & Collection
let stats = JSON.parse(localStorage.getItem('gachaStats')) || {
    totalPulls: 0,
    rareItems: 0,
    epicItems: 0,
    legendaryItems: 0,
    collection: []
};

// Feature Unlock System
function unlockFeature(feature) {
    if (feature === 'map') {
        const mapSection = document.getElementById('map-section');
        if (mapSection) {
            mapSection.style.display = 'block';
            mapSection.style.visibility = 'visible';
            mapSection.style.position = 'relative';
            mapSection.style.opacity = '1';
            mapSection.style.transform = 'translateY(0)';
            
            const mapDiv = document.getElementById('map');
            const mapPlaceholder = document.getElementById('map-placeholder');
            if (mapDiv) mapDiv.style.display = 'block';
            if (mapPlaceholder) mapPlaceholder.style.display = 'flex';
            
            if (typeof initMap === 'function') setTimeout(() => initMap(), 800);
            
            const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
            if (!unlocks.includes('map')) {
                unlocks.push('map');
                localStorage.setItem('unlockedFeatures', JSON.stringify(unlocks));
            }
        }
    } else if (feature === 'music') {
        const musicSection = document.getElementById('music-section');
        if (musicSection) {
            musicSection.style.display = 'block';
            musicSection.style.visibility = 'visible';
            musicSection.style.position = 'relative';
            musicSection.style.opacity = '1';
            musicSection.style.transform = 'translateY(0)';
            
            const spotifyIframe = document.getElementById('spotify-iframe');
            if (spotifyIframe) {
                spotifyIframe.style.display = 'block';
                spotifyIframe.src = 'https://open.spotify.com/embed/playlist/2rK6GwLnUr7K3FqDMsxaZz?utm_source=generator&theme=0';
            }
            
            const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
            if (!unlocks.includes('music')) {
                unlocks.push('music');
                localStorage.setItem('unlockedFeatures', JSON.stringify(unlocks));
            }
        }
    }
}

// Prüfe freigeschaltete Features
function checkUnlockedFeatures() {
    const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
    const collection = stats.collection || [];
    
    // Wir schauen nur in die Collection, da IDs stabil sind
    const hasMap = unlocks.includes('map') || collection.some(i => i.name === 'Geschenk 2');
    const hasMusic = unlocks.includes('music') || collection.some(i => i.name === 'Legendäre Musikbox');
    
    if (hasMap) unlockFeature('map');
    if (hasMusic) unlockFeature('music');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initGachaMachine();
    updateStats();
    createKugelPreviews();
    checkUnlockedFeatures();
});

function initGachaMachine() {
    const button = document.getElementById('gacha-button');
    const door = document.getElementById('gacha-door');
    
    if (button) {
        // Event Listener direkt hinzufügen
        button.addEventListener('click', pullGacha);
        
        button.addEventListener('mouseenter', () => {
            if (!button.disabled) {
                door.classList.add('shake');
                setTimeout(() => door.classList.remove('shake'), 500);
            }
        });

        // Check ob schon alles leer ist beim Laden
        checkIfEmpty();
    }
}

function checkIfEmpty() {
    const allItems = getAllPossibleItems();
    const collectedIds = stats.collection.map(i => i.id);
    const availableItems = allItems.filter(item => !collectedIds.includes(item.id));
    
    if (availableItems.length === 0 && collectedIds.length > 0) {
         const button = document.getElementById('gacha-button');
         if(button) {
             button.innerHTML = "Alles gesammelt! 🎉";
             button.style.background = "#ccc";
             button.style.cursor = "default";
         }
    }
}

function createKugelPreviews() {
    const container = document.getElementById('gacha-kugeln');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const kugel = document.createElement('div');
        kugel.className = 'gacha-kugel-preview';
        kugel.style.animationDelay = `${i * 0.3}s`;
        container.appendChild(kugel);
    }
}

function updateStats() {
    document.getElementById('total-pulls').textContent = stats.totalPulls;
    document.getElementById('collection-count').textContent = stats.collection.length;
    document.getElementById('rare-items').textContent = 
        stats.rareItems + stats.epicItems + stats.legendaryItems;
}

// ---------------------------------------------------------
// HAUPTFUNKTION ZUM ZIEHEN (Überarbeitet)
// ---------------------------------------------------------
function pullGacha() {
    const button = document.getElementById('gacha-button');
    
    // 1. Hole alle möglichen Items
    const allItems = getAllPossibleItems();
    
    // 2. Filtere Items heraus, die wir schon haben
    const collectedIds = stats.collection.map(item => item.id);
    const availableItems = allItems.filter(item => !collectedIds.includes(item.id));
    
    // 3. Prüfe ob noch was da ist
    if (availableItems.length === 0) {
        showCompletedModal();
        button.disabled = true;
        button.innerHTML = "Alles gesammelt! 🎉";
        return;
    }

    const door = document.getElementById('gacha-door');
    const chute = document.getElementById('gacha-chute');
    const resultKugel = document.getElementById('result-kugel');
    const kugelShell = document.getElementById('kugel-shell');
    const kugelContent = document.getElementById('kugel-content');
    
    button.disabled = true;
    button.classList.add('pulling');
    door.classList.add('shake');
    
    kugelShell.classList.remove('opened');
    kugelContent.classList.remove('show');
    kugelContent.innerHTML = '';
    
    const fallingKugel = document.createElement('div');
    fallingKugel.className = 'falling-kugel';
    chute.appendChild(fallingKugel);
    chute.classList.add('active');
    
    // 4. Ziehe zufällig aus den VERFÜGBAREN Items
    // (Einfache Zufallswahl, da Rarity jetzt weniger wichtig ist, wenn wir alles sammeln wollen)
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const item = availableItems[randomIndex];
    
    setTimeout(() => {
        chute.classList.remove('active');
        fallingKugel.remove();
        resultKugel.style.display = 'block';
        
        setTimeout(() => {
            kugelShell.classList.add('opened');
            
            setTimeout(() => {
                kugelContent.classList.add('show');
                displayItem(item);
                
                stats.totalPulls++;
                if (item.rarity === 'rare') stats.rareItems++;
                if (item.rarity === 'epic') stats.epicItems++;
                if (item.rarity === 'legendary') stats.legendaryItems++;
                
                // Füge zur Collection hinzu
                stats.collection.push({
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    rarity: item.rarity,
                    obtainedAt: new Date().toISOString(),
                    isMonsterGacha: item.isMonsterGacha || false,
                    isCutePhoto: item.isCutePhoto || false,
                    imageData: item.imageData || null
                });
                
                if (item.unlocks) unlockFeature(item.unlocks);
                
                localStorage.setItem('gachaStats', JSON.stringify(stats));
                updateStats();
                
                triggerConfetti(item.rarity);
                
                // Popups anzeigen
                if (item.isMonsterGacha && item.imageData) {
                    setTimeout(() => { if (item.imageData) showMonsterGachaImage(item.imageData); }, 500);
                } else if (item.isCutePhoto && item.imageData) {
                    setTimeout(() => { showCutePhoto(item); }, 500);
                }
                
                // Button wieder aktivieren (außer es war das letzte Item)
                setTimeout(() => {
                    const remaining = availableItems.length - 1; // -1 weil wir gerade eins gezogen haben
                    if (remaining <= 0) {
                        button.disabled = true;
                        button.innerHTML = "Alles gesammelt! 🎉";
                        button.style.background = "#ccc";
                        button.style.cursor = "default";
                        showCompletedModal(); // Zeige sofort das Ende-Fenster
                    } else {
                        button.disabled = false;
                        button.classList.remove('pulling');
                        door.classList.remove('shake');
                    }
                }, 1000);
            }, 300);
        }, 500);
    }, 1000);
}

function displayItem(item) {
    const content = document.getElementById('kugel-content');
    content.innerHTML = `
        <div class="kugel-content-icon">${item.icon}</div>
        <div class="kugel-content-name">${item.name}</div>
        <div class="kugel-content-description">${item.description}</div>
        <div class="kugel-content-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
    `;
}

// ---------------------------------------------------------
// NEUE FUNKTION: SPIEL ABGESCHLOSSEN
// ---------------------------------------------------------
function showCompletedModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 10000;
        display: flex; justify-content: center; align-items: center;
        animation: fadeIn 0.5s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 30px; text-align: center; max-width: 90%; width: 400px; border: 5px solid #FFD700; box-shadow: 0 0 50px #FFD700;">
            <div style="font-size: 4em; margin-bottom: 20px;">👑</div>
            <h2 style="font-family: var(--font-heading); color: #E91E63; margin-bottom: 20px; font-size: 2em;">HERZLICHEN GLÜCKWUNSCH!</h2>
            <p style="font-size: 1.2em; color: #555; margin-bottom: 30px;">Du hast die Gacha-Maschine komplett geleert! Alle Items befinden sich nun in deiner Sammlung.</p>
            <div style="margin-bottom: 30px; font-weight: bold; color: #9C27B0;">Sammlung: ${stats.collection.length} / ${stats.collection.length}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="padding: 15px 30px; background: #4CAF50; color: white; border: none; border-radius: 50px; font-size: 1.2em; font-weight: bold; cursor: pointer;">Juhu! 🎉</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    triggerConfetti('legendary'); // Extra viel Konfetti
    setTimeout(() => triggerConfetti('legendary'), 500);
    setTimeout(() => triggerConfetti('legendary'), 1000);
}

// Collection Anzeige
function showCollection() {
    const modal = document.getElementById('collection-modal');
    const grid = document.getElementById('collection-grid');
    
    if (stats.collection.length === 0) {
        grid.innerHTML = `<div class="empty-collection" style="grid-column: 1 / -1;"><p>Noch leer...</p></div>`;
    } else {
        const sorted = [...stats.collection].sort((a, b) => new Date(b.obtainedAt) - new Date(a.obtainedAt));
        
        grid.innerHTML = sorted.map(item => {
            let onClick = '';
            let cursorStyle = '';
            
            if (item.imageData) {
                const safeImg = item.imageData.replace(/'/g, "\\'").replace(/"/g, "");
                const safeName = item.name.replace(/'/g, "\\'").replace(/"/g, "");
                const safeIcon = item.icon;
                
                if (item.isMonsterGacha) {
                    onClick = `onclick="showMonsterGachaImage('${safeImg}')"`;
                } else {
                    onClick = `onclick="showCutePhotoFromCollection('${safeImg}', '${safeName}', '${safeIcon}')"`;
                }
                cursorStyle = 'cursor: pointer;';
            }
            
            return `
                <div class="collection-item ${item.rarity}" ${onClick} style="${cursorStyle}">
                    <span class="collection-item-icon">${item.icon}</span>
                    <div class="collection-item-name">${item.name}</div>
                </div>
            `;
        }).join('');
    }
    modal.classList.add('show');
}

function closeCollection() {
    document.getElementById('collection-modal').classList.remove('show');
}

// Schließen Events
document.addEventListener('click', (e) => {
    const modal = document.getElementById('collection-modal');
    if (e.target === modal) closeCollection();
});

// Confetti und Popups (unverändert aber notwendig)
function triggerConfetti(rarity) {
    if (typeof confetti === 'undefined') return;
    const colors = rarity === 'legendary' ? ['#f8b500', '#ff9800'] : ['#AED581', '#FFAB91'];
    const count = rarity === 'legendary' ? 200 : 50;
    
    confetti({
        particleCount: count,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
    });
}

// Popups (Monster / Cute)
function showMonsterGachaImage(imageData) {
    createPopup(imageData, "MONSTER-GACHA!", "👹", "#E91E63");
}

function showCutePhoto(item) {
    createPopup(item.imageData, item.name.toUpperCase(), item.icon, "#AED581");
}

function showCutePhotoFromCollection(img, name, icon) {
    createPopup(img, name.toUpperCase(), icon, "#AED581");
}

function createPopup(imgSrc, title, icon, color) {
    const modal = document.createElement('div');
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s ease;`;
    
    // Einfaches Schließen
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
    
    const safeSrc = imgSrc.replace(/'/g, "\\'");
    
    modal.innerHTML = `
        <div style="text-align: center; max-width: 95%; max-height: 95%; padding: 20px; pointer-events: auto;">
            <div style="font-size: 3em; animation: bounce 1s infinite;">${icon}</div>
            <h2 style="color: white; margin: 15px 0; font-family: sans-serif;">${title}</h2>
            <img src="${safeSrc}" style="max-width: 90vw; max-height: 60vh; border: 4px solid ${color}; border-radius: 15px; box-shadow: 0 0 30px ${color};">
            <br>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px; padding: 10px 30px; background: ${color}; border: none; border-radius: 20px; font-weight: bold; cursor: pointer;">Schließen</button>
        </div>
    `;
    document.body.appendChild(modal);
}
