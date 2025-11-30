/**
 * Enhanced Error Boundary
 * Global error boundary with better error handling and UI
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        // You can also log to an error reporting service here
        // Example: Sentry.captureException(error);

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl w-full"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
                            >
                                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                            </motion.div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
                                Oops! Something went wrong
                            </h1>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                                We're sorry for the inconvenience. An unexpected error has occurred.
                            </p>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                                    <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                                        Error Details:
                                    </h3>
                                    <pre className="text-sm text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap break-words">
                                        {this.state.error.toString()}
                                    </pre>
                                    {this.state.errorInfo && (
                                        <details className="mt-4">
                                            <summary className="cursor-pointer text-red-900 dark:text-red-100 font-semibold mb-2">
                                                Component Stack
                                            </summary>
                                            <pre className="text-xs text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap break-words">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={this.handleReset}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition-colors"
                                >
                                    <RefreshCw size={20} />
                                    Try Again
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={this.handleGoHome}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold shadow-lg transition-colors"
                                >
                                    <Home size={20} />
                                    Go Home
                                </motion.button>
                            </div>

                            {/* Support Info */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-8">
                                If this problem persists, please contact support at{' '}
                                <a
                                    href="mailto:support@risabur.com"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    support@risabur.com
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
