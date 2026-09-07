import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';

import { fonts, palette, radius } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = PressableProps & {
  label: string;
};

export function SecondaryButton({ label, style, ...props }: Props) {
  const { s } = useScale();

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [
        styles.button,
        { borderRadius: radius.md, paddingVertical: s(16) },
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      <Text style={[styles.text, { fontSize: s(16) }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: palette.secondaryBorder,
    borderWidth: 1.5,
  },
  text: {
    color: palette.secondaryText,
    fontFamily: fonts.semiBold,
  },
  pressed: {
    opacity: 0.85,
  },
});
