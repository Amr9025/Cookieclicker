// Cookie Clicker Start Menu JavaScript

// Small helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const show = el => el && (el.style.display = 'block');
const hide = el => el && (el.style.display = 'none');
const isAnyModalOpen = () => !!$('.modal[style*="block"]');
const clampNumber = n => (Number.isFinite(n) ? n : 0);

class CookieClickerMenu {
    constructor() {
        this.init();
        this.createCookieRain();
        this.loadSaveData();
    }

    init() {
        // Get DOM elements
        this.startBtn = $('#startGame');
        this.loadBtn = $('#loadGame');
        this.creditsBtn = $('#credits');
        this.startMenu = $('.start-menu');
        this.gameScreen = $('#gameScreen');
        this.cookieBtn = $('#cookieBtn');
        this.pointsEl = $('#points');
        this.points = 0;
        this.generatorList = $('#generatorList');
        this.generators = [
            { id: 'cursor', name: 'Cursor', baseCost: 15, qty: 0, cps: 1 },
            { id: 'grandma', name: 'Grandma', baseCost: 100, qty: 0, cps: 5 },
            { id: 'farm', name: 'Farm', baseCost: 1100, qty: 0, cps: 25 },
            { id: 'mine', name: 'Mine', baseCost: 12000, qty: 0, cps: 120 },
            { id: 'factory', name: 'Factory', baseCost: 130000, qty: 0, cps: 500 },
            { id: 'bank', name: 'Bank', baseCost: 1400000, qty: 0, cps: 2000 },
            { id: 'temple', name: 'Temple', baseCost: 20000000, qty: 0, cps: 8000 },
            { id: 'wizard', name: 'Wizard Tower', baseCost: 330000000, qty: 0, cps: 40000 },
        ];
        this.tickMs = 1000;
        
        // Modals
        this.loadModal = $('#loadModal');
        this.creditsModal = $('#creditsModal');
        
        // Close buttons
        this.closeLoadModal = $('#closeLoadModal');
        this.closeCreditsModal = $('#closeCreditsModal');
        
        this.bindEvents();
        this.renderGenerators();
    }

