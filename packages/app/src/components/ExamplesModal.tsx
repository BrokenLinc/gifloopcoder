import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useEffect, useMemo, useState } from 'react';
import { EXAMPLE_GROUPS, type ExampleSketch } from '../examples';
import type { SketchResult } from '../sketchRunner';
import { useGLCStore } from '../store/glcStore';

interface ExamplesModalProps {
  compile: (code: string) => SketchResult;
}

const FOLDER_LABELS: Record<string, string> = {
  '': 'examples/',
};

function folderLabel(folder: string): string {
  return FOLDER_LABELS[folder] ?? `examples/${folder}/`;
}

export function ExamplesModal({ compile }: ExamplesModalProps) {
  const showExamples = useGLCStore((s) => s.showExamples);
  const setShowExamples = useGLCStore((s) => s.setShowExamples);
  const setCode = useGLCStore((s) => s.setCode);
  const { colorMode } = useColorMode();

  const headerColor = useColorModeValue('gray.600', 'gray.400');
  const listBg = useColorModeValue('gray.50', 'gray.800');
  const listBorder = useColorModeValue('gray.200', 'gray.700');
  const itemHoverBg = useColorModeValue('gray.100', 'gray.700');
  const itemActiveBg = useColorModeValue('blue.100', 'blue.900');
  const itemActiveColor = useColorModeValue('blue.800', 'blue.100');
  const previewBorder = useColorModeValue('gray.200', 'gray.700');

  const firstExample = useMemo(() => EXAMPLE_GROUPS[0]?.items[0] ?? null, []);
  const [selected, setSelected] = useState<ExampleSketch | null>(firstExample);

  useEffect(() => {
    if (showExamples && !selected) {
      setSelected(firstExample);
    }
  }, [showExamples, selected, firstExample]);

  const previewExtensions = useMemo(
    () => [javascript({ jsx: false, typescript: false }), EditorView.editable.of(false)],
    [],
  );

  function handleClose() {
    setShowExamples(false);
  }

  function handleLoad() {
    if (!selected) return;
    if (!confirm('Discard current sketch?')) return;
    setCode(selected.code);
    setShowExamples(false);
    setTimeout(() => compile(selected.code), 0);
  }

  return (
    <Modal isOpen={showExamples} onClose={handleClose} size="4xl" scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent data-testid="examples-modal" maxH="80vh">
        <ModalHeader>Load example</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack align="stretch" spacing={4} height="60vh">
            <Box
              flex="0 0 240px"
              overflowY="auto"
              bg={listBg}
              borderWidth="1px"
              borderColor={listBorder}
              borderRadius="md"
              p={2}
            >
              <Stack spacing={3}>
                {EXAMPLE_GROUPS.map((group) => (
                  <Box key={group.folder || 'root'}>
                    <Heading
                      size="xs"
                      px={2}
                      py={1}
                      color={headerColor}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {folderLabel(group.folder)}
                    </Heading>
                    <Stack spacing={0}>
                      {group.items.map((item) => {
                        const isActive = selected?.path === item.path;
                        return (
                          <Box
                            key={item.path}
                            as="button"
                            type="button"
                            textAlign="left"
                            px={2}
                            py={1}
                            borderRadius="sm"
                            fontSize="sm"
                            bg={isActive ? itemActiveBg : 'transparent'}
                            color={isActive ? itemActiveColor : undefined}
                            fontWeight={isActive ? 'semibold' : 'normal'}
                            _hover={{ bg: isActive ? itemActiveBg : itemHoverBg }}
                            onClick={() => setSelected(item)}
                            onDoubleClick={() => {
                              setSelected(item);
                              handleLoad();
                            }}
                            data-testid={`example-${item.path}`}
                          >
                            {item.name}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Flex
              flex="1"
              direction="column"
              minWidth={0}
              borderWidth="1px"
              borderColor={previewBorder}
              borderRadius="md"
              overflow="hidden"
            >
              {selected ? (
                <>
                  <Box px={3} py={2} borderBottomWidth="1px" borderColor={previewBorder}>
                    <Text fontSize="sm" fontFamily="mono" color={headerColor}>
                      examples/{selected.path}
                    </Text>
                  </Box>
                  <Box
                    flex="1"
                    minHeight={0}
                    overflow="hidden"
                    sx={{
                      '.cm-editor': { height: '100%', fontSize: '13px' },
                      '.cm-scroller': { fontFamily: 'var(--chakra-fonts-mono)' },
                    }}
                  >
                    <CodeMirror
                      value={selected.code}
                      height="100%"
                      extensions={previewExtensions}
                      theme={colorMode === 'dark' ? oneDark : 'light'}
                      editable={false}
                      basicSetup={{
                        lineNumbers: true,
                        foldGutter: false,
                        highlightActiveLine: false,
                        autocompletion: false,
                        closeBrackets: false,
                        tabSize: 2,
                      }}
                    />
                  </Box>
                </>
              ) : (
                <Flex flex="1" align="center" justify="center">
                  <Text color={headerColor}>No example selected.</Text>
                </Flex>
              )}
            </Flex>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleLoad}
            isDisabled={!selected}
            data-testid="examples-load"
          >
            Load
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
