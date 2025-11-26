// Gacha Machine JavaScript

// Basis Gacha Items Database - REDUZIERT für schnelles Sammeln
let baseGachaItems = [
    // Common Items (4 Items)
    { id: 1, name: "Capybara Sticker", icon: "🦫", rarity: "common", description: "Ein süßer Capybara Sticker!", probability: 5, color: "#AED581" },
    { id: 2, name: "Yuzu Bad", icon: "🛁", rarity: "common", description: "Entspannendes Yuzu-Bad!", probability: 5, color: "#FFF176" },
    { id: 3, name: "Matcha Tee", icon: "🍵", rarity: "common", description: "Leckerer Matcha Tee!", probability: 5, color: "#AED581" },
    { id: 4, name: "Herz", icon: "💕", rarity: "common", description: "Viel Liebe!", probability: 5, color: "#ff6b9d" },
    
    // Rare Items (3 Items)
    { id: 6, name: "Goldene Capybara", icon: "🦫✨", rarity: "rare", description: "Eine seltene goldene Capybara!", probability: 5, color: "#f8b500" },
    { id: 7, name: "Regenbogen", icon: "🌈", rarity: "rare", description: "Ein wunderschöner Regenbogen!", probability: 5, color: "#AED581" },
    { id: 8, name: "Krone", icon: "👑", rarity: "rare", description: "Eine goldene Krone!", probability: 5, color: "#f8b500" },
    
    // Epic Items (2 Items)
    { id: 9, name: "Königliche Capybara", icon: "👑🦫", rarity: "epic", description: "Die königliche Capybara!", probability: 5, color: "#ff6b9d" },
    { id: 10, name: "Magisches Portal", icon: "🌀", rarity: "epic", description: "Ein magisches Portal!", probability: 5, color: "#9C27B0" },
    
    // Legendary Items (4 Items - mit Features)
    { id: 11, name: "Legendäre Otis", icon: "🦫🌟", rarity: "legendary", description: "DIE legendäre Otis selbst!", probability: 3, color: "#f8b500" },
    { id: 12, name: "Legendäre Karte", icon: "🗺️✨", rarity: "legendary", description: "Eine magische Karte mit allen Orten!", probability: 3, color: "#4CAF50", unlocks: "map" },
    { id: 13, name: "Legendäre Musikbox", icon: "🎵✨", rarity: "legendary", description: "Eine wundervolle Musikbox voller Melodien!", probability: 3, color: "#9C27B0", unlocks: "music" },
    { id: 14, name: "Göttliche Kugel", icon: "✨🌟✨", rarity: "legendary", description: "Eine göttliche Kugel voller Magie!", probability: 1, color: "#ff9800" },
];

// Dynamische Gacha Items (inkl. Monster-Gacha für hochgeladene Bilder)
function getGachaItems() {
    const items = [...baseGachaItems];
    
    // Füge Monster-Gacha Items für hochgeladene Bilder hinzu
    try {
        const uploadedImages = JSON.parse(localStorage.getItem('otisImages')) || [];
        uploadedImages.forEach((img, index) => {
            items.push({
                id: 1000 + index, // Eindeutige IDs ab 1000
                name: "Monster-Gacha",
                icon: "👹",
                rarity: "legendary",
                description: "Ein mysteriöses Monster-Gacha!",
                probability: 2,
                color: "#E91E63",
                isMonsterGacha: true,
                imageData: img.data,
                imageDate: img.date
            });
        });
    } catch (e) {
        console.error('Fehler beim Laden der Bilder für Monster-Gacha:', e);
    }
    
    return items;
}

// Verwende dynamische Funktion
const gachaItems = getGachaItems();

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
            // Entferne alle versteckenden Styles
            mapSection.style.display = 'block';
            mapSection.style.visibility = 'visible';
            mapSection.style.position = 'relative';
            mapSection.style.left = 'auto';
            mapSection.style.opacity = '0';
            mapSection.style.transform = 'translateY(30px)';
            mapSection.style.transition = 'all 0.8s ease';
            
            const mapDiv = document.getElementById('map');
            const mapPlaceholder = document.getElementById('map-placeholder');
            if (mapDiv) mapDiv.style.display = 'block';
            if (mapPlaceholder) mapPlaceholder.style.display = 'flex';
            
            // Animation starten
            setTimeout(() => {
                mapSection.style.opacity = '1';
                mapSection.style.transform = 'translateY(0)';
            }, 100);
            
            // Lade Karte wenn sie freigeschaltet wird
            if (typeof initMap === 'function') {
                setTimeout(() => initMap(), 800);
            }
            
            // Speichere Unlock in localStorage
            const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
            if (!unlocks.includes('map')) {
                unlocks.push('map');
                localStorage.setItem('unlockedFeatures', JSON.stringify(unlocks));
            }
        }
    } else if (feature === 'music') {
        const musicSection = document.getElementById('music-section');
        if (musicSection) {
            // Entferne alle versteckenden Styles
            musicSection.style.display = 'block';
            musicSection.style.visibility = 'visible';
            musicSection.style.position = 'relative';
            musicSection.style.left = 'auto';
            musicSection.style.opacity = '0';
            musicSection.style.transform = 'translateY(30px)';
            musicSection.style.transition = 'all 0.8s ease';
            
            const spotifyIframe = document.getElementById('spotify-iframe');
            if (spotifyIframe) {
                spotifyIframe.style.display = 'block';
                spotifyIframe.src = 'https://open.spotify.com/embed/playlist/2rK6GwLnUr7K3FqDMsxaZz?utm_source=generator&theme=0';
            }
            
            // Animation starten
            setTimeout(() => {
                musicSection.style.opacity = '1';
                musicSection.style.transform = 'translateY(0)';
            }, 100);
            
            // Speichere Unlock in localStorage
            const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
            if (!unlocks.includes('music')) {
                unlocks.push('music');
                localStorage.setItem('unlockedFeatures', JSON.stringify(unlocks));
            }
        }
    }
}

