import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import logoGlb from '@assets/SPRIZZLE_LOGO_1781324328167.glb';

function ScrollRotatingModel() {
  const { scene } = useGLTF(logoGlb);
  const groupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      velocityRef.current += e.deltaY * 0.004;
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += velocityRef.current;
    velocityRef.current *= 0.90;
    if (Math.abs(velocityRef.current) < 0.0001) velocityRef.current = 0;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2.2} />
    </group>
  );
}

export default function SprizzleLogo() {
  return (
    <div
      className="w-full h-full"
      data-testid="3d-logo-container"
      style={{ minHeight: '320px' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={1} adjustCamera={false}>
            <ScrollRotatingModel />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(logoGlb);
