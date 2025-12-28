import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones padrão do Expo
import { useAuth } from '../src/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email, password });
      router.replace('/'); // replace evita que o usuário volte para o login pelo botão "voltar"
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView evita que o teclado cubra os campos de input no iOS/Android
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Acesse sua Conta</Text>

          {/* Grupo de Input: Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Grupo de Input: Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                value={password}
                onChangeText={setPassword}
                placeholder="Sua senha"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.togglePassword} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#A68A73" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.loginButtonSubmit, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Carregando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signupLinkText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    elevation: 4, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#975238',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputPassword: {
    paddingRight: 50,
  },
  togglePassword: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  errorMessage: {
    color: '#D93025',
    textAlign: 'center',
    marginBottom: 15,
  },
  loginButtonSubmit: {
    backgroundColor: '#975238',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#555',
    fontSize: 14,
  },
  signupLinkText: {
    color: '#975238',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});