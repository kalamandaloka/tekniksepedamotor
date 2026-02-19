import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useAnimations, Instances, Instance, Html } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Play, Square, Maximize2, Minimize2, Info, X, Activity, Scissors } from "lucide-react";
import { Group, Vector2, Vector3 } from "three";
import * as THREE from "three";

interface Props {
  simId: string;
  simTitle?: string;
  simDescription?: string;
  panelTitle?: string;
  status?: string;
  simConditions?: { id: number; description: string; status?: string; image?: string }[];
  simImage?: string;
  showStatus?: boolean;
}

const CenterImagePlane = ({ imageUrl }: { imageUrl?: string }) => {
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
  const dist = camera.position.length();
  const fovRad = (camera.fov * Math.PI) / 180;
  const height = 2 * dist * Math.tan(fovRad / 2);
  const width = height * aspect;
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const animKolamUrl = new URL('../modules/LD-01/system/models/anim_kolam.glb', import.meta.url).href;
const sawahUrl = new URL('../data/LD-01/models/sawah2.glb', import.meta.url).href;
const aritIconUrl = new URL('../data/LD-01/images/arit.png', import.meta.url).href;

// Helper to generate a procedural water normal map
const useWaterTexture = () => {
  return useMemo(() => {
    const size = 512;
    const data = new Uint8Array(size * size * 4);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        
        // Generate wave pattern
        // Mix of sine waves at different frequencies
        const u = x / size * 20; // Frequency X
        const v = y / size * 20; // Frequency Y
        
        // Height value (0-1)
        // const h = Math.sin(u) * 0.5 + 0.5; // Simple sine
        
        // More complex "watery" noise
        const h1 = Math.sin(u + v);
        const h2 = Math.cos(u * 0.8 - v * 0.5);
        const h3 = Math.sin(u * 1.5 + v * 0.2);
        
        const h = (h1 + h2 + h3) / 3;
        
        // Convert height to normal map (approximate)
        // Normal = (dh/dx, dh/dy, 1)
        // We'll just bake a pattern into RGB
        
        // Actually, let's just make a visual texture for 'map' or 'normalMap'
        // For a normal map, R = x-slope, G = y-slope, B = z (up)
        
        const r = 128 + h * 127; 
        const g = 128 + h * 127;
        const b = 255; // Pointing up mostly
        
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);
};

const WaterWithFlow = ({ geometry, position, rotation, scale }: { geometry: THREE.BufferGeometry, position: any, rotation?: any, scale: any }) => {
  const waterTexture = useWaterTexture();
  
  // Clone texture so each instance can have independent offset if needed (though we share here)
  // Actually, we want to animate the texture offset
  
  useFrame((_, delta) => {
    if (waterTexture) {
        // Flow from left to right: Animate U (x) coordinate
        waterTexture.offset.x -= delta * 0.2; // Adjust speed here
        waterTexture.offset.y += delta * 0.05; // Slight diagonal drift
    }
  });

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={scale}>
      <meshPhysicalMaterial 
        color="#00a6ed"
        normalMap={waterTexture}
        normalScale={new Vector2(0.5, 0.5)} // Adjust ripple strength
        transmission={0.9} 
        opacity={0.9}
        roughness={0.05} 
        ior={1.33} 
        thickness={0.5} 
        specularIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};


const KolamAnimScene = ({ isPlaying }: { isPlaying: boolean }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(animKolamUrl);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          if (isPlaying) {
            action.play();
          } else {
            action.stop();
          }
        }
      });
    }
  }, [isPlaying, actions]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
};

const GrassCutterLogic = ({ active, onCut }: { active: boolean, onCut: (pos: Vector3) => void }) => {
    const { camera, raycaster, pointer } = useThree();
    
    useFrame(() => {
        if (!active) return;

        // Raycast to a ground plane at y=0.5
        raycaster.setFromCamera(pointer, camera);
        const groundPlane = new THREE.Plane(new Vector3(0, 1, 0), -0.5); // Plane facing up at y=0.5
        const target = new Vector3();
        raycaster.ray.intersectPlane(groundPlane, target);

        if (target) {
            onCut(target);
        }
    });

    return null;
};

