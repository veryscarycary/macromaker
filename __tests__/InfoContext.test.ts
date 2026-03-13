import { defaultValues } from '../context/InfoContext';

describe('InfoContext defaultValues', () => {
  it('has age pre-filled to 30', () => {
    expect(defaultValues.age).toBe(30);
  });
  it('has weight pre-filled to 150', () => {
    expect(defaultValues.weight).toBe(150);
  });
  it('has heightFeet set to 5', () => {
    expect(defaultValues.heightFeet).toBe(5);
  });
  it('has heightInches pre-filled to 10', () => {
    expect(defaultValues.heightInches).toBe(10);
  });
  it('leaves name blank (no default)', () => {
    expect(defaultValues.name).toBe('');
  });
});
