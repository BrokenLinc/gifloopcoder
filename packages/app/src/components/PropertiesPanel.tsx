import {
  Badge,
  Checkbox,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import type { GLC, InterpolationMode } from '@glc/engine';
import { useGLCStore } from '../store/glcStore';

interface PropertiesPanelProps {
  glc: GLC | null;
}

export function PropertiesPanel({ glc }: PropertiesPanelProps) {
  const duration = useGLCStore((s) => s.duration);
  const fps = useGLCStore((s) => s.fps);
  const maxColors = useGLCStore((s) => s.maxColors);
  const mode = useGLCStore((s) => s.mode);
  const easing = useGLCStore((s) => s.easing);
  const status = useGLCStore((s) => s.status);
  const setDuration = useGLCStore((s) => s.setDuration);
  const setFPS = useGLCStore((s) => s.setFPS);
  const setMaxColors = useGLCStore((s) => s.setMaxColors);
  const setMode = useGLCStore((s) => s.setMode);
  const setEasing = useGLCStore((s) => s.setEasing);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');
  const disabled = !glc || status !== 'idle';

  function changeDuration(_: string, n: number) {
    if (Number.isNaN(n)) return;
    setDuration(n);
    glc?.setDuration(n);
  }
  function changeFPS(_: string, n: number) {
    if (Number.isNaN(n)) return;
    setFPS(n);
    glc?.setFPS(n);
  }
  function changeMaxColors(_: string, n: number) {
    if (Number.isNaN(n)) return;
    setMaxColors(n);
    glc?.setMaxColors(n);
  }
  function changeMode(value: string) {
    setMode(value as InterpolationMode);
    glc?.setMode(value);
  }
  function changeEasing(value: boolean) {
    setEasing(value);
    glc?.setEasing(value);
  }

  return (
    <Wrap
      px={4}
      py={2}
      bg={bg}
      borderTopWidth="1px"
      borderColor={border}
      spacing={4}
      data-testid="properties-panel"
    >
      <WrapItem alignItems="center">
        <HStack>
          <Text fontSize="sm" minW="70px">
            Duration
          </Text>
          <NumberInput
            size="xs"
            min={0.1}
            step={0.1}
            value={duration}
            onChange={changeDuration}
            isDisabled={disabled}
            maxW="80px"
          >
            <NumberInputField data-testid="prop-duration" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Badge fontSize="0.6em">sec</Badge>
        </HStack>
      </WrapItem>
      <WrapItem alignItems="center">
        <HStack>
          <Text fontSize="sm" minW="40px">
            FPS
          </Text>
          <NumberInput
            size="xs"
            min={1}
            max={60}
            step={1}
            value={fps}
            onChange={changeFPS}
            isDisabled={disabled}
            maxW="80px"
          >
            <NumberInputField data-testid="prop-fps" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </WrapItem>
      <WrapItem alignItems="center">
        <HStack>
          <Text fontSize="sm" minW="80px">
            Max colors
          </Text>
          <NumberInput
            size="xs"
            min={2}
            max={256}
            step={1}
            value={maxColors}
            onChange={changeMaxColors}
            isDisabled={disabled}
            maxW="80px"
          >
            <NumberInputField data-testid="prop-max-colors" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </WrapItem>
      <WrapItem alignItems="center">
        <HStack>
          <Text fontSize="sm">Mode</Text>
          <Select
            size="xs"
            value={mode}
            onChange={(e) => changeMode(e.target.value)}
            isDisabled={disabled}
            maxW="120px"
            data-testid="prop-mode"
          >
            <option value="bounce">Bounce</option>
            <option value="single">Single</option>
          </Select>
        </HStack>
      </WrapItem>
      <WrapItem alignItems="center">
        <Checkbox
          size="sm"
          isChecked={easing}
          onChange={(e) => changeEasing(e.target.checked)}
          isDisabled={disabled}
          data-testid="prop-easing"
        >
          Easing
        </Checkbox>
      </WrapItem>
      <WrapItem alignItems="center">
        <Badge
          colorScheme={status === 'playing' ? 'blue' : status === 'encoding' ? 'orange' : 'gray'}
          data-testid="status-badge"
        >
          {status}
        </Badge>
      </WrapItem>
    </Wrap>
  );
}
