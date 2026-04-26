import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,
    mono: `'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,
  },
  styles: {
    global: {
      'html, body, #root': {
        height: '100%',
        margin: 0,
      },
    },
  },
  semanticTokens: {
    colors: {
      panelBg: { default: 'gray.50', _dark: 'gray.800' },
      panelBorder: { default: 'gray.200', _dark: 'gray.700' },
    },
  },
});
