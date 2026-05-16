javascript:(function() {
    'use strict';

    // ==========================================
    // LOVABLE.DEV UNLIMITED - PREMIUM EDITION
    // ==========================================
    
    const CONFIG = {
        version: '2.0.0',
        autoRemixEnabled: true,
        remixInterval: 5000, // 5 segundos entre tentativas
        maxRemixAttempts: 999, // Praticamente infinito
        enableNotifications: true,
        enableAutoScroll: true
    };

    let state = {
        isActive: true,
        remixCount: 0,
        generationCount: 0,
        lastError: null,
        isRemixing: false,
        totalCreditsUsed: 0,
        sessionStartTime: Date.now()
    };

    // ==========================================
    // ESTILOS CSS
    // ==========================================
    const CSS = `
        .lovable-unlimited-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        .lovable-panel {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            color: white;
            width: 380px;
            max-height: 600px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideIn {
            from {
                transform: translateX(420px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .lovable-header {
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .lovable-title {
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .lovable-status-badge {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #00ff88;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .lovable-close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .lovable-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .lovable-content {
            padding: 20px;
            flex: 1;
            overflow-y: auto;
        }

        .lovable-stat {
            margin-bottom: 16px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            border-left: 3px solid #00ff88;
        }

        .lovable-stat-label {
            font-size: 12px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .lovable-stat-value {
            font-size: 24px;
            font-weight: 700;
            margin-top: 4px;
        }

        .lovable-controls {
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            gap: 10px;
        }

        .lovable-btn {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .lovable-btn-primary {
            background: #00ff88;
            color: #667eea;
        }

        .lovable-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 255, 136, 0.3);
        }

        .lovable-btn-primary:active {
            transform: translateY(0);
        }

        .lovable-btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .lovable-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        .lovable-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        .lovable-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 12px;
        }

        .lovable-toggle-label {
            font-size: 14px;
            font-weight: 500;
        }

        .lovable-switch {
            width: 50px;
            height: 28px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 14px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }

        .lovable-switch.active {
            background: #00ff88;
        }

        .lovable-switch-thumb {
            width: 24px;
            height: 24px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: left 0.3s;
        }

        .lovable-switch.active .lovable-switch-thumb {
            left: 24px;
        }

        .lovable-log {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 8px;
            font-size: 11px;
            font-family: 'Courier New', monospace;
            max-height: 150px;
            overflow-y: auto;
            margin-top: 12px;
            color: #00ff88;
        }

        .lovable-log-entry {
            padding: 4px 0;
            border-bottom: 1px solid rgba(0, 255, 136, 0.1);
        }

        .lovable-log-entry:last-child {
            border-bottom: none;
        }

        .lovable-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999998;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            animation: notificationSlide 0.3s ease;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        @keyframes notificationSlide {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .lovable-notification.success {
            background: #00ff88;
            color: #333;
        }

        .lovable-notification.warning {
            background: #ffa502;
            color: white;
        }

        .lovable-notification.error {
            background: #ff4757;
            color: white;
        }

        .lovable-notification.info {
            background: #667eea;
            color: white;
        }

        .lovable-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;

    // ==========================================
    // FUNÇÕES PRINCIPAIS
    // ==========================================

    function injectStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = CSS;
        document.head.appendChild(styleEl);
    }

    function showNotification(message, type = 'info') {
        if (!CONFIG.enableNotifications) return;

        const notif = document.createElement('div');
        notif.className = `lovable-notification ${type}`;
        notif.textContent = message;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'notificationSlide 0.3s ease reverse';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    function addLog(message) {
        const logEl = document.querySelector('.lovable-log');
        if (logEl) {
            const entry = document.createElement('div');
            entry.className = 'lovable-log-entry';
            const time = new Date().toLocaleTimeString();
            entry.textContent = `[${time}] ${message}`;
            logEl.appendChild(entry);
            logEl.scrollTop = logEl.scrollHeight;

            // Manter apenas os últimos 20 logs
            const entries = logEl.querySelectorAll('.lovable-log-entry');
            if (entries.length > 20) {
                entries[0].remove();
            }
        }
    }

    function updateStats() {
        const remixCountEl = document.querySelector('[data-stat="remix-count"]');
        const generationCountEl = document.querySelector('[data-stat="generation-count"]');
        const sessionTimeEl = document.querySelector('[data-stat="session-time"]');

        if (remixCountEl) remixCountEl.textContent = state.remixCount;
        if (generationCountEl) generationCountEl.textContent = state.generationCount;
        
        if (sessionTimeEl) {
            const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            sessionTimeEl.textContent = `${minutes}m ${seconds}s`;
        }
    }

    function findAndClickRemixButton() {
        // Estratégia 1: Procurar por texto "Remix"
        let remixBtn = Array.from(document.querySelectorAll('button')).find(b => 
            b.innerText.toLowerCase().includes('remix') || 
            b.getAttribute('aria-label')?.toLowerCase().includes('remix')
        );

        // Estratégia 2: Procurar por atributos data
        if (!remixBtn) {
            remixBtn = document.querySelector('[data-testid*="remix"], [data-test*="remix"], [class*="remix"]');
        }

        // Estratégia 3: Procurar em menus dropdown
        if (!remixBtn) {
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.innerHTML.includes('Remix') || btn.textContent.includes('Remix')) {
                    remixBtn = btn;
                    break;
                }
            }
        }

        if (remixBtn && remixBtn.offsetParent !== null) { // Verifica se está visível
            remixBtn.click();
            state.remixCount++;
            addLog(`✓ Remix ativado (${state.remixCount})`);
            showNotification(`Remix #${state.remixCount} executado!`, 'success');
            return true;
        }

        return false;
    }

    function monitorGenerations() {
        // Interceptar requisições de geração
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0] instanceof Request ? args[0].url : args[0];

            try {
                const response = await originalFetch.apply(this, args);

                // Detectar geração bem-sucedida
                if (url.includes('generate') || url.includes('build')) {
                    if (response.ok) {
                        state.generationCount++;
                        addLog(`✓ Geração #${state.generationCount} concluída`);
                        updateStats();
                    }
                }

                // Detectar limite de créditos
                if (response.status === 429 || response.status === 402) {
                    state.lastError = `Limite detectado (HTTP ${response.status})`;
                    addLog(`⚠ ${state.lastError}`);
                    showNotification('Limite atingido! Ativando Remix...', 'warning');
                    
                    if (CONFIG.autoRemixEnabled) {
                        setTimeout(() => findAndClickRemixButton(), 1000);
                    }
                }

                return response;
            } catch (error) {
                console.error('[Lovable Unlimited] Erro:', error);
                return originalFetch.apply(this, args);
            }
        };
    }

    function autoRemixLoop() {
        if (!CONFIG.autoRemixEnabled || !state.isActive) return;

        const interval = setInterval(() => {
            if (!state.isActive || !CONFIG.autoRemixEnabled) {
                clearInterval(interval);
                return;
            }

            if (state.remixCount < CONFIG.maxRemixAttempts) {
                // Tentar remix a cada intervalo configurado
                if (!state.isRemixing) {
                    state.isRemixing = true;
                    const found = findAndClickRemixButton();
                    state.isRemixing = false;

                    if (!found) {
                        addLog('⊘ Botão Remix não encontrado');
                    }
                }
            }
        }, CONFIG.remixInterval);

        window.lovableUnlimitedInterval = interval;
    }

    function createPanel() {
        const container = document.createElement('div');
        container.className = 'lovable-unlimited-container';
        container.innerHTML = `
            <div class="lovable-panel">
                <div class="lovable-header">
                    <div class="lovable-title">
                        <span class="lovable-status-badge"></span>
                        Lovable Unlimited
                    </div>
                    <button class="lovable-close-btn" onclick="this.closest('.lovable-unlimited-container').remove()">×</button>
                </div>

                <div class="lovable-content">
                    <div class="lovable-toggle">
                        <span class="lovable-toggle-label">Auto Remix</span>
                        <div class="lovable-switch active" id="autoRemixToggle">
                            <div class="lovable-switch-thumb"></div>
                        </div>
                    </div>

                    <div class="lovable-stat">
                        <div class="lovable-stat-label">Remixes Executados</div>
                        <div class="lovable-stat-value" data-stat="remix-count">0</div>
                    </div>

                    <div class="lovable-stat">
                        <div class="lovable-stat-label">Gerações Detectadas</div>
                        <div class="lovable-stat-value" data-stat="generation-count">0</div>
                    </div>

                    <div class="lovable-stat">
                        <div class="lovable-stat-label">Tempo de Sessão</div>
                        <div class="lovable-stat-value" data-stat="session-time">0m 0s</div>
                    </div>

                    <div class="lovable-log" id="lovableLog"></div>
                </div>

                <div class="lovable-controls">
                    <button class="lovable-btn lovable-btn-primary" id="manualRemixBtn">
                        Remix Manual
                    </button>
                    <button class="lovable-btn lovable-btn-secondary" id="resetBtn">
                        Reset
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Event Listeners
        document.getElementById('autoRemixToggle').addEventListener('click', function() {
            CONFIG.autoRemixEnabled = !CONFIG.autoRemixEnabled;
            this.classList.toggle('active');
            state.isActive = CONFIG.autoRemixEnabled;
            addLog(`Auto Remix ${CONFIG.autoRemixEnabled ? 'ativado' : 'desativado'}`);
            showNotification(
                `Auto Remix ${CONFIG.autoRemixEnabled ? 'ativado' : 'desativado'}`,
                CONFIG.autoRemixEnabled ? 'success' : 'info'
            );
        });

        document.getElementById('manualRemixBtn').addEventListener('click', function() {
            if (findAndClickRemixButton()) {
                updateStats();
            } else {
                showNotification('Botão Remix não encontrado!', 'error');
                addLog('✗ Remix manual falhou');
            }
        });

        document.getElementById('resetBtn').addEventListener('click', function() {
            state.remixCount = 0;
            state.generationCount = 0;
            state.sessionStartTime = Date.now();
            updateStats();
            addLog('⟲ Estatísticas resetadas');
            showNotification('Estatísticas resetadas!', 'info');
        });

        // Atualizar stats a cada segundo
        setInterval(updateStats, 1000);

        addLog('✓ Painel carregado com sucesso');
    }

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    function init() {
        injectStyles();
        createPanel();
        monitorGenerations();
        autoRemixLoop();

        addLog('✓ Lovable Unlimited v' + CONFIG.version + ' iniciado');
        showNotification('Lovable Unlimited ativado!', 'success');

        console.log('%c[Lovable Unlimited] Script carregado com sucesso!', 'color: #667eea; font-weight: bold; font-size: 14px;');
        console.log('%c[Lovable Unlimited] Versão: ' + CONFIG.version, 'color: #667eea;');
    }

    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
