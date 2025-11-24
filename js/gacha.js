// Gacha Machine JavaScript

// Gacha Items Database
const gachaItems = [
    // Common Items
    { id: 1, name: "Capybara Sticker", icon: "🦫", rarity: "common", description: "Ein süßer Capybara Sticker!", probability: 50 },
    { id: 2, name: "Yuzu Bad", icon: "🛁", rarity: "common", description: "Entspannendes Yuzu-Bad!", probability: 50 },
    { id: 3, name: "Matcha Tee", icon: "🍵", rarity: "common", description: "Leckerer Matcha Tee!", probability: 50 },
    { id: 4, name: "Taiwan Flagge", icon: "🇹🇼", rarity: "common", description: "Taiwan Pride!", probability: 50 },
    { id: 5, name: "Herz", icon: "💕", rarity: "common", description: "Viel Liebe!", probability: 50 },
    
    // Rare Items
    { id: 6, name: "Goldene Capybara", icon: "🦫✨", rarity: "rare", description: "Eine seltene goldene Capybara!", probability: 25 },
    { id: 7, name: "Regenbogen", icon: "🌈", rarity: "rare", description: "Ein wunderschöner Regenbogen!", probability: 25 },
    { id: 8, name: "Stern", icon: "⭐", rarity: "rare", description: "Ein glänzender Stern!", probability: 25 },
    { id: 9, name: "Diamant", icon: "💎", rarity: "rare", description: "Ein wertvoller Diamant!", probability: 25 },
    
    // Epic Items
    { id: 10, name: "Königliche Capybara", icon: "👑🦫", rarity: "epic", description: "Die königliche Capybara!", probability: 10 },
    { id: 11, name: "Magischer Ball", icon: "🔮", rarity: "epic", description: "Ein magischer Kristallball!", probability: 10 },
    { id: 12, name: "Feuerwerk", icon: "🎆", rarity: "epic", description: "Ein spektakuläres Feuerwerk!", probability: 10 },
    
    // Legendary Items
    { id: 13, name: "Legendäre Otis", icon: "🦫🌟", rarity: "legendary", description: "DIE legendäre Otis selbst!", probability: 2 },
    { id: 14, name: "Göttliche Kugel", icon: "✨🌟✨", rarity: "legendary", description: "Eine göttliche Kugel voller Magie!", probability: 2 },
];

// Stats
let stats = JSON.parse(localStorage.getItem('gachaStats')) || {
    totalPulls: 0,
    rareItems: 0,
    epicItems: 0,
    legendaryItems: 0
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
    document.getElementById('rare-items').textContent = 
        stats.rareItems + stats.epicItems + stats.legendaryItems;
}

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
                localStorage.setItem('gachaStats', JSON.stringify(stats));
                updateStats();
                
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
    } else {
        confetti(config);
    }
}
