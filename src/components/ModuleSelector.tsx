import { type ModuleData, modules } from '../data/modules'

interface ModuleSelectorProps {
  onSelectModule: (module: ModuleData) => void;
  theme?: 'dark' | 'light';
}

const ModuleSelector = ({ onSelectModule, theme = 'dark' }: ModuleSelectorProps) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`absolute inset-0 z-50 overflow-y-auto custom-scrollbar p-10 ${
        isLight ? 'bg-white' : 'bg-nalar-dark'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-nalar-accent mb-2">PEMBELAJARAN INTERAKTIF AGRIBISNIS TANAMAN PERKEBUNAN</h1>
            <p className={isLight ? 'text-slate-600' : 'text-gray-400'}>Pilih modul pembelajaran interaktif</p>
        </header>

        <div className="space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`flex flex-col md:flex-row gap-4 md:items-center rounded-xl border p-4 md:p-5 transition-colors ${
                isLight
                  ? 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
                  : 'bg-nalar-panel border-white/10 hover:border-nalar-accent/60 hover:bg-white/5'
              }`}
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img
                  src="/gambar/global/semusim.png"
                  alt={`Ilustrasi 3D modul ${mod.title}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] md:text-xs border ${
                    isLight
                      ? 'bg-white/80 text-slate-700 border-slate-200'
                      : 'bg-black/60 text-white border-white/10'
                  }`}
                >
                  {mod.category}
                </div>
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
                    ID: {mod.id}
                  </span>
                  <h3
                    className={`text-base md:text-lg font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {mod.title}
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}
                >
                  {mod.description}
                </p>
                <div className="grid gap-1 text-xs md:text-sm mt-1">
                  <div className={isLight ? 'text-slate-600' : 'text-gray-300'}>
                    <span className="font-semibold">CP Fase F:</span>{' '}
                    <span>
                      Menguatkan pemahaman konsep dan prosedur kerja agribisnis
                      tanaman perkebunan melalui pengalaman belajar interaktif.
                    </span>
                  </div>
                  <div className={isLight ? 'text-slate-600' : 'text-gray-300'}>
                    <span className="font-semibold">SKKNI:</span>{' '}
                    <span>
                      Materi selaras dengan standar kompetensi kerja nasional
                      bidang agribisnis tanaman perkebunan.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 md:mt-0 flex justify-end md:ml-auto">
                <button
                  onClick={() => onSelectModule(mod)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap ${
                    isLight
                      ? 'bg-nalar-primary text-nalar-dark hover:bg-nalar-primary/90'
                      : 'bg-nalar-primary text-nalar-dark hover:bg-white'
                  }`}
                >
                  Mulai Belajar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ModuleSelector