const SawahScene = ({ isAritActive }: { isAritActive: boolean }) => {
  const { nodes } = useGLTF(sawahUrl) as any;
  
  // State for grass instances (to allow removal)
  const [grassInstances, setGrassInstances] = useState<any[]>([]);
  const [isClean, setIsClean] = useState(false);

  // Initial generation
  useEffect(() => {
    const instances = [];
    const count = 50; 
    const width = 8; 
    const depth = 8; 
    
    for (let i = 0; i < count; i++) {
      instances.push({
        id: i,
        position: [
          (Math.random() - 0.5) * width,
          0.23, 
          (Math.random() - 0.5) * depth
        ] as [number, number, number],
        rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
        scale: 0.8 + Math.random() * 0.6,
        visible: true
      });
    }
    setGrassInstances(instances);
  }, []);

  const handleCut = useCallback((toolPos: Vector3) => {
      setGrassInstances(prev => {
          const next = prev.map(g => {
              if (!g.visible) return g;
              // Simple distance check (ignoring Y for now or including it)
              const grassPos = new Vector3(g.position[0], g.position[1], g.position[2]);
              const dist = toolPos.distanceTo(grassPos);
              if (dist < 0.8) { // Cutting radius
                  return { ...g, visible: false };
              }
              return g;
          });
          
          // Check if all clear
          const remaining = next.filter(g => g.visible).length;
          if (remaining === 0 && prev.some(g => g.visible)) {
              setIsClean(true);
          }
          
          return next;
      });
  }, []);

  const visibleGrass = grassInstances.filter(g => g.visible);

  return (
    <group dispose={null}>
      {/* Tool Cursor Logic */}
      <GrassCutterLogic active={isAritActive} onCut={handleCut} />
      
      {/* Completion Info */}
      {isClean && (
          <Html center>
              <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex flex-col items-center gap-2 animate-bounce">
                  <Activity size={32} />
                  <span className="font-bold text-lg">Lahan Sudah Bersih!</span>
                  <span className="text-sm opacity-90">Siap untuk tahap selanjutnya.</span>
              </div>
          </Html>
      )}

      {/* Lahan (Ground) - Keep original */}
      <primitive object={nodes.lahan} />

      {/* Water (Air) - Realistic Water using WaterWithFlow */}
      <group>
          {nodes.air && (
            <WaterWithFlow 
              geometry={nodes.air.geometry} 
              position={nodes.air.position} 
              rotation={nodes.air.rotation}
              scale={nodes.air.scale} 
            />
          )}
      </group>

      {/* Grass (Rumput) - Scattered Instances */}
              {nodes.rumput && visibleGrass.length > 0 && (
                <Instances
                  range={visibleGrass.length}
                  material={nodes.rumput.material}
                  geometry={nodes.rumput.geometry}
                >
                  {visibleGrass.map((data) => (
                    <Instance
                      key={data.id}
                      position={data.position}
                      rotation={data.rotation}
                      scale={data.scale}
                    />
                  ))}
                </Instances>
              )}
    </group>
  );
};

const SanitasiScene = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.4]} />
        <meshStandardMaterial color="#22d3ee" />
      </mesh>
      <mesh position={[1.2, 0.2, -0.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 24]} />
        <meshStandardMaterial color="#67e8f9" />
      </mesh>
    </group>
  );
};

const PengolahanScene = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <torusGeometry args={[1.2, 0.2, 16, 100]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
};

