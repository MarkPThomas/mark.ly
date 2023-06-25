import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorInfo: undefined
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    process.env.NODE_ENV !== 'production' && console.log("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    const { hasError, errorInfo } = this.state;
    if (hasError) {
      return (
        <div className="component">
          <div className="component-header">
            <p>
              Problem loading component{' '}
              <span
                style={{ cursor: 'pointer', color: '#0077FF' }}
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reload
              </span>{' '}
            </p>
          </div>
          {
            process.env.NODE_ENV !== 'production' &&
            <div className="component-body">
              <details className="error-details">
                <summary>Tell me more</summary>
                {errorInfo && errorInfo.componentStack.toString()}
              </details>
            </div>
          }
        </div>
      );
    }

    return this.props.children;
  }
}