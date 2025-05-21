import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView
} from 'react-native';
import { Activity } from '@/types';
import { getActivityColor, getFormattedTime } from '@/utils/activityUtils';

interface ActivityTimelineProps {
  activities: Activity[];
  date: Date;
  timePeriod: 'day' | 'week' | 'month';
}

interface TimelineEvent {
  time: Date;
  type: string;
  isStart: boolean;
  activityId: string;
}

export default function ActivityTimeline({ 
  activities, 
  date,
  timePeriod
}: ActivityTimelineProps) {
  // For timeline, we'll focus on daily view
  if (timePeriod !== 'day' || activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Daily Timeline</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {timePeriod !== 'day' 
              ? 'Timeline is only available in day view' 
              : 'No activities to display'}
          </Text>
        </View>
      </View>
    );
  }
  
  // Create timeline events from activities
  const timelineEvents: TimelineEvent[] = [];
  
  activities.forEach(activity => {
    // Add start event
    timelineEvents.push({
      time: activity.startTime,
      type: activity.type,
      isStart: true,
      activityId: activity.id
    });
    
    // Add end event if available
    if (activity.endTime) {
      timelineEvents.push({
        time: activity.endTime,
        type: activity.type,
        isStart: false,
        activityId: activity.id
      });
    }
  });
  
  // Sort events by time
  timelineEvents.sort((a, b) => a.time.getTime() - b.time.getTime());
  
  // Create hour markers (from 8 AM to 6 PM)
  const hourMarkers = [];
  const startHour = 8; // 8 AM
  const endHour = 18; // 6 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    hourMarkers.push({
      hour,
      label: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Timeline</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.timeline}>
          {/* Hour markers */}
          <View style={styles.hourMarkersContainer}>
            {hourMarkers.map((marker) => (
              <View key={marker.hour} style={styles.hourMarker}>
                <Text style={styles.hourLabel}>{marker.label}</Text>
                <View style={styles.hourLine} />
              </View>
            ))}
          </View>
          
          {/* Activity spans */}
          <View style={styles.activitiesContainer}>
            {activities.map((activity) => {
              // Calculate position and width
              const startHourDecimal = activity.startTime.getHours() + 
                activity.startTime.getMinutes() / 60;
              
              const endHourDecimal = activity.endTime
                ? activity.endTime.getHours() + activity.endTime.getMinutes() / 60
                : startHourDecimal + (activity.duration || 0) / 60;
              
              // Position is relative to start of timeline (8 AM)
              const startPosition = Math.max(0, (startHourDecimal - startHour) * 100);
              
              // Width is based on duration
              const width = Math.min(
                (endHour - startHour) * 100, 
                (endHourDecimal - Math.max(startHour, startHourDecimal)) * 100
              );
              
              // Skip if activity doesn't fall in our timeframe
              if (startPosition < 0 && startPosition + width < 0) return null;
              if (startPosition > (endHour - startHour) * 100) return null;
              
              const backgroundColor = getActivityColor(activity.type, 0.2);
              const borderColor = getActivityColor(activity.type, 0.7);
              const textColor = getActivityColor(activity.type, 1);
              
              return (
                <View 
                  key={activity.id}
                  style={[
                    styles.activitySpan,
                    {
                      left: `${startPosition}%`,
                      width: `${width}%`,
                      backgroundColor,
                      borderColor
                    }
                  ]}
                >
                  <Text 
                    style={[styles.activityLabel, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {activity.type}
                  </Text>
                  <Text style={styles.activityTime}>
                    {getFormattedTime(activity.startTime)}
                    {activity.endTime ? ` - ${getFormattedTime(activity.endTime)}` : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  timeline: {
    width: 1000, // Make sure it's wide enough to scroll
    height: 200,
  },
  hourMarkersContainer: {
    flexDirection: 'row',
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  hourMarker: {
    width: 100, // 100px per hour
    alignItems: 'center',
    position: 'relative',
  },
  hourLabel: {
    fontSize: 12,
    color: '#64748b',
    position: 'absolute',
    top: 0,
  },
  hourLine: {
    width: 1,
    height: 10,
    backgroundColor: '#e2e8f0',
    position: 'absolute',
    top: 20,
  },
  activitiesContainer: {
    position: 'relative',
    height: 150,
    marginTop: 20,
  },
  activitySpan: {
    position: 'absolute',
    height: 60,
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    justifyContent: 'center',
    top: 10,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
});