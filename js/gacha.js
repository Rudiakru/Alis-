// Gacha Machine JavaScript

// Gacha Items Database - BEGRENZTE ANZAHL (nur 10 Items)
const gachaItems = [
    // Common Items (50% chance total) - 5 Items
    { id: 1, name: "Capybara Sticker", icon: "🦫", rarity: "common", description: "Ein süßer Capybara Sticker!", probability: 10, color: "#AED581" },
    { id: 2, name: "Yuzu Bad", icon: "🛁", rarity: "common", description: "Entspannendes Yuzu-Bad!", probability: 10, color: "#FFF176" },
    { id: 3, name: "Matcha Tee", icon: "🍵", rarity: "common", description: "Leckerer Matcha Tee!", probability: 10, color: "#AED581" },
    { id: 4, name: "Taiwan Flagge", icon: "🇹🇼", rarity: "common", description: "Taiwan Pride!", probability: 10, color: "#FFAB91" },
    { id: 5, name: "Herz", icon: "💕", rarity: "common", description: "Viel Liebe!", probability: 10, color: "#ff6b9d" },
    
    // Rare Items (30% chance total) - 3 Items
    { id: 6, name: "Goldene Capybara", icon: "🦫✨", rarity: "rare", description: "Eine seltene goldene Capybara!", probability: 10, color: "#f8b500" },
    { id: 7, name: "Regenbogen", icon: "🌈", rarity: "rare", description: "Ein wunderschöner Regenbogen!", probability: 10, color: "#AED581" },
    { id: 8, name: "Stern", icon: "⭐", rarity: "rare", description: "Ein glänzender Stern!", probability: 10, color: "#FFF176" },
    
    // Epic Items (15% chance total) - 1 Item
    { id: 9, name: "Königliche Capybara", icon: "👑🦫", rarity: "epic", description: "Die königliche Capybara!", probability: 4, color: "#ff6b9d" },
    
    // Legendary Items (5% chance total) - 3 Items
    { id: 10, name: "Legendäre Otis", icon: "🦫🌟", rarity: "legendary", description: "DIE legendäre Otis selbst!", probability: 1, color: "#f8b500" },
    { id: 11, name: "Legendäre Karte", icon: "🗺️✨", rarity: "legendary", description: "Eine magische Karte mit allen Orten!", probability: 1, color: "#4CAF50", unlocks: "map" },
    { id: 12, name: "Legendäre Musikbox", icon: "🎵✨", rarity: "legendary", description: "Eine wundervolle Musikbox voller Melodien!", probability: 1, color: "#9C27B0", unlocks: "music" },
];

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
            mapSection.style.opacity = '0';
            mapSection.style.transform = 'translateY(30px)';
            mapSection.style.transition = 'all 0.8s ease';
            
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
            musicSection.style.display = 'block';
            musicSection.style.opacity = '0';
            musicSection.style.transform = 'translateY(30px)';
            musicSection.style.transition = 'all 0.8s ease';
            
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
            mapSection.style.opacity = '1';
            mapSection.style.transform = 'translateY(0)';
            if (typeof initMap === 'function') {
                setTimeout(() => initMap(), 500);
            }
        }
    }
    
    if (hasMusic) {
        const musicSection = document.getElementById('music-section');
        if (musicSection) {
            musicSection.style.display = 'block';
            musicSection.style.opacity = '1';
            musicSection.style.transform = 'translateY(0)';
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
            const itemData = gachaItems.find(i => i.id === item.id);
            return `
                <div class="collection-item ${item.rarity}">
                    <span class="collection-item-icon">${item.icon}</span>
                    <div class="collection-item-name">${item.name}</div>
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
                
                // Add to collection if not already there
                const isNewItem = !stats.collection.find(i => i.id === item.id);
                if (isNewItem) {
                    stats.collection.push({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        rarity: item.rarity,
                        obtainedAt: new Date().toISOString()
                    });
                    
                    // Prüfe ob Feature freigeschaltet werden soll
                    if (item.unlocks) {
                        unlockFeature(item.unlocks);
                    }
                }
                
                localStorage.setItem('gachaStats', JSON.stringify(stats));
                updateStats();
                
                // Show collection notification if new item
                if (stats.collection.length > 0) {
                    showCollectionNotification(item);
                }
                
                // Confetti based on rarity
                triggerConfetti(item.rarity);
                
                // Re-enable button
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
    // Calculate total probability
    const totalProb = gachaItems.reduce((sum, item) => sum + item.probability, 0);
    
    // Random number
    let random = Math.random() * totalProb;
    
    // Find item
    for (const item of gachaItems) {
        random -= item.probability;
        if (random <= 0) {
            return item;
        }
    }
    
    // Fallback
    return gachaItems[0];
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
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideIn 0.5s ease;
        max-width: 300px;
    `;
    
    const isNew = !stats.collection.find(i => i.id === item.id && i.obtainedAt !== item.obtainedAt);
    
    notification.innerHTML = `
        <div style="font-size: 2em; text-align: center; margin-bottom: 10px;">${item.icon}</div>
        <div style="font-weight: bold; text-align: center; margin-bottom: 5px;">${item.name}</div>
        <div style="text-align: center; font-size: 0.9em; color: #666;">${isNew ? '✨ Neues Item!' : 'Du hattest das schon!'}</div>
        <div style="text-align: center; margin-top: 10px;">
            <span class="kugel-content-rarity ${item.rarity}" style="display: inline-block;">${item.rarity.toUpperCase()}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
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
`;
document.head.appendChild(style);
