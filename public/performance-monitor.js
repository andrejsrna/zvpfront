// Performance monitoring for LCP optimization
(function () {
  'use strict';

  // Performance observer for LCP
  function initLCPMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'largest-contentful-paint') {
          const lcpTime = entry.startTime;
          const renderDelay = entry.renderTime - entry.loadTime;

          console.log('LCP Metrics:', {
            lcp: lcpTime,
            loadTime: entry.loadTime,
            renderTime: entry.renderTime,
            renderDelay: renderDelay,
            url: entry.url,
            element: entry.element?.tagName,
          });

          // Send to analytics if needed
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'LCP',
              value: lcpTime,
              render_delay: renderDelay,
              metric_id: 'lcp',
            });
          }
        }
      });
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  // Monitor Web Vitals
  function initWebVitalsMonitoring() {
    // CLS monitoring
    const clsObserver = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.hadRecentInput) return;

        console.log('CLS Entry:', {
          value: entry.value,
          sources: entry.sources?.map(s => ({
            node: s.node?.tagName,
            previousRect: s.previousRect,
            currentRect: s.currentRect,
          })),
        });
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // FID monitoring
    const fidObserver = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        console.log('FID:', {
          value: entry.processingStart - entry.startTime,
          startTime: entry.startTime,
          processingStart: entry.processingStart,
        });
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  }

  // Image loading performance
  function monitorImageLoading() {
    const imageObserver = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.initiatorType === 'img') {
          const loadTime = entry.responseEnd - entry.startTime;
          const renderDelay = performance.now() - entry.responseEnd;

          console.log('Image Performance:', {
            url: entry.name,
            loadTime: loadTime,
            renderDelay: renderDelay,
            size: entry.transferSize,
          });
        }
      });
    });
    imageObserver.observe({ type: 'resource', buffered: true });
  }

  // Critical resource timing
  function monitorCriticalResources() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      const fcp = paint.find(p => p.name === 'first-contentful-paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

      console.log('Critical Timing:', {
        ttfb: navigation.responseStart,
        domReady: navigation.domContentLoadedEventEnd,
        loadComplete: navigation.loadEventEnd,
        fcp: fcp?.startTime,
        lcp: lcp?.startTime,
      });
    });
  }

  // Initialize all monitoring
  function init() {
    initLCPMonitoring();
    initWebVitalsMonitoring();
    monitorImageLoading();
    monitorCriticalResources();
  }

  // Start monitoring when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
