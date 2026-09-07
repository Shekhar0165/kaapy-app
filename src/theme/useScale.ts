import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 390;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useScale() {
  const { width, height } = useWindowDimensions();
  const scale = clamp(width / BASE_WIDTH, 0.9, 1.2);
  const isCompactHeight = height < 700;
  const s = (value: number) => Math.round(value * scale);
  return { s, scale, isCompactHeight };
}
