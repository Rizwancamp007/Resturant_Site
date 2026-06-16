import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function FloatingDish() {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t / 4) * 0.2;
      meshRef.current.rotation.y = t * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.25;
      ringRef.current.rotation.x = Math.cos(t / 3) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Plate Rim */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.15, 64]} />
        <meshStandardMaterial
          color="#070214"
          roughness={0.05}
          metalness={0.95}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Gold Rim Ring */}
      <mesh ref={ringRef} position={[0, 0.09, 0]}>
        <torusGeometry args={[2.1, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#ffaa00"
          roughness={0.1}
          metalness={1.0}
        />
      </mesh>

      {/* Center Food Representation - Abstract Gourmet Shape */}
      <Float speed={2.5} rotationIntensity={1.8} floatIntensity={1.8}>
        <Sphere args={[1.0, 64, 64]} position={[0, 0.5, 0]}>
          <MeshDistortMaterial
            color="#ff3700"
            attach="material"
            distort={0.45}
            speed={3.5}
            roughness={0.05}
            metalness={0.85}
            clearcoat={1.0}
          />
        </Sphere>
      </Float>

      {/* Secondary Garnishes Floating Around */}
      <Float speed={3.5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[1.4, 0.8, -0.8]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="#ffaa00" metalness={0.95} roughness={0.05} />
        </mesh>
      </Float>
      <Float speed={4.5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[-1.2, 0.7, 1.2]}>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#7d7099" metalness={0.8} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="w-full h-full min-h-[350px] md:min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 4, 6], fov: 45 }} shadows>
        <color attach="background" args={['#03000a']} />
        <ambientLight intensity={0.7} />
        
        {/* Cinematic Lighting */}
        <pointLight position={[10, 10, 10]} intensity={2.0} castShadow />
        <spotLight
          position={[-10, 15, 5]}
          angle={0.35}
          penumbra={1}
          intensity={2.5}
          castShadow
        />
        <directionalLight position={[0, -5, -5]} intensity={0.6} color="#7d7099" />

        <FloatingDish />
        
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  );
}
