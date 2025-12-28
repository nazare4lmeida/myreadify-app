import React, { useState, useEffect, useCallback } from "react";
import { 
  StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, 
  Image, ActivityIndicator, Alert, SafeAreaView, Platform 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import api, { IMAGE_BASE_URL } from "../src/services/api";
import { useAuth } from "../src/contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SubmitSummaryPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signed } = useAuth();

  const [title, setTitle] = useState((params.title as string) || "");
  const [author, setAuthor] = useState((params.author as string) || "");
  const [category, setCategory] = useState((params.category as string) || "");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [mySummaries, setMySummaries] = useState<any[]>([]);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUpdating = !!params.slug;

  const resolveCoverUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/150x225";
    if (url.startsWith('http')) return url;
    return `${IMAGE_BASE_URL}/${url.split('/').pop()}`;
  };

  const fetchMySummaries = useCallback(async () => {
    if (!signed) return;
    setLoadingSummaries(true);
    try {
      const response = await api.get("/my-summaries");
      setMySummaries(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummaries(false);
    }
  }, [signed]);

  useEffect(() => { fetchMySummaries(); }, [fetchMySummaries]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!title || !author || !category || !content) return Alert.alert("Erro", "Preencha tudo.");
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("content", content);

    if (isUpdating) {
      formData.append("slug", params.slug as string);
      formData.append("coverUrlMock", (params.cover_url as string).split('/').pop() || "");
    } else if (imageUri) {
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append("coverImage", {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      await api.post("/summaries", formData, { headers: { "Content-Type": "multipart/form-data" } });
      Alert.alert("Sucesso", "Enviado!", [{ text: "OK", onPress: () => router.push("/explore" as any) }]);
    } catch (err) {
      Alert.alert("Erro", "Falha no envio.");
    } finally { setIsSubmitting(false); }
  };

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return styles.status_pending;
    if (s === 'approved') return styles.status_approved;
    if (s === 'rejected') return styles.status_rejected;
    return {};
  };

  if (!signed) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.notLogged}>
          <Text>Logue para enviar.</Text>
          <TouchableOpacity onPress={() => router.push("/login" as any)}><Text>Ir para Login</Text></TouchableOpacity>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.formCard}>
          <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} editable={!isUpdating}/>
          <TextInput style={styles.input} placeholder="Autor" value={author} onChangeText={setAuthor} editable={!isUpdating}/>
          <TextInput style={styles.input} placeholder="Categoria" value={category} onChangeText={setCategory} editable={!isUpdating}/>
          <TextInput style={styles.textArea} placeholder="Resumo" value={content} onChangeText={setContent} multiline/>
          
          <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
             {imageUri || isUpdating ? 
              <Image source={{ uri: imageUri || resolveCoverUrl(params.cover_url as string) }} style={{width: 100, height: 150}} /> 
              : <Text>Escolher Capa</Text>
             }
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
            {isSubmitting ? <ActivityIndicator color="#FFF"/> : <Text style={{color: '#FFF'}}>Enviar</Text>}
          </TouchableOpacity>
        </View>

        <View style={{padding: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Meus Envios</Text>
          {mySummaries.map(item => (
            <View key={item.id} style={{flexDirection: 'row', marginVertical: 10}}>
              <Image source={{ uri: resolveCoverUrl(item.cover_url) }} style={{width: 40, height: 60}} />
              <View style={{marginLeft: 10}}>
                <Text>{item.title}</Text>
                {/* CORREÇÃO DE ESTILO DINÂMICO AQUI */}
                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                  <Text style={{fontSize: 10}}>{item.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F7" },
  notLogged: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formCard: { padding: 20, backgroundColor: '#FFF', margin: 15, borderRadius: 10 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  textArea: { borderBottomWidth: 1, height: 100, marginBottom: 15 },
  uploadBtn: { padding: 20, backgroundColor: '#F5F5F5', alignItems: 'center', marginBottom: 20 },
  submitBtn: { backgroundColor: '#975238', padding: 15, alignItems: 'center', borderRadius: 5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', marginTop: 5 },
  status_pending: { backgroundColor: '#FFF8E1' },
  status_approved: { backgroundColor: '#E8F5E9' },
  status_rejected: { backgroundColor: '#FFEBEE' }
});