import { useState, useRef, Suspense, useEffect } from 'react';
import { type ModuleContent } from '../types/ModuleContent';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Box, FileText, Check, Play, AlertCircle, Award, List } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';
import { useAuth } from '../context/AuthContext';

// Helper component for interactive parts with hover effect
const TractorPart = ({ 
  name, 
  position, 
  rotation, 
  geometry, 
  materialProps, 
  onClick 
}: { 
  name: string; 
  position?: [number, number, number]; 
  rotation?: [number, number, number]; 
  geometry: React.ReactNode; 
  materialProps: any; 
  onClick: (name: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh 
      name={name}
      position={position} 
      rotation={rotation} 
      onClick={(e) => { e.stopPropagation(); onClick(name); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      castShadow
    >
      {geometry}
      <meshStandardMaterial 
        {...materialProps} 
        color={hovered ? '#fbbf24' : materialProps.color} // Highlight color on hover
        emissive={hovered ? '#fbbf24' : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  );
};

// Simple primitive tractor for fallback/demo
const SimpleTractor = ({ onClick }: { onClick: (meshName: string) => void }) => {
  return (
    <group>
      {/* Body */}
      <TractorPart 
        name="Body" 
        position={[0, 0.5, 0]} 
        geometry={<boxGeometry args={[1.5, 1, 2.5]} />} 
        materialProps={{ color: "#ef4444" }} 
        onClick={onClick} 
      />
      
      {/* Cabin */}
      <TractorPart 
        name="Cabin" 
        position={[0, 1.5, -0.5]} 
        geometry={<boxGeometry args={[1.2, 1, 1.2]} />} 
        materialProps={{ color: "#333", transparent: true, opacity: 0.8 }} 
        onClick={onClick} 
      />

      {/* Wheels */}
      <TractorPart 
        name="Wheel_Front_Left" 
        position={[-0.9, 0.4, 1]} 
        rotation={[0, 0, Math.PI / 2]} 
        geometry={<cylinderGeometry args={[0.4, 0.4, 0.5, 32]} />} 
        materialProps={{ color: "#1f2937" }} 
        onClick={onClick} 
      />
      <TractorPart 
        name="Wheel_Front_Right" 
        position={[0.9, 0.4, 1]} 
        rotation={[0, 0, Math.PI / 2]} 
        geometry={<cylinderGeometry args={[0.4, 0.4, 0.5, 32]} />} 
        materialProps={{ color: "#1f2937" }} 
        onClick={onClick} 
      />
      <TractorPart 
        name="Wheel_Rear_Left" 
        position={[-1, 0.6, -1]} 
        rotation={[0, 0, Math.PI / 2]} 
        geometry={<cylinderGeometry args={[0.6, 0.6, 0.6, 32]} />} 
        materialProps={{ color: "#1f2937" }} 
        onClick={onClick} 
      />
      <TractorPart 
        name="Wheel_Rear_Right" 
        position={[1, 0.6, -1]} 
        rotation={[0, 0, Math.PI / 2]} 
        geometry={<cylinderGeometry args={[0.6, 0.6, 0.6, 32]} />} 
        materialProps={{ color: "#1f2937" }} 
        onClick={onClick} 
      />

      {/* Exhaust */}
      <TractorPart 
        name="Exhaust" 
        position={[0.5, 1.8, 0.8]} 
        geometry={<cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />} 
        materialProps={{ color: "#555" }} 
        onClick={onClick} 
      />
    </group>
  );
};

interface EvaluasiViewProps {
  data: ModuleContent['evaluasi'];
  moduleId: string;
}

const EvaluasiView = ({ data, moduleId }: EvaluasiViewProps) => {
  const { user } = useAuth();
  const [subTab, setSubTab] = useState<'teori' | 'praktek'>('teori');
  
  // States
  const [teoriAnswers, setTeoriAnswers] = useState<Record<number, number>>({});
  const [praktekAnswers, setPraktekAnswers] = useState<Record<number, boolean>>({}); // id -> correct/wrong
  
  const [activeTeoriId, setActiveTeoriId] = useState<number>(1);
  const [activePraktekId, setActivePraktekId] = useState<number>(1);
  
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0, score: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleObjectClick = (meshName: string) => {
    if (submitted || subTab !== 'praktek') return;
    
    const currentTask = data.praktek.tasks[activePraktekId - 1];
    const isCorrect = meshName === currentTask.targetMeshName;
    
    setPraktekAnswers(prev => ({
      ...prev,
      [activePraktekId]: isCorrect
    }));
  };

  const handleTeoriAnswer = (qId: number, optIdx: number) => {
    if (submitted) return;
    setTeoriAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    const totalTeori = data.teori.questions.length;
    const totalPraktek = data.praktek.tasks.length;
    const totalQuestions = totalTeori + totalPraktek;
    
    let correctTeori = 0;
    data.teori.questions.forEach(q => {
        if (teoriAnswers[q.id] === q.correctAnswer) correctTeori++;
    });

    let correctPraktek = 0;
    data.praktek.tasks.forEach(t => {
        if (praktekAnswers[t.id]) correctPraktek++;
    });

    const totalCorrect = correctTeori + correctPraktek;
    const finalScore = (totalCorrect / totalQuestions) * 100;

    return {
        correct: totalCorrect,
        wrong: totalQuestions - totalCorrect,
        total: totalQuestions,
        score: Math.round(finalScore)
    };
  };

  const handleSubmit = async () => {
    if (confirm('Apakah Anda yakin ingin menyelesaikan ujian? Pastikan semua soal telah terjawab.')) {
        setIsSubmitting(true);
        const result = calculateScore();
        setScore(result);
        setSubmitted(true);

        // Save to DB
        if (window.api && user) {
            try {
                await window.api.addExamResult({
                    studentId: user.id,
                    moduleId: moduleId,
                    score: result.score,
                    type: 'Evaluasi Akhir'
                });
            } catch (error) {
                console.error('Failed to save result:', error);
                alert('Gagal menyimpan hasil ujian');
            }
        }
        setIsSubmitting(false);
    }
  };

  const resetExam = () => {
    if (confirm('Ulangi ujian? Riwayat jawaban akan dihapus.')) {
        setSubmitted(false);
        setTeoriAnswers({});
        setPraktekAnswers({});
        setScore({ correct: 0, wrong: 0, total: 0, score: 0 });
        setActiveTeoriId(1);
        setActivePraktekId(1);
    }
  };

  return (
    <div className="flex w-full h-full bg-nalar-dark/95 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in pointer-events-auto">
      
      {/* 1. LEFT SIDEBAR: Tabs */}
      <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col shrink-0 z-20">
        <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
                <Award className="text-nalar-primary" /> EVALUASI
            </h2>
        </div>
        <div className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setSubTab('teori')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    subTab === 'teori' 
                    ? 'bg-nalar-primary text-nalar-dark shadow-lg shadow-nalar-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <FileText size={18} /> Ujian Teori
            </button>
            <button 
                onClick={() => setSubTab('praktek')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    subTab === 'praktek' 
                    ? 'bg-nalar-primary text-nalar-dark shadow-lg shadow-nalar-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <Box size={18} /> Ujian Praktek
            </button>
        </div>
      </div>

      {/* 2. CENTER: Content */}
      <div className="flex-1 relative bg-gray-900/50 flex flex-col min-w-0">
         {submitted ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-10 animate-fade-in">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-500 border border-green-500/30">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Ujian Selesai!</h2>
                <div className="text-6xl font-bold text-nalar-accent mb-2">{score.score}</div>
                <p className="text-gray-400 mb-8">Nilai Akhir Anda</p>
                
                <div className="grid grid-cols-2 gap-4 max-w-xs w-full text-sm">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                        <span className="block text-gray-400 mb-1">Benar</span>
                        <span className="text-xl font-bold text-green-400">{score.correct}</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                        <span className="block text-gray-400 mb-1">Salah</span>
                        <span className="text-xl font-bold text-red-400">{score.wrong}</span>
                    </div>
                </div>

                <button onClick={resetExam} className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-bold">
                    Ulangi Ujian
                </button>
            </div>
         ) : (
             <>
                {subTab === 'teori' && (
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-3xl mx-auto animate-fade-in">
                            {/* Question Header */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-bold text-nalar-primary uppercase tracking-wider bg-nalar-primary/10 px-3 py-1 rounded-full border border-nalar-primary/20">
                                    Pertanyaan {activeTeoriId}
                                </span>
                                <span className="text-gray-400 text-sm font-mono">
                                    {activeTeoriId} / {data.teori.questions.length}
                                </span>
                            </div>
                            
                            {/* Question Text */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
                                <p className="text-xl text-white font-medium leading-relaxed">
                                    {data.teori.questions[activeTeoriId-1].question}
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                {data.teori.questions[activeTeoriId-1].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleTeoriAnswer(activeTeoriId, idx)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all text-base group relative overflow-hidden ${
                                            teoriAnswers[activeTeoriId] === idx 
                                            ? 'bg-nalar-accent text-nalar-dark border-nalar-accent font-bold shadow-lg shadow-nalar-accent/20' 
                                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-colors shrink-0 ${
                                                teoriAnswers[activeTeoriId] === idx 
                                                ? 'border-nalar-dark text-nalar-dark' 
                                                : 'border-white/30 text-white/50 group-hover:border-white/50 group-hover:text-white'
                                            }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span>{opt}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Navigation Buttons (Prev/Next) */}
                            <div className="flex justify-between mt-8 pt-8 border-t border-white/10">
                                <button 
                                    onClick={() => setActiveTeoriId(prev => Math.max(1, prev - 1))}
                                    disabled={activeTeoriId === 1}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                                >
                                    <ChevronLeft size={18} /> Sebelumnya
                                </button>
                                <button 
                                    onClick={() => setActiveTeoriId(prev => Math.min(data.teori.questions.length, prev + 1))}
                                    disabled={activeTeoriId === data.teori.questions.length}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                                >
                                    Selanjutnya <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {subTab === 'praktek' && (
                    <div className="w-full h-full relative">
                        {/* Instruction Overlay */}
                        <div className="absolute top-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
                            <div className="bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl max-w-lg text-center pointer-events-auto">
                                <h3 className="text-nalar-accent font-bold mb-1 text-sm uppercase tracking-wider">Tugas Praktek #{activePraktekId}</h3>
                                <p className="text-white text-lg font-medium leading-relaxed">
                                    {data.praktek.tasks[activePraktekId-1].question}
                                </p>
                                {praktekAnswers[data.praktek.tasks[activePraktekId-1].id] !== undefined && (
                                   <div className={`mt-2 font-bold text-sm px-3 py-1 rounded-full inline-block ${praktekAnswers[data.praktek.tasks[activePraktekId-1].id] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                     {praktekAnswers[data.praktek.tasks[activePraktekId-1].id] ? 'BENAR' : 'SALAH'}
                                   </div>
                                )}
                            </div>
                        </div>

                        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/50">Loading 3D Model...</div>}>
                           <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 3, 4], fov: 45 }} className="w-full h-full">
                             <Stage environment="city" intensity={0.6}>
                               <SimpleTractor onClick={handleObjectClick} />
                             </Stage>
                             <OrbitControls />
                           </Canvas>
                        </Suspense>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] text-white/50 border border-white/5 pointer-events-none">
                           Klik bagian model untuk menjawab
                        </div>
                    </div>
                )}
             </>
         )}
      </div>

      {/* 3. RIGHT SIDEBAR: Navigation Grid */}
      <div className="w-72 bg-black/40 border-l border-white/10 flex flex-col shrink-0 z-20">
         <div className="p-4 border-b border-white/10 bg-black/20">
             <h3 className="font-bold text-white flex items-center gap-2">
                 <List size={18} className="text-nalar-primary" /> Navigasi Soal
             </h3>
             <p className="text-xs text-gray-500 mt-1">
                {subTab === 'teori' 
                    ? `${Object.keys(teoriAnswers).length} dari ${data.teori.questions.length} terjawab`
                    : `${Object.keys(praktekAnswers).length} dari ${data.praktek.tasks.length} selesai`
                }
             </p>
         </div>
         
         <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {!submitted && (
                <div className="grid grid-cols-5 gap-2">
                    {subTab === 'teori' 
                        ? data.teori.questions.map(q => (
                            <button
                                key={q.id}
                                onClick={() => setActiveTeoriId(q.id)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                    activeTeoriId === q.id 
                                        ? 'ring-2 ring-white bg-nalar-accent text-nalar-dark' 
                                        : teoriAnswers[q.id] !== undefined 
                                            ? 'bg-green-500/80 text-white' 
                                            : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'
                                }`}
                            >
                                {q.id}
                            </button>
                        ))
                        : data.praktek.tasks.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActivePraktekId(t.id)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                    activePraktekId === t.id 
                                        ? 'ring-2 ring-white bg-nalar-accent text-nalar-dark' 
                                        : praktekAnswers[t.id] === true
                                            ? 'bg-green-500/80 text-white'
                                            : praktekAnswers[t.id] === false
                                                ? 'bg-red-500/80 text-white'
                                                : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'
                                }`}
                            >
                                {t.id}
                            </button>
                        ))
                    }
                </div>
            )}
         </div>

         <div className="p-4 border-t border-white/10 bg-black/20">
             {!submitted && (
                 <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-nalar-primary hover:bg-nalar-primary/90 text-nalar-dark font-bold rounded-lg transition-colors shadow-lg shadow-nalar-primary/10 disabled:opacity-50"
                 >
                     {isSubmitting ? 'Menyimpan...' : 'Selesai Ujian'}
                 </button>
             )}
         </div>
      </div>
    </div>
  );
};

export default EvaluasiView;
