import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, FileSpreadsheet, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useActivities } from '@/hooks/useActivities';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import ActivityTypeChart from '@/components/ActivityTypeChart';
import ActivityTimeline from '@/components/ActivityTimeline';

type TimePeriod = 'day' | 'week' | 'month';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { activities, exportActivities, isLoading } = useActivities();

  // Calculate the date range based on the time period
  const getDateRange = () => {
    const formatOptions: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric'
    };

    if (timePeriod === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else if (timePeriod === 'week') {
      // Calculate start of week (Sunday)
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      // Calculate end of week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', formatOptions)} - ${endOfWeek.toLocaleDateString('en-US', formatOptions)}`;
    } else {
      // For month
      return currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (timePeriod === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (timePeriod === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (timePeriod === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (timePeriod === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Check if we can go to next (not future)
  const canGoNext = () => {
    const today = new Date();
    
    if (timePeriod === 'day') {
      return currentDate.getDate() < today.getDate() || 
             currentDate.getMonth() < today.getMonth() || 
             currentDate.getFullYear() < today.getFullYear();
    } else if (timePeriod === 'week') {
      // Get the end of current week
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 6);
      return endOfWeek < today;
    } else {
      // Month view
      return currentDate.getMonth() < today.getMonth() || 
             currentDate.getFullYear() < today.getFullYear();
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      await exportActivities(currentDate, timePeriod);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Dashboard" subtitle="Activity Analysis" />
      
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, timePeriod === 'day' && styles.activePeriod]}
          onPress={() => setTimePeriod('day')}
        >
          <Text style={[
            styles.periodButtonText, 
            timePeriod === 'day' && styles.activePeriodText
          ]}>
            Day
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.periodButton, timePeriod === 'week' && styles.activePeriod]}
          onPress={() => setTimePeriod('week')}
        >
          <Text style={[
            styles.periodButtonText, 
            timePeriod === 'week' && styles.activePeriodText
          ]}>
            Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.periodButton, timePeriod === 'month' && styles.activePeriod]}
          onPress={() => setTimePeriod('month')}
        >
          <Text style={[
            styles.periodButtonText, 
            timePeriod === 'month' && styles.activePeriodText
          ]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.dateNavigator}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={goToPrevious}
        >
          <ArrowLeft size={20} color="#64748b" />
        </TouchableOpacity>
        
        <View style={styles.currentPeriod}>
          <Calendar size={16} color="#64748b" style={styles.calendarIcon} />
          <Text style={styles.currentPeriodText}>{getDateRange()}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.navButton, !canGoNext() && styles.disabledButton]}
          onPress={goToNext}
          disabled={!canGoNext()}
        >
          <ArrowRight size={20} color={canGoNext() ? "#64748b" : "#cbd5e1"} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <StatsOverview 
            activities={activities} 
            timePeriod={timePeriod} 
            date={currentDate}
          />
          
          <ActivityTypeChart 
            activities={activities} 
            timePeriod={timePeriod} 
            date={currentDate}
          />
          
          <ActivityTimeline 
            activities={activities} 
            date={currentDate}
            timePeriod={timePeriod}
          />
        </ScrollView>
      )}

      <View style={[styles.exportContainer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={handleExport}
        >
          <FileSpreadsheet size={20} color="#0891b2" />
          <Text style={styles.exportButtonText}>Export to Excel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activePeriod: {
    backgroundColor: '#e0f2fe',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activePeriodText: {
    color: '#0891b2',
    fontWeight: '600',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  navButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  currentPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 8,
  },
  currentPeriodText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
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
  exportContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#0891b2',
    borderRadius: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0891b2',
    marginLeft: 8,
  },
});