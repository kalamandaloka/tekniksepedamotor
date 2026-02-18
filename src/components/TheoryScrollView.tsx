import React, { useRef } from 'react';
import { Book, Menu, List } from 'lucide-react';

interface TheoryPage {
  title?: string;
  content: string;
  image?: string;
}

interface TheoryScrollViewProps {
  title: string;
  pages: TheoryPage[];
  references?: string[];
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <>
      {content.split(/!\[(.*?)\]\((.*?)\)/g).map((part, i, arr) => {
        if (i % 3 === 0) return <span key={i}>{part}</span>;
        if (i % 3 === 1) return null; // Alt text
        // i % 3 === 2 is URL
        const alt = arr[i-1];
        return (
          <div key={i} className="my-4 flex justify-center w-full">
            <img 
              src={part} 
              alt={alt} 
              className="rounded-lg shadow-md max-h-[300px] object-contain border-2 border-white bg-white mx-auto"
            />
          </div>
        );
      })}
    </>
  );
};

const TheoryScrollView = ({ title, pages, references }: TheoryScrollViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    if (scrollContainerRef.current) {
      const element = scrollContainerRef.current.querySelector(`#${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full h-full flex bg-[#fdfbf7] rounded-xl shadow-2xl border border-[#e3d5c6]/30 pointer-events-auto overflow-hidden">
      
      {/* Sidebar TOC - Visible on Desktop */}
      <div className="hidden md:flex flex-col w-72 border-r border-[#e3d5c6]/30 bg-[#f7f5f0] h-full shrink-0">
         <div className="p-6 border-b border-[#e3d5c6]/30 bg-[#fdfbf7]">
            <h2 className="font-serif font-bold text-gray-900 flex items-center gap-2">
              <List size={20} className="text-nalar-primary" />
              Daftar Isi
            </h2>
         </div>
         <div className="overflow-y-auto p-4 custom-scrollbar flex-1">
            <ul className="space-y-1">
              {pages.map((page, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(`section-${index}`)}
                    className="text-left w-full text-nalar-primary hover:text-nalar-accent hover:bg-white/50 p-2 rounded-lg transition-all font-serif flex items-start gap-2 group"
                  >
                    <span className="text-sm font-mono text-gray-400 mt-0.5 group-hover:text-nalar-accent transition-colors">{index + 1}.</span>
                    <span className="text-sm leading-tight">{page.title || `Bagian ${index + 1}`}</span>
                  </button>
                </li>
              ))}
              {references && references.length > 0 && (
                <li>
                  <button 
                    onClick={() => scrollToSection('references')}
                    className="text-left w-full text-nalar-primary hover:text-nalar-accent hover:bg-white/50 p-2 rounded-lg transition-all font-serif flex items-start gap-2 group"
                  >
                     <span className="text-sm font-mono text-gray-400 mt-0.5 group-hover:text-nalar-accent transition-colors">Ref.</span>
                     <span className="text-sm leading-tight">Referensi</span>
                  </button>
                </li>
              )}
            </ul>
         </div>
      </div>

      {/* Main Content Area */}
      <div ref={scrollContainerRef} className="flex-1 h-full overflow-y-auto custom-scrollbar relative scroll-smooth bg-[#fdfbf7]">
        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
          
          {/* Cover / Title Section */}
          <div className="text-center mb-12 pb-8 border-b-2 border-nalar-primary/20">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-nalar-primary mb-4">{title}</h1>
            <div className="w-24 h-1 bg-nalar-accent mx-auto rounded-full"></div>
          </div>

          {/* Mobile TOC (Collapsible or just listed at top) */}
          <div className="md:hidden mb-12 bg-white/50 p-6 rounded-lg border border-[#e3d5c6]">
            <h2 className="text-xl font-bold font-serif text-gray-900 mb-4 flex items-center gap-2">
              <List size={20} /> Daftar Isi
            </h2>
            <ul className="space-y-2">
              {pages.map((page, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(`section-${index}`)}
                    className="text-left text-nalar-primary hover:text-nalar-accent transition-colors font-serif flex items-baseline gap-2"
                  >
                    <span className="text-sm font-mono text-gray-400">{index + 1}.</span>
                    <span>{page.title || `Bagian ${index + 1}`}</span>
                  </button>
                </li>
              ))}
              {references && references.length > 0 && (
                <li>
                  <button 
                    onClick={() => scrollToSection('references')}
                    className="text-left text-nalar-primary hover:text-nalar-accent transition-colors font-serif flex items-baseline gap-2"
                  >
                     <span className="text-sm font-mono text-gray-400">Ref.</span>
                     <span>Referensi</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Content Pages */}
          <div className="space-y-16">
            {pages.map((page, index) => (
              <div key={index} id={`section-${index}`} className="scroll-mt-8">
                {page.title && (
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-nalar-primary text-white text-sm font-mono shrink-0">
                      {index + 1}
                    </span>
                    {page.title}
                  </h3>
                )}
                
                {page.image && (
                  <div className="mb-8 flex justify-center">
                    <img 
                      src={page.image} 
                      alt={page.title || "Ilustrasi"} 
                      className="rounded-lg shadow-lg max-h-[400px] object-contain border-4 border-white bg-white"
                    />
                  </div>
                )}

                <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-loose text-gray-800">
                  <MarkdownRenderer content={page.content} />
                </div>
              </div>
            ))}
          </div>

          {/* References */}
          {references && references.length > 0 && (
            <div id="references" className="mt-20 pt-12 border-t-2 border-gray-200 scroll-mt-8">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Referensi</h3>
              <ul className="list-disc list-inside space-y-3 font-serif text-gray-700">
                {references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-20 text-center text-gray-400 text-sm font-mono py-8 border-t border-gray-100">
            --- Akhir Dokumen ---
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryScrollView;
