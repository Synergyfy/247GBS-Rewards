export type HexColor = `#${string}`;

/**
 * Returns a darker version of the provided hex color.
 *
 * @param hexColor - The hex color code (must start with #)
 * @param factor - How much to darken the color (0.0 to 1.0)
 * @returns A darkened hex color code
 * @throws Error if the hex color format is invalid
 */
export const darkenHexColor = (
  hexColor: HexColor,
  factor: number = 0.15
): HexColor => {
  // Validate hex color format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(hexColor)) {
    throw new Error('Invalid hex color format. Must be #RRGGBB or #RGB');
  }

  // Normalize to 6 characters
  let normalizedHex = hexColor;
  if (hexColor.length === 4) {
    normalizedHex = `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`;
  }

  // Convert hex to RGB
  const r = parseInt(normalizedHex.slice(1, 3), 16);
  const g = parseInt(normalizedHex.slice(3, 5), 16);
  const b = parseInt(normalizedHex.slice(5, 7), 16);

  // Validate factor
  if (factor < 0 || factor > 1) {
    throw new Error('Factor must be between 0 and 1');
  }

  // Darken each component
  const darkenComponent = (component: number): number =>
    Math.max(0, Math.min(255, Math.floor(component * (1 - factor))));

  const newR = darkenComponent(r);
  const newG = darkenComponent(g);
  const newB = darkenComponent(b);

  // Convert back to hex
  const toHex = (n: number): string => n.toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}` as HexColor;
};

// // Example usage
// try {
//   const originalColor = '#4989dc' as HexColor;
//   console.log('Original:', originalColor);
//   console.log('Darker (default 15%):', darkenHexColor(originalColor));
//   console.log('Darker (30%):', darkenHexColor(originalColor, 0.3));
//   console.log('Slightly darker (10%):', darkenHexColor(originalColor, 0.1));

//   // Also works with shorthand hex
//   console.log('From shorthand:', darkenHexColor('#48c', 0.15));
// } catch (error) {
//   console.error('Error:', error);
// }
