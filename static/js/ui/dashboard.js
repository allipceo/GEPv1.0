/**
 * GEP 통계 대시보드
 * 통계 데이터 로드, 차트 생성, 활동 로그, 목표 설정
 */

class DashboardUI {
    constructor() {
        this.charts = {};
        this.statistics = {};
        this.goals = {};
        this.activities = [];
        this.badges = [];
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.loadStatistics();
        this.createCharts();
        this.loadActivities();
        this.loadBadges();
        this.updateGoals();
        console.log('✅ DashboardUI 초기화 완료');
    }

    // ===== 설정 관리 =====
    loadSettings() {
        const savedGoals = localStorage.getItem('gep_goals');
        if (savedGoals) {
            this.goals = JSON.parse(savedGoals);
        } else {
            this.goals = {
                dailyQuestions: 20,
                weeklyHours: 10,
                notifications: true
            };
        }
    }

    saveSettings() {
        localStorage.setItem('gep_goals', JSON.stringify(this.goals));
    }

    // ===== 이벤트 리스너 =====
    setupEventListeners() {
        // 새로고침 버튼
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.refreshData();
        });

        // 내보내기 버튼
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportData();
        });

        // 차트 기간 변경
        document.getElementById('accuracy-period')?.addEventListener('change', (e) => {
            this.updateAccuracyChart(parseInt(e.target.value));
        });

        document.getElementById('time-period')?.addEventListener('change', (e) => {
            this.updateTimeChart(e.target.value);
        });

        // 목표 설정
        document.getElementById('set-goals-btn')?.addEventListener('click', () => {
            this.showGoalsModal();
        });

        document.getElementById('save-goals-btn')?.addEventListener('click', () => {
            this.saveGoals();
        });

        document.getElementById('cancel-goals-btn')?.addEventListener('click', () => {
            this.hideGoalsModal();
        });

        document.getElementById('close-goals-modal')?.addEventListener('click', () => {
            this.hideGoalsModal();
        });

        // 빠른 액션 버튼들
        document.querySelectorAll('.gep-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                const text = e.target.textContent || e.target.querySelector('span')?.textContent;
                this.handleQuickAction(text);
            });
        });
    }

    // ===== 통계 데이터 로드 =====
    async loadStatistics() {
        showLoading('통계를 불러오는 중...');
        
        try {
            // DataManager에서 통계 데이터 로드
            const stats = await window.GEPDataManager.getStatistics('current');
            this.statistics = stats || {};
            
            // 통계 카드 업데이트
            this.updateStatisticsCards();
            
            // 차트 데이터 업데이트
            this.updateChartData();
            
            hideLoading();
            showToast('통계가 업데이트되었습니다.', 'success');
            
        } catch (error) {
            console.error('통계 로드 실패:', error);
            showToast('통계 로드에 실패했습니다.', 'error');
            hideLoading();
        }
    }

    updateStatisticsCards() {
        const stats = this.statistics;
        
        // 총 문제 수
        document.getElementById('total-questions').textContent = '1,440';
        
        // 풀이한 문제 수
        const answeredQuestions = stats.totalAnswered || 0;
        document.getElementById('answered-questions').textContent = answeredQuestions.toLocaleString();
        
        // 정답률
        const accuracy = stats.accuracy || 0;
        document.getElementById('accuracy-rate').textContent = `${accuracy.toFixed(1)}%`;
        
        // 총 학습 시간
        const totalTime = stats.totalTime || 0;
        const hours = Math.floor(totalTime / 3600000); // 밀리초를 시간으로 변환
        document.getElementById('total-time').textContent = `${hours}시간`;
        
        // 변화율 계산 (이전 대비)
        this.calculateChanges();
    }

    calculateChanges() {
        // 실제로는 이전 데이터와 비교하여 변화율 계산
        // 여기서는 예시 데이터 사용
        const changes = {
            answered: '+12%',
            accuracy: '+5.2%',
            time: '+2시간'
        };
        
        document.getElementById('answered-change').textContent = changes.answered;
        document.getElementById('accuracy-change').textContent = changes.accuracy;
        document.getElementById('time-change').textContent = changes.time;
    }

    // ===== 차트 생성 =====
    createCharts() {
        this.createAccuracyChart();
        this.createCategoryChart();
        this.createTimeChart();
        this.createHeatmap();
    }

    createAccuracyChart() {
        const ctx = document.getElementById('accuracy-chart');
        if (!ctx) return;
        
        this.charts.accuracy = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateDateLabels(7),
                datasets: [{
                    label: '정답률',
                    data: this.generateAccuracyData(7),
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createCategoryChart() {
        const ctx = document.getElementById('category-chart');
        if (!ctx) return;
        
        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['생명보험', '손해보험', '제3보험'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#8B5CF6',
                        '#F97316',
                        '#EC4899'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createTimeChart() {
        const ctx = document.getElementById('time-chart');
        if (!ctx) return;
        
        this.charts.time = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.generateDateLabels(7),
                datasets: [{
                    label: '학습 시간',
                    data: this.generateTimeData(7),
                    backgroundColor: '#10B981',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '시간';
                            }
                        }
                    }
                }
            }
        });
    }

    createHeatmap() {
        const container = document.getElementById('heatmap-container');
        if (!container) return;
        
        // 간단한 히트맵 생성 (실제로는 더 정교한 라이브러리 사용)
        container.innerHTML = this.generateHeatmapHTML();
    }

    generateHeatmapHTML() {
        const weeks = 52;
        const days = 7;
        let html = '<div class="grid grid-cols-52 gap-1">';
        
        for (let week = 0; week < weeks; week++) {
            for (let day = 0; day < days; day++) {
                const intensity = Math.random(); // 실제로는 데이터 기반
                const color = this.getHeatmapColor(intensity);
                html += `<div class="w-2 h-2 ${color} rounded-sm" title="Week ${week}, Day ${day}"></div>`;
            }
        }
        
        html += '</div>';
        return html;
    }

    getHeatmapColor(intensity) {
        if (intensity < 0.2) return 'bg-gray-100';
        if (intensity < 0.4) return 'bg-green-200';
        if (intensity < 0.6) return 'bg-green-400';
        if (intensity < 0.8) return 'bg-green-600';
        return 'bg-green-800';
    }

    // ===== 차트 데이터 업데이트 =====
    updateChartData() {
        this.updateAccuracyChart(7);
        this.updateCategoryChart();
        this.updateTimeChart('day');
    }

    updateAccuracyChart(days) {
        if (!this.charts.accuracy) return;
        
        const data = this.generateAccuracyData(days);
        const labels = this.generateDateLabels(days);
        
        this.charts.accuracy.data.labels = labels;
        this.charts.accuracy.data.datasets[0].data = data;
        this.charts.accuracy.update();
    }

    updateCategoryChart() {
        if (!this.charts.category) return;
        
        // 실제 카테고리별 데이터로 업데이트
        const categoryData = this.getCategoryData();
        
        this.charts.category.data.datasets[0].data = categoryData;
        this.charts.category.update();
    }

    updateTimeChart(period) {
        if (!this.charts.time) return;
        
        const data = this.generateTimeData(period === 'day' ? 7 : period === 'week' ? 4 : 12);
        const labels = this.generateDateLabels(period === 'day' ? 7 : period === 'week' ? 4 : 12);
        
        this.charts.time.data.labels = labels;
        this.charts.time.data.datasets[0].data = data;
        this.charts.time.update();
    }

    // ===== 데이터 생성 헬퍼 =====
    generateDateLabels(count) {
        const labels = [];
        const today = new Date();
        
        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }));
        }
        
        return labels;
    }

    generateAccuracyData(count) {
        // 실제로는 서버에서 가져온 데이터 사용
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * 40) + 60); // 60-100% 범위
        }
        return data;
    }

    generateTimeData(count) {
        // 실제로는 서버에서 가져온 데이터 사용
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * 4) + 1); // 1-5시간 범위
        }
        return data;
    }

    getCategoryData() {
        // 실제 카테고리별 성과 데이터
        return [65, 25, 10];
    }

    // ===== 활동 로그 =====
    async loadActivities() {
        try {
            const events = await window.GEPDataManager.getEvents({ limit: 10 });
            this.activities = events || [];
            this.displayActivities();
        } catch (error) {
            console.error('활동 로그 로드 실패:', error);
        }
    }

    displayActivities() {
        const container = document.getElementById('activity-log');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.activities.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">아직 활동 기록이 없습니다.</p>';
            return;
        }
        
        this.activities.forEach(activity => {
            const activityElement = this.createActivityElement(activity);
            container.appendChild(activityElement);
        });
    }

    createActivityElement(activity) {
        const div = document.createElement('div');
        div.className = 'flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors';
        
        const icon = this.getActivityIcon(activity.type);
        const time = new Date(activity.timestamp).toLocaleString('ko-KR');
        
        div.innerHTML = `
            <div class="w-8 h-8 ${icon.bg} rounded-full flex items-center justify-center flex-shrink-0">
                <i class="${icon.class} text-sm ${icon.color}"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">${activity.title}</p>
                <p class="text-sm text-gray-600">${activity.description}</p>
                <p class="text-xs text-gray-500 mt-1">${time}</p>
            </div>
        `;
        
        return div;
    }

    getActivityIcon(type) {
        const icons = {
            'quiz_start': { class: 'fas fa-play', bg: 'bg-blue-100', color: 'text-blue-600' },
            'quiz_complete': { class: 'fas fa-check', bg: 'bg-green-100', color: 'text-green-600' },
            'goal_achieved': { class: 'fas fa-trophy', bg: 'bg-yellow-100', color: 'text-yellow-600' },
            'badge_earned': { class: 'fas fa-medal', bg: 'bg-purple-100', color: 'text-purple-600' }
        };
        
        return icons[type] || icons['quiz_start'];
    }

    // ===== 배지 시스템 =====
    loadBadges() {
        this.badges = this.generateBadges();
        this.displayBadges();
    }

    generateBadges() {
        return [
            { id: 'first_quiz', name: '첫 문제', description: '첫 번째 문제를 풀었습니다', icon: 'fas fa-star', earned: true },
            { id: 'perfect_score', name: '만점', description: '한 번에 만점을 받았습니다', icon: 'fas fa-crown', earned: false },
            { id: 'streak_7', name: '7일 연속', description: '7일 연속으로 학습했습니다', icon: 'fas fa-fire', earned: true },
            { id: 'time_master', name: '시간 관리', description: '총 100시간 학습했습니다', icon: 'fas fa-clock', earned: false },
            { id: 'category_master', name: '카테고리 마스터', description: '모든 카테고리를 완료했습니다', icon: 'fas fa-trophy', earned: false },
            { id: 'speed_demon', name: '스피드 데몬', description: '1분 내에 10문제를 풀었습니다', icon: 'fas fa-bolt', earned: false }
        ];
    }

    displayBadges() {
        const container = document.getElementById('badges-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.badges.forEach(badge => {
            const badgeElement = this.createBadgeElement(badge);
            container.appendChild(badgeElement);
        });
    }

    createBadgeElement(badge) {
        const div = document.createElement('div');
        div.className = 'text-center';
        
        const opacity = badge.earned ? 'opacity-100' : 'opacity-50';
        const color = badge.earned ? 'text-yellow-600' : 'text-gray-400';
        
        div.innerHTML = `
            <div class="w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-3 ${opacity}">
                <i class="${badge.icon} text-2xl"></i>
            </div>
            <h4 class="font-medium text-gray-900 mb-1">${badge.name}</h4>
            <p class="text-sm text-gray-600">${badge.description}</p>
        `;
        
        return div;
    }

    // ===== 목표 관리 =====
    updateGoals() {
        this.updateDailyGoal();
        this.updateWeeklyGoal();
    }

    updateDailyGoal() {
        const progress = this.statistics.todayAnswered || 0;
        const goal = this.goals.dailyQuestions || 20;
        const percent = Math.min((progress / goal) * 100, 100);
        
        document.getElementById('daily-goal-questions').textContent = `${goal}문제`;
        document.getElementById('daily-goal-progress').style.width = `${percent}%`;
        document.getElementById('daily-progress-text').textContent = `${progress}/${goal} 완료`;
        document.getElementById('daily-progress-percent').textContent = `${percent.toFixed(0)}%`;
    }

    updateWeeklyGoal() {
        const progress = this.statistics.weeklyTime || 0;
        const goal = this.goals.weeklyHours || 10;
        const percent = Math.min((progress / (goal * 3600000)) * 100, 100); // 시간을 밀리초로 변환
        
        document.getElementById('weekly-goal-time').textContent = `${goal}시간`;
        document.getElementById('weekly-goal-progress').style.width = `${percent}%`;
        document.getElementById('weekly-progress-text').textContent = `${Math.floor(progress / 3600000)}/${goal}시간 완료`;
        document.getElementById('weekly-progress-percent').textContent = `${percent.toFixed(0)}%`;
    }

    showGoalsModal() {
        const modal = document.getElementById('goals-modal');
        if (!modal) return;
        
        // 현재 설정값으로 입력 필드 초기화
        document.getElementById('daily-goal-input').value = this.goals.dailyQuestions || 20;
        document.getElementById('weekly-goal-input').value = this.goals.weeklyHours || 10;
        document.getElementById('goal-notifications').checked = this.goals.notifications !== false;
        
        modal.classList.remove('hidden');
    }

    hideGoalsModal() {
        const modal = document.getElementById('goals-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveGoals() {
        const dailyGoal = parseInt(document.getElementById('daily-goal-input').value) || 20;
        const weeklyGoal = parseInt(document.getElementById('weekly-goal-input').value) || 10;
        const notifications = document.getElementById('goal-notifications').checked;
        
        this.goals = {
            dailyQuestions: dailyGoal,
            weeklyHours: weeklyGoal,
            notifications: notifications
        };
        
        this.saveSettings();
        this.updateGoals();
        this.hideGoalsModal();
        
        showToast('목표가 저장되었습니다.', 'success');
    }

    // ===== 빠른 액션 =====
    handleQuickAction(action) {
        switch (action) {
            case '문제 풀이 시작':
                window.location.href = '/quiz.html';
                break;
            case '틀린 문제 복습':
                window.location.href = '/quiz.html?mode=wrong';
                break;
            case '상세 분석 보기':
                this.showDetailedAnalysis();
                break;
        }
    }

    showDetailedAnalysis() {
        showModal(`
            <div class="text-center">
                <h3 class="text-lg font-semibold mb-4">상세 분석</h3>
                <p class="text-gray-600 mb-4">
                    더 자세한 학습 분석을 보시겠습니까?
                </p>
                <div class="space-y-2 text-left">
                    <p class="text-sm">• 카테고리별 상세 성과</p>
                    <p class="text-sm">• 시간대별 학습 패턴</p>
                    <p class="text-sm">• 취약점 분석</p>
                    <p class="text-sm">• 개선 권장사항</p>
                </div>
            </div>
        `, {
            title: '상세 분석',
            confirmText: '분석 보기',
            cancelText: '취소',
            onConfirm: () => {
                // 상세 분석 페이지로 이동
                window.location.href = '/analysis.html';
            }
        });
    }

    // ===== 데이터 새로고침 =====
    async refreshData() {
        showLoading('데이터를 새로고침하는 중...');
        
        try {
            await this.loadStatistics();
            await this.loadActivities();
            this.updateGoals();
            
            hideLoading();
            showToast('데이터가 새로고침되었습니다.', 'success');
        } catch (error) {
            console.error('데이터 새로고침 실패:', error);
            hideLoading();
            showToast('데이터 새로고침에 실패했습니다.', 'error');
        }
    }

    // ===== 데이터 내보내기 =====
    exportData() {
        const data = {
            statistics: this.statistics,
            goals: this.goals,
            activities: this.activities,
            badges: this.badges,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `gep-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('데이터가 내보내기되었습니다.', 'success');
    }
}

// 전역 인스턴스 생성
window.dashboardUI = new DashboardUI();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 GEP 대시보드 페이지 로드 완료');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    // 차트 정리
    if (window.dashboardUI && window.dashboardUI.charts) {
        Object.values(window.dashboardUI.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
    }
});

