/**
 * GEP 성능 모니터링 시스템
 * 실시간 성능 추적 및 최적화
 * 
 * @author 서대리
 * @version 1.0
 * @date 2025-08-26
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: [],
            memoryUsage: [],
            animationFPS: [],
            networkRequests: [],
            userInteractions: []
        };
        
        this.thresholds = {
            pageLoadTime: 2000, // 2초
            memoryUsage: 50,    // 50MB
            animationFPS: 55,   // 55fps
            networkResponse: 200, // 200ms
            userResponse: 100    // 100ms
        };
        
        this.isMonitoring = false;
        this.monitoringInterval = null;
        
        this.initialize();
    }

    /**
     * 모니터링 시스템 초기화
     */
    initialize() {
        console.log('📊 성능 모니터링 시스템 초기화...');
        
        // 페이지 로드 시간 측정
        this.measurePageLoadTime();
        
        // 메모리 사용량 모니터링 시작
        this.startMemoryMonitoring();
        
        // 애니메이션 성능 모니터링
        this.startAnimationMonitoring();
        
        // 네트워크 요청 모니터링
        this.startNetworkMonitoring();
        
        // 사용자 인터랙션 모니터링
        this.startUserInteractionMonitoring();
        
        this.isMonitoring = true;
        console.log('✅ 성능 모니터링 시스템 시작');
    }

    /**
     * 페이지 로드 시간 측정
     */
    measurePageLoadTime() {
        const startTime = performance.now();
        
        window.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            this.metrics.pageLoadTime.push({
                time: loadTime,
                timestamp: new Date().toISOString(),
                threshold: this.thresholds.pageLoadTime,
                passed: loadTime < this.thresholds.pageLoadTime
            });
            
            console.log(`📊 페이지 로드 시간: ${loadTime.toFixed(2)}ms ${loadTime < this.thresholds.pageLoadTime ? '✅' : '❌'}`);
        });
    }

    /**
     * 메모리 사용량 모니터링
     */
    startMemoryMonitoring() {
        if ('memory' in performance) {
            this.monitoringInterval = setInterval(() => {
                const memoryInfo = performance.memory;
                const memoryUsageMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
                
                this.metrics.memoryUsage.push({
                    usage: memoryUsageMB,
                    timestamp: new Date().toISOString(),
                    threshold: this.thresholds.memoryUsage,
                    passed: memoryUsageMB < this.thresholds.memoryUsage
                });
                
                if (memoryUsageMB > this.thresholds.memoryUsage) {
                    console.warn(`⚠️ 메모리 사용량 높음: ${memoryUsageMB.toFixed(2)}MB`);
                }
            }, 5000); // 5초마다 체크
        }
    }

    /**
     * 애니메이션 성능 모니터링
     */
    startAnimationMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) { // 1초마다 FPS 계산
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                this.metrics.animationFPS.push({
                    fps: fps,
                    timestamp: new Date().toISOString(),
                    threshold: this.thresholds.animationFPS,
                    passed: fps >= this.thresholds.animationFPS
                });
                
                frameCount = 0;
                lastTime = currentTime;
                
                if (fps < this.thresholds.animationFPS) {
                    console.warn(`⚠️ 애니메이션 성능 저하: ${fps}fps`);
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    /**
     * 네트워크 요청 모니터링
     */
    startNetworkMonitoring() {
        const originalFetch = window.fetch;
        let requestCount = 0;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            requestCount++;
            
            try {
                const response = await originalFetch(...args);
                const responseTime = performance.now() - startTime;
                
                this.metrics.networkRequests.push({
                    url: args[0],
                    responseTime: responseTime,
                    timestamp: new Date().toISOString(),
                    threshold: this.thresholds.networkResponse,
                    passed: responseTime < this.thresholds.networkResponse
                });
                
                if (responseTime > this.thresholds.networkResponse) {
                    console.warn(`⚠️ 네트워크 응답 지연: ${responseTime.toFixed(2)}ms`);
                }
                
                return response;
            } catch (error) {
                console.error('❌ 네트워크 요청 실패:', error);
                throw error;
            }
        };
    }

    /**
     * 사용자 인터랙션 모니터링
     */
    startUserInteractionMonitoring() {
        const events = ['click', 'input', 'scroll', 'keydown'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                const startTime = performance.now();
                
                // 다음 이벤트 루프에서 응답 시간 측정
                setTimeout(() => {
                    const responseTime = performance.now() - startTime;
                    
                    this.metrics.userInteractions.push({
                        type: eventType,
                        responseTime: responseTime,
                        timestamp: new Date().toISOString(),
                        threshold: this.thresholds.userResponse,
                        passed: responseTime < this.thresholds.userResponse
                    });
                    
                    if (responseTime > this.thresholds.userResponse) {
                        console.warn(`⚠️ 사용자 인터랙션 지연: ${responseTime.toFixed(2)}ms`);
                    }
                }, 0);
            }, { passive: true });
        });
    }

    /**
     * 성능 지표 조회
     */
    getMetrics() {
        return {
            pageLoadTime: this.getAverageMetric('pageLoadTime'),
            memoryUsage: this.getAverageMetric('memoryUsage'),
            animationFPS: this.getAverageMetric('animationFPS'),
            networkRequests: this.getAverageMetric('networkRequests'),
            userInteractions: this.getAverageMetric('userInteractions'),
            overall: this.getOverallPerformance()
        };
    }

    /**
     * 평균 지표 계산
     */
    getAverageMetric(metricName) {
        const metrics = this.metrics[metricName];
        if (metrics.length === 0) return null;
        
        const values = metrics.map(m => m[metricName === 'pageLoadTime' ? 'time' : 
                                       metricName === 'memoryUsage' ? 'usage' : 
                                       metricName === 'animationFPS' ? 'fps' : 
                                       metricName === 'networkRequests' ? 'responseTime' : 'responseTime']);
        
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const passed = metrics.filter(m => m.passed).length;
        const total = metrics.length;
        
        return {
            average: average,
            passed: passed,
            total: total,
            successRate: (passed / total) * 100,
            threshold: this.thresholds[metricName],
            meetsThreshold: average <= this.thresholds[metricName]
        };
    }

    /**
     * 전체 성능 평가
     */
    getOverallPerformance() {
        const metrics = this.getMetrics();
        const scores = [];
        
        if (metrics.pageLoadTime) scores.push(metrics.pageLoadTime.meetsThreshold ? 100 : 50);
        if (metrics.memoryUsage) scores.push(metrics.memoryUsage.meetsThreshold ? 100 : 50);
        if (metrics.animationFPS) scores.push(metrics.animationFPS.meetsThreshold ? 100 : 50);
        if (metrics.networkRequests) scores.push(metrics.networkRequests.meetsThreshold ? 100 : 50);
        if (metrics.userInteractions) scores.push(metrics.userInteractions.meetsThreshold ? 100 : 50);
        
        const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
        
        return {
            score: averageScore,
            grade: averageScore >= 90 ? 'A' : averageScore >= 80 ? 'B' : averageScore >= 70 ? 'C' : 'D',
            status: averageScore >= 80 ? 'excellent' : averageScore >= 60 ? 'good' : 'needs_improvement'
        };
    }

    /**
     * 성능 최적화 권장사항
     */
    getOptimizationRecommendations() {
        const metrics = this.getMetrics();
        const recommendations = [];
        
        if (metrics.pageLoadTime && !metrics.pageLoadTime.meetsThreshold) {
            recommendations.push('페이지 로드 시간 최적화 필요 (이미지 압축, 코드 분할)');
        }
        
        if (metrics.memoryUsage && !metrics.memoryUsage.meetsThreshold) {
            recommendations.push('메모리 사용량 최적화 필요 (메모리 누수 확인, 불필요한 객체 제거)');
        }
        
        if (metrics.animationFPS && !metrics.animationFPS.meetsThreshold) {
            recommendations.push('애니메이션 성능 최적화 필요 (CSS 애니메이션 사용, GPU 가속 활용)');
        }
        
        if (metrics.networkRequests && !metrics.networkRequests.meetsThreshold) {
            recommendations.push('네트워크 요청 최적화 필요 (캐싱, 요청 병합)');
        }
        
        if (metrics.userInteractions && !metrics.userInteractions.meetsThreshold) {
            recommendations.push('사용자 인터랙션 응답성 개선 필요 (이벤트 위임, 비동기 처리)');
        }
        
        return recommendations;
    }

    /**
     * 모니터링 중지
     */
    stop() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        this.isMonitoring = false;
        console.log('⏹️ 성능 모니터링 중지');
    }

    /**
     * 성능 리포트 생성
     */
    generateReport() {
        const metrics = this.getMetrics();
        const recommendations = this.getOptimizationRecommendations();
        
        return {
            timestamp: new Date().toISOString(),
            metrics: metrics,
            recommendations: recommendations,
            summary: {
                overallScore: metrics.overall.score,
                grade: metrics.overall.grade,
                status: metrics.overall.status,
                monitoringDuration: this.getMonitoringDuration()
            }
        };
    }

    /**
     * 모니터링 지속 시간 계산
     */
    getMonitoringDuration() {
        if (this.metrics.pageLoadTime.length === 0) return 0;
        
        const startTime = new Date(this.metrics.pageLoadTime[0].timestamp);
        const endTime = new Date();
        return Math.round((endTime - startTime) / 1000); // 초 단위
    }
}

// 전역 성능 모니터 인스턴스 생성
window.PerformanceMonitor = new PerformanceMonitor();

// 개발자 도구에서 접근 가능하도록 노출
window.getPerformanceReport = () => {
    return window.PerformanceMonitor.generateReport();
};

console.log('📊 성능 모니터링 시스템 준비 완료');
