// 인증 관리 클래스
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // 저장된 사용자 정보 로드
        this.loadUserFromStorage();
        
        // 페이지별 초기화
        if (window.location.pathname.includes('login.html')) {
            this.initLoginPage();
        } else if (window.location.pathname.includes('signup.html')) {
            this.initSignupPage();
        }
    }

    // 로그인 페이지 초기화
    initLoginPage() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // 실시간 유효성 검사
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput.value, 'email-error'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword(passwordInput.value, 'password-error'));
        }
    }

    // 회원가입 페이지 초기화
    initSignupPage() {
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // 전체 동의 체크박스 처리
        const termsAll = document.getElementById('terms-all');
        const termsService = document.getElementById('terms-service');
        const termsPrivacy = document.getElementById('terms-privacy');
        const termsMarketing = document.getElementById('terms-marketing');

        if (termsAll) {
            termsAll.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                [termsService, termsPrivacy, termsMarketing].forEach(checkbox => {
                    if (checkbox) checkbox.checked = isChecked;
                });
            });
        }

        // 개별 약관 체크박스 처리
        [termsService, termsPrivacy, termsMarketing].forEach(checkbox => {
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    const allChecked = termsService?.checked && termsPrivacy?.checked && termsMarketing?.checked;
                    if (termsAll) termsAll.checked = allChecked;
                });
            }
        });

        // 실시간 유효성 검사
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('password');
        const passwordConfirmInput = document.getElementById('password-confirm');

        if (nameInput) {
            nameInput.addEventListener('blur', () => this.validateName(nameInput.value, 'name-error'));
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput.value, 'email-error'));
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => this.validatePhone(phoneInput.value, 'phone-error'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword(passwordInput.value, 'password-error'));
        }

        if (passwordConfirmInput) {
            passwordConfirmInput.addEventListener('blur', () => {
                const password = passwordInput?.value || '';
                this.validatePasswordConfirm(password, passwordConfirmInput.value, 'password-confirm-error');
            });
        }
    }

    // 로그인 처리
    async handleLogin(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('login-submit-btn');
        const btnText = document.getElementById('login-btn-text');
        const spinner = document.getElementById('login-spinner');
        
        // 로딩 상태 시작
        this.setLoadingState(submitBtn, btnText, spinner, true);

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('remember-me') === 'on';

        try {
            // 유효성 검사
            const isEmailValid = this.validateEmail(email, 'email-error');
            const isPasswordValid = this.validatePassword(password, 'password-error');

            if (!isEmailValid || !isPasswordValid) {
                throw new Error('입력 정보를 확인해주세요.');
            }

            // 로그인 시뮬레이션 (실제로는 서버 API 호출)
            await this.simulateApiCall();
            
            const success = await this.login(email, password, rememberMe);
            
            if (success) {
                this.showToast('로그인에 성공했습니다!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            // 로딩 상태 종료
            this.setLoadingState(submitBtn, btnText, spinner, false);
        }
    }

    // 회원가입 처리
    async handleSignup(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('signup-submit-btn');
        const btnText = document.getElementById('signup-btn-text');
        const spinner = document.getElementById('signup-spinner');
        
        // 로딩 상태 시작
        this.setLoadingState(submitBtn, btnText, spinner, true);

        const formData = new FormData(event.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            passwordConfirm: formData.get('password-confirm')
        };

        try {
            // 유효성 검사
            const isNameValid = this.validateName(userData.name, 'name-error');
            const isEmailValid = this.validateEmail(userData.email, 'email-error');
            const isPhoneValid = this.validatePhone(userData.phone, 'phone-error');
            const isPasswordValid = this.validatePassword(userData.password, 'password-error');
            const isPasswordConfirmValid = this.validatePasswordConfirm(userData.password, userData.passwordConfirm, 'password-confirm-error');
            const isTermsValid = this.validateTerms();

            if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isPasswordConfirmValid || !isTermsValid) {
                throw new Error('입력 정보를 확인해주세요.');
            }

            // 회원가입 시뮬레이션 (실제로는 서버 API 호출)
            await this.simulateApiCall();
            
            const success = await this.signup(userData);
            
            if (success) {
                this.showToast('회원가입이 완료되었습니다!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                throw new Error('회원가입 중 오류가 발생했습니다.');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            // 로딩 상태 종료
            this.setLoadingState(submitBtn, btnText, spinner, false);
        }
    }

    // 로그인 (실제 구현에서는 서버 API 호출)
    async login(email, password, rememberMe = false) {
        // 시뮬레이션: 특정 이메일/비밀번호 조합만 허용
        if (email === 'test@neurucare.com' && password === 'password123') {
            const user = {
                id: '1',
                name: '테스트 사용자',
                email: email,
                phone: '010-1234-5678'
            };
            
            this.currentUser = user;
            
            // 로컬 스토리지에 저장
            if (rememberMe) {
                localStorage.setItem('neurucare_user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('neurucare_user', JSON.stringify(user));
            }
            
            return true;
        }
        
        return false;
    }

    // 회원가입 (실제 구현에서는 서버 API 호출)
    async signup(userData) {
        // 시뮬레이션: 항상 성공
        const user = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone
        };
        
        // 실제로는 서버에 저장
        console.log('새 사용자 등록:', user);
        
        return true;
    }

    // 로그아웃
    async logout() {
        this.currentUser = null;
        localStorage.removeItem('neurucare_user');
        sessionStorage.removeItem('neurucare_user');
        
        this.showToast('로그아웃되었습니다.', 'info');
        
        // 메인 페이지로 이동
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // 로그인 상태 확인
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // 현재 사용자 정보 반환
    getCurrentUser() {
        return this.currentUser;
    }

    // 저장된 사용자 정보 로드
    loadUserFromStorage() {
        const userFromLocal = localStorage.getItem('neurucare_user');
        const userFromSession = sessionStorage.getItem('neurucare_user');
        
        if (userFromLocal) {
            this.currentUser = JSON.parse(userFromLocal);
        } else if (userFromSession) {
            this.currentUser = JSON.parse(userFromSession);
        }
    }

    // 유효성 검사 메서드들
    validateName(name, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        const nameInput = document.getElementById('name');
        
        if (!name || name.trim().length < 2) {
            this.showFieldError(errorElement, nameInput, '이름은 2자 이상 입력해주세요.');
            return false;
        }
        
        this.hideFieldError(errorElement, nameInput);
        return true;
    }

    validateEmail(email, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(errorElement, emailInput, '이메일을 입력해주세요.');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(errorElement, emailInput, '올바른 이메일 형식을 입력해주세요.');
            return false;
        }
        
        this.hideFieldError(errorElement, emailInput);
        return true;
    }

    validatePhone(phone, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        const phoneInput = document.getElementById('phone');
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        
        if (!phone) {
            this.showFieldError(errorElement, phoneInput, '전화번호를 입력해주세요.');
            return false;
        }
        
        if (!phoneRegex.test(phone)) {
            this.showFieldError(errorElement, phoneInput, '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
            return false;
        }
        
        this.hideFieldError(errorElement, phoneInput);
        return true;
    }

    validatePassword(password, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        const passwordInput = document.getElementById('password');
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!password) {
            this.showFieldError(errorElement, passwordInput, '비밀번호를 입력해주세요.');
            return false;
        }
        
        if (password.length < 8) {
            this.showFieldError(errorElement, passwordInput, '비밀번호는 8자 이상이어야 합니다.');
            return false;
        }
        
        if (!passwordRegex.test(password)) {
            this.showFieldError(errorElement, passwordInput, '영문, 숫자, 특수문자를 포함해야 합니다.');
            return false;
        }
        
        this.hideFieldError(errorElement, passwordInput);
        return true;
    }

    validatePasswordConfirm(password, passwordConfirm, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        const passwordConfirmInput = document.getElementById('password-confirm');
        
        if (!passwordConfirm) {
            this.showFieldError(errorElement, passwordConfirmInput, '비밀번호 확인을 입력해주세요.');
            return false;
        }
        
        if (password !== passwordConfirm) {
            this.showFieldError(errorElement, passwordConfirmInput, '비밀번호가 일치하지 않습니다.');
            return false;
        }
        
        this.hideFieldError(errorElement, passwordConfirmInput);
        return true;
    }

    validateTerms() {
        const termsService = document.getElementById('terms-service');
        const termsPrivacy = document.getElementById('terms-privacy');
        const errorElement = document.getElementById('terms-error');
        
        if (!termsService?.checked || !termsPrivacy?.checked) {
            this.showFieldError(errorElement, null, '필수 약관에 동의해주세요.');
            return false;
        }
        
        this.hideFieldError(errorElement, null);
        return true;
    }

    // 필드 에러 표시
    showFieldError(errorElement, inputElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.add('input-error');
            inputElement.classList.remove('input-success');
        }
    }

    // 필드 에러 숨김
    hideFieldError(errorElement, inputElement) {
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.remove('input-error');
            inputElement.classList.add('input-success');
        }
    }

    // 로딩 상태 설정
    setLoadingState(button, textElement, spinner, isLoading) {
        if (button) {
            button.disabled = isLoading;
        }
        
        if (textElement) {
            textElement.style.display = isLoading ? 'none' : 'inline';
        }
        
        if (spinner) {
            spinner.classList.toggle('hidden', !isLoading);
        }
    }

    // 토스트 메시지 표시
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toastMessage = document.getElementById('toast-message');
        const toastText = document.getElementById('toast-text');
        
        if (!toastContainer || !toastMessage || !toastText) return;
        
        // 타입별 스타일 설정
        toastMessage.className = 'alert';
        switch (type) {
            case 'success':
                toastMessage.classList.add('alert-success');
                break;
            case 'error':
                toastMessage.classList.add('alert-error');
                break;
            case 'warning':
                toastMessage.classList.add('alert-warning');
                break;
            default:
                toastMessage.classList.add('alert-info');
        }
        
        toastText.textContent = message;
        toastContainer.classList.remove('hidden');
        
        // 3초 후 자동 숨김
        setTimeout(() => {
            toastContainer.classList.add('hidden');
        }, 3000);
    }

    // API 호출 시뮬레이션
    async simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000 + Math.random() * 1000);
        });
    }
}

// 전역 인스턴스 생성
const authManager = new AuthManager();

// 전역 함수로 내보내기 (다른 스크립트에서 사용 가능)
window.authManager = authManager;

export default authManager;