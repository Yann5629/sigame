import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Activity, ActivityInput, ActivityType } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface ActivityContextType {
  activities: Activity[];
  currentActivity: Activity | null;
  activityTypes: ActivityType[];
  customActivityTypes: ActivityType[];
  isLoading: boolean;
  startActivity: (activity: ActivityInput) => void;
  pauseActivity: () => void;
  resumeActivity: () => void;
  completeActivity: () => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  addActivityType: (type: ActivityType) => void;
  removeActivityType: (type: ActivityType) => void;
  exportActivities: (date: Date, period: 'day' | 'week' | 'month') => Promise<void>;
}

// Default activity types
const DEFAULT_ACTIVITY_TYPES: ActivityType[] = [
  'Work',
  'Meeting',
  'Break',
  'Admin',
  'Learning',
  'Development',
  'Planning',
  'Other'
];

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// Mock activities data for demo purposes
const mockActivities: Activity[] = [
  {
    id: '1',
    userId: '1',
    type: 'Work',
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(10, 30, 0, 0)),
    duration: 90,
    note: 'Working on project documentation',
  },
  {
    id: '2',
    userId: '1',
    type: 'Meeting',
    startTime: new Date(new Date().setHours(10, 30, 0, 0)),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)),
    duration: 30,
    note: 'Team standup',
  },
  {
    id: '3',
    userId: '1',
    type: 'Break',
    startTime: new Date(new Date().setHours(11, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 30, 0, 0)),
    duration: 30,
    note: 'Lunch break',
  },
  {
    id: '4',
    userId: '1',
    type: 'Development',
    startTime: new Date(new Date().setHours(11, 30, 0, 0)),
    endTime: new Date(new Date().setHours(13, 0, 0, 0)),
    duration: 90,
    note: 'Implementing new features',
  },
  {
    id: '5',
    userId: '2',
    type: 'Admin',
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(10, 0, 0, 0)),
    duration: 60,
    note: 'Admin work',
  },
];

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider = ({ children }: ActivityProviderProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [customActivityTypes, setCustomActivityTypes] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load activities when user changes
  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (user) {
          // In a real app, this would be an API call to get activities for the user
          // For demo, filter mock activities by userId
          const userActivities = mockActivities.filter(
            activity => activity.userId === user.id ||
            (user.role === 'admin') // Admins can see all activities
          );
          
          setActivities(userActivities);
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [user]);

  // Start a new activity
  const startActivity = (activityInput: ActivityInput) => {
    if (!user) return;
    
    // Complete current activity if there is one
    if (currentActivity) {
      completeActivity();
    }
    
    const newActivity: Activity = {
      id: Date.now().toString(), // In a real app, this would be generated on the server
      userId: user.id,
      type: activityInput.type,
      startTime: activityInput.startTime,
      note: activityInput.note || '',
    };
    
    setCurrentActivity(newActivity);
  };

  // Pause the current activity
  const pauseActivity = () => {
    if (!currentActivity) return;
    
    const pausedActivity = {
      ...currentActivity,
      isPaused: true,
      pausedAt: new Date(),
    };
    
    setCurrentActivity(pausedActivity);
  };

  // Resume the current activity
  const resumeActivity = () => {
    if (!currentActivity || !currentActivity.isPaused || !currentActivity.pausedAt) return;
    
    const now = new Date();
    const pauseDuration = Math.round((now.getTime() - currentActivity.pausedAt.getTime()) / 60000); // in minutes
    
    const resumedActivity = {
      ...currentActivity,
      isPaused: false,
      totalPausedTime: (currentActivity.totalPausedTime || 0) + pauseDuration,
    };
    
    setCurrentActivity(resumedActivity);
  };

  // Complete the current activity
  const completeActivity = () => {
    if (!currentActivity) return;
    
    const now = new Date();
    let duration = Math.round((now.getTime() - currentActivity.startTime.getTime()) / 60000); // in minutes
    
    // Subtract paused time if any
    if (currentActivity.totalPausedTime) {
      duration -= currentActivity.totalPausedTime;
    }
    
    // If activity is paused, calculate additional pause time
    if (currentActivity.isPaused && currentActivity.pausedAt) {
      const additionalPauseTime = Math.round((now.getTime() - currentActivity.pausedAt.getTime()) / 60000);
      duration -= additionalPauseTime;
    }
    
    const completedActivity: Activity = {
      ...currentActivity,
      endTime: now,
      duration: duration > 0 ? duration : 1, // Minimum 1 minute
      isPaused: false,
    };
    
    setActivities(prevActivities => [...prevActivities, completedActivity]);
    setCurrentActivity(null);
  };

  // Update an existing activity
  const updateActivity = (id: string, updates: Partial<Activity>) => {
    // Check if it's the current activity
    if (currentActivity && currentActivity.id === id) {
      setCurrentActivity({
        ...currentActivity,
        ...updates,
      });
      return;
    }
    
    // Otherwise, update in the activities list
    setActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  };

  // Delete an activity
  const deleteActivity = (id: string) => {
    // If trying to delete current activity, just clear it
    if (currentActivity && currentActivity.id === id) {
      setCurrentActivity(null);
      return;
    }
    
    // Remove from activities list
    setActivities(prevActivities =>
      prevActivities.filter(activity => activity.id !== id)
    );
  };

  // Add a custom activity type
  const addActivityType = (type: ActivityType) => {
    if (!DEFAULT_ACTIVITY_TYPES.includes(type) && !customActivityTypes.includes(type)) {
      setCustomActivityTypes(prev => [...prev, type]);
    }
  };

  // Remove a custom activity type
  const removeActivityType = (type: ActivityType) => {
    // Can't remove default types
    if (DEFAULT_ACTIVITY_TYPES.includes(type)) return;
    
    setCustomActivityTypes(prev => prev.filter(t => t !== type));
  };

  // Export activities to Excel
  const exportActivities = async (date: Date, period: 'day' | 'week' | 'month') => {
    // In a real app, this would call an API to generate and download an Excel file
    console.log(`Exporting activities for ${period} on ${date.toDateString()}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`Activities exported for ${period} starting ${date.toDateString()}`);
  };

  const value = {
    activities,
    currentActivity,
    activityTypes: [...DEFAULT_ACTIVITY_TYPES, ...customActivityTypes],
    customActivityTypes,
    isLoading,
    startActivity,
    pauseActivity,
    resumeActivity,
    completeActivity,
    updateActivity,
    deleteActivity,
    addActivityType,
    removeActivityType,
    exportActivities,
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};