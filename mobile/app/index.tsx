import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import LoginForm from '../components/LoginForm';
import { Text, View } from '../components/Themed';


export default function Login() {
  return (
    <View style={styles.container}>
      <LoginForm />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
