// neurucare 메인 애플리케이션

class MainApp {
    constructor() {
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.productData = {
            product1: {
                name: '하이드라 에센스',
                price: '89,000원',
                description: '히알루론산과 천연 보습 성분으로 깊은 수분 공급을 제공하는 프리미엄 에센스입니다.',
                benefits: ['깊은 보습', '피부 진정', '탄력 개선', '수분 장벽 강화'],
                ingredients: ['히알루론산', '세라마이드', '판테놀', '알로에 베라'],
                usage: '세안 후 토너 사용 후, 적당량을 손바닥에 덜어 얼굴 전체에 부드럽게 발라줍니다.'
            },
            product2: {
                name: '리뉴얼 크림',
                price: '125,000원',
                description: '콜라겐과 펩타이드 성분으로 주름 개선과 탄력 증진에 도움을 주는 안티에이징 크림입니다.',
                benefits: ['주름 개선', '탄력 증진', '영양 공급', '피부 재생'],
                ingredients: ['콜라겐', '펩타이드', '레티놀', '비타민E'],
                usage: '에센스 사용 후, 적당량을 얼굴 전체에 발라 부드럽게 마사지해줍니다.'
            },
            product3: {
                name: '브라이트닝 세럼',
                price: '98,000원',
                description: '글루타치온과 비타민C로 기미, 잡티를 집중 케어하여 맑고 투명한 피부로 가꿔주는 세럼입니다.',
                benefits: ['미백 효과', '기미 개선', '브라이트닝', '피부톤 균일화'],
                ingredients: ['글루타치온', '비타민C', '나이아신아마이드', '알부틴'],
                usage: '저녁 스킨케어 시 에센스 후 사용하며, 자외선 차단제와 함께 사용하세요.'
            }
        };
    }

