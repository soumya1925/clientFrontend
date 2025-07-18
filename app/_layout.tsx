import { Slot, useRouter, useSegments } from 'expo-router';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from '../redux/store';
import { useEffect } from 'react';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
  
    // Wrap in a small timeout to prevent navigating before layout mounts
    const timeout = setTimeout(() => {
      if (!user && !inAuthGroup) {
        router.replace('/login');
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }, 100); 
  
    return () => clearTimeout(timeout);
  }, [user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </Provider>
  );
}
