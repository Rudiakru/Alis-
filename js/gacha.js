// Gacha Machine JavaScript - "Strict Collection" (Mit Sicherheits-Sperre)

// 1. DEFINITIONEN DER ITEM-TYPEN
const itemTemplates = [
    // --- Items MIT Fotos ---
    { 
        type: "dynamic", 
        category: "dogs", 
        name: "Hund Foto", 
        icon: "🐶", 
        rarity: "common", 
        description: "Ein süßer Hund!", 
        color: "#FFAB91", 
        isCutePhoto: true,
        baseId: 20000 
    },
    { 
        type: "dynamic", 
        category: "cat", 
        name: "Katze Foto", 
        icon: "🐱", 
        rarity: "common", 
        description: "Eine süße Katze!", 
        color: "#FFB3D9", 
        isCutePhoto: true,
        baseId: 30000 
    },
    { 
        type: "dynamic", 
        category: "photo", 
        name: "Fotosession", 
        icon: "📸✨", 
        rarity: "legendary", 
        description: "Eine spezielle Fotosession!", 
        color: "#ff6b9d", 
        isCutePhoto: true,
        baseId: 40000 
    },
    { 
        type: "dynamic", 
        category: "monster", 
        name: "Monster-Gacha", 
        icon: "👹", 
        rarity: "legendary", 
        description: "Ein mysteriöses Monster-Gacha!", 
        color: "#E91E63", 
        isMonsterGacha: true,
        baseId: 50000 
    },

    // --- Items OHNE Fotos ---
    { type: "static", id: 101, name: "Kuss", icon: "💋", rarity: "common", description: "Ein süßer Kuss!", color: "#ff6b9d" },
    { type: "static", id: 102, name: "Kaffee und Kuchen", icon: "☕🎂", rarity: "rare", description: "Leckerer Kaffee und Kuchen!", color: "#FFF176" },
    { type: "static", id: 103, name: "Geschenk 1", icon: "🎁", rarity: "epic", description: "Ein besonderes Geschenk!", color: "#ff6b9d" },
    { type: "static", id: 104, name: "Legendäre Musikbox", icon: "🎵✨", rarity: "legendary", description: "Eine wundervolle Musikbox!", color: "#9C27B0", unlocks: "music" },
    { type: "static", id: 105, name: "Geschenk 2", icon: "🧧", rarity: "legendary", description: "Ein Glücksumschlag!", color: "#DC143C", unlocks: "map" },
];

// Bild-Datenbank
const localImages = {
    cat: ['img/cat/IMG_3374.jpeg', 'img/cat/IMG_3375.jpeg', 'img/cat/IMG_3376.jpeg'],
    dogs: ['img/dogs/IMG_3377.jpeg', 'img/dogs/IMG_3378.jpeg', 'img/dogs/IMG_3379.jpeg', 'img/dogs/IMG_3380.jpeg', 'img/dogs/IMG_3381.jpeg'],
    monster: ['img/monster/15e245b6-5314-40af-a89e-d3b49783902c.jpeg'],
    photo: ['img/photo/dfb37733-44e3-4e9f-bd06-1aa5adcf566d_Original.jpeg']
};


// 2. GENERATOR
function getAllPossibleItems() {
    let deck = [];
    itemTemplates.forEach(template => {
        if (template.type === "static") {
            deck.push(template);
        } else if (template.type === "dynamic") {
            const images = localImages[template.category] || [];
            images.forEach((imgPath, index) => {
                deck.push({
                    id: template.baseId + index,
                    name: template.name,
                    icon: template.icon,
                    rarity: template.rarity,
                    description: template.description,
                    color: template.color,
                    isCutePhoto: template.isCutePhoto,
                    isMonsterGacha: template.isMonsterGacha,
                    imageData: imgPath
                });
            });
        }
    });

    try {
        const uploadedImages = JSON.parse(localStorage.getItem('otisImages')) || [];
        uploadedImages.forEach((img, index) => {
            deck.push({
                id: 60000 + index,
                name: "Monster-Gacha",
                icon: "👹",
                rarity: "legendary",
                description: "Ein mysteriöses Monster-Gacha (Upload)!",
                color: "#E91E63",
                isMonsterGacha: true,
                imageData: img.data,
                imageDate: img.date
            });
        });
    } catch (e) { console.error(e); }

    return deck;
}

