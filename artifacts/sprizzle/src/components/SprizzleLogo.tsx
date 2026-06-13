import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Float } from '@react-three/drei';
import { Suspense } from 'react';
import logoGlb from '@assets/SPRIZZLE_LOGO_1781324328167.glb';

function LogoModel() {
  const { scene } = useGLTF(logoGlb);
  
  return (
    <Float
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={1.5} 
      floatingRange={[-0.2, 0.2]}
    >
      <primitive object={scene} scale={2} />
    </Float>
  );
}

export default function SprizzleLogo() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]" data-testid="3d-logo-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.8} adjustCamera={false}>
            <LogoModel />
          </Stage>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate 
            autoRotateSpeed={3} 
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(logoGlb);
