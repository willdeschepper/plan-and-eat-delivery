import * as React from 'react';

import { cleanup, fireEvent, render, screen } from '@/lib/test-utils';

import { OtpInput } from './otp-input';

afterEach(cleanup);

describe('otpInput', () => {
  it('updates value when digit entered in first cell', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <OtpInput value="" onChange={onChange} length={6} />,
    );
    fireEvent.changeText(screen.getByTestId('otp-cell-0'), '5');
    expect(onChange).toHaveBeenCalledWith('5');
    rerender(<OtpInput value="5" onChange={onChange} length={6} />);
    fireEvent.changeText(screen.getByTestId('otp-cell-1'), '9');
    expect(onChange).toHaveBeenLastCalledWith('59');
  });

  it('strips non-digits from input', () => {
    const onChange = jest.fn();
    render(<OtpInput value="" onChange={onChange} />);
    fireEvent.changeText(screen.getByTestId('otp-cell-0'), 'a3b');
    expect(onChange).toHaveBeenCalledWith('3');
  });
});
