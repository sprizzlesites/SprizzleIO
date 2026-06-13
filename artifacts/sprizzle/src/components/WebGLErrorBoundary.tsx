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
          className="w-full flex items-center justify-center"
          style={{ minHeight: "400px" }}
          data-testid="logo-fallback"
        >
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: "240px",
              height: "240px",
              background: "radial-gradient(circle at 40% 35%, #ff66cc 0%, #cc33ff 50%, #6633ff 100%)",
              boxShadow: "0 0 80px 20px rgba(204,51,255,0.4), 0 0 40px 8px rgba(255,102,204,0.3)",
            }}
          >
            <span
              style={{
                fontFamily: "'Fredoka One', 'Nunito', sans-serif",
                fontSize: "4rem",
                fontWeight: "900",
                color: "white",
                letterSpacing: "-2px",
                textShadow: "0 2px 12px rgba(0,0,0,0.2)",
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
