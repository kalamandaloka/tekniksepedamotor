import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useAnimations } from "@react-three/drei";
import { useEffect } from "react";

type Props = {
  modelType: "box" | "cylinder" | "torus" | "plane";
  modelPath?: string;
  className?: string;
};

const GLTFModel = ({ url }: { url: string }) => {
  const gltf: any = useGLTF(url);
  const { actions } = useAnimations(gltf.animations, gltf.scene);

  useEffect(() => {
    // Play all animations found in the GLB
    if (actions) {
      Object.values(actions).forEach((action: any) => {
        action.play();
      });
    }
  }, [actions]);

  return <primitive object={gltf.scene} />;
};

const Shape = ({ type }: { type: Props["modelType"] }) => {
  switch (type) {
    case "box":
      return (
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.6, 0.6]} />
          <meshStandardMaterial color="#93c5fd" />
        </mesh>
      );
    case "cylinder":
      return (
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1, 24]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
      );
    case "torus":
      return (
        <mesh castShadow>
          <torusGeometry args={[0.7, 0.2, 16, 100]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      );
    default:
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 1.2]} />
          <meshStandardMaterial color="#0ea5e9" transparent opacity={0.7} />
        </mesh>
      );
  }
};

const InlineModel = ({ modelType, modelPath, className }: Props) => {
  return (
    <div className={`w-full rounded-lg overflow-hidden border border-white/10 ${className || 'h-[360px]'}`}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2, 3], fov: 45 }}>
        <Stage environment="city" intensity={0.6}>
          {modelPath ? <GLTFModel url={modelPath} /> : <Shape type={modelType} />}
        </Stage>
        <OrbitControls autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
};

export default InlineModel;
