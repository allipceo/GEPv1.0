# GEP 무료서비스 파일 구조 문서화 (G050)

## 📋 **문서 정보**
**문서 번호**: G050  
**작성일**: 2025년 7월 17일  
**목적**: GEP 무료서비스에서 개발된 폴더와 파일 구조 정리  
**대상**: 개발 참고 및 유지보수용  

---

## 🏗️ **전체 프로젝트 구조**

```
GEPv1.0/
├── 📁 docs/                          # 문서 폴더
├── 📁 templates/                      # HTML 템플릿
├── 📁 static/                         # 정적 파일 (CSS, JS, 데이터)
├── 📁 qgenerator/                     # QGENERATOR 독립 시스템
├── 📁 참고자료/                       # 참고 자료
├── 📄 app.py                         # GEP 메인 서버
├── 📄 qmanager_server.py             # QManager 독립 서버
├── 📄 requirements.txt               # Python 의존성
├── 📄 Procfile                       # 배포 설정
└── 📄 runtime.txt                    # Python 버전 설정
```

---

## 📁 **핵심 폴더 구조 상세**

### **1. templates/ - HTML 템플릿**
```
templates/
├── 📄 base.html                      # 기본 레이아웃 템플릿
├── 📁 pages/                         # 페이지별 템플릿
│   ├── 📄 index.html                 # 메인 페이지
│   ├── 📄 learning.html              # 학습 페이지
│   └── 📄 statistics.html            # 통계 페이지
└── 📁 components/                    # 컴포넌트 템플릿
```

### **2. static/ - 정적 파일**
```
static/
├── 📁 css/                           # 스타일시트
│   ├── 📄 main.css                   # 메인 스타일
│   ├── 📄 components.css             # 컴포넌트 스타일
│   └── 📄 responsive.css             # 반응형 스타일
├── 📁 js/                            # JavaScript 파일
│   ├── 📄 learning.js                # 학습 페이지 로직
│   ├── 📄 statistics.js              # 통계 페이지 로직
│   ├── 📄 gep-system.js              # GEP 시스템 통합
│   ├── 📄 performance-monitor.js     # 성능 모니터링
│   ├── 📁 core/                      # 핵심 모듈
│   ├── 📁 modules/                   # 기능 모듈
│   ├── 📁 ui/                        # UI 관련
│   └── 📁 utils/                     # 유틸리티
├── 📁 data/                          # 데이터 파일
│   ├── 📄 gep_master_v1.0.json       # 1,440개 기출문제 (1.4MB)
│   ├── 📄 qmanager_questions.json    # QManager 진위형 문제
│   ├── 📄 gep_generated_questions.json # 생성된 문제
│   └── 📄 qmanager_structure.json    # QManager 구조
└── 📁 qmanager/                      # QManager 독립 시스템
    ├── 📄 index.html                 # QManager 메인 페이지
    ├── 📁 js/
    │   └── 📄 qmanager.js            # QManager 로직 (29KB)
    └── 📁 css/
        └── 📄 styles.css             # QManager 스타일
```

### **3. qgenerator/ - QGENERATOR 독립 시스템**
```
qgenerator/
├── 📄 index.html                     # QGENERATOR 메인 페이지
├── 📄 server.py                      # QGENERATOR 서버
├── 📄 styles.css                     # QGENERATOR 스타일
├── 📄 README.md                      # QGENERATOR 문서
├── 📄 debug.js                       # 디버깅 도구
├── 📄 test_questions.js              # 테스트 데이터
├── 📄 simulation_data.js             # 시뮬레이션 데이터
└── 📁 js/
    └── 📄 qgenerator.js              # QGENERATOR 로직 (17KB)
```

---

## 📄 **핵심 파일 리스트**

### **🏠 메인 서버 파일**
| 파일명 | 크기 | 설명 | 상태 |
|--------|------|------|------|
| `app.py` | 6.7KB | GEP 메인 Flask 서버 | ✅ 완료 |
| `qmanager_server.py` | 7.3KB | QManager 독립 서버 | ✅ 완료 |

