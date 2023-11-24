import {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  token: string;
  name?: string;
  email?: string;
  userId?: string;
  passcode?: string;
  isAuthenticated: boolean;
  authenticate: (
    token: string,
    name?: string,
    email?: string,
    userId?: string,
    passcode?: string,
  ) => void;
  logout: () => void;
  signout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: '',
  name: '',
  email: '',
  userId: '',
  passcode: '',
  isAuthenticated: false,
  authenticate: (
    token: string,
    name?: string,
    email?: string,
    userId?: string,
    passcode?: string,
  ) => {},
  logout: () => {},
  signout: () => {},
});

// Creating a context provider

const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [passcode, setPassCode] = useState<string | undefined>();

  const authenticate = (
    token: string,
    name?: string,
    email?: string,
    userId?: string,
    passcode?: string,
  ) => {
    setAuthToken(token);
    setName(name);
    setEmail(email);
    setUserId(userId);
    setPassCode(passcode);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('name', name!);
    AsyncStorage.setItem('email', email!);
    AsyncStorage.setItem('userId', userId!);
    AsyncStorage.setItem('passcode', passcode!);
  };

  const logout = () => {
    setAuthToken(undefined);
    AsyncStorage.clear();
  };

  const signout = () => {
    setAuthToken(undefined);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('name');
    AsyncStorage.removeItem('userId');
  };

  const value: AuthContextType = {
    token: authToken || '',
    name: name || '',
    email: email || '',
    userId: userId || '',
    passcode: passcode || '',
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
