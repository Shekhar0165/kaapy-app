import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, IndianRupee, User } from 'lucide-react-native';
import type { ComponentType } from 'react';
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, palette, spacing } from '../theme/theme';
import { useScale } from '../theme/useScale';

type LucideIcon = ComponentType<{
  color: string;
  size: number;
  strokeWidth?: number;
}>;

const ICONS: Record<string, LucideIcon> = {
  Home,
  Balance: IndianRupee,
  Profile: User,
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { s } = useScale();
  const insets = useSafeAreaInsets();
  const styles = createStyles(s);

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + s(8) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;
          const isFocused = state.index === index;
          const Icon = ICONS[route.name] ?? Home;

          function handlePress() {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress',
            });

            if (!isFocused && !event.defaultPrevented) {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              navigation.navigate(route.name);
            }
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              hitSlop={8}
              onPress={handlePress}
              style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
            >
              <View style={[styles.pill, isFocused && styles.pillActive]}>
                <Icon
                  color={isFocused ? palette.primaryText : palette.subink}
                  size={s(20)}
                  strokeWidth={isFocused ? 2.4 : 2}
                />
                {isFocused ? <Text style={styles.labelActive}>{label}</Text> : null}
              </View>
              {!isFocused ? <Text style={styles.label}>{label}</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(s: (value: number) => number) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: palette.background,
      paddingHorizontal: s(spacing.lg),
      paddingTop: s(8),
    },
    bar: {
      alignItems: 'center',
      backgroundColor: palette.background,
      borderColor: palette.featureBorder,
      borderRadius: s(28),
      borderWidth: 1,
      elevation: 4,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: s(8),
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: s(6) },
      shadowOpacity: 0.06,
      shadowRadius: s(12),
    },
    tab: {
      alignItems: 'center',
      flex: 1,
      gap: s(4),
      paddingVertical: s(4),
    },
    tabPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.96 }],
    },
    pill: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: s(6),
      paddingHorizontal: s(4),
      paddingVertical: s(4),
    },
    pillActive: {
      backgroundColor: palette.accent,
      borderRadius: s(999),
      elevation: 3,
      paddingHorizontal: s(14),
      paddingVertical: s(8),
      shadowColor: palette.accentDark,
      shadowOffset: { width: 0, height: s(3) },
      shadowOpacity: 0.2,
      shadowRadius: s(5),
    },
    label: {
      color: palette.subink,
      fontFamily: fonts.medium,
      fontSize: s(11),
    },
    labelActive: {
      color: palette.primaryText,
      fontFamily: fonts.semiBold,
      fontSize: s(12),
    },
  });
}