// Stats
let stats = JSON.parse(localStorage.getItem('gachaStats')) || {
    totalPulls: 0, rarity: {rare:0, epic:0, legendary:0}, collection: []
};
// Fix für alte Stats Struktur falls nötig
if(!stats.rareItems) {
    stats.rareItems = stats.rarity?.rare || 0;
    stats.epicItems = stats.rarity?.epic || 0;
    stats.legendaryItems = stats.rarity?.legendary || 0;
}

// Feature Unlocks
function unlockFeature(feature) {
    const showSection = (id) => {
        const section = document.getElementById(id);
        if (section) { section.style.display = 'block'; section.style.opacity = '1'; }
    };
    if (feature === 'map') {
        showSection('map-section');
        if (typeof initMap === 'function') setTimeout(initMap, 500);
        saveUnlock('map');
    } else if (feature === 'music') {
        showSection('music-section');
        const iframe = document.getElementById('spotify-iframe');
        if (iframe) { iframe.style.display = 'block'; iframe.src = 'https://open.spotify.com/embed/playlist/2rK6GwLnUr7K3FqDMsxaZz?utm_source=generator&theme=0'; }
        saveUnlock('music');
    }
}

function saveUnlock(feature) {
    const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
    if (!unlocks.includes(feature)) {
        unlocks.push(feature);
        localStorage.setItem('unlockedFeatures', JSON.stringify(unlocks));
    }
}

function checkUnlockedFeatures() {
    const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
    const hasMap = unlocks.includes('map') || stats.collection.some(i => i.unlocks === 'map');
    const hasMusic = unlocks.includes('music') || stats.collection.some(i => i.unlocks === 'music');
    if (hasMap) unlockFeature('map');
    if (hasMusic) unlockFeature('music');
}


// ---------------------------------------------------------
// INITIALISIERUNG
// ---------------------------------------------------------
// SICHERHEITS-SCHALTER
let isAnimating = false;

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
        // Entferne alte Event Listener durch Klonen (Trick um sicherzugehen)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Neuen Listener hinzufügen
        newButton.addEventListener('click', pullGacha);
        newButton.addEventListener('mouseenter', () => {
            if (!newButton.disabled && !isAnimating) {
                door.classList.add('shake');
                setTimeout(() => door.classList.remove('shake'), 500);
            }
        });
        
        checkIfEmpty();
    }
}

function checkIfEmpty() {
    const allItems = getAllPossibleItems();
    const collectedIds = stats.collection.map(i => i.id);
    const remaining = allItems.filter(item => !collectedIds.includes(item.id));
    
    const button = document.getElementById('gacha-button');
    if (remaining.length === 0 && button) {
        setButtonToEmpty(button);
    }
}

function setButtonToEmpty(button) {
    button.innerHTML = "Alles gesammelt! 🎉";
    button.style.background = "#ccc";
    button.style.cursor = "default";
    button.disabled = true;
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
        (stats.rareItems || 0) + (stats.epicItems || 0) + (stats.legendaryItems || 0);
}


