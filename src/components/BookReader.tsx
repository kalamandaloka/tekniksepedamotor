import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookPage {
  title?: string;
  content: string;
  image?: string;
}

interface BookReaderProps {
  title: string;
  pages: BookPage[];
  references?: string[];
}

const Page = React.forwardRef<HTMLDivElement, { children?: React.ReactNode; number?: number | string; title?: string; image?: string }>((props, ref) => {
  return (
    <div className="page bg-[#fdfbf7] h-full shadow-inner border-r border-[#e3d5c6]/30 flex flex-col overflow-hidden" ref={ref}>
      <div className="flex-1 min-h-0 p-6 md:p-12 pb-0 md:pb-0 overflow-y-auto custom-scrollbar relative">
        {props.title && (
          <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-300 pb-2">
            {props.title}
          </h3>
        )}
        {props.image && (
          <div className="mb-6 flex justify-center">
            <img 
              src={props.image} 
              alt={props.title || "Ilustrasi"} 
              className="rounded-lg shadow-md max-h-[250px] object-contain border-4 border-white bg-white"
            />
          </div>
        )}
        <div className="prose prose-stone max-w-none whitespace-pre-wrap font-serif text-base md:text-lg leading-loose text-gray-800 pb-20">
          {typeof props.children === 'string' ? props.children.split(/!\[(.*?)\]\((.*?)\)/g).map((part, i, arr) => {
            if (i % 3 === 0) return <span key={i}>{part}</span>;
            if (i % 3 === 1) return null; // Alt text, used in next iteration
            // i % 3 === 2 is URL
            const alt = arr[i-1];
            return (
              <div key={i} className="my-4 flex justify-center w-full">
                <img 
                  src={part} 
                  alt={alt} 
                  className="rounded-lg shadow-md max-h-[200px] object-contain border-2 border-white bg-white mx-auto"
                />
              </div>
            );
          }) : props.children}
        </div>
      </div>
      {props.number && (
        <div className="h-16 shrink-0 flex items-center justify-center text-xs text-gray-400 font-serif font-bold tracking-widest bg-[#fdfbf7] z-10">
          {props.number}
        </div>
      )}
    </div>
  );
});

const Cover = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>((props, ref) => {
  return (
    <div className="page page-cover bg-nalar-primary text-white h-full flex items-center justify-center p-6 md:p-10 shadow-2xl" ref={ref} data-density="hard">
      <div className="text-center border-4 border-white/20 p-4 md:p-8 w-full h-full flex flex-col items-center justify-center rounded-lg">
        <h2 className="text-2xl md:text-4xl font-bold font-serif tracking-widest uppercase mb-4">{props.children}</h2>
        <div className="w-16 h-1 bg-white/50 rounded-full mb-4"></div>
        <p className="text-white/80 font-mono text-xs md:text-sm">MODUL INTERAKTIF</p>
      </div>
    </div>
  );
});

const BookReader = ({ title, pages, references }: BookReaderProps) => {
  const book = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 500, height: 650 });
  const [inputPage, setInputPage] = useState("1");

  // Calculate total pages: Cover + Empty + TOC + Content Pages + (References) + Back Cover
  const totalPageCount = 1 + 1 + 1 + pages.length + (references && references.length > 0 ? 1 : 0) + 1;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile: nearly full width, appropriate aspect ratio
        const newWidth = Math.min(width - 40, 400); 
        setDimensions({ width: newWidth, height: newWidth * 1.4 });
      } else if (width < 1024) {
        // Tablet
        setDimensions({ width: 350, height: 500 });
      } else {
        // Desktop
        setDimensions({ width: 500, height: 650 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const onFlip = (e: any) => {
    setCurrentPage(e.data);
    setInputPage((e.data + 1).toString());
  };

  const nextButtonClick = () => {
    book.current?.pageFlip().flipNext();
  };

  const prevButtonClick = () => {
    book.current?.pageFlip().flipPrev();
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPageCount) {
      book.current?.pageFlip().flip(pageNum - 1);
    }
  };

  // Construct pages array to avoid null/undefined children which crashes react-pageflip
  const bookChildren = [
    <Cover key="cover-front">{title}</Cover>,
    <Page key="empty-page" />,
    <Page key="toc" title="Daftar Isi">
       <div className="flex flex-col h-full">
          <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-20">
            {pages.map((page, index) => (
              <li key={index} 
                  className="flex items-baseline justify-between group cursor-pointer border-b border-gray-200 pb-2 hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={() => book.current?.pageFlip().flip(index + 3)}
              >
                <span className="font-serif text-gray-800 group-hover:text-nalar-primary transition-colors text-sm md:text-base line-clamp-2 text-left flex-1 mr-4">
                  {page.title || `Bagian ${index + 1}`}
                </span>
                <span className="text-xs text-gray-400 font-mono shrink-0 group-hover:text-nalar-primary">
                  Hal. {index + 1}
                </span>
              </li>
            ))}
            {references && references.length > 0 && (
               <li className="flex items-baseline justify-between group cursor-pointer border-b border-gray-200 pb-2 hover:bg-gray-50 p-2 rounded transition-colors"
                   onClick={() => book.current?.pageFlip().flip(pages.length + 3)}>
                  <span className="font-serif text-gray-800 group-hover:text-nalar-primary transition-colors text-sm md:text-base">Referensi</span>
               </li>
            )}
          </ul>
       </div>
    </Page>,
    ...pages.map((page, index) => (
      <Page key={`page-${index}`} number={index + 1} title={page.title} image={page.image}>
        {page.content}
      </Page>
    ))
  ];

  if (references && references.length > 0) {
    bookChildren.push(
      <Page key="references" number="Ref" title="Referensi">
        <ul className="list-disc list-inside space-y-2">
          {references.map((ref, i) => (
            <li key={i}>{ref}</li>
          ))}
        </ul>
      </Page>
    );
  }

  bookChildren.push(<Cover key="cover-back">SELESAI</Cover>);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-fade-in relative overflow-hidden">
      <div className="relative w-full flex items-center justify-center transition-all duration-300" style={{ height: dimensions.height }}>
        {/* @ts-ignore - Library types might be missing or incompatible with React 19 strict typing */}
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="shadow-2xl"
          ref={book}
          onFlip={onFlip}
        >
          {bookChildren}
        </HTMLFlipBook>

        {/* Navigation Controls */}
        <div className="absolute z-50 flex justify-between w-full pointer-events-none px-4 md:px-0 left-1/2 -translate-x-1/2 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:max-w-[1150px]">
             <button
                onClick={prevButtonClick}
                className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/80 text-gray-800 backdrop-blur-sm transition-all duration-300 hover:bg-nalar-accent hover:text-white shadow-lg border border-gray-200"
             >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
             </button>
             <button
                onClick={nextButtonClick}
                className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/80 text-gray-800 backdrop-blur-sm transition-all duration-300 hover:bg-nalar-accent hover:text-white shadow-lg border border-gray-200"
             >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
             </button>
        </div>
      </div>

      <div className="mt-4 md:mt-6 text-xs text-gray-400 font-mono flex items-center gap-2 relative z-[100] pointer-events-auto">
        <span>Halaman</span>
        <form onSubmit={handlePageSubmit} className="inline-block" onClick={(e) => e.stopPropagation()}>
          <input 
            type="number"
            min={1}
            max={totalPageCount}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onBlur={() => setInputPage((currentPage + 1).toString())}
            className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:border-nalar-primary bg-white shadow-sm cursor-text font-bold"
          />
        </form>
        <span>dari {totalPageCount} (Termasuk Cover)</span>
      </div>
    </div>
  );
};

export default BookReader;