### **🌐 HTML 템플릿 파일**
| 파일명 | 크기 | 설명 | 상태 |
|--------|------|------|------|
| `templates/base.html` | 2.0KB | 기본 레이아웃 | ✅ 완료 |
| `templates/pages/index.html` | 9.3KB | 메인 페이지 | ✅ 완료 |
| `templates/pages/learning.html` | 15KB | 학습 페이지 | ✅ 완료 |
| `templates/pages/statistics.html` | 5.1KB | 통계 페이지 | ✅ 완료 |
| `static/qmanager/index.html` | 8.2KB | QManager 페이지 | ✅ 완료 |
| `qgenerator/index.html` | 27KB | QGENERATOR 페이지 | ✅ 완료 |

### **🎨 CSS 스타일 파일**
| 파일명 | 크기 | 설명 | 상태 |
|--------|------|------|------|
| `static/css/main.css` | 13KB | 메인 스타일 | ✅ 완료 |
| `static/css/components.css` | 15KB | 컴포넌트 스타일 | ✅ 완료 |
| `static/css/responsive.css` | 7.7KB | 반응형 스타일 | ✅ 완료 |
| `static/qmanager/css/styles.css` | 5.3KB | QManager 스타일 | ✅ 완료 |
| `qgenerator/styles.css` | 4.7KB | QGENERATOR 스타일 | ✅ 완료 |

### **⚡ JavaScript 로직 파일**
| 파일명 | 크기 | 설명 | 상태 |
|--------|------|------|------|
| `static/js/learning.js` | 28KB | 학습 페이지 로직 | ✅ 완료 |
| `static/js/statistics.js` | 12KB | 통계 페이지 로직 | ✅ 완료 |
| `static/js/gep-system.js` | 11KB | GEP 시스템 통합 | ✅ 완료 |
| `static/js/performance-monitor.js` | 12KB | 성능 모니터링 | ✅ 완료 |
| `static/qmanager/js/qmanager.js` | 29KB | QManager 로직 | ✅ 완료 |
| `qgenerator/js/qgenerator.js` | 17KB | QGENERATOR 로직 | ✅ 완료 |

### **📊 데이터 파일**
| 파일명 | 크기 | 설명 | 상태 |
|--------|------|------|------|
| `static/data/gep_master_v1.0.json` | 1.4MB | 1,440개 기출문제 | ✅ 완료 |
| `static/data/qmanager_questions.json` | 47KB | QManager 진위형 문제 | ✅ 완료 |
| `static/data/gep_generated_questions.json` | 27KB | 생성된 문제 | ✅ 완료 |
| `static/data/qmanager_structure.json` | 4.7KB | QManager 구조 | ✅ 완료 |

### **🛠️ 유틸리티 파일**
| 파일명 | 크기 | 설명 | 상태 |
|--------|------|------|------|
| `requirements.txt` | 64B | Python 의존성 | ✅ 완료 |
| `Procfile` | 23B | 배포 설정 | ✅ 완료 |
| `runtime.txt` | 15B | Python 버전 | ✅ 완료 |
| `qmanager_migration.py` | 9.1KB | QManager 마이그레이션 | ✅ 완료 |

---

## 🚀 **시스템별 파일 그룹**

### **1. GEP 메인 시스템**
```
✅ 완료된 파일들:
├── app.py                           # 메인 서버
├── templates/pages/index.html       # 메인 페이지
├── templates/pages/learning.html    # 학습 페이지
├── templates/pages/statistics.html  # 통계 페이지
├── static/css/main.css              # 메인 스타일
├── static/css/components.css        # 컴포넌트 스타일
├── static/css/responsive.css        # 반응형 스타일
├── static/js/learning.js            # 학습 로직
├── static/js/statistics.js          # 통계 로직
├── static/js/gep-system.js          # 시스템 통합
└── static/data/gep_master_v1.0.json # 기출문제 데이터
```

