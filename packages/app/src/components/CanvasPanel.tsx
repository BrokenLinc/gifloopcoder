import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { GLC } from '@glc/engine';
import { useState } from 'react';
import { useGLCStore } from '../store/glcStore';

interface CanvasPanelProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  glc: GLC | null;
  errorMessage: string | null;
}

export function CanvasPanel({ canvasRef, glc, errorMessage }: CanvasPanelProps) {
  const status = useGLCStore((s) => s.status);
  const [scrubT, setScrubT] = useState(0);
  const stageBg = useColorModeValue('gray.100', 'gray.900');
  const canvasBg = useColorModeValue('white', 'black');
  const border = useColorModeValue('gray.300', 'gray.700');

  function handleScrub(value: number) {
    setScrubT(value);
    if (glc && status !== 'playing') {
      glc.renderList.render(value);
    }
  }

  return (
    <Flex direction="column" flex="1" minHeight={0} bg={stageBg} overflow="auto">
      {errorMessage && (
        <Alert status="error" fontSize="sm" data-testid="compile-error">
          <AlertIcon />
          <Text whiteSpace="pre-wrap">{errorMessage}</Text>
        </Alert>
      )}
      <Center flex="1" p={4}>
        <Box
          borderWidth="1px"
          borderColor={border}
          bg={canvasBg}
          boxShadow="md"
          data-testid="canvas-frame"
        >
          <canvas ref={canvasRef} data-testid="glc-canvas" style={{ display: 'block' }} />
        </Box>
      </Center>
      <Box px={4} py={2} borderTopWidth="1px" borderColor={border}>
        <Slider
          aria-label="Scrubber"
          min={0}
          max={1}
          step={0.001}
          value={scrubT}
          onChange={handleScrub}
          isDisabled={!glc || status === 'playing'}
          data-testid="scrubber"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </Flex>
  );
}
