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
            className="aero-orb relative flex items-center justify-center"
            style={{
              width: "240px",
              height: "240px",
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, hsl(272 60% 50%) 25%, hsl(225 70% 50%) 70%, hsl(272 90% 10%) 100%)",
              boxShadow: "0 0 60px 10px rgba(147, 51, 234, 0.6), inset 0 0 30px rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.3)"
            }}
          >
            {/* Glossy top overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
            <span
              style={{
                fontFamily: "'Fredoka One', 'Fredoka', 'Nunito', sans-serif",
                fontSize: "5rem",
                fontWeight: "900",
                color: "white",
                letterSpacing: "-2px",
                textShadow: "0 4px 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.5)",
                zIndex: 10
              }}
            >
              S
            </span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