const CustomCursorOverlay = ({ active, iconUrl }: { active: boolean, iconUrl: string }) => {
  const cursorRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!active) return;

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // KITA BISA ATUR OFFSET DI SINI
        // Offset X dan Y dalam pixel untuk menggeser gambar relatif terhadap mouse
        // Menggeser ke kiri 690px dan atas 140px (90 + 50) sesuai permintaan user
        const offsetX = -690; 
        const offsetY = -140; 
        
        cursorRef.current.style.transform = `translate(${e.clientX + offsetX}px, ${e.clientY + offsetY}px)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [active]);

  if (!active) return null;

  return (
    <img 
      ref={cursorRef}
      src={iconUrl} 
      className="fixed w-16 h-16 pointer-events-none z-[9999] object-contain" 
      style={{ 
        transform: 'translate(-100px, -100px)', // Initial off-screen
        left: 0,
        top: 0,
        // Kita hilangkan translate(-50%, -50%) agar defaultnya pojok kiri atas, 
        // lalu kita atur via offsetX/offsetY di atas
      }} 
    />
  );
};

const SystemSim = ({ simId, simTitle, simDescription, panelTitle, status, simConditions, simImage, showStatus = true }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [condition, setCondition] = useState(1);
  const [isAritActive, setIsAritActive] = useState(false);

  // Sync internal state with actual fullscreen status (handles Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const scene =
    simId === "sanitasi" ? (
      <SanitasiScene />
    ) : simId === "pengolahan" ? (
      <PengolahanScene />
    ) : simId === "kolam-animasi" ? (
      <KolamAnimScene isPlaying={isPlaying} />
    ) : simId === "sim-01-layout" ? (
      <SawahScene isAritActive={isAritActive} />
    ) : null;

  const hasConditions = Array.isArray(simConditions) && simConditions.length > 0;
  const activeStatusRaw = hasConditions ? simConditions?.find(c => c.id === condition)?.status : status;
  const statusClass = activeStatusRaw === "Waspada" ? "text-yellow-400" : activeStatusRaw === "Darurat" ? "text-red-400" : "text-green-400";
  const centerImage = hasConditions ? simConditions?.find((c) => c.id === condition)?.image : simImage;

  return (
    <div ref={containerRef} className={`w-full h-full overflow-hidden relative group bg-gray-900 ${isAritActive ? 'cursor-none' : ''}`}>
      <CustomCursorOverlay active={isAritActive} iconUrl={aritIconUrl} />
      
      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
        {scene && (
          <Stage environment="city" intensity={0.6}>
            {scene}
          </Stage>
        )}
        <CenterImagePlane imageUrl={centerImage} />
        <OrbitControls autoRotate={simId !== "kolam-animasi"} autoRotateSpeed={0.6} enabled={!isAritActive} />
      </Canvas>
      

      {/* Top Right - Info Panel */}
      <div className="absolute top-4 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none">
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:bg-white/10 border border-white/10 transition-colors pointer-events-auto cursor-auto"
          title={showInfo ? "Sembunyikan Info" : "Tampilkan Info"}
        >
          {showInfo ? <X size={18} /> : <Info size={18} />}
        </button>
        
        {showInfo && (
          <div className="w-64 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/10 shadow-lg animate-fade-in text-white/90 pointer-events-auto cursor-auto">
            <h4 className="font-bold text-sm mb-2 text-nalar-accent">{panelTitle ?? "Informasi Simulasi"}</h4>
            {simTitle && <div className="text-xs font-semibold mb-2 text-white/80">{simTitle}</div>}
            <p className="text-xs leading-relaxed text-gray-300">
              {(hasConditions ? simConditions?.find(c => c.id === condition)?.description : undefined) 
                ?? simDescription 
                ?? `Simulasi ini menunjukkan proses ${simId.replace(/-/g, ' ')}. Anda dapat mengontrol animasi dan melihat perubahan parameter pada grafik. Gunakan mouse untuk memutar (drag) dan zoom (scroll) tampilan 3D.`}
            </p>
            {showStatus && activeStatusRaw && (
              <div className="mt-3 pt-3 border-t border-white/10 text-xs flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`${statusClass} font-mono`}>{activeStatusRaw}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Bottom - Animation Controls (Specific to kolam-animasi) */}
      {simId === "kolam-animasi" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-2 bg-nalar-primary text-white rounded-full font-bold shadow-lg hover:bg-nalar-accent transition-colors backdrop-blur-sm bg-opacity-90 cursor-auto"
          >
            {isPlaying ? (
              <>
                <Square size={16} fill="currentColor" />
                <span>Berhenti</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>Mulai</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Center Bottom - Tools (Specific to sim-01-layout) */}
      {simId === "sim-01-layout" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsAritActive(!isAritActive)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 transition-all shadow-xl cursor-auto ${
                isAritActive 
                ? 'bg-nalar-primary border-white text-white scale-110' 
                : 'bg-black/60 border-white/20 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            title="Gunakan Sabit"
          >
            <Scissors size={24} className={isAritActive ? 'animate-pulse' : ''} />
            <span className="text-[10px] font-bold mt-1">SABIT</span>
          </button>
        </div>
      )}

      {/* Bottom Right - Controls */}
      <div className="absolute bottom-4 right-4 z-[100] flex items-center gap-3">
        {hasConditions && (
          <div className="flex bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 shadow-lg cursor-auto">
            {[1, 2, 3].map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-all cursor-auto ${
                  condition === c 
                    ? 'bg-nalar-primary text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Kondisi {c}
              </button>
            ))}
          </div>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-lg bg-black/60 backdrop-blur-md text-white/80 hover:bg-white/10 border border-white/10 transition-colors shadow-lg cursor-auto"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </div>
  );
};

export default SystemSim;
