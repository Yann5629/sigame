import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { Activity } from '@/types';
import { getActivityColor, getFormattedDuration, getFormattedTime } from '@/utils/activityUtils';

interface ActivityTableProps {
  activities: Activity[];
  currentActivity: Activity | null;
}

export default function ActivityTable({ activities, currentActivity }: ActivityTableProps) {
  // Combine current and past activities
  const allActivities = currentActivity 
    ? [currentActivity, ...activities]
    : activities;
    
  if (allActivities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No activities to display</Text>
        <Text style={styles.emptySubtext}>
          Start tracking activities to see them in table view
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal style={styles.container}>
      <View>
        {/* Table Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.typeCell]}>Type</Text>
          <Text style={[styles.headerCell, styles.timeCell]}>Start</Text>
          <Text style={[styles.headerCell, styles.timeCell]}>End</Text>
          <Text style={[styles.headerCell, styles.durationCell]}>Duration</Text>
          <Text style={[styles.headerCell, styles.noteCell]}>Note</Text>
          <Text style={[styles.headerCell, styles.actionsCell]}>Actions</Text>
        </View>
        
        {/* Table Body */}
        <ScrollView style={styles.tableBody}>
          {allActivities.map((activity, index) => {
            const isActive = currentActivity && activity.id === currentActivity.id;
            const textColor = getActivityColor(activity.type, 1);
            
            // If active, use current time for end time display
            const endTimeDisplay = isActive && !activity.endTime 
              ? 'now'
              : activity.endTime 
                ? getFormattedTime(activity.endTime)
                : '';
                
            // Calculate duration for active items
            const duration = isActive && !activity.duration
              ? (() => {
                  const now = new Date();
                  const startTime = activity.startTime;
                  let durationMinutes = Math.round((now.getTime() - startTime.getTime()) / 60000);
                  
                  // Subtract paused time if any
                  if (activity.totalPausedTime) {
                    durationMinutes -= activity.totalPausedTime;
                  }
                  
                  // If currently paused, subtract current pause duration
                  if (activity.isPaused && activity.pausedAt) {
                    const pauseDuration = Math.round((now.getTime() - activity.pausedAt.getTime()) / 60000);
                    durationMinutes -= pauseDuration;
                  }
                  
                  return getFormattedDuration(durationMinutes > 0 ? durationMinutes : 1);
                })()
              : activity.duration
                ? getFormattedDuration(activity.duration)
                : '';
                
            return (
              <View 
                key={activity.id} 
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  isActive && styles.activeRow
                ]}
              >
                <View style={[styles.cell, styles.typeCell]}>
                  <Text style={[styles.typeText, { color: textColor }]}>
                    {activity.type}
                  </Text>
                  {activity.isPaused && (
                    <View style={styles.pausedBadge}>
                      <Text style={styles.pausedText}>PAUSED</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cell, styles.timeCell]}>
                  {getFormattedTime(activity.startTime)}
                </Text>
                <Text style={[styles.cell, styles.timeCell]}>
                  {endTimeDisplay}
                </Text>
                <Text style={[styles.cell, styles.durationCell]}>
                  {duration}
                </Text>
                <Text 
                  style={[styles.cell, styles.noteCell]}
                  numberOfLines={2}
                >
                  {activity.note}
                </Text>
                <View style={[styles.cell, styles.actionsCell]}>
                  {!isActive && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Edit2 size={16} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Trash2 size={16} color="#64748b" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 12,
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 14,
    color: '#475569',
    paddingHorizontal: 12,
  },
  tableBody: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 12,
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f8fafc',
  },
  activeRow: {
    backgroundColor: '#e0f2fe',
  },
  cell: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  typeCell: {
    width: 140,
  },
  timeCell: {
    width: 80,
    fontSize: 14,
    color: '#334155',
  },
  durationCell: {
    width: 90,
    fontSize: 14,
    color: '#334155',
  },
  noteCell: {
    width: 200,
    fontSize: 14,
    color: '#334155',
  },
  actionsCell: {
    width: 100,
  },
  typeText: {
    fontWeight: '500',
    fontSize: 14,
  },
  pausedBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  pausedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginRight: 8,
  },
});