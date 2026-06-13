import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          className="w-full flex items-center justify-center relative"
          style={{ minHeight: "400px" }}
          data-testid="logo-fallback"
        >
          <div
            className="relative"
            style={{
              width: "300px",
              height: "300px",
            }}
          >
            {/* Outer glow */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              boxShadow: "0 0 80px 20px rgba(120,60,220,0.5), 0 0 40px 8px rgba(60,80,220,0.35)",
            }} />
            {/* Bubble shell */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.18) 0%, rgba(100,50,200,0.28) 38%, rgba(30,20,120,0.6) 78%, rgba(10,5,60,0.75) 100%)",
              border: "1.5px solid rgba(255,255,255,0.28)",
              boxShadow: "inset 0 0 40px rgba(255,255,255,0.08)",
            }} />
            {/* Glassy top-half shine */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
              pointerEvents: "none",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "48%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.04) 100%)",
                borderRadius: "50% 50% 0 0 / 48% 48% 0 0",
              }} />
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
