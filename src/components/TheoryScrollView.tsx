import React, { useRef } from 'react';
import { List } from 'lucide-react';

const getTitleParts = (title?: string) => {
  if (!title) return { level1: undefined, level2: undefined, level3: undefined };
  const parts = title.split(/\s*:\s*/);
  return {
    level1: parts[0],
    level2: parts[1],
    level3: parts[2],
  };
};

 

interface TheoryPage {
  title?: string;
  content: string;
  image?: string;
  contentL1?: string;
  contentL2?: string;
  contentL3?: string;
  contentL4?: string;
  contentL5?: string;
  contentL6?: string;
  contentL7?: string;
  contentL8?: string;
  contentL9?: string;
  subSections?: {
    title2: string;
    content2?: string;
    content2Parts?: string[];
    items?: {
      title3: string;
      content3?: string;
    }[];
  }[];
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
        if (i % 3 === 1) return null;
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
  const isEmpty = !pages || pages.length === 0;

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
                  {isEmpty ? (
                    <li className="pl-2 text-gray-500">Belum ada konten teori</li>
                  ) : pages.map((page, index) => {
                    const base = (index + 1).toString();
                    const parts = getTitleParts(page.title);
                    const hasSubs = Array.isArray(page.subSections) && page.subSections.length > 0;
                    return (
                      <>
                        <li key={`toc-${index}-l1`} className="pl-2">
                          <button
                            onClick={() => scrollToSection(`section-${index}-l1`)}
                            className="text-left w-full text-nalar-primary hover:text-nalar-accent hover:bg-white/50 py-2 pr-2 rounded-lg transition-all font-serif flex items-start gap-2 group"
                          >
                            <span className="text-sm font-mono text-gray-400 mt-0.5 group-hover:text-nalar-accent transition-colors">{base}.</span>
                            <span className="text-sm leading-tight">{parts.level1 || page.title || `Bagian ${index + 1}`}</span>
                          </button>
                        </li>
                        {hasSubs
                          ? (page.subSections ?? [])
                              .filter((sub) => !!sub.title2 && sub.title2.trim().length > 0)
                              .map((sub, j) => (
                              <React.Fragment key={`toc-${index}-l2-${j}`}>
                                <li className="pl-6">
                                  <button
                                    onClick={() => scrollToSection(`section-${index}-l2-${j}`)}
                                    className="text-left w-full text-nalar-primary hover:text-nalar-accent hover:bg-white/50 py-2 pr-2 rounded-lg transition-all font-serif flex items-start gap-2 group"
                                  >
                                    <span className="text-sm font-mono text-gray-400 mt-0.5 group-hover:text-nalar-accent transition-colors">{`${base}.${j + 1}` }.</span>
                                    <span className="text-sm leading-tight">{sub.title2}</span>
                                  </button>
                                </li>
                                {(sub.items ?? []).map((item, k) => (
                                  <li key={`toc-${index}-l3-${j}-${k}`} className="pl-10">
                                    <button
                                      onClick={() => scrollToSection(`section-${index}-l3-${j}-${k}`)}
                                      className="text-left w-full text-nalar-primary hover:text-nalar-accent hover:bg-white/50 py-2 pr-2 rounded-lg transition-all font-serif flex items-start gap-2 group"
                                    >
                                      <span className="text-sm font-mono text-gray-400 mt-0.5 group-hover:text-nalar-accent transition-colors">{`${base}.${j + 1}.${k + 1}` }.</span>
                                      <span className="text-sm leading-tight">{item.title3}</span>
                                    </button>
                                  </li>
                                ))}
                              </React.Fragment>
                            ))
                          : parts.level2 && (
                              <li key={`toc-${index}-l2`} className="pl-6">
                                <button
                                  onClick={() => scrollToSection(`section-${index}-l2`)}
                                  className="text-left w-full text-nalar-primary hover:text-nalar-accent hover:bg-white/50 py-2 pr-2 rounded-lg transition-all font-serif flex items-start gap-2 group"
                                >
                                  <span className="text-sm font-mono text-gray-400 mt-0.5 group-hover:text-nalar-accent transition-colors">{`${base}.1` }.</span>
                                  <span className="text-sm leading-tight">{parts.level2}</span>
                                </button>
                              </li>
                            )}
                        {parts.level3 && !hasSubs && (
                              <li key={`toc-${index}-l3`} className="pl-10">
                                <button
                                  onClick={() => scrollToSection(`section-${index}-l3`)}
                                  className="text-left w-full text-nalar-primary hover:text-nalar-accent hover:bg-white/50 py-2 pr-2 rounded-lg transition-all font-serif flex items-start gap-2 group"
                                >
                                  <span className="text-sm font-mono text-gray-400 mt-0.5 group-hover:text-nalar-accent transition-colors">{`${base}.1.1` }.</span>
                                  <span className="text-sm leading-tight">{parts.level3}</span>
                                </button>
                              </li>
                            )}
                      </>
                    );
                  })}
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
              {(isEmpty ? [] : pages).map((page, index) => {
                const base = (index + 1).toString();
                const parts = getTitleParts(page.title);
                const hasSubs = Array.isArray(page.subSections) && page.subSections.length > 0;
                return (
                  <>
                    <li key={`mtoc-${index}-l1`}>
                      <button
                        onClick={() => scrollToSection(`section-${index}-l1`)}
                        className="text-left text-nalar-primary hover:text-nalar-accent transition-colors font-serif flex items-baseline gap-2"
                      >
                        <span className="text-sm font-mono text-gray-400">{base}.</span>
                        <span>{parts.level1 || page.title || `Bagian ${index + 1}`}</span>
                      </button>
                    </li>
                    {hasSubs
                      ? (page.subSections ?? [])
                          .filter((sub) => !!sub.title2 && sub.title2.trim().length > 0)
                          .map((sub, j) => (
                          <React.Fragment key={`mtoc-${index}-l2-${j}`}>
                            <li className="pl-4">
                              <button
                                onClick={() => scrollToSection(`section-${index}-l2-${j}`)}
                                className="text-left text-nalar-primary hover:text-nalar-accent transition-colors font-serif flex items-baseline gap-2"
                              >
                                <span className="text-sm font-mono text-gray-400">{`${base}.${j + 1}` }.</span>
                                <span>{sub.title2}</span>
                              </button>
                            </li>
                            {(sub.items ?? []).map((item, k) => (
                              <li key={`mtoc-${index}-l3-${j}-${k}`} className="pl-8">
                                <button
                                  onClick={() => scrollToSection(`section-${index}-l3-${j}-${k}`)}
                                  className="text-left text-nalar-primary hover:text-nalar-accent transition-colors font-serif flex items-baseline gap-2"
                                >
                                  <span className="text-sm font-mono text-gray-400">{`${base}.${j + 1}.${k + 1}` }.</span>
                                  <span>{item.title3}</span>
                                </button>
                              </li>
                            ))}
                          </React.Fragment>
                        ))
                      : parts.level2 && (
                          <li key={`mtoc-${index}-l2`} className="pl-4">
                            <button
                              onClick={() => scrollToSection(`section-${index}-l2`)}
                              className="text-left text-nalar-primary hover:text-nalar-accent transition-colors font-serif flex items-baseline gap-2"
                            >
                              <span className="text-sm font-mono text-gray-400">{`${base}.1` }.</span>
                              <span>{parts.level2}</span>
                            </button>
                          </li>
                        )}
                    {parts.level3 && !hasSubs && (
                          <li key={`mtoc-${index}-l3`} className="pl-8">
                            <button
                              onClick={() => scrollToSection(`section-${index}-l3`)}
                              className="text-left text-nalar-primary hover:text-nalar-accent transition-colors font-serif flex items-baseline gap-2"
                            >
                              <span className="text-sm font-mono text-gray-400">{`${base}.1.1` }.</span>
                              <span>{parts.level3}</span>
                            </button>
                          </li>
                        )}
                  </>
                );
              })}
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
            {isEmpty ? (
              <div className="text-center text-gray-600 py-16">Belum ada konten teori</div>
            ) : pages.map((page, index) => (
              <div key={index} id={`section-${index}`} className="scroll-mt-8">
                {page.title && (
                  <div className="mb-6">
                    <h3 id={`section-${index}-l1`} className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                      {getTitleParts(page.title).level1}
                    </h3>
                    {page.contentL1 && (
                      <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify mb-6">
                        <MarkdownRenderer content={page.contentL1} />
                      </div>
                    )}
                    {!page.subSections && getTitleParts(page.title).level2 && (
                      <div className="mt-1">
                        <div id={`section-${index}-l2`} className="text-lg md:text-xl font-serif font-semibold text-gray-800">
                          {getTitleParts(page.title).level2}
                        </div>
                      </div>
                    )}
                    {!page.subSections && page.contentL2 && (
                      <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify mb-6">
                        <MarkdownRenderer content={page.contentL2} />
                      </div>
                    )}
                    {!page.subSections && getTitleParts(page.title).level3 && (
                      <div className="mt-0.5">
                        <div id={`section-${index}-l3`} className="text-base md:text-lg font-serif font-bold text-gray-700">
                          {getTitleParts(page.title).level3}
                        </div>
                      </div>
                    )}
                    {!page.subSections && page.contentL3 && (
                      <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify mb-6">
                        <MarkdownRenderer content={page.contentL3} />
                      </div>
                    )}
                    {!page.subSections &&
                      [page.contentL4, page.contentL5, page.contentL6, page.contentL7, page.contentL8, page.contentL9]
                        .map((val, idx) =>
                          val ? (
                            <div
                              key={`content-${index}-extra-${idx}`}
                              className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify mb-6"
                            >
                              <MarkdownRenderer content={val} />
                            </div>
                          ) : null
                        )}
                  </div>
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

                {!page.contentL1 && !page.contentL2 && !page.contentL3 && !page.subSections && (
                  <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify mb-6">
                    <MarkdownRenderer content={page.content} />
                  </div>
                )}

                {page.subSections && page.subSections.length > 0 && (
                  <div className="space-y-6">
                    {page.subSections.map((sub, j) => (
                      <div key={`content-${index}-l2-${j}`}>
                        <h4 id={`section-${index}-l2-${j}`} className="text-lg md:text-xl font-serif font-semibold text-gray-800">
                          {sub.title2}
                        </h4>
                        {sub.content2 && (
                          <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify mb-6">
                            <MarkdownRenderer content={sub.content2} />
                          </div>
                        )}
                        {Array.isArray(sub.content2Parts) && sub.content2Parts.length > 0 && (
                          <div className="space-y-6">
                            {sub.content2Parts.map((part, idx) => (
                              <div key={`content-${index}-l2-${j}-part-${idx}`} className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify">
                                <MarkdownRenderer content={part} />
                              </div>
                            ))}
                          </div>
                        )}
                        {(sub.items ?? []).map((item, k) => (
                          <div key={`content-${index}-l3-${j}-${k}`} className="mt-2">
                            <h5 id={`section-${index}-l3-${j}-${k}`} className="text-base md:text-lg font-serif font-bold text-gray-700">
                              {item.title3}
                            </h5>
                            {item.content3 && (
                              <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-lg leading-normal text-gray-800 text-justify mb-6">
                                <MarkdownRenderer content={item.content3} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
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
