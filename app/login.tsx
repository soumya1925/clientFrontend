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
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../redux/hooks';
import { loginUser } from '../redux/authSlice';

const gradients = [
  ['#FF6B6B', '#FFD93D'],
  ['#6BCB77', '#4D96FF'],
  ['#A66CFF', '#F2A7C1'],
  ['#43E97B', '#38F9D7'],
];

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = async () => {
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      router.replace('/(tabs)');
    } else {
      console.error('Login failed:', res.payload);
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <Pressable onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
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
