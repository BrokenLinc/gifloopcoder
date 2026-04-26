import { Box, useColorMode } from '@chakra-ui/react';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror, { keymap } from '@uiw/react-codemirror';
import { useCallback, useMemo } from 'react';
import type { SketchResult } from '../sketchRunner';
import { useGLCStore } from '../store/glcStore';

interface CodeEditorProps {
  onCompile: (code: string) => SketchResult;
}

export function CodeEditor({ onCompile }: CodeEditorProps) {
  const code = useGLCStore((s) => s.code);
  const setCode = useGLCStore((s) => s.setCode);
  const { colorMode } = useColorMode();

  const handleChange = useCallback(
    (value: string) => {
      setCode(value);
    },
    [setCode],
  );

  const extensions = useMemo(
    () => [
      javascript({ jsx: false, typescript: false }),
      keymap.of([
        {
          key: 'Mod-Enter',
          preventDefault: true,
          run: () => {
            onCompile(useGLCStore.getState().code);
            return true;
          },
        },
      ]),
    ],
    [onCompile],
  );

  return (
    <Box
      height="100%"
      width="100%"
      overflow="hidden"
      data-testid="code-editor"
      sx={{
        '.cm-editor': { height: '100%', fontSize: '13px' },
        '.cm-scroller': { fontFamily: 'var(--chakra-fonts-mono)' },
      }}
    >
      <CodeMirror
        value={code}
        height="100%"
        extensions={extensions}
        theme={colorMode === 'dark' ? oneDark : 'light'}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          autocompletion: true,
          closeBrackets: true,
          tabSize: 2,
        }}
      />
    </Box>
  );
}
