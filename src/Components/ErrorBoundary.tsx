import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // optional custom fallback UI
  section?: string; // name shown in the error message e.g. "Bookings"
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you'd send this to Sentry / Azure App Insights
    console.error(
      `[ErrorBoundary${this.props.section ? ` — ${this.props.section}` : ""}]`,
      error,
      info,
    );
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <p className="error-boundary-eyebrow">Something went wrong</p>
          <h3 className="error-boundary-title">
            {this.props.section
              ? `The ${this.props.section} section failed to load`
              : "This section failed to load"}
          </h3>
          <p className="error-boundary-message">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button className="error-boundary-btn" onClick={this.reset}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}
