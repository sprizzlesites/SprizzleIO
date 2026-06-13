import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const logoUrl = '/sprizzle-logo.glb';

function LogoModel({ scale = 1, autoRotate = true }: { scale?: number; autoRotate?: boolean }) {
  const { scene } = useGLTF(logoUrl);
  const groupRef = useRef<THREE.Group>(null);
  const scrollVel = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      scrollVel.current += e.deltaY * 0.0008;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    groupRef.current.rotation.y += scrollVel.current;
    scrollVel.current *= 0.92;
    if (Math.abs(scrollVel.current) < 0.0001) scrollVel.current = 0;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={scale} />
    </group>
  );
}

// Fallback logo component that looks like the 3D logo's "S" in an orb
function LogoFallback({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, hsl(272 60% 55%) 25%, hsl(225 70% 50%) 70%, hsl(272 90% 10%) 100%)',
        boxShadow: `0 0 ${size * 0.4}px hsl(272 60% 50%), inset 0 0 ${size * 0.2}px rgba(255,255,255,0.8)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 800,
        fontSize: size * 0.55,
        fontFamily: "'Fredoka', sans-serif",
        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glass highlight overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          borderRadius: '50% 50% 0 0',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0.05))',
          pointerEvents: 'none',
        }}
      />
      S
    </div>
  );
}

interface Logo3DProps {
  size?: number;
  autoRotate?: boolean;
  scale?: number;
  style?: React.CSSProperties;
  className?: string;
  showFallback?: boolean;
}

export default function Logo3D({ size = 40, autoRotate = true, scale = 2.2, style, className }: Logo3DProps) {
  const [webglFailed, setWebglFailed] = useState(false);

  // Check WebGL availability synchronously before mounting Canvas
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglFailed(true);
      }
    } catch {
      setWebglFailed(true);
    }
  }, []);

  if (webglFailed) {
    return <LogoFallback size={size} />;
  }

  return (
    <div
      className={className}
      data-testid="3d-logo-container"
      style={{ width: size, height: size, ...style }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          if (!gl) setWebglFailed(true);
        }}
        onError={() => setWebglFailed(true)}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={1} adjustCamera={false}>
            <LogoModel scale={scale} autoRotate={autoRotate} />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(logoUrl);
