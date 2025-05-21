export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ActivityType = 
  | 'Work' 
  | 'Meeting' 
  | 'Break' 
  | 'Admin' 
  | 'Learning' 
  | 'Development' 
  | 'Planning' 
  | 'Other';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  note?: string;
  isPaused?: boolean;
  pausedAt?: Date;
  totalPausedTime?: number; // in minutes
}

export interface ActivityInput {
  type: ActivityType;
  startTime: Date;
  endTime?: Date;
  note?: string;
}

export interface ActivityTypeConfig {
  type: ActivityType;
  color: string;
  icon: string;
}