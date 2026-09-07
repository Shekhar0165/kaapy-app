import { createElement } from 'react';
import { View } from 'react-native';

type IconProps = {
  color?: string;
  size?: number;
  strokeWidth?: number;
};

function MockIcon({ color, size }: IconProps) {
  return createElement(View, { style: { backgroundColor: color, height: size, width: size } });
}

export const Home = MockIcon;
export const IndianRupee = MockIcon;
export const User = MockIcon;
