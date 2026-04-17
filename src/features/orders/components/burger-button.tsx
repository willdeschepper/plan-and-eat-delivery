import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  onPress: () => void;
  isDark?: boolean;
};

export function BurgerButton({ onPress, isDark = false }: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = isDark ? '#fafafa' : '#1E1E1E';

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.88); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      hitSlop={12}
    >
      <Animated.View style={[styles.container, animStyle]}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <View style={[styles.lineShort, { backgroundColor: color }]} />
        <View style={[styles.line, { backgroundColor: color }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 5,
    paddingLeft: 2,
  },
  line: {
    height: 2,
    width: 22,
    borderRadius: 2,
  },
  lineShort: {
    height: 2,
    width: 15,
    borderRadius: 2,
  },
});
