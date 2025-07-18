import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Alert } from 'react-native'; // 👈 Add this at top

import { useRouter } from 'expo-router';
import { useAppDispatch } from '../redux/hooks';
import { registerUser } from '../redux/authSlice';

const gradients = [
  ['#4D96FF', '#6BCB77'],
  ['#FF6B6B', '#FFD93D'],
  ['#A66CFF', '#F2A7C1'],
  ['#43E97B', '#38F9D7'],
];

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const [bgIndex, setBgIndex] = useState(0);
  const [colors, setColors] = useState(gradients[0]);
  const colorAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % gradients.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      colorAnim.setValue(0);
      setColors(gradients[bgIndex]);
    });
  }, [bgIndex]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors[0], colors[1]],
  });



  const handleRegister = async () => {
    const res = await dispatch(registerUser(form));
    console.log('Register response:', res); // 👈 add this
  
    if (registerUser.fulfilled.match(res)) {
        const message = (res.payload as any)?.message || 'Registration successful';
      
        Alert.alert('Success', message);
      
        setTimeout(() => {
          router.replace('/login');
        }, 500); // Delay ensures alert finishes rendering first
      } else {
      const errorMsg = (res.payload as any)?.message || 'Something went wrong';
      Alert.alert('Registration Failed', errorMsg);
    }
  };
  

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
  },
  link: {
    marginTop: 8,
    textAlign: 'center',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
