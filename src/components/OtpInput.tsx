import { useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputInstance } from 'react-native';

import { fonts, palette, radius } from '../theme/theme';
import { useScale } from '../theme/useScale';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
  autoFocus?: boolean;
};

export function OtpInput({ value, onChangeText, length = 6, autoFocus }: Props) {
  const { s } = useScale();
  const styles = createStyles(s);
  const inputRef = useRef<TextInputInstance>(null);

  function handleChangeText(text: string) {
    onChangeText(text.replace(/[^0-9]/g, '').slice(0, length));
  }

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.row}>
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] ?? '';
        const isActive = index === value.length;

        return (
          <View
            key={index}
            style={[
              styles.box,
              digit ? styles.boxFilled : null,
              isActive ? styles.boxActive : null,
            ]}
          >
            <Text style={styles.digit}>{digit}</Text>
          </View>
        );
      })}

      <TextInput
        ref={inputRef}
        autoFocus={autoFocus}
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        caretHidden
        keyboardType="number-pad"
        maxLength={length}
        onChangeText={handleChangeText}
        style={styles.hiddenInput}
        textContentType="oneTimeCode"
        value={value}
      />
    </Pressable>
  );
}

function createStyles(s: (value: number) => number) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: s(10),
    },
    box: {
      alignItems: 'center',
      backgroundColor: palette.background,
      borderColor: palette.secondaryBorder,
      borderRadius: radius.sm,
      borderWidth: 1,
      height: s(52),
      justifyContent: 'center',
      width: s(44),
    },
    boxFilled: {
      backgroundColor: palette.featureBg,
    },
    boxActive: {
      borderColor: palette.accent,
      borderWidth: 2,
    },
    digit: {
      color: palette.ink,
      fontFamily: fonts.bold,
      fontSize: s(20),
    },
    hiddenInput: {
      height: 1,
      left: 0,
      opacity: 0,
      position: 'absolute',
      top: 0,
      width: 1,
    },
  });
}
