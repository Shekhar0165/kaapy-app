import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { fonts, palette, radius, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = TextInputProps & {
  label: string;
};

export function FormInput({ label, style, onFocus, onBlur, ...rest }: Props) {
  const { s } = useScale();
  const [isFocused, setIsFocused] = useState(false);
  const styles = createStyles(s, isFocused);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={palette.subink}
        style={[styles.input, style]}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      />
    </View>
  );
}

function createStyles(s: (value: number) => number, isFocused: boolean) {
  return StyleSheet.create({
    wrapper: {
      gap: s(6),
    },
    label: {
      color: palette.subink,
      fontFamily: fonts.medium,
      fontSize: s(12),
      letterSpacing: 0.3,
    },
    input: {
      backgroundColor: palette.background,
      borderColor: isFocused ? palette.accent : palette.secondaryBorder,
      borderRadius: radius.sm,
      borderWidth: isFocused ? 1.5 : 1,
      color: palette.ink,
      fontFamily: fonts.regular,
      fontSize: s(16),
      paddingHorizontal: s(spacing.lg),
      paddingVertical: s(14),
    },
  });
}
