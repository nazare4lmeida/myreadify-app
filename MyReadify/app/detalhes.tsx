import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetalhesLivro() {
  const { title, author } = useLocalSearchParams(); // Removido o 'id' que não estava em uso
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text style={styles.summaryText}>
            O resumo completo será carregado aqui conforme os dados do seu banco.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDFCFB' },
  container: { flex: 1 },
  backButton: { padding: 20 },
  backText: { color: '#8B5E3C', fontWeight: 'bold' },
  headerContent: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4A3728' },
  author: { fontSize: 18, color: '#A68A73' },
  content: { padding: 25 },
  divider: { height: 1, backgroundColor: '#E3D5CA', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#8B5E3C', marginBottom: 10 },
  summaryText: { fontSize: 16, color: '#4A3728', lineHeight: 24 },
});