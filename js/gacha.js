// Gacha Machine JavaScript

// Gacha Items Database
const gachaItems = [
    // Common Items (50% chance total)
    { id: 1, name: "Capybara Sticker", icon: "🦫", rarity: "common", description: "Ein süßer Capybara Sticker!", probability: 10, color: "#AED581" },
    { id: 2, name: "Yuzu Bad", icon: "🛁", rarity: "common", description: "Entspannendes Yuzu-Bad!", probability: 10, color: "#FFF176" },
    { id: 3, name: "Matcha Tee", icon: "🍵", rarity: "common", description: "Leckerer Matcha Tee!", probability: 10, color: "#AED581" },
    { id: 4, name: "Taiwan Flagge", icon: "🇹🇼", rarity: "common", description: "Taiwan Pride!", probability: 10, color: "#FFAB91" },
    { id: 5, name: "Herz", icon: "💕", rarity: "common", description: "Viel Liebe!", probability: 10, color: "#ff6b9d" },
    
    // Rare Items (30% chance total)
    { id: 6, name: "Goldene Capybara", icon: "🦫✨", rarity: "rare", description: "Eine seltene goldene Capybara!", probability: 8, color: "#f8b500" },
    { id: 7, name: "Regenbogen", icon: "🌈", rarity: "rare", description: "Ein wunderschöner Regenbogen!", probability: 8, color: "#AED581" },
    { id: 8, name: "Stern", icon: "⭐", rarity: "rare", description: "Ein glänzender Stern!", probability: 7, color: "#FFF176" },
    { id: 9, name: "Diamant", icon: "💎", rarity: "rare", description: "Ein wertvoller Diamant!", probability: 7, color: "#AED581" },
    
    // Epic Items (15% chance total)
    { id: 10, name: "Königliche Capybara", icon: "👑🦫", rarity: "epic", description: "Die königliche Capybara!", probability: 5, color: "#ff6b9d" },
    { id: 11, name: "Magischer Ball", icon: "🔮", rarity: "epic", description: "Ein magischer Kristallball!", probability: 5, color: "#c44569" },
    { id: 12, name: "Feuerwerk", icon: "🎆", rarity: "epic", description: "Ein spektakuläres Feuerwerk!", probability: 5, color: "#f8b500" },
    
    // Legendary Items (5% chance total)
    { id: 13, name: "Legendäre Otis", icon: "🦫🌟", rarity: "legendary", description: "DIE legendäre Otis selbst!", probability: 3, color: "#f8b500" },
    { id: 14, name: "Göttliche Kugel", icon: "✨🌟✨", rarity: "legendary", description: "Eine göttliche Kugel voller Magie!", probability: 2, color: "#ff9800" },
];

// Stats & Collection
let stats = JSON.parse(localStorage.getItem('gachaStats')) || {
    totalPulls: 0,
    rareItems: 0,
    epicItems: 0,
    legendaryItems: 0,
    collection: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initGachaMachine();
    updateStats();
    createKugelPreviews();
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
                if (!stats.collection.find(i => i.id === item.id)) {
                    stats.collection.push({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        rarity: item.rarity,
                        obtainedAt: new Date().toISOString()
                    });
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
