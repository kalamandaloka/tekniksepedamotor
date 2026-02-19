import React, { useRef, useState } from "react";

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const PanZoomImage = ({ src, alt, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => clamp(s + delta, 0.5, 4));
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    const dy = e.clientY - lastYRef.current;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    setTx((x) => x + dx);
    setTy((y) => y + dy);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    draggingRef.current = false;
  };

  const reset = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={reset}
    >
      <div
        className="absolute inset-0 overflow-hidden bg-black/20"
        style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: "center center" }}
      >
        <img src={src} alt={alt} className="w-full h-full object-contain select-none" draggable={false} />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 border border-white/10 flex items-center gap-2">
        <button className="px-2 py-0.5 bg-white/10 rounded hover:bg-white/20" onClick={() => setScale((s) => clamp(s + 0.1, 0.5, 4))}>+</button>
        <button className="px-2 py-0.5 bg-white/10 rounded hover:bg-white/20" onClick={() => setScale((s) => clamp(s - 0.1, 0.5, 4))}>-</button>
        <button className="px-2 py-0.5 bg-white/10 rounded hover:bg-white/20" onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default PanZoomImage;
