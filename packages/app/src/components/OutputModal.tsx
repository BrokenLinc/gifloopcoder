import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useGLCStore } from '../store/glcStore';

export function OutputModal() {
  const output = useGLCStore((s) => s.output);
  const showOutput = useGLCStore((s) => s.showOutput);
  const setShowOutput = useGLCStore((s) => s.setShowOutput);

  function close() {
    setShowOutput(false);
  }

  function download() {
    if (!output) return;
    const a = document.createElement('a');
    a.href = output.url;
    a.download = `glc-output.${output.type === 'gif' ? 'gif' : 'png'}`;
    a.click();
  }

  const title = !output
    ? 'Output'
    : output.type === 'gif'
      ? 'Generated GIF'
      : output.type === 'spritesheet'
        ? 'Sprite Sheet'
        : 'Captured Still';

  return (
    <Modal isOpen={showOutput} onClose={close} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent data-testid="output-modal">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {output ? (
            <Box overflow="auto" maxH="60vh" textAlign="center">
              <Image
                src={output.url}
                alt={title}
                mx="auto"
                data-testid="output-image"
                maxW="100%"
              />
              <Text mt={2} fontSize="sm" color="gray.500">
                {output.width} × {output.height}
              </Text>
            </Box>
          ) : (
            <Text>No output yet.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={close}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={download} isDisabled={!output}>
              Download
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
