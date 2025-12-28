import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Header() {
  const { signed, user, signOut } = useAuth(); // signOut agora é extraído
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigateTo('/')} style={styles.logoContainer}>
        <Text style={styles.logoTitle}>MyReadify</Text>
        <Text style={styles.logoSubtitle}>Sua estante digital</Text>
      </TouchableOpacity>

      <View style={styles.navProfile}>
        {signed ? (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigateTo('/perfil')}
          >
            <Text style={styles.profileName}>
              Olá, {(user as any)?.role === 'admin' ? 'Admin' : user?.name?.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigateTo('/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginTop: 10
  },
  logoContainer: { flex: 1 },
  logoTitle: { fontSize: 20, fontWeight: 'bold', color: '#4A3728' },
  logoSubtitle: { fontSize: 10, color: '#A68A73', marginTop: -2 },
  navProfile: { flexDirection: 'row', alignItems: 'center' },
  profileButton: { backgroundColor: '#F4EAE2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  profileName: { color: '#975238', fontWeight: 'bold', fontSize: 12 },
  loginButton: { borderWidth: 1, borderColor: '#975238', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 5 },
  loginButtonText: { color: '#975238', fontWeight: 'bold' }
});