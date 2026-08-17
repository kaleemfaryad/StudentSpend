import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import ExpenseCard from '../components/ExpenseCard';

import EmptyState from '../components/EmptyState';

import {
  getExpensesApi,
  deleteExpenseApi,
} from '../api/expenseApi';

import {
  getToken,
} from '../storage/authStorage';

import {
  Expense,
} from '../types/expense';


// ========================================
// SCREEN
// ========================================

const ExpenseHistoryScreen = ({
  navigation,
}: any) => {

  const [
    expenses,
    setExpenses,
  ] = useState<Expense[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);


  // ========================================
  // LOAD EXPENSES FROM BACKEND
  // ========================================

  const loadExpenses = async () => {

    try {

      setLoading(true);


      // Get authentication token

      const token =
        await getToken();


      if (!token) {

        Alert.alert(
          'Session expired',
          'Please login again.',
        );

        return;
      }


      // Get expenses from Neon
      // through the backend API

      const data =
        await getExpensesApi(
          token,
        );


      // Convert API expenses to
      // frontend Expense type

      const formattedExpenses:
        Expense[] =
        data.map(expense => ({
          id: expense.id,

          amount: expense.amount,

          description:
            expense.description,

          category:
            expense.category as Expense['category'],

          date:
            expense.date,
        }));


      setExpenses(
        formattedExpenses,
      );

    } catch (error) {

      console.log(
        'Error loading expenses:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to load expenses.',
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

      loadExpenses();

    }, []),
  );


  // ========================================
  // DELETE EXPENSE
  // ========================================

  const handleDelete = (
    expenseId: string,
  ) => {

    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {

            try {

              const token =
                await getToken();


              if (!token) {

                Alert.alert(
                  'Session expired',
                  'Please login again.',
                );

                return;
              }


              // Delete from Neon
              // through backend API

              await deleteExpenseApi(
                token,
                expenseId,
              );


              // Reload the list

              await loadExpenses();

            } catch (error) {

              console.log(
                'Error deleting expense:',
                error,
              );

              Alert.alert(
                'Error',
                'Unable to delete expense.',
              );

            }

          },
        },
      ],
    );
  };


  // ========================================
  // RENDER
  // ========================================

  return (
    <SafeAreaView
      style={styles.container}>

      <ScrollView
        contentContainerStyle={
          styles.content
        }>

        {/* Title */}

        <Text style={styles.title}>
          Expense History
        </Text>


        {/* Number of expenses */}

        <Text style={styles.countText}>

          {expenses.length}{' '}

          {expenses.length === 1
            ? 'expense'
            : 'expenses'}

        </Text>


        {/* Loading */}

        {loading ? (

          <Text style={styles.loadingText}>
            Loading expenses...
          </Text>

        ) : expenses.length === 0 ? (

          /* Empty State */

          <EmptyState />

        ) : (

          /* Expense List */

          expenses.map(
            expense => (

              <View
                key={expense.id}
                style={
                  styles.expenseContainer
                }>

                {/* Expense */}

                <ExpenseCard
                  expense={expense}
                />


                {/* Action Buttons */}

                <View
                  style={
                    styles.actionRow
                  }>

                  {/* Edit */}

                  <TouchableOpacity
                    style={
                      styles.editButton
                    }
                    onPress={() =>
                      navigation.navigate(
                        'EditExpense',
                        {
                          expense,
                        },
                      )
                    }>

                    <Text
                      style={
                        styles.editButtonText
                      }>
                      Edit
                    </Text>

                  </TouchableOpacity>


                  {/* Delete */}

                  <TouchableOpacity
                    style={
                      styles.deleteButton
                    }
                    onPress={() =>
                      handleDelete(
                        expense.id,
                      )
                    }>

                    <Text
                      style={
                        styles.deleteButtonText
                      }>
                      Delete
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>

            )
          )

        )}

      </ScrollView>

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
    paddingBottom: 40,
  },


  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },


  countText: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 25,
  },


  loadingText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#64748b',
  },


  expenseContainer: {
    marginBottom: 5,
  },


  actionRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },


  editButton: {
    flex: 1,

    padding: 12,

    marginRight: 5,

    borderRadius: 8,

    backgroundColor: '#2563eb',

    alignItems: 'center',
  },


  editButtonText: {
    color: '#ffffff',

    fontSize: 15,

    fontWeight: 'bold',
  },


  deleteButton: {
    flex: 1,

    padding: 12,

    marginLeft: 5,

    borderRadius: 8,

    backgroundColor: '#dc2626',

    alignItems: 'center',
  },


  deleteButtonText: {
    color: '#ffffff',

    fontSize: 15,

    fontWeight: 'bold',
  },

});


export default ExpenseHistoryScreen;