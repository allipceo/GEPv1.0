/**
 * GEP 대문 페이지 기능
 * 스크롤 애니메이션, 통계 카운터, 호버 효과, 반응형 최적화
 */

class LandingPage {
    constructor() {
        this.isInitialized = false;
        this.counters = [];
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupHoverEffects();
        this.setupResponsiveOptimizations();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('✅ LandingPage 초기화 완료');
    }

    // ===== 스크롤 애니메이션 =====
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('gep-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // 애니메이션 대상 요소들
        const animatedElements = document.querySelectorAll(`
            .gep-card,
            .gep-heading-2,
            .gep-heading-3,
            .gep-heading-4,
            .gep-text-large,
            .gep-btn
        `);

        animatedElements.forEach(el => {
            el.classList.add('opacity-0', 'transform', 'translate-y-8');
            observer.observe(el);
        });

        // 스크롤 진행률 표시
        this.setupScrollProgress();
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.className = 'fixed top-0 left-0 w-0 h-1 bg-blue-600 z-50 transition-all duration-300';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // ===== 통계 카운터 애니메이션 =====
    setupCounterAnimations() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const counterElements = document.querySelectorAll('[data-counter]');
        counterElements.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000; // 2초
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // 숫자 포맷팅
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ===== 호버 효과 =====
    setupHoverEffects() {
        // 카드 호버 효과
        const cards = document.querySelectorAll('.gep-card-hover');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });

