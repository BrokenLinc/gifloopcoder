import { Divider, HStack, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import {
  faCamera,
  faFile,
  faFilm,
  faFolderOpen,
  faImage,
  faPause,
  faPlay,
  faPlayCircle,
  faQuestionCircle,
  faSave,
  faSyncAlt,
  faTh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GLC } from '@glc/engine';
import { useEffect } from 'react';
import { useGLCStore } from '../store/glcStore';

interface ToolbarProps {
  glc: GLC | null;
  compile: () => void;
}

interface ToolButton {
  label: string;
  shortcut?: string;
  icon: typeof faPlay;
  onClick: () => void;
  isDisabled?: boolean;
  isActive?: boolean;
  testId: string;
}

export function Toolbar({ glc, compile }: ToolbarProps) {
  const status = useGLCStore((s) => s.status);
  const setShowAbout = useGLCStore((s) => s.setShowAbout);
  const setError = useGLCStore((s) => s.setError);
  const setCode = useGLCStore((s) => s.setCode);
  const code = useGLCStore((s) => s.code);
  const setOutput = useGLCStore((s) => s.setOutput);

  const isPlaying = status === 'playing';
  const isEncoding = status === 'encoding';
  const bg = useColorModeValue('gray.100', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');

  function newFile() {
    if (!confirm('Discard current sketch?')) return;
    setCode('');
    setError(null);
  }

  function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,text/javascript';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      setCode(text);
      setTimeout(compile, 0);
    };
    input.click();
  }

  function saveFile() {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sketch.js';
    a.click();
    URL.revokeObjectURL(url);
  }

  function captureStill() {
    if (!glc) return;
    const url = glc.captureStill();
    setOutput({ url, width: glc.w, height: glc.h, type: 'png' });
  }

  const buttons: ToolButton[] = [
    {
      label: 'New',
      shortcut: 'Ctrl+N',
      icon: faFile,
      onClick: newFile,
      testId: 'tb-new',
    },
    {
      label: 'Open',
      shortcut: 'Ctrl+O',
      icon: faFolderOpen,
      onClick: openFile,
      testId: 'tb-open',
    },
    {
      label: 'Save',
      shortcut: 'Ctrl+S',
      icon: faSave,
      onClick: saveFile,
      testId: 'tb-save',
    },
    {
      label: 'Compile',
      shortcut: 'Ctrl+Enter',
      icon: faSyncAlt,
      onClick: compile,
      testId: 'tb-compile',
    },
    {
      label: isPlaying ? 'Pause' : 'Loop',
      shortcut: 'Ctrl+L',
      icon: isPlaying ? faPause : faPlay,
      isActive: isPlaying,
      onClick: () => glc?.toggleLoop(),
      isDisabled: !glc || isEncoding,
      testId: 'tb-loop',
    },
    {
      label: 'Play once',
      shortcut: 'Ctrl+P',
      icon: faPlayCircle,
      onClick: () => glc?.playOnce(),
      isDisabled: !glc || isPlaying || isEncoding,
      testId: 'tb-play-once',
    },
    {
      label: 'Make GIF',
      shortcut: 'Ctrl+G',
      icon: faImage,
      onClick: () => glc?.makeGif(),
      isDisabled: !glc || isPlaying || isEncoding,
      testId: 'tb-make-gif',
    },
    {
      label: 'Capture still',
      shortcut: 'Ctrl+I',
      icon: faCamera,
      onClick: captureStill,
      isDisabled: !glc,
      testId: 'tb-still',
    },
    {
      label: 'Sprite sheet',
      shortcut: 'Ctrl+T',
      icon: faTh,
      onClick: () =>
        glc?.makeSpriteSheet((size) => confirm(`Sprite sheet will be ${size}×${size}. Continue?`)),
      isDisabled: !glc || isPlaying || isEncoding,
      testId: 'tb-spritesheet',
    },
    {
      label: 'About',
      icon: faQuestionCircle,
      onClick: () => setShowAbout(true),
      testId: 'tb-about',
    },
  ];

  useEffect(() => {
    function isMod(e: KeyboardEvent) {
      return e.ctrlKey || e.metaKey;
    }
    function handler(e: KeyboardEvent) {
      if (!isMod(e)) return;
      const map: Record<string, () => void> = {
        Enter: compile,
        n: newFile,
        o: openFile,
        s: saveFile,
        l: () => glc?.toggleLoop(),
        p: () => glc?.playOnce(),
        g: () => glc?.makeGif(),
        i: captureStill,
        t: () =>
          glc?.makeSpriteSheet((size) =>
            confirm(`Sprite sheet will be ${size}×${size}. Continue?`),
          ),
      };
      const fn = map[e.key.toLowerCase()] ?? map[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glc, code]);

  return (
    <HStack
      spacing={1}
      px={3}
      py={2}
      bg={bg}
      borderBottomWidth="1px"
      borderColor={border}
      align="center"
    >
      <FontAwesomeIcon icon={faFilm} aria-label="GLC logo" />
      <Divider orientation="vertical" height="20px" mx={2} />
      {buttons.map((b) => (
        <Tooltip
          key={b.testId}
          label={b.shortcut ? `${b.label} (${b.shortcut})` : b.label}
          openDelay={400}
        >
          <IconButton
            aria-label={b.label}
            data-testid={b.testId}
            size="sm"
            variant={b.isActive ? 'solid' : 'ghost'}
            colorScheme={b.isActive ? 'blue' : undefined}
            isDisabled={b.isDisabled}
            onClick={b.onClick}
            icon={<FontAwesomeIcon icon={b.icon} />}
          />
        </Tooltip>
      ))}
    </HStack>
  );
}
