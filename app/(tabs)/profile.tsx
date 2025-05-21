import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  Alert,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  LogOut, 
  Moon, 
  User as UserIcon, 
  Mail, 
  UserCog,
  Settings,
  Palette
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ActivityTypeManager from '@/components/ActivityTypeManager';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, isAdmin } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showActivityTypes, setShowActivityTypes] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here would be implementation to actually change the theme
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Profile" subtitle="Your account" />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Email not available'}</Text>
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminText}>Admin</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.settingIconContainer}>
                <Moon size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
              thumbColor="#ffffff"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowActivityTypes(true)}
          >
            <View style={styles.settingTextContainer}>
              <View style={styles.settingIconContainer}>
                <Palette size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Manage Activity Types</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.settingIconContainer}>
                <UserIcon size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.settingIconContainer}>
                <Mail size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Change Email</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          {isAdmin && (
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <View style={styles.settingIconContainer}>
                  <UserCog size={20} color="#64748b" />
                </View>
                <Text style={styles.settingText}>Manage Users</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.settingIconContainer}>
                <Settings size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>App Settings</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.logoutContainer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {showActivityTypes && (
        <ActivityTypeManager 
          visible={showActivityTypes}
          onClose={() => setShowActivityTypes(false)}
        />
      )}
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
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  adminBadge: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  adminText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    marginTop: 8,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#334155',
  },
  chevron: {
    fontSize: 20,
    color: '#94a3b8',
  },
  logoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 8,
  },
});