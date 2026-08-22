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
  registerUser,
} from '../api/authApi';

import {
  saveAuthData,
} from '../storage/authStorage';


const RegisterScreen = ({
  navigation,
  onRegisterSuccess,
}: any) => {

  const [
    name,
    setName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);


  // ========================================
  // REGISTER
  // ========================================

  const handleRegister =
    async () => {

      if (
        !name.trim() ||
        !email.trim() ||
        !password ||
        !confirmPassword
      ) {

        Alert.alert(
          'Missing information',
          'Please fill in all fields.',
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        Alert.alert(
          'Password mismatch',
          'Passwords do not match.',
        );

        return;
      }


      if (
        password.length < 6
      ) {

        Alert.alert(
          'Invalid password',
          'Password must be at least 6 characters.',
        );

        return;
      }


      try {

        setLoading(true);


        const response =
          await registerUser(
            name.trim(),
            email.trim(),
            password,
          );


        // Save token + user

        await saveAuthData(
          response.token,
          response.user,
        );


        // Tell AppNavigator registration succeeded

        onRegisterSuccess();

      } catch (error: any) {

        Alert.alert(
          'Registration failed',
          error.message ||
            'Unable to create account.',
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
          Create Account
        </Text>


        <Text style={styles.subtitle}>
          Start managing your expenses
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={name}
          onChangeText={setName}
        />


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


        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={
            setConfirmPassword
          }
        />


        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >

          <Text style={styles.buttonText}>

            {loading
              ? 'Creating account...'
              : 'Create Account'}

          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.loginText}>

            Already have an account?
            {' '}
            Login

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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 30,
    fontSize: 16,
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

  loginButton: {
    marginTop: 25,
    alignItems: 'center',
  },

  loginText: {
    color: '#2563eb',
    fontSize: 15,
  },

});


export default RegisterScreen;