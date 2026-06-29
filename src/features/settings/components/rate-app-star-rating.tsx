import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { RateAppStarIcon } from './rate-app-star-icon';

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

type Props = {
  rating: number;
  onSelectRating: (rating: number) => void;
};

export function RateAppStarRating({ rating, onSelectRating }: Props) {
  return (
    <View style={styles.row}>
      {STAR_VALUES.map(value => (
        <Pressable
          key={value}
          accessibilityRole="button"
          accessibilityLabel={`${value}`}
          hitSlop={4}
          onPress={() => onSelectRating(value)}
          style={styles.starButton}
          testID={`settings-rate-app-star-${value}`}
        >
          <RateAppStarIcon active={value <= rating} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
