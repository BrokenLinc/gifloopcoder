import {
  Button,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useGLCStore } from '../store/glcStore';

export function AboutModal() {
  const showAbout = useGLCStore((s) => s.showAbout);
  const setShowAbout = useGLCStore((s) => s.setShowAbout);

  return (
    <Modal isOpen={showAbout} onClose={() => setShowAbout(false)} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent data-testid="about-modal">
        <ModalHeader>About GIF Loop Coder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <Heading size="sm">GIF Loop Coder (GLC)</Heading>
            <Text>
              A tool for coding looping animations in JavaScript and exporting them as GIFs, sprite
              sheets, or PNG stills.
            </Text>
            <Text>
              Originally created by Keith Peters (
              <Link href="https://www.bit-101.com" isExternal color="blue.400">
                bit-101.com
              </Link>
              ). Modernized to a pnpm + Vite + React 18 + Chakra UI workspace.
            </Text>
            <Text>
              Engine package <Text as="code">@glc/engine</Text> can also be embedded directly. See
              the docs for details.
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowAbout(false)}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
