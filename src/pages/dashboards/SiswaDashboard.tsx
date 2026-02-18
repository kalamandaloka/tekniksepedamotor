import { useState, useEffect } from 'react';
import Experience from '../../components/Experience';
import UI from '../../components/UI';
import ModuleSelector from '../../components/ModuleSelector';
import { type ModuleData } from '../../data/modules';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, LogOut, Sun, Moon } from 'lucide-react';

// --- Types ---
interface ExamResult {
  id: number;
  student_id: number;
  student_name: string;
  kelas: string;
  module_id: string;
  score: number;
  date: string;
  type: string;
}

interface ExamResultsViewProps {
  theme: 'dark' | 'light';
}

const ExamResultsView = ({ theme }: ExamResultsViewProps) => {
    const [results, setResults] = useState<ExamResult[]>([]);
    const { user } = useAuth();
    const isLight = theme === 'light';

    useEffect(() => {
        const fetchResults = async () => {
            if(window.api && user) {
                // Pass user.id to filter results
                const res = await window.api.getExamResults(user.id);
                if(res.success && res.results) setResults(res.results);
            } else {
                 // Mock data for development/browser
                setResults([
                    { id: 1, student_id: 1, student_name: 'Siswa Mock', kelas: 'XII-A', module_id: 'LD-01', score: 85, date: '2023-10-10', type: 'Evaluasi Akhir' }
                ]);
            }
        };
        fetchResults();
    }, [user]);

    return (
        <div className="space-y-6 animate-fade-in p-8 h-full overflow-y-auto">
            <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Riwayat Hasil Ujian</h2>
            <div className={`rounded-xl overflow-hidden border ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className={`text-sm uppercase tracking-wider border-b ${isLight ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-white/10 text-gray-400'}`}>
                            <th className="p-4 font-medium">Tanggal</th>
                            <th className="p-4 font-medium">Modul</th>
                            <th className="p-4 font-medium">Tipe Ujian</th>
                            <th className="p-4 font-medium text-right">Nilai</th>
                        </tr>
                    </thead>
                    <tbody className={`text-sm divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
                        {results.length > 0 ? (
                            results.map((r) => (
                                <tr
                                  key={r.id}
                                  className={isLight ? 'hover:bg-slate-50 transition-colors text-slate-900' : 'hover:bg-white/5 transition-colors text-white'}
                                >
                                    <td className={isLight ? 'p-4 text-slate-500' : 'p-4 text-gray-400'}>
                                        {new Date(r.date).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="p-4 font-medium">{r.module_id}</td>
                                    <td className="p-4">
                                        <span
                                          className={
                                            isLight
                                              ? 'bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs'
                                              : 'bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs'
                                          }
                                        >
                                            {r.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-nalar-primary">{r.score}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                  colSpan={4}
                                  className={isLight ? 'p-8 text-center text-slate-500' : 'p-8 text-center text-gray-500'}
                                >
                                    Belum ada data hasil ujian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
     );
};

const SiswaDashboard = () => {
  const [activeModule, setActiveModule] = useState<ModuleData | null>(null);
  const [activeTab, setActiveTab] = useState<'modul' | 'ujian'>('modul');
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('theme');
    return stored === 'light' ? 'light' : 'dark';
  });
  const isLight = theme === 'light';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="w-full h-screen bg-nalar-dark flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col shrink-0 z-50 backdrop-blur-sm">
        <div className="p-6">
           <h1 className="text-2xl font-bold tracking-wider text-nalar-accent">NALAR<span className="text-white">ED</span></h1>
           <p className="text-xs text-gray-500 mt-1">Student Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
            <button
                onClick={() => setActiveTab('modul')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'modul' 
                    ? 'bg-nalar-primary text-nalar-dark shadow-lg shadow-nalar-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
             >
                <BookOpen size={20} />
                Modul Pembelajaran
             </button>
             <button
                onClick={() => setActiveTab('ujian')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'ujian' 
                    ? 'bg-nalar-primary text-nalar-dark shadow-lg shadow-nalar-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
             >
                <Award size={20} />
                Hasil Ujian
             </button>
        </nav>

        <div className="p-4 border-t border-white/10">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-nalar-accent/20 flex items-center justify-center text-nalar-accent font-bold">
                 {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                 <p className="text-xs text-gray-500">Siswa</p>
              </div>
           </div>
           <button
             onClick={toggleTheme}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-3 rounded-lg text-xs font-medium border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 transition-colors"
           >
             {isLight ? <Moon size={14} /> : <Sun size={14} />}
             <span>{isLight ? 'Mode Gelap' : 'Mode Terang'}</span>
           </button>
           <button 
             onClick={logout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm transition-colors"
           >
             <LogOut size={16} /> Keluar
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 relative overflow-hidden bg-gradient-to-br ${
          isLight ? 'from-slate-100 to-slate-200' : 'from-nalar-dark to-black'
        }`}
      >
         {/* Experience Background - Only visible in Modul tab */}
         {activeTab === 'modul' && <Experience />}

         <div className="absolute inset-0 z-10">
            {activeTab === 'modul' && (
                activeModule ? (
                    <UI 
                        activeModule={activeModule} 
                        onHomeClick={() => setActiveModule(null)} 
                    />
                ) : (
                    <ModuleSelector onSelectModule={setActiveModule} theme={theme} />
                )
            )}
            
            {activeTab === 'ujian' && <ExamResultsView theme={theme} />}
         </div>
      </div>
    </div>
  );
};

export default SiswaDashboard;
