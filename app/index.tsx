import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:9011/auth', 
        {
          login: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        await AsyncStorage.setItem('user_id', response.data.user_id);
        router.push('/main');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
      console.error(error);
    }
  };

  // Function to handle registration link
  const handleRegisterLink = () => {
    router.push('/register'); // Navigate to the register screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />

      {/* Link to the Register Screen */}
      <TouchableOpacity onPress={handleRegisterLink}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  linkText: {
    marginTop: 16,
    color: '#1e90ff',
    textAlign: 'center',
  },
});
