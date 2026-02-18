import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Key, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  FileText,
  Box,
  Cpu,
  Award
} from 'lucide-react';
import { type ModuleContent } from '../../types/ModuleContent';
import { modules as staticModules, type ModuleData } from '../../data/modules';
import { createDummyContent } from '../../utils/createDummyContent';

// --- Types ---
interface License {
    id: number;
    code: string;
    status: string;
    activation_date: string | null;
    duration_days: number;
}

// --- Dynamic Import Helper ---
const loadModuleContent = async (module: ModuleData): Promise<ModuleContent | null> => {
  try {
    if (window.api && window.api.getModuleContent) {
      const dbContent = await window.api.getModuleContent(module.id);
      if (dbContent && dbContent.content) {
        return dbContent.content;
      }
    }

    const loadedModule = await import(`../../modules/${module.id}/index.ts`);
    return loadedModule.default;
  } catch (error) {
    console.error(`Failed to load module ${module.id}:`, error);
    return createDummyContent(module.id, module.title);
  }
};

// --- Sub-Components ---

const LicensesView = () => {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [code, setCode] = useState('');
    const [duration, setDuration] = useState(30);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchLicenses = async () => {
        if (window.api) {
            const result = await window.api.getLicenses();
            if (result.success) setLicenses(result.licenses);
        }
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (window.api) {
            const result = await window.api.addLicense({ code, duration_days: duration });
            if (result.success) {
                setCode('');
                fetchLicenses();
            } else {
                setError(result.error || 'Gagal menambah lisensi');
            }
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Hapus lisensi ini?')) {
            if (window.api) {
                await window.api.deleteLicense(id);
                fetchLicenses();
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Key className="text-nalar-primary" /> Manajemen Lisensi
            </h2>

            {/* Add Form */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">Tambah Lisensi Baru</h3>
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm text-gray-400">Kode Lisensi</label>
                        <input 
                            type="text" 
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-nalar-primary outline-none"
                            placeholder="Contoh: LIC-2024-001"
                            required
                        />
                    </div>
                    <div className="w-40 space-y-2">
                        <label className="text-sm text-gray-400">Durasi (Hari)</label>
                        <input 
                            type="number" 
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-nalar-primary outline-none"
                            min="1"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-6 py-2 bg-nalar-primary text-nalar-dark font-bold rounded-lg hover:bg-nalar-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Tambah'}
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {/* List */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">Kode</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Durasi</th>
                            <th className="p-4">Tanggal Aktivasi</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {licenses.map(lic => (
                            <tr key={lic.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-white">{lic.code}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${lic.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {lic.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-300">{lic.duration_days} Hari</td>
                                <td className="p-4 text-gray-300">
                                    {lic.activation_date ? new Date(lic.activation_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleDelete(lic.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {licenses.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data lisensi</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ModulesView = () => {
    const [modules, setModules] = useState<ModuleData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<ModuleContent | null>(null);
    const [activeSection, setActiveSection] = useState<'capaian' | 'teori' | 'komponen' | 'system' | 'evaluasi'>('capaian');
    const [jsonContent, setJsonContent] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchModules = async () => {
            if (window.api) {
                const result = await window.api.getModules();
                if (result.success) setModules(result.modules);
            } else {
                setModules(staticModules);
            }
        };
        fetchModules();
    }, []);

    const handleEdit = async (module: ModuleData) => {
        setEditingId(module.id);
        const content = await loadModuleContent(module);
        if (content) {
            setEditContent(content);
            setJsonContent(JSON.stringify(content.capaian, null, 2));
            setActiveSection('capaian');
        } else {
            alert('Gagal memuat konten modul');
        }
    };

    const handleSectionChange = (section: typeof activeSection) => {
        if (!editContent) return;
        
        // Save current json to object before switching
        try {
            const currentObj = JSON.parse(jsonContent);
            const updatedContent = { ...editContent, [activeSection]: currentObj };
            setEditContent(updatedContent);
            
            // Load new section
            setJsonContent(JSON.stringify(updatedContent[section], null, 2));
            setActiveSection(section);
        } catch (e) {
            alert('JSON Error: Perbaiki format JSON sebelum pindah tab.');
        }
    };

    const handleSave = async () => {
        if (!editingId || !editContent) return;
        setSaving(true);
        try {
            const currentObj = JSON.parse(jsonContent);
            const finalContent = { ...editContent, [activeSection]: currentObj };
            
            if (window.api) {
                const result = await window.api.saveModuleContent(editingId, finalContent);
                if (result.success) {
                    alert('Berhasil menyimpan konten modul!');
                    setEditingId(null);
                } else {
                    alert('Gagal menyimpan: ' + result.error);
                }
            }
        } catch (e) {
            alert('JSON Error: Format JSON tidak valid.');
        }
        setSaving(false);
    };

    if (editingId && editContent) {
        return (
            <div className="h-full flex flex-col animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white/10 rounded-full text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-white">Edit Modul: {editContent.title}</h2>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-nalar-primary text-nalar-dark font-bold rounded-lg hover:bg-nalar-primary/90 transition-colors"
                    >
                        <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden border border-white/10 rounded-xl bg-black/20">
                    {/* Tabs */}
                    <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col">
                        {[
                            { id: 'capaian', icon: FileText, label: 'Capaian' },
                            { id: 'teori', icon: BookOpen, label: 'Teori' },
                            { id: 'komponen', icon: Box, label: 'Komponen' },
                            { id: 'system', icon: Cpu, label: 'Sistem' },
                            { id: 'evaluasi', icon: Award, label: 'Evaluasi' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleSectionChange(tab.id as any)}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${
                                    activeSection === tab.id 
                                    ? 'bg-nalar-primary/10 text-nalar-primary border-r-2 border-nalar-primary' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <tab.icon size={18} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Editor */}
                    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                        <div className="p-2 bg-black/40 text-xs text-gray-500 border-b border-white/5 flex justify-between">
                            <span>JSON Editor - {activeSection.toUpperCase()}</span>
                            <span>Tekan Simpan untuk menerapkan perubahan</span>
                        </div>
                        <textarea
                            value={jsonContent}
                            onChange={e => setJsonContent(e.target.value)}
                            className="flex-1 w-full bg-transparent text-gray-300 font-mono text-sm p-4 outline-none resize-none"
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="text-nalar-primary" /> Manajemen Modul
            </h2>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4 w-24">ID</th>
                            <th className="p-4 w-1/3">Judul</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Deskripsi</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {modules.map(module => (
                            <tr key={module.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 align-top">
                                    <span className="px-2 py-1 bg-nalar-primary/20 text-nalar-primary text-xs font-bold rounded border border-nalar-primary/30 whitespace-nowrap">
                                        {module.id}
                                    </span>
                                </td>
                                <td className="p-4 align-top text-white font-medium">
                                    {module.title}
                                </td>
                                <td className="p-4 align-top text-gray-300">
                                    {module.category}
                                </td>
                                <td className="p-4 align-top text-gray-400 text-sm line-clamp-2">
                                    {module.description}
                                </td>
                                <td className="p-4 align-top text-right">
                                    <button 
                                        onClick={() => handleEdit(module)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10 text-sm"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Main Dashboard ---

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'users' | 'modul' | 'license' | 'settings'>('home');

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Manajemen User', icon: Users },
    { id: 'modul', label: 'Modul', icon: BookOpen },
    { id: 'license', label: 'Lisensi', icon: Key },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="w-full h-screen bg-nalar-dark flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col shrink-0 backdrop-blur-md z-50">
        <div className="p-6">
           <h1 className="text-2xl font-bold tracking-wider text-nalar-accent">NALAR<span className="text-white">ADMIN</span></h1>
           <p className="text-xs text-gray-500 mt-1">Administrator Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
           {menuItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
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
           <div className="flex items-center gap-3 px-4 py-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-nalar-accent flex items-center justify-center text-nalar-dark font-bold">
                   {user?.name?.charAt(0) || 'A'}
               </div>
               <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                   <p className="text-xs text-gray-500 truncate">Admin</p>
               </div>
           </div>
           <button 
             onClick={logout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm transition-colors"
           >
             <LogOut size={16} /> Keluar
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-nalar-dark to-black relative flex flex-col">
        <div className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
                {activeTab === 'home' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                            <h3 className="text-gray-400 text-sm mb-2">Total Modul</h3>
                            <p className="text-3xl font-bold text-white">15</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                            <h3 className="text-gray-400 text-sm mb-2">Total Siswa</h3>
                            <p className="text-3xl font-bold text-white">-</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                            <h3 className="text-gray-400 text-sm mb-2">Lisensi Aktif</h3>
                            <p className="text-3xl font-bold text-white">-</p>
                        </div>
                    </div>
                )}
                {activeTab === 'modul' && <ModulesView />}
                {activeTab === 'license' && <LicensesView />}
                {activeTab === 'users' && <div className="text-white">Manajemen User (Coming Soon)</div>}
                {activeTab === 'settings' && <div className="text-white">Pengaturan (Coming Soon)</div>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
