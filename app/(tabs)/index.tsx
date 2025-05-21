import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Pause, Check } from 'lucide-react-native';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import ActivityItem from '@/components/ActivityItem';
import NewActivityForm from '@/components/NewActivityForm';
import Header from '@/components/Header';
import ViewToggle from '@/components/ViewToggle';
import ActivityTable from '@/components/ActivityTable';

type ViewMode = 'form' | 'table';

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { 
    activities, 
    currentActivity, 
    startActivity, 
    pauseActivity, 
    resumeActivity, 
    completeActivity,
    isLoading
  } = useActivities();
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  
  // Current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Today" subtitle={formattedDate} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Today" subtitle={formattedDate} />
      
      <View style={styles.viewToggleContainer}>
        <ViewToggle 
          activeView={viewMode} 
          onChangeView={(mode) => setViewMode(mode as ViewMode)} 
        />
      </View>

      {viewMode === 'form' ? (
        <ScrollView style={styles.content}>
          {activities.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Today's Activities</Text>
              {activities.map((activity) => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity} 
                />
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No activities recorded yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your first activity for today
              </Text>
            </View>
          )}

          {currentActivity ? (
            <View style={styles.currentActivityContainer}>
              <Text style={styles.sectionTitle}>Current Activity</Text>
              <ActivityItem 
                activity={currentActivity} 
                isActive
              />
            </View>
          ) : (
            <NewActivityForm />
          )}
        </ScrollView>
      ) : (
        <ActivityTable 
          activities={activities} 
          currentActivity={currentActivity}
        />
      )}

      <View style={[styles.actionsContainer, { paddingBottom: insets.bottom || 16 }]}>
        {currentActivity ? (
          currentActivity.isPaused ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.resumeButton]}
              onPress={resumeActivity}
            >
              <Play size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Resume</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.pauseButton]}
                onPress={pauseActivity}
              >
                <Pause size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Pause</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={completeActivity}
              >
                <Check size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.startButton]}
            onPress={() => startActivity({
              type: 'Work',
              startTime: new Date(),
              note: ''
            })}
          >
            <Play size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Start Activity</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  viewToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
    marginTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  currentActivityContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#0891b2',
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
    flex: 1,
    marginRight: 8,
  },
  resumeButton: {
    backgroundColor: '#10b981',
  },
  completeButton: {
    backgroundColor: '#0891b2',
    flex: 1,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});