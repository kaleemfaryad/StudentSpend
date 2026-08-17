import React, {
  useEffect,
  useState,
} from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ExpenseHistoryScreen from '../screens/ExpenseHistoryScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';
import BudgetScreen from '../screens/BudgetScreen';

import {
  clearAuthData,
  getToken,
} from '../storage/authStorage';


const Stack =
  createNativeStackNavigator();


const AppNavigator = () => {

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    authenticated,
    setAuthenticated,
  ] = useState(false);


  // ========================================
  // CHECK EXISTING LOGIN
  // ========================================

  useEffect(() => {

    const checkAuth =
      async () => {

        try {

          const token =
            await getToken();

          setAuthenticated(
            !!token,
          );

        } catch (error) {

          console.log(
            'Auth check error:',
            error,
          );

          setAuthenticated(false);

        } finally {

          setLoading(false);

        }
      };

    checkAuth();

  }, []);


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {

    try {

      // Remove token and stored user
      await clearAuthData();

      // Tell navigator that user is no
      // longer authenticated
      setAuthenticated(false);

    } catch (error) {

      console.log(
        'Logout error:',
        error,
      );

    }
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return null;
  }


  // ========================================
  // NAVIGATION
  // ========================================

  return (
    <NavigationContainer>

      <Stack.Navigator>

        {!authenticated ? (

          // ==================================
          // AUTH SCREENS
          // ==================================

          <>

            <Stack.Screen
              name="Login"
              options={{
                headerShown: false,
              }}
            >
              {props => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={() =>
                    setAuthenticated(true)
                  }
                />
              )}
            </Stack.Screen>


            <Stack.Screen
              name="Register"
              options={{
                title:
                  'Create Account',
              }}
            >
              {props => (
                <RegisterScreen
                  {...props}
                  onRegisterSuccess={() =>
                    setAuthenticated(true)
                  }
                />
              )}
            </Stack.Screen>

          </>

        ) : (

          // ==================================
          // APPLICATION SCREENS
          // ==================================

          <>

            <Stack.Screen
              name="Home"
              options={{
                title:
                  'StudentSpend',
              }}
            >
              {props => (
                <HomeScreen
                  {...props}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>


            <Stack.Screen
              name="AddExpense"
              component={
                AddExpenseScreen
              }
              options={{
                title:
                  'Add Expense',
              }}
            />


            <Stack.Screen
              name="ExpenseHistory"
              component={
                ExpenseHistoryScreen
              }
              options={{
                title:
                  'Expense History',
              }}
            />


            <Stack.Screen
              name="EditExpense"
              component={
                EditExpenseScreen
              }
              options={{
                title:
                  'Edit Expense',
              }}
            />


            <Stack.Screen
              name="Budget"
              component={
                BudgetScreen
              }
              options={{
                title:
                  'Monthly Budget',
              }}
            />

          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>
  );
};


export default AppNavigator;