// Prüfe freigeschaltete Features beim Laden
function checkUnlockedFeatures() {
    // Prüfe localStorage für freigeschaltete Features
    const unlocks = JSON.parse(localStorage.getItem('unlockedFeatures')) || [];
    
    // Oder prüfe Collection
    const stats = JSON.parse(localStorage.getItem('gachaStats')) || { collection: [] };
    const collection = stats.collection || [];
    
    // Prüfe ob Karte freigeschaltet ist
    const hasMap = unlocks.includes('map') || collection.some(item => {
        const itemData = gachaItems.find(i => i.id === item.id);
        return itemData && itemData.unlocks === 'map';
    });
    
    // Prüfe ob Musik freigeschaltet ist
    const hasMusic = unlocks.includes('music') || collection.some(item => {
        const itemData = gachaItems.find(i => i.id === item.id);
        return itemData && itemData.unlocks === 'music';
    });
    
    if (hasMap) {
        const mapSection = document.getElementById('map-section');
        if (mapSection) {
            mapSection.style.display = 'block';
            mapSection.style.visibility = 'visible';
            mapSection.style.position = 'relative';
            mapSection.style.left = 'auto';
            mapSection.style.opacity = '1';
            mapSection.style.transform = 'translateY(0)';
            
            const mapDiv = document.getElementById('map');
            const mapPlaceholder = document.getElementById('map-placeholder');
            if (mapDiv) mapDiv.style.display = 'block';
            if (mapPlaceholder) mapPlaceholder.style.display = 'flex';
            
            if (typeof initMap === 'function') {
                setTimeout(() => initMap(), 500);
            }
        }
    }
    
    if (hasMusic) {
        const musicSection = document.getElementById('music-section');
        if (musicSection) {
            musicSection.style.display = 'block';
            musicSection.style.visibility = 'visible';
            musicSection.style.position = 'relative';
            musicSection.style.left = 'auto';
            musicSection.style.opacity = '1';
            musicSection.style.transform = 'translateY(0)';
            
            const spotifyIframe = document.getElementById('spotify-iframe');
            if (spotifyIframe) {
                spotifyIframe.style.display = 'block';
                spotifyIframe.src = 'https://open.spotify.com/embed/playlist/2rK6GwLnUr7K3FqDMsxaZz?utm_source=generator&theme=0';
            }
        }
    }
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
    
    // Button hover effect
    button.addEventListener('mouseenter', () => {
        if (!button.disabled) {
            door.classList.add('shake');
            setTimeout(() => door.classList.remove('shake'), 500);
        }
    });
}

