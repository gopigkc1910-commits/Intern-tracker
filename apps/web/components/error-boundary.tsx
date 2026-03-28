'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
    }
    
    // In production, you could send to error tracking service (Sentry, etc)
    // logErrorToService(error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="page-shell">
          <section className="glass-panel rounded-[32px] p-8 shadow-glow">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-coral">Error</p>
              <h1 className="mt-3 text-3xl font-semibold text-ink">Something went wrong</h1>
              <p className="mt-4 max-w-xl mx-auto text-sm leading-7 text-slate">
                We encountered an unexpected error. The issue has been logged and our team will look into it. 
                Try refreshing the page or navigating to a different section.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 rounded-[22px] bg-coral/10 border border-coral/20 p-4 text-left text-xs font-mono text-coral max-w-2xl mx-auto overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-mist hover:bg-slate transition"
                >
                  Refresh Page
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-ink/20 px-5 py-3 text-sm font-medium text-ink hover:bg-mist transition"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
