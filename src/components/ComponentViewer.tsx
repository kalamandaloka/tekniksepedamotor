import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { useEffect } from "react";

interface Props {
  name: string;
  description: string;
  modelType: "box" | "cylinder" | "torus" | "plane";
  onClose: () => void;
}

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

const ComponentViewer = ({ name, description, modelType, onClose }: Props) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-[900px] h-[520px] bg-nalar-dark/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm"
          >
            Tutup
          </button>
        </div>
        <div className="absolute left-4 top-4 z-20">
          <div className="px-3 py-1 rounded bg-nalar-primary/20 text-nalar-primary text-xs font-semibold">
            {name}
          </div>
        </div>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [3, 2, 3], fov: 45 }}
          className="w-full h-full"
        >
          <Stage environment="city" intensity={0.6}>
            <Shape type={modelType} />
          </Stage>
          <OrbitControls autoRotate autoRotateSpeed={0.8} />
        </Canvas>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 border-t border-white/10 text-gray-300 text-sm">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ComponentViewer;
