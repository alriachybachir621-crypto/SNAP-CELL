import React, { useRef } from 'react';

interface SnapCellLogoProps {
  size?: 'nav' | 'hero' | 'footer';
  onFiveTaps?: () => void;
  className?: string;
}

export const SnapCellLogo: React.FC<SnapCellLogoProps> = ({
  size = 'nav',
  onFiveTaps,
  className = '',
}) => {
  const tapsRef = useRef<number[]>([]);

  const handleClick = () => {
    if (!onFiveTaps) return;
    const now = Date.now();
    const recent = tapsRef.current.filter((t) => now - t < 2500);
    recent.push(now);
    tapsRef.current = recent;
    if (recent.length >= 5) {
      tapsRef.current = [];
      onFiveTaps();
    }
  };

  const sizeClass =
    size === 'hero'
      ? 'w-44 sm:w-52'
      : size === 'footer'
      ? 'w-40'
      : 'w-32 sm:w-36';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="SNAP CELL"
      className={`relative block overflow-hidden bg-black rounded-md select-none shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600] ${sizeClass} ${className}`}
      style={{ aspectRatio: '596 / 107' }}
    >
      <img
        src="/assets/aistudio/image_29f6f646.png"
        alt="SNAP CELL"
        draggable={false}
        referrerPolicy="no-referrer"
        className="pointer-events-none select-none max-w-none absolute"
        style={{
          width: '121.48%',
          height: 'auto',
          left: '-11.41%',
          top: '-541.12%',
        }}
      />
    </button>
  );
};
