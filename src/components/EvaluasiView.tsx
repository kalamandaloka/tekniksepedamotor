import { useState } from 'react';
import { type ModuleContent } from '../types/ModuleContent';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, FileText, Check, Play, AlertCircle, Award, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper component for interactive parts with hover effect
// Praktek dihapus dari UI

interface EvaluasiViewProps {
  data: ModuleContent['evaluasi'];
  moduleId: string;
}

const EvaluasiView = ({ data, moduleId }: EvaluasiViewProps) => {
  const { user } = useAuth();
  const [subTab, setSubTab] = useState<'teori'>('teori');
  
  // States
  const [teoriAnswers, setTeoriAnswers] = useState<Record<number, number>>({});
  const [activeTeoriId, setActiveTeoriId] = useState<number>(1);
  
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0, score: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTeoriAnswer = (qId: number, optIdx: number) => {
    if (submitted) return;
    setTeoriAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    const totalTeori = data.teori.questions.length;
    const totalQuestions = totalTeori;
    
    let correctTeori = 0;
    data.teori.questions.forEach(q => {
        if (teoriAnswers[q.id] === q.correctAnswer) correctTeori++;
    });

    const totalCorrect = correctTeori;
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
        setScore({ correct: 0, wrong: 0, total: 0, score: 0 });
        setActiveTeoriId(1);
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
                {`${Object.keys(teoriAnswers).length} dari ${data.teori.questions.length} terjawab`}
             </p>
         </div>
         
         <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {!submitted && (
                <div className="grid grid-cols-5 gap-2">
                    {data.teori.questions.map(q => (
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
                    ))}
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
