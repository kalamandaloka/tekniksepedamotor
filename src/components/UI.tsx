import { Home, BookOpen, Target, Settings, Activity, FileCheck, Image as ImageIcon } from 'lucide-react'
import { type ModuleData } from '../data/modules'
import { type ModuleContent } from '../types/ModuleContent'
import { useState, useEffect } from 'react'
import InlineModel from './InlineModel'
import SystemSim from './SystemSim'
import Footer from './Footer'
import BookReader from './BookReader'
import TheoryScrollView from './TheoryScrollView'
import { createDummyContent } from '../utils/createDummyContent'

// Dynamic imports for modules
const loadModuleContent = async (module: ModuleData): Promise<ModuleContent | null> => {
  try {
    const loadedModule = await import(`../modules/${module.id}/index.ts`);
    return loadedModule.default;
  } catch (error) {
    console.error(`Failed to load module ${module.id}:`, error);
    return createDummyContent(module.id, module.title);
  }
};

interface UIProps {
  activeModule: ModuleData;
  onHomeClick: () => void;
}

import EvaluasiView from './EvaluasiView';

const UI = ({ activeModule, onHomeClick }: UIProps) => {
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [activeTab, setActiveTab] = useState<'capaian' | 'teori' | 'komponen' | 'system' | 'evaluasi'>('capaian');
  const [loading, setLoading] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0)
  const [activeSim, setActiveSim] = useState<string | null>(null)
  const [theoryViewMode] = useState<'book' | 'scroll'>('scroll');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    loadModuleContent(activeModule).then((data) => {
      setContent(data);
      setActiveTab('capaian');
      setLoading(false);
      if (data) setSelectedItemIndex(0)
    });
  }, [activeModule]);

  const getActiveModel = () => {
    if (!content) return null;
    
    if (activeTab === 'capaian' && content.capaian.modelUrl) {
        return { type: 'box' as const, url: content.capaian.modelUrl };
    }
    
    if (activeTab === 'komponen' && content.komponen.items[selectedItemIndex]) {
        const item = content.komponen.items[selectedItemIndex];
        return { type: item.modelType, url: item.modelPath };
    }

    return null;
  };

  const renderContent = () => {
    if (loading || !content) return <div className="p-6 text-center text-gray-400">Loading module data...</div>;

    switch (activeTab) {
      case 'capaian':
        return (
            <div className="animate-fade-in h-full flex flex-col space-y-8">
                <h2 className="text-xl font-bold text-nalar-accent border-b border-white/10 pb-2">{content.capaian.title}</h2>
                
                {/* Description */}
                <div>
                   <h3 className="text-sm font-bold text-nalar-primary mb-2 uppercase tracking-wider">Deskripsi</h3>
                   <p className="text-gray-300 text-sm leading-relaxed">{content.capaian.description}</p>
                </div>

                {/* SKKNI */}
                <div>
                   <h3 className="text-sm font-bold text-nalar-primary mb-2 uppercase tracking-wider">Capaian SKKNI</h3>
                   <ul className="space-y-2">
                       {content.capaian.skkni.map((item, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                               <span className="mt-1.5 min-w-[4px] h-1 rounded-full bg-white/40"></span>
                               <span>
                                   {typeof item === 'string' 
                                       ? item 
                                       : `${item.kode && item.kode !== 'TBD' ? item.kode + ' - ' : ''}${item.nama}`}
                               </span>
                           </li>
                       ))}
                   </ul>
                </div>

                {/* Kurikulum */}
                <div>
                   <h3 className="text-sm font-bold text-nalar-primary mb-2 uppercase tracking-wider">Capaian Kurikulum</h3>
                    <ul className="space-y-2">
                       {content.capaian.kurikulum.map((item, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                               <span className="mt-1.5 min-w-[4px] h-1 rounded-full bg-white/40"></span>
                               <span>
                                   {typeof item === 'string' 
                                       ? item 
                                       : `${item.kode && item.kode !== 'TBD' ? item.kode + ' - ' : ''}${item.nama}`}
                               </span>
                           </li>
                       ))}
                   </ul>
                </div>

                {/* Tujuan/Apa yang dicapai */}
                <div>
                   <h3 className="text-sm font-bold text-nalar-primary mb-2 uppercase tracking-wider">Tujuan Pembelajaran</h3>
                    <ul className="space-y-2">
                       {content.capaian.tujuan.map((item, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                               <Target className="w-4 h-4 text-nalar-accent mt-0.5 shrink-0" />
                               <span>{item}</span>
                           </li>
                       ))}
                   </ul>
                </div>
            </div>
        );
      case 'teori':
        return (
            <div className="animate-fade-in h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <h2 className="text-xl font-bold text-nalar-accent mb-4 border-b border-white/10 pb-2">{content.teori.title}</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                     <div className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                        {content.teori.content}
                     </div>
                </div>
                {content.teori.references && (
                    <div className="mt-8 pt-4 border-t border-white/10">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Referensi:</h4>
                        <ul className="list-disc list-inside text-xs text-gray-500">
                            {content.teori.references.map((ref, idx) => <li key={idx}>{ref}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        );
      case 'komponen':
        return null; // Handled in main layout
      case 'system':
        return (
             <div className="animate-fade-in grid grid-cols-1 gap-4">
                {content.system.simulations.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSim(s.id)}
                        className={`text-left rounded-xl border overflow-hidden transition-all duration-300 group relative flex flex-col ${activeSim === s.id ? 'border-nalar-accent shadow-[0_0_15px_rgba(255,165,0,0.3)] scale-[1.02] z-10' : 'bg-nalar-dark/80 border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                    >
                        <div className="w-full aspect-square bg-black/40 overflow-hidden relative shrink-0">
                            {s.image ? (
                                <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 bg-gray-900">
                                    <ImageIcon size={24} className={`opacity-20 ${activeSim === s.id ? 'text-nalar-accent' : 'text-white'}`} />
                                </div>
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                        </div>
                        
                        <div className={`p-2 h-12 flex items-center justify-center text-center ${activeSim === s.id ? 'bg-nalar-accent/90 backdrop-blur-sm' : ''}`}>
                            <h3 className={`text-[10px] font-bold leading-tight line-clamp-2 ${activeSim === s.id ? 'text-nalar-dark' : 'text-white'}`}>
                                {s.title}
                            </h3>
                        </div>
                    </button>
                ))}
             </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between z-10">
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between pointer-events-auto shrink-0 mb-4 md:mb-8 gap-4">
            <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onHomeClick}
                title="Kembali ke Dashboard"
            >
            <div className="text-xl md:text-2xl font-bold tracking-wider text-nalar-accent">
                    NALAR<span className="text-white">XR</span>
            </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-2 bg-nalar-dark/50 backdrop-blur-sm px-2 py-2 rounded-xl md:rounded-full border border-white/10 overflow-x-auto max-w-full">
                {[
                    { id: 'capaian', label: 'CAPAIAN', icon: Target },
                    { id: 'teori', label: 'TEORI', icon: BookOpen },
                    { id: 'komponen', label: 'KOMPONEN', icon: Settings },
                    { id: 'system', label: 'SYSTEM', icon: Activity },
                    { id: 'evaluasi', label: 'EVALUASI', icon: FileCheck },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as 'capaian' | 'teori' | 'komponen' | 'system' | 'evaluasi')}
                        className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-nalar-accent text-nalar-dark shadow-lg scale-105' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <item.icon size={14} className="md:w-4 md:h-4" />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="flex items-center gap-2">
                <button 
                    onClick={onHomeClick}
                    className="hidden md:block p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    title="Kembali ke Menu Utama"
                >
                    <Home size={24} />
                </button>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row items-start w-full gap-4 md:gap-8 overflow-hidden min-h-0">
            {activeTab === 'teori' && content ? (
                theoryViewMode === 'book' ? (
                    <BookReader 
                        title={content.teori.title}
                        pages={content.teori.pages || (content.teori.content ? [{content: content.teori.content}] : [])}
                        references={content.teori.references}
                    />
                ) : (
                    <TheoryScrollView 
                        title={content.teori.title}
                        pages={content.teori.pages || (content.teori.content ? [{content: content.teori.content}] : [])}
                        references={content.teori.references}
                    />
                )
            ) : activeTab === 'komponen' && content ? (
                /* Komponen Custom 3-Column Layout */
                <div className="flex flex-col lg:flex-row w-full h-full gap-4 md:gap-6 animate-fade-in overflow-y-auto lg:overflow-hidden">
                    {/* Left Column: List of Cards */}
                    <div className="w-full lg:w-[400px] xl:w-[500px] overflow-y-auto custom-scrollbar h-[300px] lg:h-full pr-2 shrink-0 pointer-events-auto order-2 lg:order-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {content.komponen.items.map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedItemIndex(idx)}
                                    className={`text-left rounded-xl border overflow-hidden transition-all duration-300 group relative flex flex-row lg:flex-col ${selectedItemIndex === idx ? 'border-nalar-accent shadow-[0_0_15px_rgba(255,165,0,0.3)] scale-[1.02] z-10' : 'bg-nalar-dark/80 border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                                >
                                    <div className="w-24 lg:w-full h-24 lg:h-32 bg-black/40 overflow-hidden relative shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 bg-gray-900">
                                                <Settings className="w-8 h-8 opacity-20" />
                                            </div>
                                        )}
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                    </div>
                                    
                                    <div className={`p-3 flex-1 flex items-center ${selectedItemIndex === idx ? 'bg-nalar-accent/90 backdrop-blur-sm' : ''}`}>
                                        <h3 className={`text-sm font-bold leading-tight line-clamp-2 ${selectedItemIndex === idx ? 'text-nalar-dark' : 'text-white'}`}>
                                            {item.name}
                                        </h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Center Column: 3D Model */}
                    <div className="flex-1 h-[300px] lg:h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20 backdrop-blur-sm relative group pointer-events-auto order-1 lg:order-2 min-h-[300px]">
                        {(() => {
                            const item = content.komponen.items[selectedItemIndex];
                            if (item) {
                                return (
                                    <>
                                        <InlineModel 
                                            modelType={item.modelType} 
                                            modelPath={item.modelPath} 
                                            className="w-full h-full absolute inset-0"
                                        />
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white/70 border border-white/10 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            🖱️ Putar • ⚡ Zoom
                                        </div>
                                    </>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Right Column: Description */}
                    <div className="w-full lg:w-[300px] xl:w-[350px] h-auto lg:h-full bg-nalar-dark/90 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/10 shadow-2xl overflow-y-auto custom-scrollbar shrink-0 pointer-events-auto order-3">
                         {content.komponen.items[selectedItemIndex] && (
                             <div className="animate-fade-in">
                                 <h2 className="text-2xl md:text-3xl font-bold text-nalar-accent mb-6 md:mb-8 border-b border-white/10 pb-4 leading-tight">
                                     {content.komponen.items[selectedItemIndex].name}
                                 </h2>
                                 
                                 <div className="space-y-6 md:space-y-8">
                                     <div>
                                         <div className="flex items-center gap-2 mb-3">
                                             <FileCheck className="w-4 h-4 text-nalar-primary" />
                                             <h3 className="text-sm font-bold text-nalar-primary uppercase tracking-wider">Deskripsi</h3>
                                         </div>
                                         <p className="text-gray-300 leading-loose text-sm md:text-base font-light">
                                             {content.komponen.items[selectedItemIndex].description}
                                         </p>
                                     </div>

                                     <div>
                                         <div className="flex items-center gap-2 mb-3">
                                             <Target className="w-4 h-4 text-nalar-primary" />
                                             <h3 className="text-sm font-bold text-nalar-primary uppercase tracking-wider">Fungsi Utama</h3>
                                         </div>
                                         <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                             <p className="text-gray-300 leading-relaxed text-sm">
                                                 {content.komponen.items[selectedItemIndex].function || `Alat ini digunakan untuk mendukung proses ${content.komponen.items[selectedItemIndex].name.toLowerCase()} dengan efisiensi tinggi sesuai standar K3.`}
                                             </p>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
            ) : activeTab === 'evaluasi' && content ? (
                <EvaluasiView data={content.evaluasi} moduleId={activeModule.id} />
            ) : (
                <>
                    {/* Left Panel - Dynamic Content */}
                    <div className={`w-full ${activeTab === 'system' ? 'lg:w-[350px]' : 'lg:w-[450px]'} h-[300px] lg:h-full flex flex-col pointer-events-auto transition-all duration-500 order-2 lg:order-1 ${activeTab === 'system' ? '' : 'bg-nalar-dark/90 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl'}`}>
                        {activeTab !== 'system' && (
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 shrink-0">
                                <div>
                                    <span className="text-xs font-mono text-gray-400 border border-gray-600 px-2 py-0.5 rounded mr-2">{activeModule.id}</span>
                                    <span className="text-xs font-semibold text-nalar-primary uppercase tracking-wider">{activeModule.category}</span>
                                </div>
                            </div>
                        )}
                    
                        {/* Content Container with Scroll if needed */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                            {renderContent()}
                        </div>
                    </div>

                    {/* Right Area - 3D Model View */}
                    <div className="flex-1 h-[300px] lg:h-full w-full pointer-events-auto relative flex flex-col order-1 lg:order-2 min-h-[300px] min-w-0">
                        {(() => {
                            if (activeTab === 'system') {
                    return activeSim ? (
                        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20 backdrop-blur-sm relative animate-fade-in">
                            {(() => {
                                const sim = content?.system?.simulations?.find((s: any) => s.id === activeSim);
                                return (
                                    <SystemSim 
                                        key={activeSim} 
                                        simId={activeSim} 
                                        simTitle={sim?.title} 
                                        simDescription={sim?.description}
                                        panelTitle={sim?.panelTitle}
                                        status={sim?.status}
                                        simConditions={sim?.conditions}
                                    />
                                );
                            })()}
                        </div>
                    ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col gap-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
                                        <Activity size={48} className="opacity-20" />
                                        <p>Pilih simulasi dari menu di sebelah kiri untuk memulai.</p>
                                    </div>
                                );
                            }

                            const activeModel = getActiveModel();
                            if (activeModel) {
                                return (
                                    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20 backdrop-blur-sm relative animate-fade-in">
                                        <InlineModel 
                                            modelType={activeModel.type} 
                                            modelPath={activeModel.url} 
                                            className="w-full h-full absolute inset-0"
                                        />
                                        
                                        {/* Hint/Controls Overlay */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white/70 border border-white/10 pointer-events-none select-none">
                                            🖱️ Drag to rotate • ⚡ Scroll to zoom
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>
                </>
            )}
        </main>
      </div>
      <Footer activeModule={activeModule} />
    </div>
  );
};

export default UI;
