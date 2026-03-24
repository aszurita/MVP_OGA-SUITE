/**
 * EXCALIDRAW MANAGER - Versión Iframe (Más confiable)
 */

const ExcalidrawManager = {
    iframe: null,
    isInitialized: false,

    // ========================================
    // 1. INICIALIZACIÓN
    // ========================================
    init: function() {
        if (this.isInitialized) {
            console.log('⚠️ Excalidraw ya inicializado');
            return;
        }

        this.iframe = document.getElementById('excalidrawIframe');
        
        if (!this.iframe) {
            console.error('❌ Iframe de Excalidraw no encontrado');
            return;
        }

        this.initEventListeners();
        this.isInitialized = true;
        
        console.log('✅ Excalidraw Manager (iframe) inicializado');
    },

    // ========================================
    // 2. EVENT LISTENERS
    // ========================================
    initEventListeners: function() {
        // Botón Fullscreen
        const btnFullscreen = document.getElementById('btnFullscreenExcalidraw');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
        }
    },

    // ========================================
    // 4. PANTALLA COMPLETA
    // ========================================
    toggleFullscreen: function() {
        const container = this.iframe.parentElement;
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().then(() => {
                this.showToast('Modo pantalla completa', 'success');
            }).catch(err => {
                console.error('Error fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    },

    // ========================================
    // 5. TOAST NOTIFICATION
    // ========================================
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: ${type === 'success' ? '#00b894' : '#333'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// ========================================
// EXPORTAR
// ========================================
window.ExcalidrawManager = ExcalidrawManager;

console.log('📦 Excalidraw Manager (iframe) cargado');