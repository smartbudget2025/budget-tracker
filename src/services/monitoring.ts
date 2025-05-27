import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';

class MonitoringService {
  initialize() {
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      debug: __DEV__,
      environment: __DEV__ ? 'development' : 'production',
      enabled: !__DEV__,
      tracesSampleRate: 1.0,
      enableNative: Platform.OS !== 'web',
      attachStacktrace: true,
    });
  }

  captureError(error: Error, context?: Record<string, any>) {
    if (!__DEV__) {
      Sentry.captureException(error, {
        extra: context,
      });
    } else {
      console.error('Error:', error, 'Context:', context);
    }
  }

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    if (!__DEV__) {
      Sentry.captureMessage(message, {
        level,
      });
    } else {
      console.log(`[${level}] ${message}`);
    }
  }

  setUser(user: { id: string; email?: string; name?: string }) {
    Sentry.setUser(user);
  }

  clearUser() {
    Sentry.setUser(null);
  }

  addBreadcrumb(breadcrumb: {
    category: string;
    message: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }) {
    Sentry.addBreadcrumb({
      ...breadcrumb,
      timestamp: Date.now(),
    });
  }

  startTransaction(name: string, op: string) {
    return Sentry.startTransaction({
      name,
      op,
    });
  }
}

export const monitoring = new MonitoringService(); 