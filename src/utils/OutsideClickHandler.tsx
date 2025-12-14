import { useEffect, useRef, ReactNode } from 'react';

interface OutsideClickHandlerProps {
  onOutsideClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function OutsideClickHandler({
  onOutsideClick,
  children,
  disabled = false,
  className,
  style,
}: OutsideClickHandlerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick, disabled]);

  return (
    <div ref={wrapperRef} className={className} style={style}>
      {children}
    </div>
  );
}

export default OutsideClickHandler;
