// Cookie Clicker Start Menu JavaScript

class CookieClickerMenu {
    constructor() {
        this.init();
        this.createCookieRain();
        this.loadSaveData();
    }

    init() {
        // Get DOM elements
        this.startBtn = document.getElementById('startGame');
        this.loadBtn = document.getElementById('loadGame');
        this.creditsBtn = document.getElementById('credits');
        
        // Modals
        this.loadModal = document.getElementById('loadModal');
        this.creditsModal = document.getElementById('creditsModal');
        
        // Close buttons
        this.closeLoadModal = document.getElementById('closeLoadModal');
        this.closeCreditsModal = document.getElementById('closeCreditsModal');
        
        this.bindEvents();
    }

    bindEvents() {
        // Main menu buttons
        this.startBtn.addEventListener('click', () => this.startNewGame());
        this.loadBtn.addEventListener('click', () => this.showLoadModal());
        this.creditsBtn.addEventListener('click', () => this.showCreditsModal());
        
        // Modal close events
        this.closeLoadModal.addEventListener('click', () => this.hideModal(this.loadModal));
        this.closeCreditsModal.addEventListener('click', () => this.hideModal(this.creditsModal));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target);
            }
        });
        
        
        // Save slot events
        document.querySelectorAll('.load-slot-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.loadGame(index + 1));
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    startNewGame() {
        // Add loading animation
        this.startBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Loading...</span>';
        this.startBtn.disabled = true;
        
        // Simulate game loading
        setTimeout(() => {
            alert('Game will start here! (No game file currently)');
            
            // Reset button
            this.startBtn.innerHTML = '<span class="btn-icon">🎮</span><span class="btn-text">Start New Game</span>';
            this.startBtn.disabled = false;
        }, 1500);
    }

    showLoadModal() {
        this.loadModal.style.display = 'block';
        this.updateSaveSlots();
    }


    showCreditsModal() {
        this.creditsModal.style.display = 'block';
    }

    hideModal(modal) {
        modal.style.display = 'none';
    }


    loadSaveData() {
        // Check for existing save data
        for (let i = 1; i <= 3; i++) {
            const saveData = localStorage.getItem(`cookieClickerSave${i}`);
            if (saveData) {
                try {
                    const data = JSON.parse(saveData);
                    this.updateSaveSlot(i, data);
                } catch (e) {
                    console.error(`Error loading save slot ${i}:`, e);
                }
            }
        }
    }

    updateSaveSlots() {
        // Refresh save slot display
        this.loadSaveData();
    }

    updateSaveSlot(slotNumber, data) {
        const slot = document.querySelector(`[data-slot="${slotNumber}"]`);
        if (!slot) return;
        
        const dateElement = slot.querySelector('.save-date');
        const progressElement = slot.querySelector('.save-progress');
        const loadButton = slot.querySelector('.load-slot-btn');
        
        if (data) {
            const date = new Date(data.timestamp || Date.now());
            dateElement.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            progressElement.textContent = `Cookies: ${this.formatNumber(data.cookies || 0)} | CPS: ${this.formatNumber(data.cps || 0)}`;
            loadButton.disabled = false;
            loadButton.textContent = 'Load';
        } else {
            dateElement.textContent = 'Empty';
            progressElement.textContent = 'No progress';
            loadButton.disabled = true;
            loadButton.textContent = 'Load';
        }
    }

    loadGame(slotNumber) {
        const saveData = localStorage.getItem(`cookieClickerSave${slotNumber}`);
        if (!saveData) {
            alert('No save data found in this slot!');
            return;
        }
        
        try {
            const data = JSON.parse(saveData);
            alert(`Loading game from slot ${slotNumber}!\nCookies: ${this.formatNumber(data.cookies || 0)}\nCPS: ${this.formatNumber(data.cps || 0)}`);
            
            // Here you would typically load the game with this data
            this.hideModal(this.loadModal);
        } catch (e) {
            alert('Error loading save data!');
            console.error('Save data error:', e);
        }
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toString();
    }

    createCookieRain() {
        const cookieRain = document.querySelector('.cookie-rain');
        const cookieEmojis = ['🍪', '🥠', '🧁', '🍩', '🎂'];
        
        setInterval(() => {
            
            const cookie = document.createElement('div');
            cookie.className = 'falling-cookie';
            cookie.textContent = cookieEmojis[Math.floor(Math.random() * cookieEmojis.length)];
            cookie.style.left = Math.random() * 100 + '%';
            cookie.style.animationDuration = (Math.random() * 3 + 2) + 's';
            cookie.style.fontSize = (Math.random() * 10 + 15) + 'px';
            
            cookieRain.appendChild(cookie);
            
            // Remove cookie after animation
            setTimeout(() => {
                if (cookie.parentNode) {
                    cookie.parentNode.removeChild(cookie);
                }
            }, 5000);
        }, 800);
    }

    handleKeyboard(e) {
        // Keyboard shortcuts
        switch(e.key) {
            case 'Escape':
                // Close any open modal
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'block') {
                        this.hideModal(modal);
                    }
                });
                break;
            case 'Enter':
                // Start game if no modal is open
                if (!document.querySelector('.modal[style*="block"]')) {
                    this.startNewGame();
                }
                break;
            case '1':
                if (!document.querySelector('.modal[style*="block"]')) {
                    this.startNewGame();
                }
                break;
            case '2':
                if (!document.querySelector('.modal[style*="block"]')) {
                    this.showLoadModal();
                }
                break;
            case '3':
                if (!document.querySelector('.modal[style*="block"]')) {
                    this.showCreditsModal();
                }
                break;
        }
    }

    // Demo function to create sample save data for testing
    createDemoSaveData() {
        const demoData = {
            cookies: 1234567,
            cps: 5432,
            timestamp: Date.now() - 86400000, // 1 day ago
            buildings: {
                cursors: 10,
                grandmas: 5,
                farms: 3
            }
        };
        
        localStorage.setItem('cookieClickerSave1', JSON.stringify(demoData));
        this.updateSaveSlots();
    }
}

// Initialize the menu when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const menu = new CookieClickerMenu();
    
    // Add demo save data for testing (remove in production)
    // Uncomment the line below to create demo save data
    // menu.createDemoSaveData();
    
    // Add some fun console messages
    console.log('🍪 Cookie Clicker Menu Loaded!');
    console.log('Keyboard shortcuts:');
    console.log('1 - Start New Game');
    console.log('2 - Load Game');
    console.log('3 - Credits');
    console.log('ESC - Close Modal');
    console.log('ENTER - Start Game');
});

// Add some extra visual effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover sound effect placeholder
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Placeholder for hover sound effect
            console.log('🔊 Hover sound effect');
        });
        
        btn.addEventListener('click', () => {
            // Placeholder for click sound effect
            console.log('🔊 Click sound effect');
        });
    });
    
    // Add particle effect on button clicks
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            createClickParticles(e.target);
        });
    });
});

function createClickParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = '#FFD700';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (i / 6) * Math.PI * 2;
        const velocity = 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let x = 0, y = 0;
        const animate = () => {
            x += vx * 0.02;
            y += vy * 0.02;
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = Math.max(0, 1 - Math.abs(x) / 100);
            
            if (Math.abs(x) < 100) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        requestAnimationFrame(animate);
    }
}
