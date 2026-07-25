import { v4 as uuidv4 } from 'uuid';

export function generateRandomCharsFromUUID(): string {
  const uuid = uuidv4();

  const uuidWithoutHyphens = uuid.replace(/-/g, '');

  let result = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * uuidWithoutHyphens.length);
    result += uuidWithoutHyphens[randomIndex];
  }

  return result;
}

export function formatString(input: string): string {
  const stringWithoutSpaces = input.replace(/\s/g, '');

  const lowercaseString = stringWithoutSpaces.toLowerCase();

  return lowercaseString;
}

export function generateRandomCode(): string {
  // Generate three random 3-digit numbers
  const part1 = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0'); // Ensure it's always 3 digits
  const part2 = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0'); // Ensure it's always 3 digits
  const part3 = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0'); // Ensure it's always 3 digits

  // Combine the parts with hyphens
  return `${part1}-${part2}-${part3}`;
}
