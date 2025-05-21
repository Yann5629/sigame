import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput
} from 'react-native';
import { Play } from 'lucide-react-native';
import { ActivityType } from '@/types';
import { useActivities } from '@/hooks/useActivities';
import ActivityTypePicker from './ActivityTypePicker';

export default function NewActivityForm() {
  const { startActivity, activityTypes } = useActivities();
  const [activityType, setActivityType] = useState<ActivityType>('Work');
  const [note, setNote] = useState('');

  const handleStart = () => {
    startActivity({
      type: activityType,
      startTime: new Date(),
      note,
    });
    
    // Reset form
    setNote('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start New Activity</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Activity Type</Text>
        <ActivityTypePicker 
          selectedType={activityType}
          onSelect={setActivityType}
          types={activityTypes}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Add details about this activity"
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>
      
      <TouchableOpacity 
        style={styles.startButton}
        onPress={handleStart}
      >
        <Play size={20} color="#FFFFFF" style={styles.startIcon} />
        <Text style={styles.startButtonText}>Start Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  startButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  startIcon: {
    marginRight: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});