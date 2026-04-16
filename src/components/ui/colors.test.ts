const colors = require('./colors');

describe('colors', () => {
  it('exports primary, charcoal, white, black', () => {
    expect(colors.primary).toBeDefined();
    expect(colors.charcoal).toBeDefined();
    expect(colors.white).toBe('#ffffff');
    expect(colors.black).toBe('#000000');
  });

  it('has expected primary shades', () => {
    expect(colors.primary[400]).toBe('#FF8933');
    expect(colors.primary[500]).toBeDefined();
  });

  it('has expected charcoal shades', () => {
    expect(colors.charcoal[950]).toBe('#121212');
    expect(colors.charcoal[100]).toBeDefined();
  });

  it('has input border tokens for floating label fields', () => {
    expect(colors.inputBorder.idle).toBe('#CECECE');
    expect(colors.inputBorder.active).toBe('#BEBEBE');
  });
});
