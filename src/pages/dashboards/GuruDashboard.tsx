import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UI from '../../components/UI';
import { type ModuleData } from '../../data/modules';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Award, 
  School,
  LogOut,
  Plus,
  Search,
  Trash2,
  MoreVertical,
  Lock,
  CheckCircle,
  PlayCircle,
  ShoppingCart,
  Sun,
  Moon
} from 'lucide-react';
import { modules } from '../../data/modules';

// --- Types ---
interface Student {
  id: number;
  nik: string;
  name: string;
  kelas: string;
  username: string;
}

interface ClassData {
  id: number;
  name: string;
}

interface ExamResult {
  id: number;
  student_name: string;
  kelas: string;
  module_id: string;
  score: number;
  date: string;
  type: 'teori' | 'praktek';
}

interface DashboardStats {
  studentCount: number;
  classCount: number;
  moduleCount: number;
  avgScore: number;
}

// --- Sub-Components ---

type PaketId = 'tsm1' | 'tsm2' | 'tsmlistrik';

interface HomeViewProps {
  onNavigateToModules: (paket: PaketId) => void;
  theme: 'dark' | 'light';
}

const HomeView = ({ onNavigateToModules, theme }: HomeViewProps) => {
  const [stats, setStats] = useState<DashboardStats>({
    studentCount: 0,
    classCount: 0,
    moduleCount: 0,
    avgScore: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (window.api) {
        const res = await window.api.getDashboardStats();
        if (res.success && res.stats) setStats(res.stats);
      } else {
        // Mock
        setStats({ studentCount: 24, classCount: 6, moduleCount: 15, avgScore: 85.5 });
      }
    };
    fetchStats();
  }, []);

  const isLight = theme === 'light';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Ringkasan Statistik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Siswa" value={stats.studentCount} icon={<Users />} color="blue" theme={theme} />
          <StatCard title="Total Kelas" value={stats.classCount} icon={<School />} color="green" theme={theme} />
          <StatCard title="Total Modul" value={stats.moduleCount} icon={<BookOpen />} color="purple" theme={theme} />
          <StatCard title="Rata-rata Nilai" value={stats.avgScore.toFixed(1)} icon={<Award />} color="orange" theme={theme} />
        </div>
      </div>

      <div>
        <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Paket Media Pembelajaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-2xl border border-nalar-primary/30 bg-black shadow-lg shadow-nalar-primary/5 hover:shadow-nalar-primary/20 transition-all duration-300 hover:-translate-y-1 w-full h-auto aspect-[3/4]">
                <div className="absolute inset-0 z-0 h-full">
                    <img 
                        src="/images/global/tsm1.png" 
                        alt="Teknik Sepeda Motor Jilid 1" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                <div className="absolute top-0 right-0 p-4 z-10">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/80 text-white text-xs font-bold border border-green-400 shadow-sm backdrop-blur-md">
                        <CheckCircle size={12} /> Terbuka
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-10 bg-gradient-to-t from-black to-transparent pt-20">
                    <div className="w-12 h-12 rounded-xl bg-nalar-primary flex items-center justify-center text-nalar-dark mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-nalar-primary/30">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                        Teknik Sepeda Motor Jilid 1
                    </h3>
                    <p className="text-gray-200 text-sm mb-6 font-medium drop-shadow-sm line-clamp-2">
                        Mesin Dasar dan Kelistrikan (18 Modul)
                    </p>
                    <button 
                        onClick={() => onNavigateToModules('tsm1')}
                        className="w-full py-3 rounded-lg bg-nalar-primary text-nalar-dark font-bold text-sm hover:bg-white hover:text-nalar-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-nalar-primary/20">
                        <PlayCircle size={18} /> Lihat Modul
                    </button>
                </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl border border-nalar-primary/30 bg-black shadow-lg shadow-nalar-primary/5 hover:shadow-nalar-primary/20 transition-all duration-300 hover:-translate-y-1 w-full h-auto aspect-[3/4]">
                <div className="absolute inset-0 z-0 h-full">
                    <img 
                        src="/images/global/tsm2.png" 
                        alt="Teknik Sepeda Motor Jilid 2" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                <div className="absolute top-0 right-0 p-4 z-10">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/80 text-white text-xs font-bold border border-green-400 shadow-sm backdrop-blur-md">
                        <CheckCircle size={12} /> Terbuka
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-10 bg-gradient-to-t from-black to-transparent pt-20">
                    <div className="w-12 h-12 rounded-xl bg-nalar-primary flex items-center justify-center text-nalar-dark mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-nalar-primary/30">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                        Teknik Sepeda Motor Jilid 2
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 font-medium drop-shadow-sm line-clamp-2">
                        Pemindah Daya dan Kendali Sasis (17 Modul)
                    </p>
                    <button 
                        onClick={() => onNavigateToModules('tsm2')}
                        className="w-full py-3 rounded-lg bg-nalar-primary text-nalar-dark font-bold text-sm hover:bg-white hover:text-nalar-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-nalar-primary/20">
                        <PlayCircle size={18} /> Lihat Modul
                    </button>
                </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl border border-nalar-primary/30 bg-black shadow-lg shadow-nalar-primary/5 hover:shadow-nalar-primary/20 transition-all duration-300 hover:-translate-y-1 w-full h-auto aspect-[3/4]">
                <div className="absolute inset-0 z-0 h-full">
                    <img 
                        src="/images/global/tsm3.png" 
                        alt="Teknik Sepeda Motor Jilid 3" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                <div className="absolute top-0 right-0 p-4 z-10">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/80 text-white text-xs font-bold border border-green-400 shadow-sm backdrop-blur-md">
                        <CheckCircle size={12} /> Terbuka
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-10 bg-gradient-to-t from-black to-transparent pt-20">
                    <div className="w-12 h-12 rounded-xl bg-nalar-primary flex items-center justify-center text-nalar-dark mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-nalar-primary/30">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                        Teknik Sepeda Motor Jilid 3
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 font-medium drop-shadow-sm line-clamp-2">
                        Sepeda Motor Listrik (15 Modul)
                    </p>
                    <button 
                        onClick={() => onNavigateToModules('tsmlistrik')}
                        className="w-full py-3 rounded-lg bg-nalar-primary text-nalar-dark font-bold text-sm hover:bg-white hover:text-nalar-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-nalar-primary/20">
                        <PlayCircle size={18} /> Lihat Modul
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  theme: 'dark' | 'light';
}

