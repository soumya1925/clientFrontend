import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {user?.name || 'User'}!</Text>
      <Text style={styles.infoText}>
        Click on the expense to access features of Expense Tracker
      </Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
});
