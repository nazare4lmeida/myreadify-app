import React, { useState } from 'react';
import { 
  StyleSheet, Text, TextInput, TouchableOpacity, 
  ScrollView, Image, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '../src/services/api';

export default function EnviarResumo() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para escolher a imagem da galeria
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !author || !category || !content || !image) {
      Alert.alert("Erro", "Por favor, preencha todos os campos e escolha uma capa.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("content", content);

    // Preparando a imagem para o FormData no Mobile
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("coverImage", {
      uri: image,
      name: filename,
      type,
    } as any);

    try {
      await api.post("/summaries", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Sucesso", "Resumo enviado para avaliação!");
      router.replace('/explore');
    } catch (err: any) {
      const msg = err.response?.data?.error || "Erro ao enviar resumo.";
      Alert.alert("Erro", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Enviar Resumo</Text>
        <p style={styles.description}>Compartilhe suas leituras com a comunidade MyReadify.</p>

        <TextInput 
          style={styles.input} 
          placeholder="Título do Livro" 
          value={title} 
          onChangeText={setTitle} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Autor" 
          value={author} 
          onChangeText={setAuthor} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Categoria (Ex: Fantasia, Filosofia)" 
          value={category} 
          onChangeText={setCategory} 
        />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Escreva seu resumo aqui..." 
          value={content} 
          onChangeText={setContent} 
          multiline 
          numberOfLines={6}
        />

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
            <Text style={styles.imageBtnText}>📸 Selecionar Capa do Livro</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitBtn, isSubmitting && styles.btnDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Enviar para Avaliação</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDFCFB' },
  container: { padding: 25 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#4A3728', marginBottom: 5 },
  description: { fontSize: 14, color: '#A68A73', marginBottom: 25 },
  input: { 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#E3D5CA', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15,
    fontSize: 16,
    color: '#4A3728'
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  imageBtn: { 
    height: 150, 
    backgroundColor: '#F9F4F0', 
    borderRadius: 10, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: '#E3D5CA',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden'
  },
  imageBtnText: { color: '#8B5E3C', fontWeight: 'bold' },
  preview: { width: '100%', height: '100%' },
  submitBtn: { 
    backgroundColor: '#8B5E3C', 
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});