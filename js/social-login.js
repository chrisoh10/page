/* global Kakao, google */

// 소셜 로그인 관리 클래스
class SocialLoginManager {
    constructor() {
        this.kakaoAppKey = 'YOUR_KAKAO_APP_KEY'; // 실제 앱 키로 교체 필요
        this.googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // 실제 클라이언트 ID로 교체 필요
        this.init();
    }

    init() {
        this.initKakaoSDK();
        this.initGoogleSDK();
        this.bindEvents();
    }

    // 카카오 SDK 초기화
    initKakaoSDK() {
        if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
            // 실제 환경에서는 실제 앱 키를 사용해야 합니다
            // Kakao.init(this.kakaoAppKey);
            console.log('카카오 SDK 초기화 (데모 모드)');
        }
    }

    // 구글 SDK 초기화
    initGoogleSDK() {
        if (typeof google !== 'undefined') {
            // 실제 환경에서는 실제 클라이언트 ID를 사용해야 합니다
            console.log('구글 SDK 초기화 (데모 모드)');
        }
    }

    // 이벤트 바인딩
    bindEvents() {
        // 카카오 로그인 버튼
        const kakaoLoginBtn = document.getElementById('kakao-login-btn');
        const kakaoSignupBtn = document.getElementById('kakao-signup-btn');
        
        if (kakaoLoginBtn) {
            kakaoLoginBtn.addEventListener('click', () => this.loginWithKakao());
        }
        
        if (kakaoSignupBtn) {
            kakaoSignupBtn.addEventListener('click', () => this.signupWithKakao());
        }

        // 구글 로그인 버튼
        const googleLoginBtn = document.getElementById('google-login-btn');
        const googleSignupBtn = document.getElementById('google-signup-btn');
        
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.loginWithGoogle());
        }
        
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', () => this.signupWithGoogle());
        }
    }

    // 카카오 로그인
    async loginWithKakao() {
        try {
            this.showLoadingState('kakao-login-btn', true);
            
            // 실제 환경에서는 Kakao SDK를 사용
            // const response = await this.kakaoLogin();
            
            // 데모용 시뮬레이션
            await this.simulateApiCall();
            const success = await this.simulateKakaoLogin();
            
            if (success) {
                window.authManager.showToast('카카오 로그인에 성공했습니다!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                throw new Error('카카오 로그인에 실패했습니다.');
            }
        } catch (error) {
            window.authManager.showToast(error.message, 'error');
        } finally {
            this.showLoadingState('kakao-login-btn', false);
        }
    }

    // 카카오 회원가입
    async signupWithKakao() {
        try {
            this.showLoadingState('kakao-signup-btn', true);
            
            // 실제 환경에서는 Kakao SDK를 사용
            // const response = await this.kakaoLogin();
            
            // 데모용 시뮬레이션
            await this.simulateApiCall();
            const success = await this.simulateKakaoSignup();
            
            if (success) {
                window.authManager.showToast('카카오 회원가입에 성공했습니다!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                throw new Error('카카오 회원가입에 실패했습니다.');
            }
        } catch (error) {
            window.authManager.showToast(error.message, 'error');
        } finally {
            this.showLoadingState('kakao-signup-btn', false);
        }
    }

    // 구글 로그인
    async loginWithGoogle() {
        try {
            this.showLoadingState('google-login-btn', true);
            
            // 실제 환경에서는 Google SDK를 사용
            // const response = await this.googleLogin();
            
            // 데모용 시뮬레이션
            await this.simulateApiCall();
            const success = await this.simulateGoogleLogin();
            
            if (success) {
                window.authManager.showToast('구글 로그인에 성공했습니다!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                throw new Error('구글 로그인에 실패했습니다.');
            }
        } catch (error) {
            window.authManager.showToast(error.message, 'error');
        } finally {
            this.showLoadingState('google-login-btn', false);
        }
    }

    // 구글 회원가입
    async signupWithGoogle() {
        try {
            this.showLoadingState('google-signup-btn', true);
            
            // 실제 환경에서는 Google SDK를 사용
            // const response = await this.googleLogin();
            
            // 데모용 시뮬레이션
            await this.simulateApiCall();
            const success = await this.simulateGoogleSignup();
            
            if (success) {
                window.authManager.showToast('구글 회원가입에 성공했습니다!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                throw new Error('구글 회원가입에 실패했습니다.');
            }
        } catch (error) {
            window.authManager.showToast(error.message, 'error');
        } finally {
            this.showLoadingState('google-signup-btn', false);
        }
    }

    // 실제 카카오 로그인 (실제 환경에서 사용)
    async kakaoLogin() {
        return new Promise((resolve, reject) => {
            if (typeof Kakao === 'undefined') {
                reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
                return;
            }

            Kakao.Auth.login({
                success: (response) => {
                    // 사용자 정보 요청
                    Kakao.API.request({
                        url: '/v2/user/me',
                        success: (userInfo) => {
                            resolve({
                                id: userInfo.id,
                                email: userInfo.kakao_account?.email,
                                name: userInfo.properties?.nickname,
                                provider: 'kakao'
                            });
                        },
                        fail: (error) => {
                            reject(new Error('사용자 정보를 가져올 수 없습니다.'));
                        }
                    });
                },
                fail: (error) => {
                    reject(new Error('카카오 로그인에 실패했습니다.'));
                }
            });
        });
    }

    // 실제 구글 로그인 (실제 환경에서 사용)
    async googleLogin() {
        return new Promise((resolve, reject) => {
            if (typeof google === 'undefined') {
                reject(new Error('구글 SDK가 로드되지 않았습니다.'));
                return;
            }

            google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: (response) => {
                    try {
                        const payload = JSON.parse(atob(response.credential.split('.')[1]));
                        resolve({
                            id: payload.sub,
                            email: payload.email,
                            name: payload.name,
                            provider: 'google'
                        });
                    } catch (error) {
                        reject(new Error('구글 로그인 정보 처리에 실패했습니다.'));
                    }
                }
            });

            google.accounts.id.prompt();
        });
    }

    // 카카오 로그인 시뮬레이션 (데모용)
    async simulateKakaoLogin() {
        const user = {
            id: 'kakao_123456',
            name: '카카오 사용자',
            email: 'kakao@example.com',
            phone: '010-1234-5678',
            provider: 'kakao'
        };

        // AuthManager에 사용자 정보 저장
        if (window.authManager) {
            window.authManager.currentUser = user;
            sessionStorage.setItem('neurucare_user', JSON.stringify(user));
        }

        return true;
    }

    // 카카오 회원가입 시뮬레이션 (데모용)
    async simulateKakaoSignup() {
        const user = {
            id: 'kakao_' + Date.now(),
            name: '카카오 신규사용자',
            email: 'new_kakao@example.com',
            phone: '010-9876-5432',
            provider: 'kakao'
        };

        // AuthManager에 사용자 정보 저장
        if (window.authManager) {
            window.authManager.currentUser = user;
            sessionStorage.setItem('neurucare_user', JSON.stringify(user));
        }

        return true;
    }

    // 구글 로그인 시뮬레이션 (데모용)
    async simulateGoogleLogin() {
        const user = {
            id: 'google_123456',
            name: '구글 사용자',
            email: 'google@example.com',
            phone: '010-1234-5678',
            provider: 'google'
        };

        // AuthManager에 사용자 정보 저장
        if (window.authManager) {
            window.authManager.currentUser = user;
            sessionStorage.setItem('neurucare_user', JSON.stringify(user));
        }

        return true;
    }

    // 구글 회원가입 시뮬레이션 (데모용)
    async simulateGoogleSignup() {
        const user = {
            id: 'google_' + Date.now(),
            name: '구글 신규사용자',
            email: 'new_google@example.com',
            phone: '010-9876-5432',
            provider: 'google'
        };

        // AuthManager에 사용자 정보 저장
        if (window.authManager) {
            window.authManager.currentUser = user;
            sessionStorage.setItem('neurucare_user', JSON.stringify(user));
        }

        return true;
    }

    // 로딩 상태 표시
    showLoadingState(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const originalText = button.textContent;
        
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <div class="loading-spinner mr-2"></div>
                처리중...
            `;
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }

    // API 호출 시뮬레이션
    async simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000 + Math.random() * 1000);
        });
    }

    // 소셜 로그인 연동 해제 (실제 환경에서 사용)
    async disconnectKakao() {
        if (typeof Kakao !== 'undefined') {
            Kakao.API.request({
                url: '/v1/user/unlink',
                success: (response) => {
                    console.log('카카오 연동 해제 성공');
                },
                fail: (error) => {
                    console.error('카카오 연동 해제 실패:', error);
                }
            });
        }
    }

    // 구글 로그아웃 (실제 환경에서 사용)
    async disconnectGoogle() {
        if (typeof google !== 'undefined') {
            google.accounts.id.disableAutoSelect();
            console.log('구글 자동 선택 비활성화');
        }
    }
}

// 전역 인스턴스 생성
const socialLoginManager = new SocialLoginManager();

// 전역 함수로 내보내기
window.socialLoginManager = socialLoginManager;

export default socialLoginManager;