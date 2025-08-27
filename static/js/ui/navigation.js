/**
 * GEP 네비게이션 시스템
 * 반응형 네비게이션 바, 사이드바 메뉴, 브레드크럼, 사용자 메뉴
 */

class NavigationManager {
    constructor() {
        this.currentPage = null;
        this.menuItems = [];
        this.isMobileMenuOpen = false;
        this.userMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMenuItems();
        this.createNavigationBar();
        this.setupEventListeners();
        this.updateBreadcrumb();
    }

    setupMenuItems() {
        this.menuItems = [
            {
                id: 'home',
                label: '홈',
                icon: '🏠',
                url: '/',
                active: true
            },
            {
                id: 'quiz',
                label: '문제 풀이',
                icon: '📝',
                url: '/quiz.html',
                submenu: [
                    { id: 'basic', label: '기본 모드', url: '/quiz.html?mode=basic' },
                    { id: 'random', label: '랜덤 모드', url: '/quiz.html?mode=random' },
                    { id: 'wrong', label: '틀린 문제', url: '/quiz.html?mode=wrong' },
                    { id: 'exam', label: '시험 모드', url: '/quiz.html?mode=exam' }
                ]
            },
            {
                id: 'dashboard',
                label: '통계',
                icon: '📊',
                url: '/dashboard.html'
            },
            {
                id: 'study',
                label: '학습',
                icon: '📚',
                url: '/study.html',
                submenu: [
                    { id: 'life', label: '생명보험', url: '/study.html?type=life' },
                    { id: 'damage', label: '손해보험', url: '/study.html?type=damage' },
                    { id: 'third', label: '제3보험', url: '/study.html?type=third' }
                ]
            },
            {
                id: 'profile',
                label: '프로필',
                icon: '👤',
                url: '/profile.html'
            }
        ];
    }

