import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      await signUp({ name, email, password });
      
      Alert.alert(
        'Sucesso!', 
        'Cadastro realizado com sucesso! Você será redirecionado para a página de login.',
        [{ text: 'OK', onPress: () => router.push('/login') }]
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.registerContainer}>
          <Text style={styles.title}>Crie sua Conta</Text>

          {/* Nome de Usuário */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de usuário:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome de usuário"
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Criar Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crie uma senha:</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                value={password}
                onChangeText={setPassword}
                placeholder="Crie uma senha forte"
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

          {/* Confirmar Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha:</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme sua senha"
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.registerButtonSubmit, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Processando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLinkText}>Entre aqui</Text>
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
    paddingVertical: 40,
  },
  registerContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
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
    marginBottom: 18,
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
    fontSize: 14,
  },
  registerButtonSubmit: {
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
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#555',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#975238',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});