    bindEvents() {
        // Main menu buttons
        this.startBtn.addEventListener('click', () => this.startNewGame());
        this.loadBtn.addEventListener('click', () => this.showLoadModal());
        this.creditsBtn.addEventListener('click', () => this.showCreditsModal());
        
        // Modal close events
        this.closeLoadModal.addEventListener('click', () => hide(this.loadModal));
        this.closeCreditsModal.addEventListener('click', () => hide(this.creditsModal));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) hide(e.target);
        });
        
        
        // Save slot events
        $$('.load-slot-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.loadGame(index + 1));
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    startNewGame() {
        hide(this.startMenu);
        show(this.gameScreen);
        this.points = 0;
        if (this.pointsEl) this.pointsEl.textContent = this.points;
        if (this.cookieBtn && !this.cookieBound) {
            this.cookieBtn.addEventListener('click', () => {
                this.points += 1;
                this.pointsEl.textContent = this.points;
                this.refreshShopButtons();
            });
            this.cookieBound = true;
        }
        this.startProductionLoop();
    }

    showLoadModal() {
        show(this.loadModal);
        this.updateSaveSlots();
    }


    showCreditsModal() {
        show(this.creditsModal);
    }

    hideModal(modal) { hide(modal); }


    loadSaveData() {
        // Check for existing save data
        for (let i = 1; i <= 3; i++) {
            const raw = localStorage.getItem(`cookieClickerSave${i}`);
            if (!raw) { this.updateSaveSlot(i, null); continue; }
            try {
                this.updateSaveSlot(i, JSON.parse(raw));
            } catch (e) {
                console.error(`Error loading save slot ${i}:`, e);
                this.updateSaveSlot(i, null);
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
            dateElement.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            progressElement.textContent = `Cookies: ${this.formatNumber(clampNumber(data.cookies))} | CPS: ${this.formatNumber(clampNumber(data.cps))}`;
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
            alert(`Loading game from slot ${slotNumber}!\nCookies: ${this.formatNumber(clampNumber(data.cookies))}\nCPS: ${this.formatNumber(clampNumber(data.cps))}`);
            hide(this.loadModal);
        } catch (e) {
            alert('Error loading save data!');
            console.error('Save data error:', e);
        }
    }

    formatNumber(num) {
        const n = Math.floor(num);
        if (n >= 1e12) return Math.floor(n / 1e12) + 'T';
        if (n >= 1e9) return Math.floor(n / 1e9) + 'B';
        if (n >= 1e6) return Math.floor(n / 1e6) + 'M';
        if (n >= 1e3) return Math.floor(n / 1e3) + 'K';
        return String(n);
    }

    createCookieRain() {
        const cookieRain = document.querySelector('.cookie-rain');
        if (!cookieRain) return;
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
            setTimeout(() => cookie.remove(), 5000);
        }, 800);
    }

    handleKeyboard(e) {
        const actions = {
            Escape: () => $$('.modal').forEach(m => hide(m)),
            Enter: () => !isAnyModalOpen() && this.startNewGame(),
            '1': () => !isAnyModalOpen() && this.startNewGame(),
            '2': () => !isAnyModalOpen() && this.showLoadModal(),
            '3': () => !isAnyModalOpen() && this.showCreditsModal(),
        };
        const action = actions[e.key];
        if (action) action();
    }

    // ---- Generators (Step 2) ----
    renderGenerators() {
        if (!this.generatorList) return;
        this.generatorList.innerHTML = '';
        this.generators.forEach((g, idx) => {
            const div = document.createElement('div');
            div.className = 'generator-item';
            div.innerHTML = `
                <div>
                    <strong>${g.name}</strong><br/>
                    <small>Owned: <span data-q='${idx}'>${g.qty}</span> | CPS: ${g.cps}</small>
                </div>
                <button data-buy='${idx}'>Buy (${this.formatNumber(this.getCost(g))})</button>
            `;
            this.generatorList.appendChild(div);
        });
        // Delegate click once; keep one handler
        if (!this.generatorClickBound) {
            this.generatorList.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-buy]');
                if (!btn) return;
                const idx = Number(btn.getAttribute('data-buy'));
                this.buyGenerator(idx);
            });
            this.generatorClickBound = true;
        }
        this.refreshShopButtons();
    }

    getCost(g) {
        // Basic exponential scaling
        return Math.floor(g.baseCost * Math.pow(1.15, g.qty));
    }

    buyGenerator(idx) {
        const g = this.generators[idx];
        const cost = this.getCost(g);
        if (this.points < cost) return;
        this.points -= cost;
        g.qty += 1;
        if (this.pointsEl) this.pointsEl.textContent = this.points;
        this.renderGenerators();
    }

    startProductionLoop() {
        if (this.productionTimer) clearInterval(this.productionTimer);
        this.productionTimer = setInterval(() => {
            const cps = this.generators.reduce((sum, g) => sum + (g.cps * g.qty), 0);
            this.points += Math.floor(cps);
            if (this.pointsEl) this.pointsEl.textContent = Math.floor(this.points);
            this.refreshShopButtons();
        }, this.tickMs);
    }

    refreshShopButtons() {
        if (!this.generatorList) return;
        const buttons = this.generatorList.querySelectorAll('button[data-buy]');
        buttons.forEach((btn) => {
            const idx = Number(btn.getAttribute('data-buy'));
            const g = this.generators[idx];
            const cost = this.getCost(g);
            btn.disabled = this.points < cost;
            btn.textContent = `Buy (${this.formatNumber(cost)})`;
            const q = this.generatorList.querySelector(`span[data-q='${idx}']`);
            if (q) q.textContent = g.qty;
        });
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

    // Optional: menu.createDemoSaveData();

    console.log('🍪 Cookie Clicker Menu Loaded!');
    console.log('Keyboard shortcuts: 1 Start | 2 Load | 3 Credits | ESC Close | ENTER Start');

    // Extra visual/sound hooks
    $$('.menu-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => console.log('🔊 Hover sound effect'));
        btn.addEventListener('click', (e) => {
            console.log('🔊 Click sound effect');
            createClickParticles(e.currentTarget);
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
