import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { Activity } from '@/types';
import { getActivityColor } from '@/utils/activityUtils';

interface ActivityTypeChartProps {
  activities: Activity[];
  timePeriod: 'day' | 'week' | 'month';
  date: Date;
}

interface TypeSummary {
  type: string;
  duration: number;
  percentage: number;
}

export default function ActivityTypeChart({ 
  activities, 
  timePeriod,
  date 
}: ActivityTypeChartProps) {
  // Calculate total duration for each activity type
  const typeSummary: Record<string, number> = {};
  
  activities.forEach(activity => {
    const { type, duration = 0 } = activity;
    
    if (!typeSummary[type]) {
      typeSummary[type] = 0;
    }
    
    typeSummary[type] += duration;
  });
  
  // Calculate total duration
  const totalDuration = Object.values(typeSummary).reduce((sum, duration) => sum + duration, 0);
  
  // Convert to array with percentages
  const typeData: TypeSummary[] = Object.entries(typeSummary).map(([type, duration]) => ({
    type,
    duration,
    percentage: totalDuration > 0 ? (duration / totalDuration) * 100 : 0
  }));
  
  // Sort by duration (descending)
  typeData.sort((a, b) => b.duration - a.duration);

  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Activity Distribution</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Distribution</Text>
      
      <View style={styles.barContainer}>
        {typeData.length > 0 ? (
          <View style={styles.chartContainer}>
            <View style={styles.chartBar}>
              {typeData.map((item, index) => (
                <View 
                  key={item.type}
                  style={[
                    styles.barSegment,
                    { 
                      backgroundColor: getActivityColor(item.type as any, 1),
                      width: `${item.percentage}%` 
                    }
                  ]}
                />
              ))}
            </View>
            
            <View style={styles.chartLegend}>
              {typeData.map((item) => (
                <View key={item.type} style={styles.legendItem}>
                  <View 
                    style={[
                      styles.legendColor,
                      { backgroundColor: getActivityColor(item.type as any, 1) }
                    ]} 
                  />
                  <View style={styles.legendInfo}>
                    <Text style={styles.legendType}>{item.type}</Text>
                    <View style={styles.legendStats}>
                      <Text style={styles.legendPercentage}>
                        {Math.round(item.percentage)}%
                      </Text>
                      <Text style={styles.legendDuration}>
                        {Math.floor(item.duration / 60)}h {item.duration % 60}m
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activity data available</Text>
          </View>
        )}
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
  barContainer: {
    marginBottom: 8,
  },
  chartContainer: {
    width: '100%',
  },
  chartBar: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  barSegment: {
    height: '100%',
  },
  chartLegend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendInfo: {
    flex: 1,
  },
  legendType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 2,
  },
  legendStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 8,
  },
  legendDuration: {
    fontSize: 12,
    color: '#94a3b8',
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
});