/**
 * GEP UI 공통 컴포넌트 시스템
 * 모달, 토스트, 로딩, 버튼, 카드, 폼 컴포넌트
 */

class UIComponents {
    constructor() {
        this.modalContainer = null;
        this.toastContainer = null;
        this.loadingOverlay = null;
        this.init();
    }

    init() {
        this.createModalContainer();
        this.createToastContainer();
        this.createLoadingOverlay();
        this.setupGlobalStyles();
    }

    // ===== 모달 시스템 =====
    createModalContainer() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'gep-modal-container';
        this.modalContainer.className = 'fixed inset-0 z-50 hidden';
        this.modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
            <div class="flex items-center justify-center min-h-screen p-4">
                <div id="gep-modal-content" class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                    <div id="gep-modal-header" class="flex items-center justify-between p-6 border-b">
                        <h3 id="gep-modal-title" class="text-lg font-semibold text-gray-900"></h3>
                        <button id="gep-modal-close" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="gep-modal-body" class="p-6"></div>
                    <div id="gep-modal-footer" class="flex justify-end gap-3 p-6 border-t"></div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modalContainer);
        
        // 모달 닫기 이벤트
        this.modalContainer.querySelector('#gep-modal-close').addEventListener('click', () => {
            this.hideModal();
        });
        
        // 배경 클릭 시 닫기
        this.modalContainer.querySelector('.bg-black').addEventListener('click', () => {
            this.hideModal();
        });
    }

    showModal(content, options = {}) {
        const {
            title = '알림',
            type = 'info', // info, success, warning, error
            showFooter = true,
            confirmText = '확인',
            cancelText = '취소',
            onConfirm = null,
            onCancel = null,
            size = 'md' // sm, md, lg, xl
        } = options;

        const modalContent = this.modalContainer.querySelector('#gep-modal-content');
        const modalTitle = this.modalContainer.querySelector('#gep-modal-title');
        const modalBody = this.modalContainer.querySelector('#gep-modal-body');
        const modalFooter = this.modalContainer.querySelector('#gep-modal-footer');

        // 크기 설정
        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl'
        };
        modalContent.className = `bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 transform transition-all`;

        // 제목 설정
        modalTitle.textContent = title;

        // 내용 설정
        if (typeof content === 'string') {
            modalBody.innerHTML = content;
        } else {
            modalBody.innerHTML = '';
            modalBody.appendChild(content);
        }

        // 푸터 설정
        modalFooter.innerHTML = '';
        if (showFooter) {
            if (onCancel) {
                const cancelBtn = this.createButton(cancelText, 'secondary', () => {
                    this.hideModal();
                    if (onCancel) onCancel();
                });
                modalFooter.appendChild(cancelBtn);
            }

            const confirmBtn = this.createButton(confirmText, type, () => {
                this.hideModal();
                if (onConfirm) onConfirm();
            });
            modalFooter.appendChild(confirmBtn);
        }

        // 모달 표시
        this.modalContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modalContainer.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // ===== 토스트 알림 시스템 =====
    createToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'gep-toast-container';
        this.toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.toastContainer);
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const typeClasses = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };

        const iconMap = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.className = `flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${typeClasses[type]}`;
        toast.innerHTML = `
            <span class="mr-2 font-bold">${iconMap[type]}</span>
            <span>${message}</span>
            <button class="ml-auto text-white hover:text-gray-200 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        this.toastContainer.appendChild(toast);

        // 닫기 버튼 이벤트
        toast.querySelector('button').addEventListener('click', () => {
            this.hideToast(toast);
        });

        // 애니메이션 표시
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // 자동 숨김
        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);
        }
    }

    hideToast(toast) {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // ===== 로딩 시스템 =====
    createLoadingOverlay() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.id = 'gep-loading-overlay';
        this.loadingOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center';
        this.loadingOverlay.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex flex-col items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p class="text-gray-700 font-medium">로딩 중...</p>
            </div>
        `;
        document.body.appendChild(this.loadingOverlay);
    }

    showLoading(message = '로딩 중...') {
        this.loadingOverlay.querySelector('p').textContent = message;
        this.loadingOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // ===== 버튼 컴포넌트 =====
    createButton(text, type = 'primary', onClick = null, options = {}) {
        const {
            size = 'md', // sm, md, lg
            disabled = false,
            loading = false,
            icon = null,
            className = ''
        } = options;

        const button = document.createElement('button');
        
        const typeClasses = {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
            success: 'bg-green-500 hover:bg-green-600 text-white',
            danger: 'bg-red-500 hover:bg-red-600 text-white',
            warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
            outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700'
        };

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg'
        };

        button.className = `inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeClasses[type]} ${sizeClasses[size]} ${className}`;
        
        if (disabled) {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
        }

        if (loading) {
            button.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${text}
            `;
        } else {
            if (icon) {
                button.innerHTML = `${icon} ${text}`;
            } else {
                button.textContent = text;
            }
        }

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    // ===== 카드 컴포넌트 =====
    createCard(options = {}) {
        const {
            title = '',
            subtitle = '',
            content = '',
            footer = '',
            className = '',
            headerActions = []
        } = options;

        const card = document.createElement('div');
        card.className = `bg-white rounded-lg shadow-md border border-gray-200 ${className}`;

        let headerHTML = '';
        if (title || subtitle || headerActions.length > 0) {
            headerHTML = `
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            ${title ? `<h3 class="text-lg font-semibold text-gray-900">${title}</h3>` : ''}
                            ${subtitle ? `<p class="text-sm text-gray-600 mt-1">${subtitle}</p>` : ''}
                        </div>
                        ${headerActions.length > 0 ? `<div class="flex items-center space-x-2">${headerActions.map(action => action.outerHTML).join('')}</div>` : ''}
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            ${headerHTML}
            <div class="px-6 py-4">
                ${content}
            </div>
            ${footer ? `<div class="px-6 py-4 border-t border-gray-200 bg-gray-50">${footer}</div>` : ''}
        `;

        return card;
    }

    // ===== 폼 컴포넌트 =====
    createInput(options = {}) {
        const {
            type = 'text',
            placeholder = '',
            value = '',
            name = '',
            id = '',
            required = false,
            disabled = false,
            className = '',
            label = '',
            error = ''
        } = options;

        const container = document.createElement('div');
        container.className = 'mb-4';

        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'block text-sm font-medium text-gray-700 mb-1';
            labelElement.textContent = label;
            if (id) labelElement.setAttribute('for', id);
            container.appendChild(labelElement);
        }

        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.value = value;
        input.name = name;
        if (id) input.id = id;
        input.required = required;
        input.disabled = disabled;
        
        input.className = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`;
        
        if (error) {
            input.classList.add('border-red-500');
        }

        container.appendChild(input);

        if (error) {
            const errorElement = document.createElement('p');
            errorElement.className = 'mt-1 text-sm text-red-600';
            errorElement.textContent = error;
            container.appendChild(errorElement);
        }

        return container;
    }

    createSelect(options = {}) {
        const {
            options: selectOptions = [],
            placeholder = '선택하세요',
            value = '',
            name = '',
            id = '',
            required = false,
            disabled = false,
            className = '',
            label = '',
            error = ''
        } = options;

        const container = document.createElement('div');
        container.className = 'mb-4';

        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'block text-sm font-medium text-gray-700 mb-1';
            labelElement.textContent = label;
            if (id) labelElement.setAttribute('for', id);
            container.appendChild(labelElement);
        }

        const select = document.createElement('select');
        select.name = name;
        if (id) select.id = id;
        select.required = required;
        select.disabled = disabled;
        
        select.className = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`;
        
        if (error) {
            select.classList.add('border-red-500');
        }

        // 기본 옵션
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = placeholder;
        defaultOption.disabled = true;
        defaultOption.selected = !value;
        select.appendChild(defaultOption);

        // 옵션들 추가
        selectOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            optionElement.selected = option.value === value;
            select.appendChild(optionElement);
        });

        container.appendChild(select);

        if (error) {
            const errorElement = document.createElement('p');
            errorElement.className = 'mt-1 text-sm text-red-600';
            errorElement.textContent = error;
            container.appendChild(errorElement);
        }

        return container;
    }

    createTextarea(options = {}) {
        const {
            placeholder = '',
            value = '',
            name = '',
            id = '',
            rows = 4,
            required = false,
            disabled = false,
            className = '',
            label = '',
            error = ''
        } = options;

        const container = document.createElement('div');
        container.className = 'mb-4';

        if (label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'block text-sm font-medium text-gray-700 mb-1';
            labelElement.textContent = label;
            if (id) labelElement.setAttribute('for', id);
            container.appendChild(labelElement);
        }

        const textarea = document.createElement('textarea');
        textarea.placeholder = placeholder;
        textarea.value = value;
        textarea.name = name;
        textarea.rows = rows;
        if (id) textarea.id = id;
        textarea.required = required;
        textarea.disabled = disabled;
        
        textarea.className = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`;
        
        if (error) {
            textarea.classList.add('border-red-500');
        }

        container.appendChild(textarea);

        if (error) {
            const errorElement = document.createElement('p');
            errorElement.className = 'mt-1 text-sm text-red-600';
            errorElement.textContent = error;
            container.appendChild(errorElement);
        }

        return container;
    }

    createCheckbox(options = {}) {
        const {
            label = '',
            checked = false,
            name = '',
            id = '',
            required = false,
            disabled = false,
            className = ''
        } = options;

        const container = document.createElement('div');
        container.className = `flex items-center ${className}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.name = name;
        if (id) checkbox.id = id;
        checkbox.required = required;
        checkbox.disabled = disabled;
        checkbox.className = 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';

        const labelElement = document.createElement('label');
        labelElement.className = 'ml-2 block text-sm text-gray-900';
        labelElement.textContent = label;
        if (id) labelElement.setAttribute('for', id);

        container.appendChild(checkbox);
        container.appendChild(labelElement);

        return container;
    }

    // ===== 전역 스타일 설정 =====
    setupGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* GEP UI 전역 스타일 */
            .gep-fade-in {
                animation: fadeIn 0.3s ease-in-out;
            }
            
            .gep-slide-up {
                animation: slideUp 0.3s ease-out;
            }
            
            .gep-scale-in {
                animation: scaleIn 0.2s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            /* 스크롤바 스타일링 */
            ::-webkit-scrollbar {
                width: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        `;
        document.head.appendChild(style);
    }
}

// 전역 인스턴스 생성
window.UIComponents = new UIComponents();

// 편의 함수들
window.showModal = (content, options) => window.UIComponents.showModal(content, options);
window.hideModal = () => window.UIComponents.hideModal();
window.showToast = (message, type, duration) => window.UIComponents.showToast(message, type, duration);
window.showLoading = (message) => window.UIComponents.showLoading(message);
window.hideLoading = () => window.UIComponents.hideLoading();