    createNavigationBar() {
        const nav = document.createElement('nav');
        nav.id = 'gep-navigation';
        nav.className = 'bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40';
        nav.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <!-- 로고 및 메인 메뉴 -->
                    <div class="flex">
                        <!-- 로고 -->
                        <div class="flex-shrink-0 flex items-center">
                            <a href="/" class="flex items-center space-x-2">
                                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span class="text-white font-bold text-lg">G</span>
                                </div>
                                <span class="text-xl font-bold text-gray-900">GEP</span>
                            </a>
                        </div>

                        <!-- 데스크톱 메뉴 -->
                        <div class="hidden md:ml-6 md:flex md:space-x-8">
                            ${this.menuItems.map(item => this.createDesktopMenuItem(item)).join('')}
                        </div>
                    </div>

                    <!-- 우측 메뉴 -->
                    <div class="flex items-center space-x-4">
                        <!-- 검색 -->
                        <div class="hidden md:block">
                            <div class="relative">
                                <input type="text" placeholder="문제 검색..." 
                                       class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- 알림 -->
                        <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75a6 6 0 0012 0V9.75a6 6 0 00-6-6z"></path>
                            </svg>
                            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                        </button>

                        <!-- 사용자 메뉴 -->
                        <div class="relative" id="user-menu-container">
                            <button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors" id="user-menu-button">
                                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-medium text-gray-700">사용자</span>
                                </div>
                                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden" id="user-menu-dropdown">
                                <div class="py-1">
                                    <a href="/profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">프로필</a>
                                    <a href="/settings.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">설정</a>
                                    <hr class="my-1">
                                    <button class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" id="logout-button">로그아웃</button>
                                </div>
                            </div>
                        </div>

                        <!-- 모바일 메뉴 버튼 -->
                        <button class="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors" id="mobile-menu-button">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 모바일 메뉴 -->
            <div class="md:hidden hidden" id="mobile-menu">
                <div class="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
                    ${this.menuItems.map(item => this.createMobileMenuItem(item)).join('')}
                </div>
            </div>
        `;

        // 페이지 상단에 네비게이션 삽입
        document.body.insertBefore(nav, document.body.firstChild);
    }

    createDesktopMenuItem(item) {
        const isActive = this.currentPage === item.id;
        const activeClass = isActive ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
        
        let menuHTML = `
            <a href="${item.url}" class="border-b-2 ${activeClass} px-1 pt-1 text-sm font-medium transition-colors">
                <span class="mr-1">${item.icon}</span>
                ${item.label}
            </a>
        `;

        // 서브메뉴가 있는 경우
        if (item.submenu) {
            menuHTML = `
                <div class="relative group">
                    <button class="border-b-2 ${activeClass} px-1 pt-1 text-sm font-medium transition-colors flex items-center">
                        <span class="mr-1">${item.icon}</span>
                        ${item.label}
                        <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div class="py-1">
                            ${item.submenu.map(subItem => `
                                <a href="${subItem.url}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    ${subItem.label}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        return menuHTML;
    }

    createMobileMenuItem(item) {
        const isActive = this.currentPage === item.id;
        const activeClass = isActive ? 'bg-blue-50 border-blue-500 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
        
        let menuHTML = `
            <a href="${item.url}" class="block px-3 py-2 rounded-md text-base font-medium ${activeClass} border-l-4 border-transparent">
                <span class="mr-2">${item.icon}</span>
                ${item.label}
            </a>
        `;

        // 서브메뉴가 있는 경우
        if (item.submenu) {
            menuHTML = `
                <div class="space-y-1">
                    <div class="px-3 py-2 text-base font-medium text-gray-600 border-l-4 border-transparent">
                        <span class="mr-2">${item.icon}</span>
                        ${item.label}
                    </div>
                    ${item.submenu.map(subItem => `
                        <a href="${subItem.url}" class="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                            ${subItem.label}
                        </a>
                    `).join('')}
                </div>
            `;
        }

        return menuHTML;
    }

    setupEventListeners() {
        // 모바일 메뉴 토글
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // 사용자 메뉴 토글
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        
        if (userMenuButton && userMenuDropdown) {
            userMenuButton.addEventListener('click', () => {
                this.toggleUserMenu();
            });

            // 외부 클릭 시 메뉴 닫기
            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                    this.closeUserMenu();
                }
            });
        }

        // 로그아웃 버튼
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // 검색 기능
        const searchInput = document.querySelector('#gep-navigation input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // 페이지 전환 시 현재 페이지 업데이트
        window.addEventListener('popstate', () => {
            this.updateCurrentPage();
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            mobileMenu.classList.toggle('hidden', !this.isMobileMenuOpen);
        }
    }

    toggleUserMenu() {
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        if (userMenuDropdown) {
            this.userMenuOpen = !this.userMenuOpen;
            userMenuDropdown.classList.toggle('hidden', !this.userMenuOpen);
        }
    }

    closeUserMenu() {
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        if (userMenuDropdown) {
            this.userMenuOpen = false;
            userMenuDropdown.classList.add('hidden');
        }
    }

    handleLogout() {
        showModal('로그아웃하시겠습니까?', {
            title: '로그아웃',
            type: 'warning',
            confirmText: '로그아웃',
            cancelText: '취소',
            onConfirm: () => {
                // 로그아웃 로직
                localStorage.removeItem('gep_user_data');
                window.location.href = '/auth.html';
            }
        });
    }

    handleSearch(query) {
        if (query.length > 0) {
            // 검색 로직 구현
            console.log('검색:', query);
            // TODO: 검색 결과 표시
        }
    }

    navigateTo(page) {
        this.currentPage = page;
        this.updateBreadcrumb();
        this.updateActiveMenu();
        
        // 페이지 전환 애니메이션
        document.body.classList.add('page-transition');
        setTimeout(() => {
            document.body.classList.remove('page-transition');
        }, 300);
    }

    updateCurrentPage() {
        const path = window.location.pathname;
        const pageMap = {
            '/': 'home',
            '/quiz.html': 'quiz',
            '/dashboard.html': 'dashboard',
            '/study.html': 'study',
            '/profile.html': 'profile',
            '/auth.html': 'auth'
        };
        
        this.currentPage = pageMap[path] || 'home';
        this.updateActiveMenu();
        this.updateBreadcrumb();
    }

    updateActiveMenu() {
        // 데스크톱 메뉴 활성화 상태 업데이트
        const desktopMenuItems = document.querySelectorAll('#gep-navigation .md\\:flex a');
        desktopMenuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === window.location.pathname) {
                item.classList.add('border-blue-500', 'text-gray-900');
                item.classList.remove('border-transparent', 'text-gray-500');
            } else {
                item.classList.remove('border-blue-500', 'text-gray-900');
                item.classList.add('border-transparent', 'text-gray-500');
            }
        });

        // 모바일 메뉴 활성화 상태 업데이트
        const mobileMenuItems = document.querySelectorAll('#mobile-menu a');
        mobileMenuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === window.location.pathname) {
                item.classList.add('bg-blue-50', 'border-blue-500', 'text-blue-700');
                item.classList.remove('text-gray-600');
            } else {
                item.classList.remove('bg-blue-50', 'border-blue-500', 'text-blue-700');
                item.classList.add('text-gray-600');
            }
        });
    }

    updateBreadcrumb() {
        // 브레드크럼 컨테이너 생성 또는 업데이트
        let breadcrumbContainer = document.getElementById('gep-breadcrumb');
        if (!breadcrumbContainer) {
            breadcrumbContainer = document.createElement('div');
            breadcrumbContainer.id = 'gep-breadcrumb';
            breadcrumbContainer.className = 'bg-gray-50 border-b border-gray-200';
            
            // 네비게이션 바로 이동
            const nav = document.getElementById('gep-navigation');
            if (nav) {
                nav.parentNode.insertBefore(breadcrumbContainer, nav.nextSibling);
            }
        }

        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbContainer.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="py-3">
                    <nav class="flex" aria-label="Breadcrumb">
                        <ol class="flex items-center space-x-4">
                            ${breadcrumbs.map((crumb, index) => `
                                <li class="flex items-center">
                                    ${index > 0 ? '<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' : ''}
                                    <a href="${crumb.url}" class="text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-gray-500' : 'text-gray-700 hover:text-gray-900'}">
                                        ${crumb.label}
                                    </a>
                                </li>
                            `).join('')}
                        </ol>
                    </nav>
                </div>
            </div>
        `;
    }

    generateBreadcrumbs() {
        const breadcrumbs = [
            { label: '홈', url: '/' }
        ];

        const currentItem = this.menuItems.find(item => item.id === this.currentPage);
        if (currentItem) {
            breadcrumbs.push({
                label: currentItem.label,
                url: currentItem.url
            });
        }

        return breadcrumbs;
    }

    // 페이지 전환 애니메이션
    setupPageTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            .page-transition {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease-out;
            }
            
            .page-transition.loaded {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// 전역 인스턴스 생성
window.NavigationManager = new NavigationManager();

// 편의 함수들
window.navigateTo = (page) => window.NavigationManager.navigateTo(page);
window.updateBreadcrumb = () => window.NavigationManager.updateBreadcrumb();