const StatCard = ({ title, value, icon, color, theme }: StatCardProps) => {
  const isLight = theme === 'light';

  const darkColors: Record<StatCardProps['color'], string> = {
    blue: "from-blue-900/40 to-black/40 border-blue-500/30 text-blue-300",
    green: "from-green-900/40 to-black/40 border-green-500/30 text-green-300",
    purple: "from-purple-900/40 to-black/40 border-purple-500/30 text-purple-300",
    orange: "from-orange-900/40 to-black/40 border-orange-500/30 text-orange-300",
  };

  const lightColors: Record<StatCardProps['color'], string> = {
    blue: "from-blue-50 to-white border-blue-200 text-blue-700",
    green: "from-emerald-50 to-white border-emerald-200 text-emerald-700",
    purple: "from-violet-50 to-white border-violet-200 text-violet-700",
    orange: "from-amber-50 to-white border-amber-200 text-amber-700",
  };

  const palette = isLight ? lightColors : darkColors;
  
  return (
    <div className={`bg-gradient-to-br ${palette[color]} border p-6 rounded-xl`}>
      <div className="flex justify-between items-start">
        <div>
           <h3 className={`text-3xl font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{value}</h3>
           <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-200'} opacity-80`}>{title}</p>
        </div>
        <div className={`p-3 rounded-lg ${isLight ? 'bg-white/80 text-slate-700' : 'bg-white/5 text-white'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface ClassesViewProps {
  theme: 'dark' | 'light';
}

const ClassesView = ({ theme }: ClassesViewProps) => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchClasses = async () => {
    if (window.api) {
      const res = await window.api.getClasses();
      if (res.success && res.classes) setClasses(res.classes);
    } else {
      setClasses([{ id: 1, name: 'XII-A' }, { id: 2, name: 'XII-B' }]);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (window.api) {
      const res = await window.api.addClass(newClassName);
      if (res.success) {
        setNewClassName('');
        setShowAddModal(false);
        fetchClasses();
      } else {
        alert(res.error);
      }
    } else {
        alert("Fitur ini memerlukan aplikasi desktop (Electron) agar data tersimpan di database.");
    }
    setLoading(false);
  };

  const handleDeleteClass = async (id: number) => {
      if(!confirm('Hapus kelas ini?')) return;
      if(window.api) {
          await window.api.deleteClass(id);
          fetchClasses();
      }
  };

  const isLight = theme === 'light';

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Manajemen Kelas</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-nalar-primary hover:bg-nalar-primary/80 text-nalar-dark font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Kelas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(c => (
          <div
            key={c.id}
            className={`p-6 rounded-xl flex justify-between items-center group transition-colors border ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
               <div
                 className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                   isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300'
                 }`}
               >
                 {c.name.substring(0, 2)}
               </div>
               <div>
                 <h3 className={`font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>{c.name}</h3>
                 <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Kelas Aktif</p>
               </div>
            </div>
            <button 
                onClick={() => handleDeleteClass(c.id)}
                className={`p-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isLight ? 'text-slate-400 hover:text-red-500' : 'text-gray-500 hover:text-red-400'
                }`}
            >
                <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-nalar-dark border border-white/10 rounded-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-white mb-4">Tambah Kelas Baru</h3>
              <form onSubmit={handleAddClass}>
                 <input 
                    type="text" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Nama Kelas (misal: XII-C)"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white mb-4 focus:border-nalar-primary outline-none"
                    required
                 />
                 <div className="flex gap-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg">Batal</button>
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-nalar-primary text-nalar-dark font-bold rounded-lg">Simpan</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

interface StudentsViewProps {
  theme: 'dark' | 'light';
}

const StudentsView = ({ theme }: StudentsViewProps) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ nik: '', name: '', kelas: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (window.api) {
                const sRes = await window.api.getStudents();
                const cRes = await window.api.getClasses();
                if (sRes.success && sRes.students) setStudents(sRes.students);
                if (cRes.success && cRes.classes) setClasses(cRes.classes);
            } else {
                setStudents([
                    { id: 1, nik: '12345', name: 'Andi Mock', kelas: 'XII-A', username: '12345' }
                ]);
                setClasses([{ id: 1, name: 'XII-A' }, { id: 2, name: 'XII-B' }]);
            }
        };
        loadData();
    }, []);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if(window.api) {
            const res = await window.api.addStudent(formData);
            if(res.success) {
                setShowAddModal(false);
                setFormData({ nik: '', name: '', kelas: '' });
                const sRes = await window.api.getStudents(); // Refresh
                if (sRes.success && sRes.students) setStudents(sRes.students);
            } else {
                alert(res.error);
            }
        }
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.nik.includes(searchTerm) ||
        s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isLight = theme === 'light';

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Data Siswa</h2>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari siswa..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-nalar-primary outline-none border ${
                              isLight
                                ? 'bg-white text-slate-900 border-slate-200'
                                : 'bg-black/20 text-white border-white/10'
                            }`}
                        />
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-nalar-primary hover:bg-nalar-primary/80 text-nalar-dark font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                        <Plus size={18} /> Tambah Siswa
                    </button>
                </div>
            </div>

            <div
              className={`rounded-xl overflow-hidden border ${
                isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}
            >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr
                          className={`text-sm uppercase tracking-wider border-b ${
                            isLight ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-white/10 text-gray-400'
                          }`}
                        >
                            <th className="p-4 font-medium">No</th>
                            <th className="p-4 font-medium">NIK</th>
                            <th className="p-4 font-medium">Nama</th>
                            <th className="p-4 font-medium">Kelas</th>
                            <th className="p-4 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={`text-sm divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
                        {filteredStudents.map((s, idx) => (
                            <tr
                              key={s.id}
                              className={
                                isLight
                                  ? 'hover:bg-slate-50 transition-colors text-slate-900'
                                  : 'hover:bg-white/5 transition-colors text-white'
                              }
                            >
                                <td className={isLight ? 'p-4 text-slate-500' : 'p-4 text-gray-400'}>{idx + 1}</td>
                                <td className={isLight ? 'p-4 font-mono text-slate-900' : 'p-4 text-white font-mono'}>
                                    {s.nik}
                                </td>
                                <td className={isLight ? 'p-4 text-slate-900' : 'p-4 text-white'}>{s.name}</td>
                                <td className="p-4">
                                  <span
                                    className={
                                      isLight
                                        ? 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs'
                                        : 'bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs'
                                    }
                                  >
                                    {s.kelas}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                      className={
                                        isLight
                                          ? 'text-slate-400 hover:text-slate-700'
                                          : 'text-gray-400 hover:text-white'
                                      }
                                    >
                                      <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-nalar-dark border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Tambah Siswa</h3>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">NIK</label>
                                <input required type="text" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Nama Lengkap</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Kelas</label>
                                <select required value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white">
                                    <option value="">Pilih Kelas</option>
                                    {classes.length > 0 ? (
                                        classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                                    ) : (
                                        <option value="" disabled>Belum ada data kelas</option>
                                    )}
                                </select>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                                * Password default siswa: <span className="text-nalar-primary font-mono">12345678</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg">Batal</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-nalar-primary text-nalar-dark font-bold rounded-lg">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

interface ModulesViewProps {
  onSelectModule: (m: ModuleData) => void;
  theme: 'dark' | 'light';
  activePackage: PaketId | null;
}

const ModulesView = ({ onSelectModule, theme, activePackage }: ModulesViewProps) => {
    const isLight = theme === 'light';

    type PaketConfig = {
        id: PaketId;
        title: string;
        description: string;
        range: { min: number; max: number };
    };

    const paketConfigs: PaketConfig[] = [
        {
            id: 'tsm1',
            title: 'Teknik Sepeda Motor Jilid 1 : Mesin Dasar dan Kelistrikan',
            description: 'Jilid 1 mencakup mesin dasar dan kelistrikan sepeda motor (modul 001–018).',
            range: { min: 1, max: 18 }
        },
        {
            id: 'tsm2',
            title: 'Teknik Sepeda Motor Jilid 2 : Sistem Penggerak dan Sasis',
            description: 'Jilid 2 membahas sistem penggerak dan sasis (modul 019–035).',
            range: { min: 19, max: 35 }
        },
        {
            id: 'tsmlistrik',
            title: 'Teknik Sepeda Motor Jilid 3 : Sepeda Motor Listrik',
            description: 'Jilid 3 fokus pada sepeda motor listrik dan sistem pendukungnya (modul 036–050).',
            range: { min: 36, max: 50 }
        }
    ];

    const tabLabels: Record<PaketId, string> = {
        tsm1: 'Teknik Sepeda Motor 1',
        tsm2: 'Teknik Sepeda Motor 2',
        tsmlistrik: 'Teknik Sepeda Motor 3',
    };

    const [selectedPaketId, setSelectedPaketId] = useState<PaketId>(activePackage ?? 'tsm1');

    useEffect(() => {
        if (activePackage) {
            setSelectedPaketId(activePackage);
        }
    }, [activePackage]);

    const getNumberFromId = (id: string) => {
        const num = Number(id.slice(-3));
        return Number.isNaN(num) ? 0 : num;
    };

    const renderModuleCard = (m: ModuleData) => {
        const heroImage = heroImages[selectedPaketId];

        return (
        <div 
            key={m.id}
            className={`flex flex-col md:flex-row gap-4 md:items-center rounded-xl border p-4 md:p-5 transition-colors ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
        >
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden flex-shrink-0 relative"
            >
                <img
                  src={heroImage.src}
                  alt={heroImage.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded border ${
                        isLight
                          ? 'border-slate-200 text-slate-600 bg-slate-50'
                          : 'border-white/20 text-gray-300 bg-white/5'
                      }`}
                    >
                      ID: {m.id}
                    </span>
                    <h3
                      className={`text-base md:text-lg font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {m.title}
                    </h3>
                </div>
                <p
                  className={`text-sm ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}
                >
                  {m.description}
                </p>
                <div className="grid gap-1 text-xs md:text-sm mt-1">
                  <div
                    className={isLight ? 'text-slate-600' : 'text-gray-300'}
                  >
                    <span className="font-semibold">CP Fase F:</span>{' '}
                    <span>Pemahaman dan penerapan praktik agribisnis tanaman perkebunan secara komprehensif.</span>
                  </div>
                  <div
                    className={isLight ? 'text-slate-600' : 'text-gray-300'}
                  >
                    <span className="font-semibold">SKKNI:</span>{' '}
                    <span>Selaras dengan standar kompetensi kerja nasional bidang agribisnis tanaman perkebunan.</span>
                  </div>
                </div>
            </div>
            <div className="mt-3 md:mt-0 flex justify-end md:ml-auto">
              <button
                onClick={() => onSelectModule(m)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap ${
                  isLight
                    ? 'bg-nalar-primary text-nalar-dark hover:bg-nalar-primary/90'
                    : 'bg-nalar-primary text-nalar-dark hover:bg-white'
                }`}
              >
                Mulai Mengajar
              </button>
            </div>
        </div>
        );
    };

    const selectedPaket = paketConfigs.find((p) => p.id === selectedPaketId) ?? paketConfigs[0];

    const selectedModules = modules.filter((m) => {
        const num = getNumberFromId(m.id);
        return num >= selectedPaket.range.min && num <= selectedPaket.range.max;
    });

    const heroImages: Record<PaketId, { src: string; alt: string }> = {
        tsm1: {
            src: '/images/global/tsm1.png',
            alt: 'Teknik Sepeda Motor Jilid 1',
        },
        tsm2: {
            src: '/images/global/tsm2.png',
            alt: 'Teknik Sepeda Motor Jilid 2',
        },
        tsmlistrik: {
            src: '/images/global/tsm3.png',
            alt: 'Teknik Sepeda Motor Jilid 3',
        },
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div
              className={`rounded-xl border p-4 md:p-5 ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <h3 className="text-sm font-semibold tracking-wide uppercase text-nalar-primary">
                Informasi Pembelajaran
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  isLight ? 'text-slate-700' : 'text-gray-200'
                }`}
              >
                Pembelajaran teknik sepeda motor pada paket media ini dirancang untuk
                mensimulasikan proses kerja nyata di bengkel, mulai dari pemahaman dasar mesin
                dan kelistrikan, sistem pemindah daya, hingga sasis dan sepeda motor listrik
                secara interaktif.
              </p>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  isLight ? 'text-slate-700' : 'text-gray-200'
                }`}
              >
                Seluruh materi telah diselaraskan dengan Standar Kompetensi Kerja Nasional Indonesia
                (SKKNI) bidang teknik dan bisnis sepeda motor serta capaian pembelajaran vokasi,
                sehingga dapat digunakan sebagai pendukung pembelajaran yang autentik, terstruktur,
                dan berorientasi kompetensi industri.
              </p>
            </div>
            <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Paket Media Pembelajaran</h2>
            <div className="mt-4 space-y-6">
                <div className="w-full rounded-lg border border-white/10 bg-black/40 p-1">
                    <div className="grid grid-cols-3 gap-1">
                        {paketConfigs.map((paket) => {
                            const active = paket.id === selectedPaketId;
                            return (
                                <button
                                    key={paket.id}
                                    onClick={() => setSelectedPaketId(paket.id)}
                                    className={`w-full px-4 py-2 text-xs md:text-sm rounded-md font-medium text-center transition-all ${
                                        active
                                            ? 'bg-nalar-primary text-nalar-dark shadow shadow-nalar-primary/30'
                                            : isLight
                                                ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {tabLabels[paket.id]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <section className="space-y-4">
                    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-black/60 relative">
                        <div className="absolute inset-0">
                            <img
                              src={heroImages[selectedPaketId].src}
                              alt={heroImages[selectedPaketId].alt}
                              className="w-full h-40 md:h-52 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                        </div>
                        <div className="relative p-4 md:p-5 flex flex-col justify-center h-40 md:h-52">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                                {tabLabels[selectedPaketId]}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-200 max-w-xl">
                                {selectedPaket.description}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {selectedModules.map((m) => renderModuleCard(m))}
                    </div>
                </section>
            </div>
        </div>
    );
};

interface ExamsViewProps {
  theme: 'dark' | 'light';
}

const ExamsView = ({ theme }: ExamsViewProps) => {
    const [results, setResults] = useState<ExamResult[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            if(window.api) {
                const res = await window.api.getExamResults();
                if(res.success && res.results) setResults(res.results);
            } else {
                setResults([
                    { id: 1, student_name: 'Andi Mock', kelas: 'XII-A', module_id: 'LD-01', score: 85, date: '2023-10-10', type: 'teori' }
                ]);
            }
        };
        fetchResults();
    }, []);

    const isLight = theme === 'light';

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Hasil Ujian Siswa</h2>
            <div
              className={`rounded-xl overflow-hidden border ${
                isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}
            >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr
                          className={`text-sm uppercase tracking-wider border-b ${
                            isLight ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-white/10 text-gray-400'
                          }`}
                        >
                            <th className="p-4 font-medium">Tanggal</th>
                            <th className="p-4 font-medium">Siswa</th>
                            <th className="p-4 font-medium">Kelas</th>
                            <th className="p-4 font-medium">Modul</th>
                            <th className="p-4 font-medium">Tipe</th>
                            <th className="p-4 font-medium text-right">Nilai</th>
                        </tr>
                    </thead>
                    <tbody className={`text-sm divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
                        {results.length > 0 ? results.map((r) => (
                            <tr
                              key={r.id}
                              className={
                                isLight
                                  ? 'hover:bg-slate-50 transition-colors text-slate-900'
                                  : 'hover:bg-white/5 transition-colors text-white'
                              }
                            >
                                <td className={isLight ? 'p-4 text-slate-500' : 'p-4 text-gray-400'}>{r.date}</td>
                                <td className={isLight ? 'p-4 font-medium text-slate-900' : 'p-4 text-white font-medium'}>
                                    {r.student_name}
                                </td>
                                <td className={isLight ? 'p-4 text-slate-700' : 'p-4 text-gray-300'}>{r.kelas}</td>
                                <td className={isLight ? 'p-4 text-slate-700' : 'p-4 text-gray-300'}>{r.module_id}</td>
                                <td className="p-4">
                                    <span
                                      className={`px-2 py-1 rounded text-xs border ${
                                        r.type === 'teori'
                                          ? isLight
                                            ? 'bg-blue-100 border-blue-200 text-blue-700'
                                            : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                                          : isLight
                                            ? 'bg-amber-100 border-amber-200 text-amber-700'
                                            : 'bg-orange-500/20 border-orange-500/30 text-orange-300'
                                      }`}
                                    >
                                        {r.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <span
                                      className={`font-bold ${
                                        r.score >= 75
                                          ? isLight
                                            ? 'text-emerald-600'
                                            : 'text-green-400'
                                          : isLight
                                            ? 'text-red-600'
                                            : 'text-red-400'
                                      }`}
                                    >
                                        {r.score}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                              <td
                                colSpan={6}
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

// --- Main Layout ---

const GuruDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'beranda' | 'kelas' | 'siswa' | 'modul' | 'ujian'>('beranda');
  const [activeModule, setActiveModule] = useState<ModuleData | null>(null);
  const [activePackage, setActivePackage] = useState<PaketId | null>(null);
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

  const handleNavigateToModules = (paket: PaketId) => {
    setActivePackage(paket);
    setActiveTab('modul');
  };

  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: LayoutDashboard },
    { id: 'kelas', label: 'Kelas', icon: School },
    { id: 'siswa', label: 'Siswa', icon: Users },
    { id: 'modul', label: 'Modul', icon: BookOpen },
    { id: 'ujian', label: 'Ujian', icon: Award },
  ];

  return (
    <div className="w-full h-screen bg-nalar-dark flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6">
           <h1 className="text-2xl font-bold tracking-wider text-nalar-accent">NALAR<span className="text-white">ED</span></h1>
           <p className="text-xs text-gray-500 mt-1">Teacher Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
           {menuItems.map((item) => (
             <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  if (item.id === 'modul') {
                    setActivePackage(null);
                  }
                  setActiveModule(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id 
                    ? 'bg-nalar-primary text-nalar-dark shadow-lg shadow-nalar-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
             >
                <item.icon size={20} />
                {item.label}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-white/10">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-nalar-accent/20 flex items-center justify-center text-nalar-accent font-bold">
                 {user?.name?.charAt(0) || 'G'}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                 <p className="text-xs text-gray-500">Guru</p>
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
        className={`flex-1 overflow-auto bg-gradient-to-br relative ${
          isLight ? 'from-slate-100 to-slate-200' : 'from-nalar-dark to-black'
        }`}
      >
        {activeTab === 'modul' && activeModule ? (
             <div className={`absolute inset-0 z-10 ${isLight ? 'bg-white' : 'bg-nalar-dark'}`}>
                <UI activeModule={activeModule} onHomeClick={() => setActiveModule(null)} />
             </div>
        ) : (
            <div className="p-8 max-w-7xl mx-auto">
                {activeTab === 'beranda' && <HomeView onNavigateToModules={handleNavigateToModules} theme={theme} />}
                {activeTab === 'kelas' && <ClassesView theme={theme} />}
                {activeTab === 'siswa' && <StudentsView theme={theme} />}
                {activeTab === 'modul' && <ModulesView onSelectModule={setActiveModule} theme={theme} activePackage={activePackage} />}
                {activeTab === 'ujian' && <ExamsView theme={theme} />}
            </div>
        )}
      </div>
    </div>
  );
};

export default GuruDashboard;