// ---------------------------------------------------------
// HAUPTFUNKTION ZUM ZIEHEN
// ---------------------------------------------------------
function pullGacha() {
    // 1. SICHERHEITS-CHECK: Läuft schon eine Animation?
    if (isAnimating) return;
    isAnimating = true;

    const button = document.getElementById('gacha-button');
    
    // Check Deck
    const allItems = getAllPossibleItems();
    const collectedIds = stats.collection.map(item => item.id);
    const availableItems = allItems.filter(item => !collectedIds.includes(item.id));
    
    if (availableItems.length === 0) {
        setButtonToEmpty(button);
        showCompletedModal();
        isAnimating = false;
        return;
    }

    // UI Setup
    const door = document.getElementById('gacha-door');
    const chute = document.getElementById('gacha-chute');
    const resultKugel = document.getElementById('result-kugel');
    const kugelShell = document.getElementById('kugel-shell');
    const kugelContent = document.getElementById('kugel-content');
    
    button.disabled = true;
    button.classList.add('pulling');
    door.classList.add('shake');
    
    // Reset Display
    kugelShell.classList.remove('opened');
    kugelContent.classList.remove('show');
    kugelContent.innerHTML = ''; // Inhalt sicher löschen
    
    const fallingKugel = document.createElement('div');
    fallingKugel.className = 'falling-kugel';
    chute.appendChild(fallingKugel);
    chute.classList.add('active');
    
    // Item ziehen
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
                
                // Save Logic
                stats.totalPulls++;
                if (item.rarity === 'rare') stats.rareItems++;
                if (item.rarity === 'epic') stats.epicItems++;
                if (item.rarity === 'legendary') stats.legendaryItems++;
                
                stats.collection.push({
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    rarity: item.rarity,
                    description: item.description,
                    obtainedAt: new Date().toISOString(),
                    isMonsterGacha: item.isMonsterGacha || false,
                    isCutePhoto: item.isCutePhoto || false,
                    imageData: item.imageData || null,
                    unlocks: item.unlocks || null
                });
                
                if (item.unlocks) unlockFeature(item.unlocks);
                localStorage.setItem('gachaStats', JSON.stringify(stats));
                updateStats();
                triggerConfetti(item.rarity);
                
                // Popups
                if ((item.isMonsterGacha || item.isCutePhoto) && item.imageData) {
                    setTimeout(() => { showPopup(item); }, 600);
                }
                
                // Cleanup
                setTimeout(() => {
                    const remainingAfterPull = availableItems.length - 1;
                    
                    if (remainingAfterPull <= 0) {
                        setButtonToEmpty(button);
                        showCompletedModal();
                    } else {
                        button.disabled = false;
                        button.classList.remove('pulling');
                        door.classList.remove('shake');
                    }
                    // SPERRE AUFHEBEN
                    isAnimating = false;
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
// MODALS
// ---------------------------------------------------------
function showCompletedModal() {
    // Check if already open
    if(document.getElementById('completed-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'completed-modal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.5s ease;`;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 30px; text-align: center; max-width: 90%; width: 400px; border: 5px solid #FFD700; box-shadow: 0 0 50px #FFD700;">
            <div style="font-size: 4em; margin-bottom: 20px;">👑</div>
            <h2 style="font-family: var(--font-heading); color: #E91E63; margin-bottom: 20px;">ALLES GESAMMELT!</h2>
            <p style="color: #555; margin-bottom: 30px;">Du hast die Gacha-Maschine komplett geleert!</p>
            <div style="margin-bottom: 30px; font-weight: bold; color: #9C27B0;">${stats.collection.length} Items</div>
            <button onclick="document.getElementById('completed-modal').remove()" style="padding: 15px 30px; background: #4CAF50; color: white; border: none; border-radius: 50px; font-weight: bold; cursor: pointer;">Juhu! 🎉</button>
        </div>
    `;
    document.body.appendChild(modal);
    triggerConfetti('legendary');
}

function showPopup(item) {
    // Eindeutige ID vergeben, um Dopplungen zu verhindern
    const popupId = 'popup-' + item.id;
    if(document.getElementById(popupId)) return;

    const modal = document.createElement('div');
    modal.id = popupId;
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s ease;`;
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
    
    const safeSrc = item.imageData.replace(/'/g, "\\'");
    
    modal.innerHTML = `
        <div style="text-align: center; max-width: 95%; max-height: 95%; padding: 20px; pointer-events: auto;">
            <div style="font-size: 3em; animation: bounce 1s infinite;">${item.icon}</div>
            <h2 style="color: white; margin: 15px 0; font-family: sans-serif;">${item.name.toUpperCase()}</h2>
            <img src="${safeSrc}" style="max-width: 90vw; max-height: 60vh; border: 4px solid ${item.color}; border-radius: 15px; box-shadow: 0 0 30px ${item.color};">
            <br>
            <button onclick="document.getElementById('${popupId}').remove()" style="margin-top: 20px; padding: 10px 30px; background: ${item.color}; color: white; border: none; border-radius: 20px; font-weight: bold; cursor: pointer;">Schließen</button>
        </div>
    `;
    document.body.appendChild(modal);
}

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
                const safeItem = JSON.stringify(item).replace(/"/g, """);
                onClick = `onclick='showPopup(JSON.parse("${safeItem}"))'`;
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
function closeCollection() { document.getElementById('collection-modal').classList.remove('show'); }
document.addEventListener('click', (e) => { if (e.target === document.getElementById('collection-modal')) closeCollection(); });

function triggerConfetti(rarity) {
    if (typeof confetti === 'undefined') return;
    const colors = rarity === 'legendary' ? ['#f8b500', '#ff9800'] : ['#AED581', '#FFAB91'];
    confetti({ particleCount: rarity === 'legendary' ? 200 : 50, spread: 70, origin: { y: 0.6 }, colors: colors });
}
