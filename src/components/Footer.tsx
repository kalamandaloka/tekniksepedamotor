import { type ModuleData } from '../data/modules';

interface FooterProps {
    activeModule: ModuleData;
}

const Footer = ({ activeModule }: FooterProps) => {
    return (
        <footer className="w-full bg-nalar-dark/80 backdrop-blur-md border-t border-white/10 px-8 py-3 pointer-events-auto flex items-center justify-between z-20 mt-4">
            <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>© 2024 NalarXR</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>Pembelajaran Interaktif Agribisnis Tanaman Perkebunan</span>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-nalar-primary">
                    {activeModule.id}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    {activeModule.category} • {activeModule.title}
                </div>
            </div>
        </footer>
    );
};

export default Footer;