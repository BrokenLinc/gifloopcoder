import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { AboutModal } from './components/AboutModal';
import { CanvasPanel } from './components/CanvasPanel';
import { CodeEditor } from './components/CodeEditor';
import { OutputModal } from './components/OutputModal';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Splitter } from './components/Splitter';
import { Toolbar } from './components/Toolbar';
import { useGLC } from './hooks/useGLC';
import { useGLCStore } from './store/glcStore';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { glc, compile } = useGLC(canvasRef);
  const code = useGLCStore((s) => s.code);
  const splitPercent = useGLCStore((s) => s.splitPercent);
  const errorMessage = useGLCStore((s) => s.errorMessage);
  const bg = useColorModeValue('white', 'gray.900');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (glc) {
      compile(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glc]);

  return (
    <Flex direction="column" height="100vh" bg={bg}>
      <Toolbar glc={glc} compile={() => compile(code)} />
      <Flex ref={containerRef} flex="1" minHeight={0} position="relative" overflow="hidden">
        <Box width={`${splitPercent * 100}%`} minWidth="200px" overflow="hidden">
          <CodeEditor onCompile={compile} />
        </Box>
        <Splitter containerRef={containerRef} />
        <Flex flex="1" direction="column" minWidth={0} overflow="hidden">
          <CanvasPanel canvasRef={canvasRef} glc={glc} errorMessage={errorMessage} />
          <PropertiesPanel glc={glc} />
        </Flex>
      </Flex>
      <OutputModal />
      <AboutModal />
    </Flex>
  );
}