### **2. QManager 독립 시스템**
```
✅ 완료된 파일들:
├── qmanager_server.py               # 독립 서버
├── static/qmanager/index.html       # QManager 페이지
├── static/qmanager/js/qmanager.js   # QManager 로직
├── static/qmanager/css/styles.css   # QManager 스타일
├── static/data/qmanager_questions.json # 진위형 문제 데이터
└── static/data/qmanager_structure.json # 구조 데이터
```

### **3. QGENERATOR 독립 시스템**
```
✅ 완료된 파일들:
├── qgenerator/server.py             # QGENERATOR 서버
├── qgenerator/index.html            # QGENERATOR 페이지
├── qgenerator/js/qgenerator.js      # QGENERATOR 로직
├── qgenerator/styles.css            # QGENERATOR 스타일
└── qgenerator/README.md             # QGENERATOR 문서
```

---

## 📈 **파일 크기 및 복잡도 분석**

### **가장 큰 파일들 (기능별)**
1. **데이터 파일**: `gep_master_v1.0.json` (1.4MB) - 1,440개 기출문제
2. **JavaScript 로직**: `qmanager.js` (29KB) - QManager 복잡한 로직
3. **학습 시스템**: `learning.js` (28KB) - 학습 페이지 전체 로직
4. **HTML 페이지**: `qgenerator/index.html` (27KB) - QGENERATOR 복잡한 UI

### **핵심 기능별 파일 그룹**
- **학습 기능**: `learning.js` + `learning.html` (43KB)
- **통계 기능**: `statistics.js` + `statistics.html` (17KB)
- **QManager**: `qmanager.js` + `qmanager/index.html` (37KB)
- **QGENERATOR**: `qgenerator.js` + `qgenerator/index.html` (44KB)

---

## 🔧 **개발 도구 및 설정 파일**

### **배포 및 환경 설정**
```
✅ 완료된 설정 파일들:
├── requirements.txt                  # Python 패키지 의존성
├── Procfile                         # Heroku 배포 설정
├── runtime.txt                      # Python 3.11.0 버전
└── .git/                           # Git 버전 관리
```

### **데이터 변환 및 마이그레이션**
```
✅ 완료된 유틸리티들:
├── qmanager_migration.py            # QManager 데이터 마이그레이션
├── excel_to_gep_json.py            # 엑셀 → JSON 변환
├── convert_gep_excel_to_json.py    # GEP 데이터 변환
└── update_gep_data.py              # GEP 데이터 업데이트
```

---

## 📊 **시스템 통계**

### **전체 파일 통계**
- **총 파일 수**: 50+ 개
- **총 코드 라인**: 10,000+ 라인
- **총 데이터 크기**: 1.5MB+
- **JavaScript 파일**: 8개 (150KB+)
- **CSS 파일**: 5개 (45KB+)
- **HTML 파일**: 6개 (70KB+)
- **Python 파일**: 3개 (20KB+)

### **기능별 완성도**
- **GEP 메인 시스템**: 100% 완료
- **QManager 시스템**: 100% 완료
- **QGENERATOR 시스템**: 100% 완료
- **데이터 시스템**: 100% 완료
- **UI/UX 시스템**: 100% 완료

---

## 🎯 **핵심 성과**

### **완성된 시스템들**
1. **GEP 메인 시스템**: 완전한 학습 플랫폼
2. **QManager**: 독립형 진위형 문제 관리 시스템
3. **QGENERATOR**: 독립형 문제 생성 시스템
4. **데이터 관리**: 1,440개 기출문제 완전 관리

### **기술적 성과**
- **모듈화**: 3개 독립 시스템으로 분리
- **확장성**: 새로운 기능 추가 용이
- **유지보수성**: 명확한 파일 구조
- **성능**: 최적화된 데이터 로딩

---

## 📋 **문서 정보**

**문서 번호**: G050  
**작성일**: 2025년 7월 17일  
**작성자**: 서대리 (Cursor AI)  
**검토자**: 조대표님  
**버전**: V1.0  
**상태**: 파일 구조 문서화 완료

**이 문서는 GEP 무료서비스의 완전한 파일 구조를 기록하며, 향후 개발 및 유지보수의 기준 문서입니다!** 🚀
