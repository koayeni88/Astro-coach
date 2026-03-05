"use client";

import React from "react";
import { GlowButton } from "./ui";

interface Props {
  children: React.ReactNode;
  /** Optional fallback — receives reset callback */
  fallback?: (props: { reset: () => void }) => React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Lightweight client-side error boundary.
 * Catches render errors in its subtree and shows a recovery UI.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ reset: this.reset });
      }

      return (
        <div
          role="alert"
          className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center"
        >
          <span className="text-4xl">⚠️</span>
          <h2 className="text-lg font-semibold text-txt">
            Something went wrong
          </h2>
          <p className="max-w-sm text-sm text-txt-secondary">
            An unexpected error occurred. You can try again or reload the page.
          </p>
          <div className="flex gap-3">
            <GlowButton size="sm" onClick={this.reset}>
              Try again
            </GlowButton>
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload page
            </GlowButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
