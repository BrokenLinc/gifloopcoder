import { Box, useColorModeValue } from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import { useGLCStore } from '../store/glcStore';

interface SplitterProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export function Splitter({ containerRef }: SplitterProps) {
  const setSplitPercent = useGLCStore((s) => s.setSplitPercent);
  const dragging = useRef(false);
  const handleColor = useColorModeValue('gray.300', 'gray.700');
  const handleHover = useColorModeValue('blue.400', 'blue.300');

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      setSplitPercent(pct);
    },
    [containerRef, setSplitPercent],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    return () => {
      dragging.current = false;
    };
  }, []);

  return (
    <Box
      width="6px"
      cursor="col-resize"
      bg={handleColor}
      _hover={{ bg: handleHover }}
      transition="background 0.1s"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-testid="splitter"
      role="separator"
      aria-orientation="vertical"
    />
  );
}
