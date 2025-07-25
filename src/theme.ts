import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

import '@mantine/core/styles.css';

const myColor: MantineColorsTuple = [
  '#f1f1ff',
  '#e0dff2',
  '#bfbdde',
  '#9b98ca',
  '#7d79b9',
  '#6a66af',
  '#504c97',
  '#504c97',
  '#464388',
  '#3b3979'
];

export const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
  cursorType: 'pointer',
  defaultRadius: 'md',
});