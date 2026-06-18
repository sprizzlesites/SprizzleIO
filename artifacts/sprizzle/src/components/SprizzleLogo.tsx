import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Stage } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const logoUrl = `${import.meta.env.BASE_URL}sprizzle-logo.glb`;

function LogoModel({
  scale = 1,
  autoRotate = false,
  spinOnScroll = false,
}: {
  scale?: number;
  autoRotate?: boolean;
  spinOnScroll?: boolean;
}) {
  const { scene } = useGLTF(logoUrl);
  const groupRef = useRef<THREE.Group>(null);
  const scrollVel = useRef(0);
  const { invalidate } = useThree();

  useEffect(() => {
    if (!spinOnScroll) return;
    const onWheel = (e: WheelEvent) => {
      scrollVel.current += e.deltaY * 0.0008;
      invalidate();
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [spinOnScroll, invalidate]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    let didChange = false;
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
      didChange = true;
    }
    if (spinOnScroll && Math.abs(scrollVel.current) > 0.0001) {
      groupRef.current.rotation.y += scrollVel.current;
      scrollVel.current *= 0.92;
      if (Math.abs(scrollVel.current) < 0.0001) scrollVel.current = 0;
      didChange = true;
    }
    if (didChange) invalidate();
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={scale} />
    </group>
  );
}

// Fallback logo component
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
  spinOnScroll?: boolean;
  scale?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function Logo3D({
  size = 40,
  autoRotate = false,
  spinOnScroll = false,
  scale = 2.2,
  style,
  className,
}: Logo3DProps) {
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglFailed(true);
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
      style={{ width: size, height: size, overflow: 'visible', ...style }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 1]}
        frameloop="demand"
        style={{ background: 'transparent', width: '100%', height: '100%', overflow: 'visible' }}
        onCreated={({ gl }) => {
          if (!gl) setWebglFailed(true);
        }}
        onError={() => setWebglFailed(true)}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={1} adjustCamera={false}>
            <LogoModel scale={scale} autoRotate={autoRotate} spinOnScroll={spinOnScroll} />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(`${import.meta.env.BASE_URL}sprizzle-logo.glb`);