    async init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupSmoothScroll();
        this.updateUserInterface();
        await this.animateHeroSection();
    }

    setupEventListeners() {
        // 윈도우 스크롤 이벤트
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
        
        // 네비게이션 클릭 이벤트
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // CTA 버튼 이벤트
        document.querySelectorAll('.hero .btn').forEach(btn => {
            btn.addEventListener('click', this.handleCTAClick.bind(this));
        });

        // 로그아웃 버튼 이벤트 (동적으로 생성되는 경우)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                this.handleLogout();
            }
        });
    }

    setupScrollAnimations() {
        // Intersection Observer 설정
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // 애니메이션 대상 요소들 관찰
        document.querySelectorAll('.brand-card, .product-card, .philosophy-content, .philosophy-image').forEach(el => {
            observer.observe(el);
        });
    }

    setupSmoothScroll() {
        // 부드러운 스크롤 폴리필
        if (!('scrollBehavior' in document.documentElement.style)) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
            document.head.appendChild(script);
        }
    }

    // 사용자 인터페이스 업데이트 (로그인 상태에 따라)
    updateUserInterface() {
        if (window.authManager && window.authManager.isLoggedIn()) {
            const user = window.authManager.getCurrentUser();
            this.showLoggedInState(user);
        } else {
            this.showLoggedOutState();
        }
    }

    // 로그인 상태 UI
    showLoggedInState(user) {
        const navbarEnd = document.querySelector('.navbar-end');
        if (navbarEnd) {
            // 기존 로그인/회원가입 버튼들 숨기기
            const loginLinks = navbarEnd.querySelectorAll('a[href="login.html"], a[href="signup.html"]');
            loginLinks.forEach(link => link.style.display = 'none');

            // 사용자 정보 표시
            const userInfo = document.createElement('div');
            userInfo.className = 'flex items-center gap-2 mr-4';
            userInfo.innerHTML = `
                <span class="text-text-dark text-sm">안녕하세요, ${user.name}님</span>
                <button id="logout-btn" class="btn btn-ghost btn-sm text-text-light hover:text-primary-brown">
                    로그아웃
                </button>
            `;
            navbarEnd.insertBefore(userInfo, navbarEnd.firstChild);
        }
    }

    // 로그아웃 상태 UI
    showLoggedOutState() {
        const navbarEnd = document.querySelector('.navbar-end');
        if (navbarEnd) {
            // 사용자 정보 제거
            const userInfo = navbarEnd.querySelector('.flex.items-center');
            if (userInfo) {
                userInfo.remove();
            }

            // 로그인/회원가입 버튼들 다시 표시
            const loginLinks = navbarEnd.querySelectorAll('a[href="login.html"], a[href="signup.html"]');
            loginLinks.forEach(link => link.style.display = '');
        }
    }

    // 로그아웃 처리
    async handleLogout() {
        if (window.authManager) {
            await window.authManager.logout();
            this.updateUserInterface();
        }
    }

    async animateHeroSection() {
        await this.delay(500);
        const heroAnimation = document.querySelector('.hero-animation');
        if (heroAnimation) {
            heroAnimation.classList.add('animate');
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const header = document.getElementById('header');
        
        // 헤더 스크롤 효과
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 패럴랙스 효과
        this.updateParallax(scrollY);
    }

    updateParallax(scrollY) {
        const hero = document.getElementById('hero');
        if (hero) {
            const speed = scrollY * 0.5;
            hero.style.transform = `translateY(${speed}px)`;
        }
    }

    handleResize() {
        // 반응형 처리
        this.updateResponsiveElements();
    }

    updateResponsiveElements() {
        const isMobile = window.innerWidth < 768;
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            if (isMobile) {
                card.classList.add('card-compact');
            } else {
                card.classList.remove('card-compact');
            }
        });
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleCTAClick(e) {
        const buttonText = e.target.textContent.trim();
        
        if (buttonText === '제품 둘러보기') {
            this.scrollToSection('#products');
        } else if (buttonText === '브랜드 스토리') {
            this.scrollToSection('#brand-story');
        }
    }

    scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    animateElement(element) {
        element.classList.add('animate');
        
        // 추가 애니메이션 효과
        if (element.classList.contains('product-card')) {
            this.animateProductCard(element);
        }
    }

    async animateProductCard(card) {
        await this.delay(200);
        const badges = card.querySelectorAll('.badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.animation = 'fadeInUp 0.5s ease-out forwards';
            }, index * 100);
        });
    }

    // 유틸리티 함수들
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 제품 모달 관련 함수들
    showProductModal(productId) {
        const product = this.productData[productId];
        if (!product) return;

        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = this.generateModalContent(product);
        
        const modal = document.getElementById('product_modal');
        modal.showModal();
        
        // 모달 애니메이션
        this.animateModal();
    }

    generateModalContent(product) {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <div class="w-32 h-32 bg-gradient-to-br from-light-brown to-cream rounded-full flex items-center justify-center mx-auto mb-4">
                        <div class="text-6xl text-primary-brown">
                            ${product.name.includes('에센스') ? '🧴' : product.name.includes('크림') ? '🫙' : '✨'}
                        </div>
                    </div>
                    <h3 class="text-3xl font-bold text-text-dark mb-2">${product.name}</h3>
                    <p class="text-2xl font-bold text-primary-brown mb-4">${product.price}</p>
                </div>
                
                <div class="bg-cream p-4 rounded-lg">
                    <p class="text-text-light leading-relaxed">${product.description}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white p-4 rounded-lg">
                        <h4 class="font-bold text-text-dark mb-3">주요 효능</h4>
                        <ul class="space-y-1">
                            ${product.benefits.map(benefit => `<li class="text-text-light text-sm">• ${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="bg-white p-4 rounded-lg">
                        <h4 class="font-bold text-text-dark mb-3">주요 성분</h4>
                        <ul class="space-y-1">
                            ${product.ingredients.map(ingredient => `<li class="text-text-light text-sm">• ${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="bg-light-brown bg-opacity-20 p-4 rounded-lg">
                    <h4 class="font-bold text-text-dark mb-2">사용법</h4>
                    <p class="text-text-light text-sm leading-relaxed">${product.usage}</p>
                </div>
                
                <div class="flex gap-3 justify-center">
                    <button class="btn bg-primary-brown text-white hover:bg-dark-brown border-none px-8">
                        구매하기
                    </button>
                    <button class="btn btn-outline border-primary-brown text-primary-brown hover:bg-primary-brown hover:text-white px-8">
                        장바구니
                    </button>
                </div>
            </div>
        `;
    }

    async animateModal() {
        const modal = document.getElementById('product_modal');
        const modalBox = modal.querySelector('.modal-box');
        
        if (modalBox) {
            modalBox.style.opacity = '0';
            modalBox.style.transform = 'scale(0.9) translateY(20px)';
            
            await this.delay(50);
            
            modalBox.style.transition = 'all 0.3s ease-out';
            modalBox.style.opacity = '1';
            modalBox.style.transform = 'scale(1) translateY(0)';
        }
    }

    // 에러 처리
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // 사용자에게 친화적인 에러 메시지 표시
        if (window.authManager) {
            window.authManager.showToast('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
        }
    }

    // 성능 최적화를 위한 이미지 지연 로딩
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// 전역 함수들 (HTML에서 직접 호출)
function showProductModal(productId) {
    if (window.mainApp) {
        window.mainApp.showProductModal(productId);
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const mainApp = new MainApp();
        window.mainApp = mainApp;
        await mainApp.init();
        
        console.log('neurucare 웹사이트가 성공적으로 로드되었습니다.');
    } catch (error) {
        console.error('앱 초기화 중 오류 발생:', error);
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    // 필요한 정리 작업 수행
    console.log('페이지를 떠납니다.');
});

export default MainApp;