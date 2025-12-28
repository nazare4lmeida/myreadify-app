import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { IMAGE_BASE_URL } from "../src/services/api";

export default function BookCard({ livro }: { livro: any }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  const resolveCoverUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/300x450";
    if (url.startsWith('http')) {
        if (url.includes('localhost')) {
            const fileName = url.split('/').pop();
            return `${IMAGE_BASE_URL}/${fileName}`;
        }
        return url;
    }
    const fileName = url.split('/').pop();
    return `${IMAGE_BASE_URL}/${fileName}`;
  };

  const handleAction = () => {
    if (livro.slug) {
        router.push({ pathname: '/detalhes', params: { slug: livro.slug } });
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleAction} style={styles.coverWrapper}>
        <Image
          source={{ uri: resolveCoverUrl(livro.cover_url) }}
          style={[styles.cover, { opacity: isLoaded ? 1 : 0 }]}
          onLoad={() => setIsLoaded(true)}
        />
        {!isLoaded && (
            <View style={styles.skeleton}>
                <ActivityIndicator color="#975238" />
            </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAction} style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{livro.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{livro.author}</Text>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnSummary} onPress={handleAction}>
          <Text style={styles.btnText}>Ler Resumo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, marginBottom: 15, width: '48%', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  coverWrapper: { width: '100%', height: 200, borderRadius: 6, overflow: 'hidden', backgroundColor: '#F0F0F0' },
  cover: { width: '100%', height: '100%' },
  skeleton: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  info: { marginTop: 8 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  author: { fontSize: 12, color: '#A68A73', marginBottom: 10 },
  cardActions: { marginTop: 'auto' },
  btnSummary: { backgroundColor: '#975238', paddingVertical: 8, borderRadius: 5, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});