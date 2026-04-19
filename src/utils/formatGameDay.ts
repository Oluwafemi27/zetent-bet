/**
 * Format a game date to display the day label with time
 * Shows "Today", day names, or "Next week" depending on the date
 * 
 * @param date - ISO string, Date object, or timestamp
 * @returns Formatted string like "Today 14:30" or "Monday 19:00" or "Next week Mon 19:00"
 */
export function formatGameDay(date: string | Date | number): string {
  const gameDate = new Date(date);
  const today = new Date();
  
  // Reset time to midnight for date comparison
  const gameDateAtMidnight = new Date(gameDate);
  gameDateAtMidnight.setHours(0, 0, 0, 0);
  
  const todayAtMidnight = new Date(today);
  todayAtMidnight.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffInMs = gameDateAtMidnight.getTime() - todayAtMidnight.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  // Format time as HH:MM
  const timeStr = gameDate.toLocaleString([], { 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: false 
  });
  
  if (diffInDays === 0) {
    return `Today ${timeStr}`;
  } else if (diffInDays === 1) {
    return `Tomorrow ${timeStr}`;
  } else if (diffInDays > 1 && diffInDays < 7) {
    // Show the day of week (Monday, Tuesday, etc.)
    const dayName = gameDate.toLocaleString([], { weekday: "long" });
    return `${dayName} ${timeStr}`;
  } else if (diffInDays >= 7) {
    // For dates next week or beyond
    const shortDay = gameDate.toLocaleString([], { weekday: "short" });
    const month = gameDate.toLocaleString([], { month: "short" });
    const day = gameDate.getDate();
    return `${shortDay} ${month} ${day} ${timeStr}`;
  } else {
    // Past dates (shouldn't normally show, but handle gracefully)
    return gameDate.toLocaleString([], { 
      weekday: "short", 
      month: "short", 
      day: "numeric",
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    });
  }
}

/**
 * Format a game date to display just the day label without time
 * Shows "Today", day names, or "Next week" depending on the date
 * 
 * @param date - ISO string, Date object, or timestamp
 * @returns Formatted string like "Today" or "Monday" or "Next week"
 */
export function formatGameDayOnly(date: string | Date | number): string {
  const gameDate = new Date(date);
  const today = new Date();
  
  // Reset time to midnight for date comparison
  const gameDateAtMidnight = new Date(gameDate);
  gameDateAtMidnight.setHours(0, 0, 0, 0);
  
  const todayAtMidnight = new Date(today);
  todayAtMidnight.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffInMs = gameDateAtMidnight.getTime() - todayAtMidnight.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Tomorrow";
  } else if (diffInDays > 1 && diffInDays < 7) {
    // Show the day of week (Monday, Tuesday, etc.)
    return gameDate.toLocaleString([], { weekday: "long" });
  } else if (diffInDays >= 7) {
    // For dates next week or beyond
    return "Next week";
  } else {
    // Past dates
    return gameDate.toLocaleString([], { 
      weekday: "short", 
      month: "short", 
      day: "numeric"
    });
  }
}