function createKugelPreviews() {
    const container = document.getElementById('gacha-kugeln');
    container.innerHTML = '';
    
    // Create 4 preview kugeln
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

function showCollection() {
    const modal = document.getElementById('collection-modal');
    const grid = document.getElementById('collection-grid');
    
    if (stats.collection.length === 0) {
        grid.innerHTML = `
            <div class="empty-collection" style="grid-column: 1 / -1;">
                <div class="empty-collection-icon">📦</div>
                <p>Noch keine Items gesammelt!</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Ziehe eine Kugel um zu beginnen!</p>
            </div>
        `;
    } else {
        // Sort by rarity
        const sorted = [...stats.collection].sort((a, b) => {
            const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        });
        
        grid.innerHTML = sorted.map(item => {
            const allItems = getGachaItems();
            const itemData = allItems.find(i => i.id === item.id) || baseGachaItems.find(i => i.id === item.id);
            const displayIcon = item.isMonsterGacha && item.imageData ? '👹' : (itemData ? itemData.icon : item.icon);
            const displayName = item.isMonsterGacha ? 'Monster-Gacha' : (itemData ? itemData.name : item.name);
            
            return `
                <div class="collection-item ${item.rarity}" ${item.isMonsterGacha && item.imageData ? `onclick="showMonsterGachaImage('${item.imageData.replace(/'/g, "&#39;")}')" style="cursor: pointer;"` : ''}>
                    <span class="collection-item-icon">${displayIcon}</span>
                    <div class="collection-item-name">${displayName}</div>
                    <div class="collection-item-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
                </div>
            `;
        }).join('');
    }
    
    modal.classList.add('show');
}

function closeCollection() {
    document.getElementById('collection-modal').classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('collection-modal');
    if (e.target === modal) {
        closeCollection();
    }
});

// Main Gacha Pull Function
function pullGacha() {
    const button = document.getElementById('gacha-button');
    const door = document.getElementById('gacha-door');
    const chute = document.getElementById('gacha-chute');
    const resultKugel = document.getElementById('result-kugel');
    const kugelShell = document.getElementById('kugel-shell');
    const kugelContent = document.getElementById('kugel-content');
    
    // Disable button
    button.disabled = true;
    button.classList.add('pulling');
    
    // Shake door
    door.classList.add('shake');
    
    // Reset result
    kugelShell.classList.remove('opened');
    kugelContent.classList.remove('show');
    kugelContent.innerHTML = '';
    
    // Create falling kugel
    const fallingKugel = document.createElement('div');
    fallingKugel.className = 'falling-kugel';
    chute.appendChild(fallingKugel);
    chute.classList.add('active');
    
    // Get random item
    const item = getRandomItem();
    
    // After animation, show result
    setTimeout(() => {
        chute.classList.remove('active');
        fallingKugel.remove();
        
        // Show result kugel
        resultKugel.style.display = 'block';
        
        // Open kugel
        setTimeout(() => {
            kugelShell.classList.add('opened');
            
            setTimeout(() => {
                kugelContent.classList.add('show');
                displayItem(item);
                
                // Update stats
                stats.totalPulls++;
                if (item.rarity === 'rare') stats.rareItems++;
                if (item.rarity === 'epic') stats.epicItems++;
                if (item.rarity === 'legendary') stats.legendaryItems++;
                
                // Add to collection - IMMER hinzufügen (auch wenn schon vorhanden)
                // Prüfe nur ob es wirklich neu ist für Notification
                const existingItem = stats.collection.find(i => i.id === item.id);
                const isNewItem = !existingItem;
                
                if (isNewItem) {
                    stats.collection.push({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        rarity: item.rarity,
                        obtainedAt: new Date().toISOString(),
                        isMonsterGacha: item.isMonsterGacha || false,
                        imageData: item.imageData || null
                    });
                    
                    // Prüfe ob Feature freigeschaltet werden soll
                    if (item.unlocks) {
                        unlockFeature(item.unlocks);
                    }
                } else {
                    // Item schon vorhanden - aktualisiere obtainedAt
                    existingItem.obtainedAt = new Date().toISOString();
                }
                
                localStorage.setItem('gachaStats', JSON.stringify(stats));
                updateStats();
                
                // Show collection notification - nur wenn wirklich neu
                if (isNewItem) {
                    showCollectionNotification(item);
                }
                
                // Confetti based on rarity
                triggerConfetti(item.rarity);
                
                // Prüfe ob es ein Monster-Gacha ist - zeige Popup NACH Button-Reaktivierung
                if (item.isMonsterGacha && item.imageData) {
                    // Zeige das Bild in einem Popup nach kurzer Verzögerung
                    setTimeout(() => {
                        showMonsterGachaImage(item.imageData);
                    }, 500);
                }
                
                // Re-enable button - IMMER aktivieren, auch bei Monster-Gacha
                setTimeout(() => {
                    button.disabled = false;
                    button.classList.remove('pulling');
                    door.classList.remove('shake');
                }, 1000);
            }, 300);
        }, 500);
    }, 1000);
}

function getRandomItem() {
    // Lade aktuelle Items (inkl. Monster-Gacha)
    const currentItems = getGachaItems();
    
    // Calculate total probability
    const totalProb = currentItems.reduce((sum, item) => sum + item.probability, 0);
    
    // Random number
    let random = Math.random() * totalProb;
    
    // Find item
    for (const item of currentItems) {
        random -= item.probability;
        if (random <= 0) {
            return item;
        }
    }
    
    // Fallback
    return currentItems[0];
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

function triggerConfetti(rarity) {
    if (typeof confetti === 'undefined') return;
    
    const colors = {
        common: ['#AED581', '#FFAB91'],
        rare: ['#AED581', '#8BC34A', '#4CAF50'],
        epic: ['#ff6b9d', '#c44569', '#e91e63'],
        legendary: ['#f8b500', '#ff9800', '#ffc107', '#ffeb3b']
    };
    
    const config = {
        particleCount: rarity === 'legendary' ? 200 : rarity === 'epic' ? 100 : 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors[rarity] || colors.common
    };
    
    // Multiple bursts for legendary
    if (rarity === 'legendary') {
        confetti(config);
        setTimeout(() => confetti({ ...config, angle: 60 }), 200);
        setTimeout(() => confetti({ ...config, angle: 120 }), 400);
        setTimeout(() => confetti({ ...config, angle: 180 }), 600);
    } else if (rarity === 'epic') {
        confetti(config);
        setTimeout(() => confetti({ ...config, angle: 60 }), 200);
    } else {
        confetti(config);
    }
}

function showCollectionNotification(item) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ffffff, #fff5f8);
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideIn 0.5s ease;
        max-width: 320px;
        border: 3px solid rgba(255, 107, 157, 0.3);
    `;
    
    notification.innerHTML = `
        <div style="font-size: 2.5em; text-align: center; margin-bottom: 15px;">${item.icon}</div>
        <div style="font-weight: bold; text-align: center; margin-bottom: 8px; font-size: 1.2em; color: #333;">${item.name}</div>
        <div style="text-align: center; font-size: 0.95em; color: #666; margin-bottom: 10px;">${item.description || ''}</div>
        <div style="text-align: center; margin-top: 15px;">
            <span class="kugel-content-rarity ${item.rarity}" style="display: inline-block; padding: 8px 20px; font-size: 0.9em;">${item.rarity.toUpperCase()}</span>
        </div>
        <div style="text-align: center; margin-top: 15px; font-size: 0.9em; color: #4CAF50; font-weight: bold;">✨ Neues Item erhalten!</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Monster-Gacha Bild Popup
function showMonsterGachaImage(imageData) {
    // Erstelle großes Popup-Modal
    const modal = document.createElement('div');
    modal.id = 'monster-gacha-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
        pointer-events: auto;
    `;
    
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
            // Stelle sicher, dass Button wieder aktiv ist
            const button = document.getElementById('gacha-button');
            if (button) {
                button.disabled = false;
                button.classList.remove('pulling');
            }
        }, 300);
    };
    
    // Mobile-optimiertes Popup
    const isMobile = window.innerWidth <= 768;
    const monsterSize = isMobile ? '2.5em' : '4em';
    const titleSize = isMobile ? '1.5em' : '2em';
    const imgMaxWidth = isMobile ? '95vw' : '80vw';
    const imgMaxHeight = isMobile ? '60vh' : '70vh';
    const buttonPadding = isMobile ? '12px 30px' : '15px 40px';
    const buttonFontSize = isMobile ? '1em' : '1.2em';
    
    modal.innerHTML = `
        <div style="position: relative; max-width: 95%; max-height: 95%; text-align: center; pointer-events: auto; padding: ${isMobile ? '15px' : '20px'};">
            <div style="font-size: ${monsterSize}; margin-bottom: ${isMobile ? '15px' : '20px'}; animation: bounce 1s ease infinite;">👹</div>
            <h2 style="color: white; font-size: ${titleSize}; margin-bottom: ${isMobile ? '15px' : '20px'}; font-family: var(--font-heading); line-height: 1.2;">MONSTER-GACHA!</h2>
            <img src="${imageData}" alt="Monster-Gacha Bild" style="max-width: ${imgMaxWidth}; max-height: ${imgMaxHeight}; border-radius: ${isMobile ? '15px' : '20px'}; box-shadow: 0 20px 60px rgba(255, 107, 157, 0.5); border: ${isMobile ? '3px' : '5px'} solid #E91E63; display: block; margin: 0 auto;" />
            <button id="close-monster-modal" style="margin-top: ${isMobile ? '20px' : '30px'}; padding: ${buttonPadding}; background: linear-gradient(135deg, #E91E63, #C2185B); color: white; border: none; border-radius: ${isMobile ? '20px' : '25px'}; font-size: ${buttonFontSize}; font-weight: bold; cursor: pointer; box-shadow: 0 10px 30px rgba(233, 30, 99, 0.4); transition: transform 0.2s ease; -webkit-tap-highlight-color: rgba(233, 30, 99, 0.3);">Schließen ✨</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event Listener für Schließen-Button
    const closeBtn = modal.querySelector('#close-monster-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('touchstart', closeModal);
    }
    
    // Schließe nach 8 Sekunden automatisch
    setTimeout(() => {
        if (modal.parentElement) {
            closeModal();
        }
    }, 8000);
    
    // Schließe bei Klick außerhalb
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Schließe bei ESC-Taste
    const escHandler = (e) => {
        if (e.key === 'Escape' && modal.parentElement) {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-20px) scale(1.1); }
    }
`;
document.head.appendChild(style);