        // 버튼 호버 효과
        const buttons = document.querySelectorAll('.gep-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });

        // 시험 유형 카드 특별 효과
        const examCards = document.querySelectorAll('.group');
        examCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    // ===== 반응형 최적화 =====
    setupResponsiveOptimizations() {
        // 이미지 지연 로딩
        this.setupLazyLoading();
        
        // 반응형 이미지 최적화
        this.setupResponsiveImages();
        
        // 터치 디바이스 최적화
        this.setupTouchOptimizations();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('opacity-0');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            imageObserver.observe(img);
        });
    }

    setupResponsiveImages() {
        // 뷰포트 크기에 따른 이미지 최적화
        const updateImages = () => {
            const width = window.innerWidth;
            const images = document.querySelectorAll('img[data-srcset]');
            
            images.forEach(img => {
                const srcset = img.dataset.srcset;
                const sizes = srcset.split(',');
                
                let bestSrc = sizes[0].split(' ')[0]; // 기본값
                
                sizes.forEach(size => {
                    const [src, w] = size.trim().split(' ');
                    const imgWidth = parseInt(w);
                    if (imgWidth <= width && imgWidth > parseInt(bestSrc.split(' ')[1] || 0)) {
                        bestSrc = src;
                    }
                });
                
                img.src = bestSrc;
            });
        };

        window.addEventListener('resize', updateImages);
        updateImages(); // 초기 실행
    }

    setupTouchOptimizations() {
        // 터치 디바이스에서 호버 효과 비활성화
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // 터치 디바이스용 스타일 추가
            const style = document.createElement('style');
            style.textContent = `
                .touch-device .gep-card-hover:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }
                
                .touch-device .gep-btn:hover {
                    transform: none !important;
                }
                
                .touch-device .group:hover i {
                    transform: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== 이벤트 리스너 =====
    setupEventListeners() {
        // 스무스 스크롤
        this.setupSmoothScroll();
        
        // 키보드 네비게이션
        this.setupKeyboardNavigation();
        
        // 성능 모니터링
        this.setupPerformanceMonitoring();
    }

    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC 키로 모달 닫기
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                    }
                });
            }
        });
    }

    setupPerformanceMonitoring() {
        // 페이지 로드 성능 측정
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`페이지 로드 시간: ${loadTime.toFixed(2)}ms`);
            
            // 성능 지표가 좋지 않으면 경고
            if (loadTime > 3000) {
                console.warn('페이지 로드 시간이 3초를 초과했습니다.');
            }
        });
    }

    // ===== 유틸리티 메서드 =====
    
    // 학습 시작
    startLearning() {
        showLoading('학습 페이지로 이동 중...');
        
        // 사용자 인증 확인
        const userData = localStorage.getItem('gep_user_data');
        if (!userData) {
            hideLoading();
            showModal('로그인이 필요합니다.', {
                title: '로그인',
                type: 'info',
                confirmText: '로그인',
                cancelText: '취소',
                onConfirm: () => {
                    window.location.href = '/auth.html';
                }
            });
            return;
        }

        // 학습 페이지로 이동
        setTimeout(() => {
            hideLoading();
            window.location.href = '/quiz.html';
        }, 1000);
    }

    // 데모 보기
    showDemo() {
        showModal(`
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-play text-2xl text-blue-600"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">GEP 데모</h3>
                <p class="text-gray-600 mb-4">
                    문제 풀이 과정을 미리 체험해보세요.
                </p>
                <div class="bg-gray-100 p-4 rounded-lg text-left text-sm">
                    <p class="mb-2"><strong>1.</strong> 문제 풀이 모드 선택</p>
                    <p class="mb-2"><strong>2.</strong> 답안 선택 및 제출</p>
                    <p class="mb-2"><strong>3.</strong> 정답 확인 및 해설</p>
                    <p><strong>4.</strong> 통계 및 분석 확인</p>
                </div>
            </div>
        `, {
            title: '데모 보기',
            type: 'info',
            confirmText: '데모 시작',
            cancelText: '취소',
            onConfirm: () => {
                window.location.href = '/quiz.html?demo=true';
            }
        });
    }

    // 시험 유형별 네비게이션
    navigateToExam(type) {
        const examTypes = {
            broker: { name: '보험중개사', color: 'violet' },
            assessor: { name: '보험심사역', color: 'orange' },
            adjuster: { name: '손해사정사', color: 'pink' }
        };

        const exam = examTypes[type];
        if (!exam) return;

        showToast(`${exam.name} 학습을 시작합니다!`, 'success');
        
        setTimeout(() => {
            window.location.href = `/quiz.html?type=${type}`;
        }, 1500);
    }

    // 통계 업데이트
    updateStatistics() {
        // 실시간 통계 업데이트 (API 호출 시뮬레이션)
        const stats = {
            students: 15000 + Math.floor(Math.random() * 1000),
            questions: 1440,
            passRate: 95 + Math.floor(Math.random() * 5),
            hours: 24
        };

        Object.keys(stats).forEach(key => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element) {
                element.textContent = stats[key].toLocaleString();
            }
        });
    }

    // 검색 기능
    setupSearch() {
        const searchInput = document.querySelector('#search-input');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 0) {
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            }
        });
    }

    performSearch(query) {
        // 검색 로직 구현
        console.log('검색:', query);
        
        // 검색 결과 표시 (예시)
        showToast(`"${query}" 검색 결과를 찾았습니다.`, 'info');
    }

    // 접근성 개선
    setupAccessibility() {
        // 스킵 링크 추가
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = '메인 콘텐츠로 건너뛰기';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // ARIA 라벨 추가
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                const text = button.textContent.trim();
                if (text) {
                    button.setAttribute('aria-label', text);
                }
            }
        });
    }
}

// 전역 함수들
window.startLearning = () => {
    if (window.landingPage) {
        window.landingPage.startLearning();
    }
};

window.showDemo = () => {
    if (window.landingPage) {
        window.landingPage.showDemo();
    }
};

window.navigateToExam = (type) => {
    if (window.landingPage) {
        window.landingPage.navigateToExam(type);
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.landingPage = new LandingPage();
    
    // 접근성 설정
    window.landingPage.setupAccessibility();
    
    // 검색 기능 설정
    window.landingPage.setupSearch();
    
    console.log('🚀 GEP 대문 페이지 로드 완료');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    // 메모리 정리
    if (window.landingPage) {
        window.landingPage = null;
    }
});

