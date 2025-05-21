import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import { CreditCard as Edit2, Trash2, Clock, Save, X } from 'lucide-react-native';
import { Activity } from '@/types';
import { useActivities } from '@/hooks/useActivities';
import { getActivityColor, getFormattedDuration, getFormattedTime } from '@/utils/activityUtils';

interface ActivityItemProps {
  activity: Activity;
  isActive?: boolean;
}

export default function ActivityItem({ activity, isActive = false }: ActivityItemProps) {
  const { updateActivity, deleteActivity } = useActivities();
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const backgroundColor = getActivityColor(activity.type, 0.2);
  const borderColor = getActivityColor(activity.type, 0.7);
  const textColor = getActivityColor(activity.type, 1);

  const handleSave = () => {
    updateActivity(activity.id, editedActivity);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedActivity(activity);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteActivity(activity.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Display current time if this is an active activity without an end time
  const endTimeDisplay = isActive && !activity.endTime 
    ? 'now'
    : activity.endTime 
      ? getFormattedTime(activity.endTime)
      : '';

  // For active items, calculate duration in real-time
  const getDuration = () => {
    if (activity.duration) return getFormattedDuration(activity.duration);
    
    if (isActive) {
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
    }
    
    return '';
  };

  return (
    <>
      <View style={[
        styles.container, 
        { backgroundColor, borderColor },
        isActive && styles.activeContainer
      ]}>
        {!isEditing ? (
          <>
            <View style={styles.header}>
              <View style={styles.typeContainer}>
                <Text style={[styles.type, { color: textColor }]}>
                  {activity.type}
                </Text>
                {activity.isPaused && (
                  <View style={styles.pausedBadge}>
                    <Text style={styles.pausedText}>PAUSED</Text>
                  </View>
                )}
              </View>
              <View style={styles.actions}>
                {!isActive && (
                  <>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => setIsEditing(true)}
                    >
                      <Edit2 size={16} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={handleDelete}
                    >
                      <Trash2 size={16} color="#64748b" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            
            <View style={styles.timeContainer}>
              <Clock size={14} color="#64748b" style={styles.timeIcon} />
              <Text style={styles.time}>
                {getFormattedTime(activity.startTime)} - {endTimeDisplay}
              </Text>
              <Text style={styles.duration}>
                ({getDuration()})
              </Text>
            </View>
            
            {activity.note && (
              <Text style={styles.note}>{activity.note}</Text>
            )}
          </>
        ) : (
          <View style={styles.editForm}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Edit Activity</Text>
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={styles.editActionButton}
                  onPress={handleSave}
                >
                  <Save size={18} color="#0891b2" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.editActionButton}
                  onPress={handleCancel}
                >
                  <X size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Note</Text>
              <TextInput
                style={styles.input}
                value={editedActivity.note}
                onChangeText={(text) => setEditedActivity({...editedActivity, note: text})}
                placeholder="Enter a note (optional)"
                multiline
              />
            </View>
          </View>
        )}
      </View>

      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Activity</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this activity? This cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  activeContainer: {
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
  },
  pausedBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  pausedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  time: {
    fontSize: 14,
    color: '#334155',
  },
  duration: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  note: {
    fontSize: 14,
    color: '#334155',
  },
  editForm: {
    padding: 4,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  editActions: {
    flexDirection: 'row',
  },
  editActionButton: {
    padding: 4,
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    minHeight: 60,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});