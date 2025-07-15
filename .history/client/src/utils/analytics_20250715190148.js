// Google Analytics 이벤트 추적 유틸리티

// 페이지뷰 추적
export const trackPageView = (pageName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};

// 설문 시작 추적
export const trackSurveyStart = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'survey_start', {
      event_category: 'engagement',
      event_label: 'survey_initiated'
    });
  }
};

// 설문 완료 추적
export const trackSurveyComplete = (userLevel, racketCategory) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'survey_complete', {
      event_category: 'engagement',
      event_label: 'survey_finished',
      custom_parameter_1: userLevel,
      custom_parameter_2: racketCategory
    });
  }
};

// 라켓 선택 추적
export const trackRacketSelect = (racketName, category) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'racket_select', {
      event_category: 'engagement',
      event_label: racketName,
      custom_parameter_1: category
    });
  }
};

// 라켓 비교 추적
export const trackRacketCompare = (racketCount) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'racket_compare', {
      event_category: 'engagement',
      event_label: `compare_${racketCount}_rackets`
    });
  }
};

// 광고 클릭 추적
export const trackAdClick = (adPosition) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_click', {
      event_category: 'monetization',
      event_label: adPosition
    });
  }
};

// 사용자 레벨별 추적
export const trackUserLevel = (level) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_level_selected', {
      event_category: 'user_profile',
      event_label: level
    });
  }
};

// 라켓 카테고리별 추적
export const trackRacketCategory = (category) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'racket_category_selected', {
      event_category: 'user_preference',
      event_label: category
    });
  }
};

// 세션 시작 추적
export const trackSessionStart = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'session_start', {
      event_category: 'engagement'
    });
  }
};

// 오류 추적
export const trackError = (errorType, errorMessage) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'error', {
      event_category: 'error',
      event_label: errorType,
      custom_parameter_1: errorMessage
    });
  }
}; 