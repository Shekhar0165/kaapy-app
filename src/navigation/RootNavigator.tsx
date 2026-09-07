import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../auth';
import { CustomTabBar } from '../components/CustomTabBar';
import { HomeScreen } from '../screens/HomeScreen';
import { BalanceScreen } from '../screens/BalanceScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { VerifyGmailScreen } from '../screens/VerifyGmailScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function renderCustomTabBar(props: BottomTabBarProps) {
  return <CustomTabBar {...props} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ animation: 'fade', headerShown: false }}
      tabBar={renderCustomTabBar}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Balance" component={BalanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#B85C38" size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'authenticated' ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: 'Forgot password' }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ title: 'Reset password' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Create account' }}
          />
          <Stack.Screen
            name="VerifyGmail"
            component={VerifyGmailScreen}
            options={{ title: 'Verify email' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    flex: 1,
    justifyContent: 'center',
  },
});
