import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Props {
  imageUrl?: string;
  className?: string;
}

const BillboardImage = ({ imageUrl }: { imageUrl?: string }) => {
  const { camera } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let tex: THREE.Texture | null = null;
    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(imageUrl, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        setTexture(t);
        tex = t;
      });
    } else {
      setTexture(null);
    }
    return () => {
      if (tex) tex.dispose();
    };
  }, [imageUrl]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  if (!texture) return null;
  const image = texture.image as HTMLImageElement | undefined;
  const aspect = image && image.width && image.height ? image.width / image.height : 16 / 9;
  const width = 8;
  const height = width / aspect;

  return (
    <mesh ref={meshRef} position={[0, 0.8, 0]} castShadow>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const KomponenCenterImage = ({ imageUrl, className }: Props) => {
  return (
    <div className={className}>
      <Canvas shadows camera={{ position: [8, 6, 8], fov: 45 }} className="w-full h-full" gl={{ alpha: true }}>
        <BillboardImage imageUrl={imageUrl} />
        <OrbitControls autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
};

export default KomponenCenterImage;
