export function calculateExpirationDate(
  option: 'day' | 'hour' | 'week' | 'month',
): Date {
  const now = new Date(); // Get the current date and time

  switch (option) {
    case 'hour':
      return new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
    case 'day':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 1 day (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    case 'week':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 1 week (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    case 'month':
      const futureDate = new Date(now);
      futureDate.setMonth(now.getMonth() + 1); // Add 1 month
      return futureDate;
    default:
      throw new Error(
        'Invalid option. Please choose "hour", "day", "week", or "month".',
      );
  }
}
