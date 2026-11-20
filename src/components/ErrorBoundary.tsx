import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unexpected error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-xl p-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-[#FFD600]">Something went wrong</h2>
            <p className="text-sm text-[#9A9A9A] break-words">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#FFD600] text-[#0B0B0B] font-bold rounded-lg hover:brightness-95 transition-transform active:scale-[0.98]"
            >
              Reload Store
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
