import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';
import { Clock, Focus, CalendarClock } from 'lucide-react-native';
import { Activity } from '@/types';
import { getFormattedDuration } from '@/utils/activityUtils';

interface StatsOverviewProps {
  activities: Activity[];
  timePeriod: 'day' | 'week' | 'month';
  date: Date;
}

export default function StatsOverview({ 
  activities, 
  timePeriod,
  date 
}: StatsOverviewProps) {
  // Calculate total tracked time (sum of all durations)
  const totalTrackedTime = activities.reduce((total, activity) => {
    return total + (activity.duration || 0);
  }, 0);
  
  // Calculate number of unique activities
  const uniqueActivitiesCount = new Set(activities.map(a => a.type)).size;
  
  // Calculate average duration per activity
  const averageDuration = activities.length > 0 
    ? Math.round(totalTrackedTime / activities.length) 
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.timeIcon]}>
            <Clock size={20} color="#0891b2" />
          </View>
          <Text style={styles.statValue}>{getFormattedDuration(totalTrackedTime)}</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.countIcon]}>
            <Focus size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.statValue}>{activities.length}</Text>
          <Text style={styles.statLabel}>Activities</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.avgIcon]}>
            <CalendarClock size={20} color="#f59e0b" />
          </View>
          <Text style={styles.statValue}>{getFormattedDuration(averageDuration)}</Text>
          <Text style={styles.statLabel}>Avg. Duration</Text>
        </View>
      </View>
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timeIcon: {
    backgroundColor: '#e0f2fe',
  },
  countIcon: {
    backgroundColor: '#f3e8ff',
  },
  avgIcon: {
    backgroundColor: '#fef3c7',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
});