/**
 * GEP 사용자 프로필 관리
 * 프로필 정보, 설정 관리, 보안 설정, 데이터 관리
 */

class ProfileUI {
    constructor() {
        this.userData = {};
        this.settings = {};
        this.isEditing = false;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadSettings();
        this.updateDisplay();
        console.log('✅ ProfileUI 초기화 완료');
    }

    // ===== 사용자 데이터 로드 =====
    async loadUserData() {
        try {
            // DataManager에서 사용자 데이터 로드
            const userData = await window.GEPDataManager.getUser('current');
            this.userData = userData || this.getDefaultUserData();
            
            // 프로필 정보 표시
            this.displayUserData();
            
        } catch (error) {
            console.error('사용자 데이터 로드 실패:', error);
            this.userData = this.getDefaultUserData();
            this.displayUserData();
        }
    }

    getDefaultUserData() {
        return {
            id: 'current',
            firstName: '',
            lastName: '',
            email: 'user@example.com',
            phone: '',
            bio: '',
            profileImage: '',
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            accountType: 'free',
            accountStatus: 'active'
        };
    }

    displayUserData() {
        const user = this.userData;
        
        // 기본 정보 표시
        document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`.trim() || '사용자';
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('join-date').textContent = `가입일: ${new Date(user.joinDate).toLocaleDateString('ko-KR')}`;
        
        // 입력 필드 설정
        document.getElementById('first-name').value = user.firstName || '';
        document.getElementById('last-name').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('bio').value = user.bio || '';
        
        // 프로필 이미지 설정
        this.setProfileImage(user.profileImage);
        
        // 계정 상태 정보
        document.getElementById('account-join-date').textContent = new Date(user.joinDate).toLocaleDateString('ko-KR');
        document.getElementById('last-login').textContent = this.formatLastLogin(user.lastLogin);
        
        // 학습 요약 업데이트
        this.updateLearningSummary();
    }

    setProfileImage(imageUrl) {
        const profileImage = document.getElementById('profile-image');
        const defaultAvatar = document.getElementById('default-avatar');
        
        if (imageUrl) {
            profileImage.src = imageUrl;
            profileImage.classList.remove('hidden');
            defaultAvatar.classList.add('hidden');
        } else {
            profileImage.classList.add('hidden');
            defaultAvatar.classList.remove('hidden');
        }
    }

    formatLastLogin(lastLogin) {
        const now = new Date();
        const loginTime = new Date(lastLogin);
        const diffMs = now - loginTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        return loginTime.toLocaleDateString('ko-KR');
    }

    // ===== 설정 관리 =====
    loadSettings() {
        const savedSettings = localStorage.getItem('gep_user_settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            this.settings = this.getDefaultSettings();
        }
        
        this.applySettings();
    }

    getDefaultSettings() {
        return {
            dailyGoal: 20,
            weeklyGoal: 10,
            emailNotifications: true,
            goalNotifications: true,
            studyReminders: true,
            defaultExamType: 'broker',
            defaultQuizMode: 'basic',
            twoFactorEnabled: false
        };
    }

    applySettings() {
        // 학습 목표 설정
        document.getElementById('daily-goal').value = this.settings.dailyGoal || 20;
        document.getElementById('weekly-goal').value = this.settings.weeklyGoal || 10;
        
        // 알림 설정
        document.getElementById('email-notifications').checked = this.settings.emailNotifications !== false;
        document.getElementById('goal-notifications').checked = this.settings.goalNotifications !== false;
        document.getElementById('study-reminders').checked = this.settings.studyReminders !== false;
        
        // 학습 환경 설정
        document.getElementById('default-exam-type').value = this.settings.defaultExamType || 'broker';
        document.getElementById('default-quiz-mode').value = this.settings.defaultQuizMode || 'basic';
    }

    saveSettings() {
        // 현재 설정값 수집
        this.settings = {
            dailyGoal: parseInt(document.getElementById('daily-goal').value) || 20,
            weeklyGoal: parseInt(document.getElementById('weekly-goal').value) || 10,
            emailNotifications: document.getElementById('email-notifications').checked,
            goalNotifications: document.getElementById('goal-notifications').checked,
            studyReminders: document.getElementById('study-reminders').checked,
            defaultExamType: document.getElementById('default-exam-type').value,
            defaultQuizMode: document.getElementById('default-quiz-mode').value,
            twoFactorEnabled: this.settings.twoFactorEnabled
        };
        
        // 로컬 스토리지에 저장
        localStorage.setItem('gep_user_settings', JSON.stringify(this.settings));
        
        // DataManager에 저장
        this.saveUserData();
    }

    // ===== 이벤트 리스너 =====
    setupEventListeners() {
        // 저장 버튼
        document.getElementById('save-profile-btn')?.addEventListener('click', () => {
            this.saveProfile();
        });

        // 프로필 이미지 변경
        document.getElementById('change-image-btn')?.addEventListener('click', () => {
            this.changeProfileImage();
        });

        // 비밀번호 변경
        document.getElementById('change-password-btn')?.addEventListener('click', () => {
            this.changePassword();
        });

        // 2단계 인증
        document.getElementById('enable-2fa-btn')?.addEventListener('click', () => {
            this.show2FAModal();
        });

        // 세션 관리
        document.getElementById('view-sessions-btn')?.addEventListener('click', () => {
            this.showSessionsModal();
        });

        // 모달 닫기
        document.getElementById('close-2fa-modal')?.addEventListener('click', () => {
            this.hide2FAModal();
        });

        document.getElementById('close-sessions-modal')?.addEventListener('click', () => {
            this.hideSessionsModal();
        });

        // 빠른 액션
        this.setupQuickActions();

        // 폼 변경 감지
        this.setupFormChangeDetection();
    }

    setupQuickActions() {
        // 데이터 내보내기
        document.querySelector('button:has(.fa-download)')?.addEventListener('click', () => {
            this.exportUserData();
        });

        // 계정 삭제
        document.querySelector('button:has(.fa-trash)')?.addEventListener('click', () => {
            this.deleteAccount();
        });

        // 로그아웃
        document.querySelector('button:has(.fa-sign-out-alt)')?.addEventListener('click', () => {
            this.logout();
        });

        // 상세 통계 보기
        document.getElementById('view-details-btn')?.addEventListener('click', () => {
            window.location.href = '/dashboard.html';
        });

        // 프리미엄 업그레이드
        document.getElementById('upgrade-account-btn')?.addEventListener('click', () => {
            this.upgradeAccount();
        });
    }

    setupFormChangeDetection() {
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach(element => {
            element.addEventListener('change', () => {
                this.isEditing = true;
                this.updateSaveButton();
            });
        });
    }

    updateSaveButton() {
        const saveBtn = document.getElementById('save-profile-btn');
        if (saveBtn) {
            saveBtn.disabled = !this.isEditing;
            saveBtn.classList.toggle('opacity-50', !this.isEditing);
        }
    }

    // ===== 프로필 저장 =====
    async saveProfile() {
        showLoading('프로필을 저장하는 중...');
        
        try {
            // 폼 데이터 수집
            this.userData = {
                ...this.userData,
                firstName: document.getElementById('first-name').value.trim(),
                lastName: document.getElementById('last-name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                bio: document.getElementById('bio').value.trim()
            };
            
            // 설정 저장
            this.saveSettings();
            
            // DataManager에 저장
            await this.saveUserData();
            
            // 표시 업데이트
            this.displayUserData();
            
            this.isEditing = false;
            this.updateSaveButton();
            
            hideLoading();
            showToast('프로필이 저장되었습니다.', 'success');
            
        } catch (error) {
            console.error('프로필 저장 실패:', error);
            hideLoading();
            showToast('프로필 저장에 실패했습니다.', 'error');
        }
    }

    async saveUserData() {
        try {
            await window.GEPDataManager.saveUser('current', this.userData);
        } catch (error) {
            console.error('사용자 데이터 저장 실패:', error);
            throw error;
        }
    }

    // ===== 프로필 이미지 변경 =====
    changeProfileImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadProfileImage(file);
            }
        };
        input.click();
    }

    async uploadProfileImage(file) {
        showLoading('이미지를 업로드하는 중...');
        
        try {
            // 파일 크기 확인 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('파일 크기가 5MB를 초과합니다.');
            }
            
            // 파일 형식 확인
            if (!file.type.startsWith('image/')) {
                throw new Error('이미지 파일만 업로드 가능합니다.');
            }
            
            // 이미지를 Base64로 변환
            const imageUrl = await this.fileToBase64(file);
            
            // 프로필 이미지 업데이트
            this.userData.profileImage = imageUrl;
            this.setProfileImage(imageUrl);
            
            // 데이터 저장
            await this.saveUserData();
            
            hideLoading();
            showToast('프로필 이미지가 업로드되었습니다.', 'success');
            
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            hideLoading();
            showToast(error.message || '이미지 업로드에 실패했습니다.', 'error');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ===== 비밀번호 변경 =====
    async changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // 유효성 검사
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('모든 필드를 입력해주세요.', 'warning');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('새 비밀번호가 일치하지 않습니다.', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showToast('비밀번호는 8자 이상이어야 합니다.', 'error');
            return;
        }
        
        showLoading('비밀번호를 변경하는 중...');
        
        try {
            // 실제로는 서버에 비밀번호 변경 요청
            // 여기서는 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 입력 필드 초기화
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            
            hideLoading();
            showToast('비밀번호가 변경되었습니다.', 'success');
            
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
            hideLoading();
            showToast('비밀번호 변경에 실패했습니다.', 'error');
        }
    }

    // ===== 2단계 인증 =====
    show2FAModal() {
        const modal = document.getElementById('2fa-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hide2FAModal() {
        const modal = document.getElementById('2fa-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.getElementById('2fa-code').value = '';
        }
    }

    async verify2FA() {
        const code = document.getElementById('2fa-code').value;
        
        if (!code || code.length !== 6) {
            showToast('6자리 인증 코드를 입력해주세요.', 'warning');
            return;
        }
        
        showLoading('인증 코드를 확인하는 중...');
        
        try {
            // 실제로는 서버에 인증 코드 확인 요청
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.settings.twoFactorEnabled = true;
            this.saveSettings();
            
            this.hide2FAModal();
            hideLoading();
            showToast('2단계 인증이 활성화되었습니다.', 'success');
            
        } catch (error) {
            console.error('2FA 인증 실패:', error);
            hideLoading();
            showToast('인증 코드가 올바르지 않습니다.', 'error');
        }
    }

    // ===== 세션 관리 =====
    showSessionsModal() {
        const modal = document.getElementById('sessions-modal');
        if (modal) {
            this.loadSessions();
            modal.classList.remove('hidden');
        }
    }

    hideSessionsModal() {
        const modal = document.getElementById('sessions-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    loadSessions() {
        const container = document.querySelector('#sessions-modal .space-y-4');
        if (!container) return;
        
        // 세션 데이터 (실제로는 서버에서 가져옴)
        const sessions = [
            { id: '1', device: 'Chrome on Windows', location: 'Seoul, Korea', lastActive: '방금 전', isCurrent: true },
            { id: '2', device: 'Safari on iPhone', location: 'Seoul, Korea', lastActive: '2시간 전', isCurrent: false },
            { id: '3', device: 'Firefox on Mac', location: 'Busan, Korea', lastActive: '1일 전', isCurrent: false }
        ];
        
        container.innerHTML = sessions.map(session => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                    <p class="text-sm font-medium">${session.device}</p>
                    <p class="text-xs text-gray-500">${session.location} • ${session.lastActive}</p>
                </div>
                <div class="flex items-center space-x-2">
                    ${session.isCurrent ? '<span class="text-xs text-green-600 font-medium">현재</span>' : ''}
                    ${!session.isCurrent ? `<button class="text-xs text-red-600 hover:text-red-700" onclick="profileUI.terminateSession('${session.id}')">종료</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    async terminateSession(sessionId) {
        if (confirm('이 세션을 종료하시겠습니까?')) {
            showLoading('세션을 종료하는 중...');
            
            try {
                // 실제로는 서버에 세션 종료 요청
                await new Promise(resolve => setTimeout(resolve, 500));
                
                hideLoading();
                showToast('세션이 종료되었습니다.', 'success');
                this.loadSessions(); // 세션 목록 새로고침
                
            } catch (error) {
                console.error('세션 종료 실패:', error);
                hideLoading();
                showToast('세션 종료에 실패했습니다.', 'error');
            }
        }
    }

    // ===== 데이터 내보내기 =====
    async exportUserData() {
        showLoading('데이터를 내보내는 중...');
        
        try {
            const exportData = {
                userData: this.userData,
                settings: this.settings,
                statistics: await window.GEPDataManager.getStatistics('current'),
                activities: await window.GEPDataManager.getEvents({ limit: 100 }),
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `gep-user-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            hideLoading();
            showToast('데이터가 내보내기되었습니다.', 'success');
            
        } catch (error) {
            console.error('데이터 내보내기 실패:', error);
            hideLoading();
            showToast('데이터 내보내기에 실패했습니다.', 'error');
        }
    }

    // ===== 계정 삭제 =====
    deleteAccount() {
        showModal(`
            <div class="text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-2xl text-red-600"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2 text-red-600">계정 삭제</h3>
                <p class="text-gray-600 mb-4">
                    정말로 계정을 삭제하시겠습니까?<br>
                    이 작업은 되돌릴 수 없습니다.
                </p>
                <div class="bg-red-50 p-4 rounded-lg text-left text-sm">
                    <p class="mb-2"><strong>삭제되는 데이터:</strong></p>
                    <p class="mb-1">• 모든 학습 기록</p>
                    <p class="mb-1">• 프로필 정보</p>
                    <p class="mb-1">• 설정 및 목표</p>
                    <p>• 계정 관련 모든 데이터</p>
                </div>
            </div>
        `, {
            title: '계정 삭제',
            type: 'danger',
            confirmText: '계정 삭제',
            cancelText: '취소',
            onConfirm: () => {
                this.performAccountDeletion();
            }
        });
    }

    async performAccountDeletion() {
        showLoading('계정을 삭제하는 중...');
        
        try {
            // 실제로는 서버에 계정 삭제 요청
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 로컬 데이터 정리
            localStorage.clear();
            
            hideLoading();
            showToast('계정이 삭제되었습니다.', 'success');
            
            // 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 2000);
            
        } catch (error) {
            console.error('계정 삭제 실패:', error);
            hideLoading();
            showToast('계정 삭제에 실패했습니다.', 'error');
        }
    }

    // ===== 로그아웃 =====
    logout() {
        showModal('정말로 로그아웃하시겠습니까?', {
            title: '로그아웃',
            type: 'warning',
            confirmText: '로그아웃',
            cancelText: '취소',
            onConfirm: () => {
                this.performLogout();
            }
        });
    }

    async performLogout() {
        showLoading('로그아웃하는 중...');
        
        try {
            // 로컬 데이터 정리
            localStorage.removeItem('gep_user_data');
            
            hideLoading();
            showToast('로그아웃되었습니다.', 'success');
            
            // 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 1000);
            
        } catch (error) {
            console.error('로그아웃 실패:', error);
            hideLoading();
            showToast('로그아웃에 실패했습니다.', 'error');
        }
    }

    // ===== 프리미엄 업그레이드 =====
    upgradeAccount() {
        showModal(`
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-crown text-2xl text-blue-600"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">프리미엄으로 업그레이드</h3>
                <p class="text-gray-600 mb-4">
                    더 많은 기능과 혜택을 이용하세요!
                </p>
                <div class="bg-blue-50 p-4 rounded-lg text-left text-sm">
                    <p class="mb-2"><strong>프리미엄 혜택:</strong></p>
                    <p class="mb-1">• 무제한 문제 풀이</p>
                    <p class="mb-1">• 상세한 분석 리포트</p>
                    <p class="mb-1">• 맞춤형 학습 계획</p>
                    <p>• 우선 고객 지원</p>
                </div>
            </div>
        `, {
            title: '프리미엄 업그레이드',
            type: 'info',
            confirmText: '업그레이드',
            cancelText: '나중에',
            onConfirm: () => {
                window.open('/upgrade.html', '_blank');
            }
        });
    }

    // ===== 학습 요약 업데이트 =====
    async updateLearningSummary() {
        try {
            const stats = await window.GEPDataManager.getStatistics('current');
            
            if (stats) {
                document.getElementById('total-study-time').textContent = `${Math.floor((stats.totalTime || 0) / 3600000)}시간`;
                document.getElementById('total-questions-solved').textContent = `${stats.totalAnswered || 0}문제`;
                document.getElementById('average-accuracy').textContent = `${(stats.accuracy || 0).toFixed(1)}%`;
                document.getElementById('badges-earned').textContent = `${stats.badges || 0}개`;
            }
        } catch (error) {
            console.error('학습 요약 업데이트 실패:', error);
        }
    }

    // ===== 표시 업데이트 =====
    updateDisplay() {
        this.updateSaveButton();
    }
}

// 전역 인스턴스 생성
window.profileUI = new ProfileUI();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 GEP 프로필 페이지 로드 완료');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    // 변경사항이 있으면 경고
    if (window.profileUI && window.profileUI.isEditing) {
        return '저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?';
    }
});

