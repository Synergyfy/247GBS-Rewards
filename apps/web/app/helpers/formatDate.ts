export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Add ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th)
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);

  // Replace the day with the ordinal version
  return formattedDate.replace(/\d+/, `${day}${ordinalSuffix}`);
}

// Helper function to get the ordinal suffix (st, nd, rd, th)
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'; // 11th, 12th, 13th, etc.
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export const compareDates = (
  dateString1: string | Date,
  dateString2: string | Date
): string | true => {
  // Convert the date strings to Date objects
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  // Check if the dates are valid
  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    throw new Error('Invalid date strings');
  }

  // Compare the dates
  if (date1 < date2) {
    return true;
  } else if (date1 > date2) {
    return `${dateString1} is later than ${dateString2}`;
  } else {
    return `${dateString1} is the same as ${dateString2}`;
  }
};

export function formatDateShort(input: string): string {
  const date = new Date(input);

  const includesTime = input.includes(':') || input.includes('T');

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date or datetime input');
  }

  if (includesTime) {
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
