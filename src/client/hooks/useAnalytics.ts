/**
 * Analytics Hook
 * Custom hook for tracking user analytics and events
 */

'use client';

import { useEffect, useCallback } from 'react';
import { APP_CONFIG } from '@/config/api.config';

interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
}

interface PageViewEvent {
    page: string;
    title: string;
}

class AnalyticsService {
    private enabled: boolean;
    private sessionId: string;
    private userId?: string;

    constructor() {
        this.enabled = APP_CONFIG.ENABLE_ANALYTICS;
        this.sessionId = this.generateSessionId();
    }

    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }

    setUserId(userId: string) {
        this.userId = userId;
    }

    trackPageView(event: PageViewEvent) {
        if (!this.enabled) return;

        const data = {
            type: 'pageview',
            sessionId: this.sessionId,
            userId: this.userId,
            page: event.page,
            title: event.title,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
            referrer: typeof window !== 'undefined' ? document.referrer : '',
        };

        this.sendToAnalytics(data);
    }

    trackEvent(event: AnalyticsEvent) {
        if (!this.enabled) return;

        const data = {
            type: 'event',
            sessionId: this.sessionId,
            userId: this.userId,
            category: event.category,
            action: event.action,
            label: event.label,
            value: event.value,
            timestamp: new Date().toISOString(),
        };

        this.sendToAnalytics(data);
    }

    trackError(error: Error, context?: any) {
        const data = {
            type: 'error',
            sessionId: this.sessionId,
            userId: this.userId,
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
        };

        this.sendToAnalytics(data);
    }

    trackPerformance(metric: string, value: number) {
        if (!this.enabled) return;

        const data = {
            type: 'performance',
            sessionId: this.sessionId,
            userId: this.userId,
            metric,
            value,
            timestamp: new Date().toISOString(),
        };

        this.sendToAnalytics(data);
    }

    private sendToAnalytics(data: any) {
        // In production, send to your analytics service
        // For now, just log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Analytics]', data);
        }

        // Example: Send to backend
        // fetch('/api/analytics', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        // Example: Send to Google Analytics
        // if (typeof window !== 'undefined' && window.gtag) {
        //   window.gtag('event', data.action, {
        //     event_category: data.category,
        //     event_label: data.label,
        //     value: data.value,
        //   });
        // }
    }
}

// Singleton instance
const analytics = new AnalyticsService();

export function useAnalytics() {
    const trackPageView = useCallback((page: string, title: string) => {
        analytics.trackPageView({ page, title });
    }, []);

    const trackEvent = useCallback((event: AnalyticsEvent) => {
        analytics.trackEvent(event);
    }, []);

    const trackError = useCallback((error: Error, context?: any) => {
        analytics.trackError(error, context);
    }, []);

    const trackPerformance = useCallback((metric: string, value: number) => {
        analytics.trackPerformance(metric, value);
    }, []);

    const setUserId = useCallback((userId: string) => {
        analytics.setUserId(userId);
    }, []);

    // Track page views automatically
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const page = window.location.pathname;
            const title = document.title;
            trackPageView(page, title);
        }
    }, [trackPageView]);

    // Track performance metrics
    useEffect(() => {
        if (typeof window !== 'undefined' && window.performance) {
            // Track page load time
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            if (loadTime > 0) {
                trackPerformance('page_load_time', loadTime);
            }

            // Track DOM content loaded time
            const domContentLoadedTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            if (domContentLoadedTime > 0) {
                trackPerformance('dom_content_loaded', domContentLoadedTime);
            }
        }
    }, [trackPerformance]);

    return {
        trackPageView,
        trackEvent,
        trackError,
        trackPerformance,
        setUserId,
    };
}

export default analytics;
