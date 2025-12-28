import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <Text style={styles.logo}>MyReadify</Text>
      <Text style={styles.tagline}>Sua estante de livros digital.</Text>
      <View style={styles.divider} />
      <Text style={styles.copyright}>© {currentYear} MyReadify. Todos os direitos reservados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: '#FFF', padding: 30, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE' },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#4A3728' },
  tagline: { fontSize: 12, color: '#A68A73', marginBottom: 15 },
  divider: { width: '100%', height: 1, backgroundColor: '#EEE', marginBottom: 15 },
  copyright: { fontSize: 10, color: '#AAA' }
});