/**
 * GEP 통계 시스템
 * 실제 학습 통계 분석 및 시각화
 * 
 * @author 서대리
 * @version 1.0
 * @date 2025-08-26
 */

class StatisticsSystem {
    constructor() {
        this.quizResults = [];
        this.charts = {};
        
        this.initialize();
    }

    /**
     * 시스템 초기화
     */
    initialize() {
        console.log('📊 통계 시스템 초기화 시작...');
        
        try {
            // 데이터 로드
            this.loadQuizResults();
            
            // 통계 계산 및 표시
            this.calculateAndDisplayStatistics();
            
            // 차트 생성
            this.createCharts();
            
            // 최근 학습 기록 표시
            this.displayRecentSessions();
            
            console.log('✅ 통계 시스템 초기화 완료');
            
        } catch (error) {
            console.error('❌ 통계 시스템 초기화 실패:', error);
            this.showError('통계 데이터 로드에 실패했습니다.');
        }
    }

    /**
     * 퀴즈 결과 로드
     */
    loadQuizResults() {
        try {
            const storedResults = localStorage.getItem('gep_quiz_results');
            if (storedResults) {
                this.quizResults = JSON.parse(storedResults);
                console.log(`📈 ${this.quizResults.length}개의 학습 기록 로드 완료`);
            } else {
                this.quizResults = [];
                console.log('📈 학습 기록이 없습니다.');
            }
        } catch (error) {
            console.error('퀴즈 결과 로드 실패:', error);
            this.quizResults = [];
        }
    }

    /**
     * 통계 계산 및 표시
     */
    calculateAndDisplayStatistics() {
        if (this.quizResults.length === 0) {
            this.displayEmptyStatistics();
            return;
        }

        // 전체 통계 계산
        const totalSessions = this.quizResults.length;
        const totalQuestions = this.quizResults.reduce((sum, session) => sum + session.summary.total, 0);
        const totalCorrect = this.quizResults.reduce((sum, session) => sum + session.summary.correct, 0);
        const overallRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        // 통계 표시
        document.getElementById('totalSessions').textContent = totalSessions.toLocaleString();
        document.getElementById('totalQuestions').textContent = totalQuestions.toLocaleString();
        document.getElementById('totalCorrect').textContent = totalCorrect.toLocaleString();
        document.getElementById('overallRate').textContent = `${overallRate}%`;

        console.log(`통계 계산 완료: ${totalSessions}회, ${totalQuestions}문제, ${totalCorrect}정답, ${overallRate}%`);
    }

    /**
     * 빈 통계 표시
     */
    displayEmptyStatistics() {
        document.getElementById('totalSessions').textContent = '0';
        document.getElementById('totalQuestions').textContent = '0';
        document.getElementById('totalCorrect').textContent = '0';
        document.getElementById('overallRate').textContent = '0%';

        // 빈 차트 표시
        this.createEmptyCharts();
        
        // 빈 학습 기록 표시
        document.getElementById('recentSessions').innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-chart-line text-4xl mb-4"></i>
                <p class="text-lg">아직 학습 기록이 없습니다.</p>
                <p class="text-sm mt-2">학습을 시작하여 통계를 확인해보세요!</p>
                <a href="/learning" class="gep-btn-primary mt-4 inline-block">
                    <i class="fas fa-play mr-2"></i>
                    학습 시작하기
                </a>
            </div>
        `;
    }

    /**
     * 차트 생성
     */
    createCharts() {
        if (this.quizResults.length === 0) {
            this.createEmptyCharts();
            return;
        }

        this.createAccuracyChart();
        this.createSubjectChart();
    }

    /**
     * 정답률 추이 차트 생성
     */
    createAccuracyChart() {
        const ctx = document.getElementById('accuracyChart').getContext('2d');
        
        // 최근 10개 세션의 정답률 데이터
        const recentSessions = this.quizResults.slice(-10);
        const labels = recentSessions.map((session, index) => `세션 ${index + 1}`);
        const data = recentSessions.map(session => {
            return session.summary.total > 0 ? 
                Math.round((session.summary.correct / session.summary.total) * 100) : 0;
        });

        this.charts.accuracy = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '정답률 (%)',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
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

    /**
     * 과목별 성취도 차트 생성
     */
    createSubjectChart() {
        const ctx = document.getElementById('subjectChart').getContext('2d');
        
        // 과목별 통계 계산 (실제로는 문제 데이터에서 과목 정보를 가져와야 함)
        const subjectData = this.calculateSubjectStatistics();

        this.charts.subject = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: subjectData.labels,
                datasets: [{
                    data: subjectData.data,
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#06b6d4'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
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

    /**
     * 과목별 통계 계산
     */
    calculateSubjectStatistics() {
        // 실제 구현에서는 문제 데이터에서 과목 정보를 추출해야 함
        // 현재는 샘플 데이터 사용
        return {
            labels: ['손해보험', '보험법규', '보험계리', '보험경영', '보험상품', '기타'],
            data: [25, 20, 15, 15, 15, 10]
        };
    }

    /**
     * 빈 차트 생성
     */
    createEmptyCharts() {
        // 정답률 차트
        const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');
        this.charts.accuracy = new Chart(accuracyCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '정답률 (%)',
                    data: [],
                    borderColor: '#e5e7eb',
                    backgroundColor: 'rgba(229, 231, 235, 0.1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // 과목별 차트
        const subjectCtx = document.getElementById('subjectChart').getContext('2d');
        this.charts.subject = new Chart(subjectCtx, {
            type: 'doughnut',
            data: {
                labels: ['데이터 없음'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e5e7eb'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    /**
     * 최근 학습 기록 표시
     */
    displayRecentSessions() {
        const container = document.getElementById('recentSessions');
        
        if (this.quizResults.length === 0) {
            return; // 이미 빈 통계에서 처리됨
        }

        // 최근 5개 세션 표시
        const recentSessions = this.quizResults.slice(-5).reverse();
        
        container.innerHTML = recentSessions.map(session => {
            const date = new Date(session.date);
            const rate = session.summary.total > 0 ? 
                Math.round((session.summary.correct / session.summary.total) * 100) : 0;
            
            return `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-graduation-cap text-blue-600"></i>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-900">
                                ${date.toLocaleDateString('ko-KR')} ${date.toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})}
                            </div>
                            <div class="text-sm text-gray-600">
                                ${session.summary.total}문제 중 ${session.summary.correct}문제 정답
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-semibold text-blue-600">${rate}%</div>
                        <div class="text-sm text-gray-500">정답률</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * 오류 표시
     */
    showError(message) {
        // 간단한 알림 표시
        alert(message);
    }

    /**
     * 차트 새로고침
     */
    refreshCharts() {
        // 기존 차트 제거
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });

        // 데이터 다시 로드
        this.loadQuizResults();
        
        // 차트 다시 생성
        this.createCharts();
        
        // 통계 다시 계산
        this.calculateAndDisplayStatistics();
        
        // 최근 기록 다시 표시
        this.displayRecentSessions();
    }
}

// 통계 시스템 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.statisticsSystem = new StatisticsSystem();
});

// 페이지 포커스 시 차트 새로고침
window.addEventListener('focus', () => {
    if (window.statisticsSystem) {
        window.statisticsSystem.refreshCharts();
    }
});

console.log('📊 통계 시스템 로드 완료');
