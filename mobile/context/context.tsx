import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { useMutation } from '@/hooks/useMutation';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

type loginResponse = {
  success?: boolean;
  message?: string;
}

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [ sendRequest ] = useMutation<loginResponse>("/users/login");

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          const { data } = await sendRequest({email: email, password: password});
          if (data?.success === true){
            setSession(email);
            router.replace("/");
          } else {
            Alert.alert("Incorrect login details");
          }
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
