import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Modal,
  FlatList 
} from 'react-native';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { ActivityType } from '@/types';
import { useActivities } from '@/hooks/useActivities';
import { getActivityColor } from '@/utils/activityUtils';

interface ActivityTypeManagerProps {
  visible: boolean;
  onClose: () => void;
}

export default function ActivityTypeManager({ visible, onClose }: ActivityTypeManagerProps) {
  const { 
    activityTypes, 
    customActivityTypes,
    addActivityType, 
    removeActivityType 
  } = useActivities();
  const [newType, setNewType] = useState('');

  const handleAddType = () => {
    if (newType.trim() && !activityTypes.includes(newType as ActivityType)) {
      addActivityType(newType as ActivityType);
      setNewType('');
    }
  };

  const handleRemoveType = (type: ActivityType) => {
    removeActivityType(type);
  };

  // Check if a type is default (not removable) or custom
  const isDefaultType = (type: ActivityType) => {
    return !customActivityTypes.includes(type);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Manage Activity Types</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>
            Customize the activity types available in the app
          </Text>
          
          <View style={styles.addContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new activity type"
              value={newType}
              onChangeText={setNewType}
              maxLength={20}
            />
            <TouchableOpacity 
              style={[
                styles.addButton,
                (!newType.trim() || activityTypes.includes(newType as ActivityType)) && 
                styles.addButtonDisabled
              ]}
              onPress={handleAddType}
              disabled={!newType.trim() || activityTypes.includes(newType as ActivityType)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Current Activity Types</Text>
          
          <FlatList
            data={activityTypes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isDefault = isDefaultType(item);
              const typeBgColor = getActivityColor(item, 0.2);
              const typeBorderColor = getActivityColor(item, 0.7);
              const typeTextColor = getActivityColor(item, 1);
              
              return (
                <View style={styles.typeItem}>
                  <View 
                    style={[
                      styles.typeLabel,
                      { backgroundColor: typeBgColor, borderColor: typeBorderColor }
                    ]}
                  >
                    <Text style={[styles.typeLabelText, { color: typeTextColor }]}>
                      {item}
                    </Text>
                  </View>
                  
                  {!isDefault && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveType(item)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No activity types available</Text>
            }
            style={styles.typesList}
          />
          
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  addContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  typesList: {
    marginBottom: 16,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeLabel: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
  },
  typeLabelText: {
    fontWeight: '500',
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: 16,
  },
  doneButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});