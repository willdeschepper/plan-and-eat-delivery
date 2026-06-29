import type { TextInput as RNTextInput } from 'react-native';
import * as React from 'react';
import { TextInput, View } from 'react-native';

const DEFAULT_OTP_LENGTH = 6;

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hasError?: boolean;
};

export function OtpInput({
  value,
  onChange,
  length = DEFAULT_OTP_LENGTH,
  hasError = false,
}: OtpInputProps) {
  const inputsRef = React.useRef<Array<RNTextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);

    const chars = value.split('');
    chars[index] = digit;
    const nextValue = chars.join('').slice(0, length);
    onChange(nextValue);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const padded = value.padEnd(length);
  const digits = padded.split('').slice(0, length);
  const cells = React.useMemo(
    () => Array.from({ length }, (_, i) => ({ id: `otp-${length}-${i}` })),
    [length],
  );

  return (
    <View className="mt-4 flex-row justify-between gap-3">
      {cells.map((cell, index) => {
        const digit = digits[index];

        return (
          <TextInput
            key={cell.id}
            testID={`otp-cell-${index}`}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            value={digit.trim()}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => {
              setFocusedIndex(current => (current === index ? null : current));
            }}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            className={[
              'size-12 rounded-full border text-2xl font-semibold shadow-sm',
              hasError
                ? 'border-danger-600 bg-danger-50 text-danger-600 dark:bg-danger-950'
                : digit.trim()
                  ? focusedIndex === index
                    ? 'border-[#2C583A] bg-success-50 text-charcoal-900 dark:bg-success-950 dark:text-white'
                    : 'border-[#2C583A] bg-success-50 text-charcoal-900 dark:bg-success-950 dark:text-white'
                  : focusedIndex === index
                    ? 'border-[#2C583A] bg-success-50 text-charcoal-900 dark:bg-success-950 dark:text-white'
                    : 'border-neutral-400 bg-white text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white',
            ].join(' ')}
          />
        );
      })}
    </View>
  );
}
