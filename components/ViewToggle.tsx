import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { TableProperties, Rows3 } from 'lucide-react-native';

interface ViewToggleProps {
  activeView: string;
  onChangeView: (view: string) => void;
}

export default function ViewToggle({ activeView, onChangeView }: ViewToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          activeView === 'form' && styles.activeToggle
        ]}
        onPress={() => onChangeView('form')}
      >
        <Rows3 
          size={18} 
          color={activeView === 'form' ? '#0891b2' : '#64748b'} 
          style={styles.toggleIcon}
        />
        <Text 
          style={[
            styles.toggleText,
            activeView === 'form' && styles.activeToggleText
          ]}
        >
          List
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.toggleButton,
          activeView === 'table' && styles.activeToggle
        ]}
        onPress={() => onChangeView('table')}
      >
        <TableProperties 
          size={18} 
          color={activeView === 'table' ? '#0891b2' : '#64748b'} 
          style={styles.toggleIcon}
        />
        <Text 
          style={[
            styles.toggleText,
            activeView === 'table' && styles.activeToggleText
          ]}
        >
          Table
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  activeToggle: {
    backgroundColor: '#e0f2fe',
  },
  toggleIcon: {
    marginRight: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#0891b2',
    fontWeight: '600',
  },
});