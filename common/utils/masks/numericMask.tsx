
export function applyNumericMask(value: string, mask: string) {
  const numericValue = value.replace(/\D/g, '');

  let maskedValue = '';
  let index = 0;

  for (let i = 0; i < mask.length && index < numericValue.length; i++) {
    const char = mask[i];
    if (char === '9') {
      maskedValue += numericValue[index];
      index++;
    } else {
      maskedValue += char;
    }
  }

  return maskedValue;
}
