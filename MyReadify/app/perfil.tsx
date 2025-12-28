import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';

export default function PerfilPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Sair", "Deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: async () => {
          await signOut();
          router.replace('/login' as any);
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#975238" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          {/* CORREÇÃO AQUI: Casting para any para ler a role */}
          {(user as any)?.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Administrador</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#D93025" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A3728' },
  content: { flex: 1, padding: 20 },
  profileInfo: { alignItems: 'center', marginVertical: 30 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#975238', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#4A3728' },
  userEmail: { fontSize: 14, color: '#A68A73', marginTop: 5 },
  adminBadge: { backgroundColor: '#F4EAE2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginTop: 10 },
  adminBadgeText: { color: '#975238', fontSize: 12, fontWeight: 'bold' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginTop: 'auto' },
  logoutText: { marginLeft: 10, color: '#D93025', fontWeight: 'bold', fontSize: 16 }
});