import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { ActivityType } from '@/types';
import { getActivityColor } from '@/utils/activityUtils';

interface ActivityTypePickerProps {
  selectedType: ActivityType;
  onSelect: (type: ActivityType) => void;
  types: ActivityType[];
}

export default function ActivityTypePicker({ 
  selectedType, 
  onSelect, 
  types 
}: ActivityTypePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelect = (type: ActivityType) => {
    onSelect(type);
    closeModal();
  };

  const backgroundColor = getActivityColor(selectedType, 0.2);
  const borderColor = getActivityColor(selectedType, 0.7);
  const textColor = getActivityColor(selectedType, 1);

  return (
    <>
      <TouchableOpacity 
        style={styles.selector}
        onPress={openModal}
      >
        <View style={[styles.selectedType, { backgroundColor, borderColor }]}>
          <Text style={[styles.selectedTypeText, { color: textColor }]}>
            {selectedType}
          </Text>
        </View>
        <ChevronDown size={20} color="#64748b" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Activity Type</Text>
            
            <FlatList
              data={types}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const typeBgColor = getActivityColor(item, 0.2);
                const typeBorderColor = getActivityColor(item, 0.7);
                const typeTextColor = getActivityColor(item, 1);
                
                return (
                  <TouchableOpacity
                    style={[
                      styles.typeItem,
                      { backgroundColor: typeBgColor, borderColor: typeBorderColor }
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.typeItemText, { color: typeTextColor }]}>
                      {item}
                    </Text>
                    {item === selectedType && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.typesList}
            />
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  selectedType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectedTypeText: {
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
    textAlign: 'center',
  },
  typesList: {
    marginBottom: 16,
  },
  typeItem: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0891b2',
  },
  closeButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '500',
  },
});