import React, {
  useCallback,
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
  useFocusEffect,
} from '@react-navigation/native';

import {
  getBudgetApi,
  saveBudgetApi,
} from '../api/budgetApi';

import {
  getExpensesApi,
} from '../api/expenseApi';

import {
  getToken,
} from '../storage/authStorage';

import {
  formatCurrency,
} from '../utils/expenseUtils';


const BudgetScreen = () => {

  const [
    budget,
    setBudget,
  ] = useState('');


  const [
    spent,
    setSpent,
  ] = useState(0);


  const [
    loading,
    setLoading,
  ] = useState(false);


  // ========================================
  // LOAD BUDGET + EXPENSES
  // ========================================

  const loadData = async () => {

    try {

      setLoading(true);


      // ------------------------------------
      // Get token
      // ------------------------------------

      const token =
        await getToken();


      if (!token) {

        Alert.alert(
          'Session expired',
          'Please login again.',
        );

        return;
      }


      // ------------------------------------
      // Get budget from backend
      // ------------------------------------

      const savedBudget =
        await getBudgetApi(
          token,
        );


      // ------------------------------------
      // Get expenses from backend
      // ------------------------------------

      const expenses =
        await getExpensesApi(
          token,
        );


      // ------------------------------------
      // Calculate current month expenses
      // ------------------------------------

      const now =
        new Date();


      const currentMonth =
        now.getMonth();


      const currentYear =
        now.getFullYear();


      const monthlyExpenses =
        expenses.filter(expense => {

          const expenseDate =
            new Date(
              expense.date,
            );


          return (
            expenseDate.getMonth() ===
              currentMonth &&
            expenseDate.getFullYear() ===
              currentYear
          );

        });


      const totalSpent =
        monthlyExpenses.reduce(
          (
            total,
            expense,
          ) =>
            total +
            Number(
              expense.amount,
            ),
          0,
        );


      // ------------------------------------
      // Update UI
      // ------------------------------------

      setBudget(
        savedBudget
          ? String(
              savedBudget.amount,
            )
          : '',
      );


      setSpent(
        totalSpent,
      );

    } catch (error) {

      console.log(
        'Budget data loading error:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to load budget data.',
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // RELOAD WHEN SCREEN OPENS
  // ========================================

  useFocusEffect(
    useCallback(() => {

      loadData();

    }, []),
  );


  // ========================================
  // SAVE BUDGET
  // ========================================

  const handleSave = async () => {

    const amount =
      Number(
        budget.trim(),
      );


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      Alert.alert(
        'Invalid budget',
        'Please enter a valid budget.',
      );

      return;
    }


    try {

      setLoading(true);


      // ------------------------------------
      // Get token
      // ------------------------------------

      const token =
        await getToken();


      if (!token) {

        Alert.alert(
          'Session expired',
          'Please login again.',
        );

        return;
      }


      // ------------------------------------
      // Save budget to Neon
      // ------------------------------------

      await saveBudgetApi(
        token,
        amount,
      );


      // ------------------------------------
      // Reload data
      // ------------------------------------

      await loadData();


      Alert.alert(
        'Success',
        'Monthly budget saved.',
      );

    } catch (error) {

      console.log(
        'Budget save error:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to save budget.',
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // CALCULATIONS
  // ========================================

  const budgetAmount =
    Number(budget) || 0;


  const remaining =
    budgetAmount - spent;


  // ========================================
  // UI
  // ========================================

  return (
    <SafeAreaView
      style={styles.container}>

      <View
        style={styles.content}>

        <Text style={styles.title}>
          Monthly Budget
        </Text>


        <Text style={styles.label}>
          Set your monthly budget
        </Text>


        <TextInput
          style={styles.input}
          placeholder="e.g. 30000"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />


        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={loading}>

          <Text style={styles.buttonText}>

            {loading
              ? 'Saving...'
              : 'Save Budget'}

          </Text>

        </TouchableOpacity>


        <View style={styles.summary}>

          <Text
            style={styles.summaryTitle}>
            This Month
          </Text>


          <Text style={styles.item}>
            Budget:{' '}
            {formatCurrency(
              budgetAmount,
            )}
          </Text>


          <Text style={styles.item}>
            Spent:{' '}
            {formatCurrency(
              spent,
            )}
          </Text>


          <Text
            style={[
              styles.remaining,
              remaining < 0 &&
                styles.overBudget,
            ]}>

            Remaining:{' '}
            {formatCurrency(
              remaining,
            )}

          </Text>

        </View>

      </View>

    </SafeAreaView>
  );
};


// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },


  content: {
    padding: 20,
  },


  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },


  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },


  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },


  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },


  disabledButton: {
    opacity: 0.6,
  },


  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


  summary: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
  },


  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },


  item: {
    marginBottom: 10,
    fontSize: 16,
  },


  remaining: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },


  overBudget: {
    color: '#dc2626',
  },

});


export default BudgetScreen;