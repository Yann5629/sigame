import { ActivityType } from '@/types';

// Get activity type color with opacity
export const getActivityColor = (type: ActivityType, opacity: number = 1): string => {
  // Color palette for activity types
  const colors: Record<ActivityType, string> = {
    Work: `rgba(14, 165, 233, ${opacity})`, // sky-500
    Meeting: `rgba(168, 85, 247, ${opacity})`, // purple-500
    Break: `rgba(245, 158, 11, ${opacity})`, // amber-500
    Admin: `rgba(236, 72, 153, ${opacity})`, // pink-500
    Learning: `rgba(34, 211, 238, ${opacity})`, // cyan-400
    Development: `rgba(16, 185, 129, ${opacity})`, // emerald-500
    Planning: `rgba(99, 102, 241, ${opacity})`, // indigo-500
    Other: `rgba(107, 114, 128, ${opacity})`, // gray-500
  };

  return colors[type] || colors.Other;
};

// Format time as HH:MM AM/PM
export const getFormattedTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Format duration in minutes to "Xh Ym" or "Ym" if less than 1 hour
export const getFormattedDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 
    ? `${hours}h ${remainingMinutes}m` 
    : `${hours}h`;
};