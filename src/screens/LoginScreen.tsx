import React, {
  useState,
} from 'react';

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  loginUser,
} from '../api/authApi';

import {
  saveAuthData,
} from '../storage/authStorage';


const LoginScreen = ({
  navigation,
  onLoginSuccess,
}: any) => {

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);


  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = async () => {

    if (
      !email.trim() ||
      !password
    ) {

      Alert.alert(
        'Missing information',
        'Please enter your email and password.',
      );

      return;
    }


    try {

      setLoading(true);


      const response =
        await loginUser(
          email.trim(),
          password,
        );


      // Save token + user

      await saveAuthData(
        response.token,
        response.user,
      );


      // Tell AppNavigator login succeeded

      onLoginSuccess();

    } catch (error: any) {

      Alert.alert(
        'Login failed',
        error.message ||
          'Unable to login.',
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <SafeAreaView
      style={styles.container}
    >

      <View style={styles.content}>

        <Text style={styles.title}>
          StudentSpend
        </Text>


        <Text style={styles.subtitle}>
          Welcome back
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />


        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />


        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >

          <Text style={styles.buttonText}>

            {loading
              ? 'Logging in...'
              : 'Login'}

          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.registerButton}
          onPress={() =>
            navigation.navigate(
              'Register',
            )
          }
        >

          <Text
            style={styles.registerText}
          >

            Don't have an account?
            {' '}
            Register

          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 35,
    fontSize: 17,
    color: '#64748b',
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#111827',
  },

  button: {
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  registerButton: {
    marginTop: 25,
    alignItems: 'center',
  },

  registerText: {
    color: '#2563eb',
    fontSize: 15,
  },

});


export default LoginScreen;