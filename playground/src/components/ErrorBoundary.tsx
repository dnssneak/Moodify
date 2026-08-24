import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught Error Boundary Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container" role="alert" aria-live="assertive">
          <div className="error-boundary-card">
            <div className="error-boundary-header">
              <div className="error-icon-wrapper">
                <AlertTriangle className="error-icon" size={32} />
              </div>
              <span className="badge badge-error">Route Failure / React Boundary</span>
            </div>

            <h2 className="error-title">Application Component Error</h2>
            <p className="error-description">
              A UI rendering error occurred in the primary component tree. The boundary caught this error to prevent total application crash.
            </p>

            {this.state.error && (
              <div className="error-message-box">
                <code>{this.state.error.message || 'Unknown Application Error'}</code>
              </div>
            )}

            <div className="error-boundary-actions">
              <button
                type="button"
                onClick={this.handleReset}
                className="custom-btn-primary"
              >
                <RotateCcw size={16} style={{ marginRight: '6px' }} />
                Try Again (Reset State)
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="custom-btn-secondary"
              >
                <RefreshCw size={16} style={{ marginRight: '6px' }} />
                Reload Page
              </button>
            </div>

            <div className="error-details-toggle">
              <button
                type="button"
                onClick={this.toggleDetails}
                className="toggle-details-btn"
              >
                <span>{this.state.showDetails ? 'Hide Stack Trace' : 'Show Stack Trace'}</span>
                {this.state.showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {this.state.showDetails && (
                <div className="error-stack-trace">
                  <pre>{this.state.error?.stack}</pre>
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <h4 style={{ marginTop: '0.75rem', color: '#9ca3af' }}>Component Stack:</h4>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
