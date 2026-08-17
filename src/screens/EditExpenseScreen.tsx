import React, {useState} from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {
  updateExpenseApi,
} from '../api/expenseApi';

import {
  getToken,
} from '../storage/authStorage';

import {
  Expense,
  ExpenseCategory,
} from '../types/expense';

import CategorySelector from '../components/CategorySelector';


const EditExpenseScreen = ({
  navigation,
  route,
}: any) => {

  const expense: Expense =
    route.params?.expense;


  const [amount, setAmount] =
    useState(
      String(expense?.amount ?? ''),
    );


  const [description, setDescription] =
    useState(
      expense?.description ?? '',
    );


  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<
    ExpenseCategory | ''
  >(
    expense?.category ?? '',
  );


  const [
    loading,
    setLoading,
  ] = useState(false);


  // ========================================
  // UPDATE EXPENSE
  // ========================================

  const handleUpdateExpense =
    async () => {

      // ------------------------------------
      // Validate expense
      // ------------------------------------

      if (!expense?.id) {

        Alert.alert(
          'Error',
          'Expense information is missing.',
        );

        return;
      }


      // ------------------------------------
      // Validate amount
      // ------------------------------------

      if (!amount.trim()) {

        Alert.alert(
          'Invalid amount',
          'Please enter an amount.',
        );

        return;
      }


      const numericAmount =
        Number(amount.trim());


      if (
        !Number.isFinite(
          numericAmount,
        )
      ) {

        Alert.alert(
          'Invalid amount',
          'Please enter a valid number.',
        );

        return;
      }


      if (numericAmount <= 0) {

        Alert.alert(
          'Invalid amount',
          'Amount must be greater than 0.',
        );

        return;
      }


      // ------------------------------------
      // Validate description
      // ------------------------------------

      if (!description.trim()) {

        Alert.alert(
          'Invalid description',
          'Please enter a description.',
        );

        return;
      }


      // ------------------------------------
      // Validate category
      // ------------------------------------

      if (!selectedCategory) {

        Alert.alert(
          'Category required',
          'Please select a category.',
        );

        return;
      }


      try {

        setLoading(true);


        // ----------------------------------
        // Get authentication token
        // ----------------------------------

        const token =
          await getToken();


        if (!token) {

          Alert.alert(
            'Session expired',
            'Please login again.',
          );

          return;
        }


        // ----------------------------------
        // Update expense in Neon
        // through backend API
        // ----------------------------------

        await updateExpenseApi(
          token,
          expense.id,
          {
            amount: numericAmount,

            description:
              description.trim(),

            category:
              selectedCategory,

            date:
              expense.date,
          },
        );


        // ----------------------------------
        // Return to Expense History
        // ----------------------------------

        navigation.goBack();

      } catch (error) {

        console.log(
          'Error updating expense:',
          error,
        );

        Alert.alert(
          'Error',
          'Unable to update expense.',
        );

      } finally {

        setLoading(false);

      }
    };


  // ========================================
  // UI
  // ========================================

  return (
    <SafeAreaView
      style={styles.container}>

      <ScrollView
        contentContainerStyle={
          styles.content
        }>

        <Text style={styles.title}>
          Edit Expense
        </Text>


        {/* Category */}

        <Text style={styles.label}>
          Category
        </Text>

        <CategorySelector
          selectedCategory={
            selectedCategory
          }
          onSelectCategory={
            setSelectedCategory
          }
        />


        {/* Amount */}

        <Text style={styles.label}>
          Amount
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />


        {/* Description */}

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Lunch"
          value={description}
          onChangeText={
            setDescription
          }
        />


        {/* Update */}

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.disabledButton,
          ]}
          onPress={
            handleUpdateExpense
          }
          disabled={loading}>

          <Text
            style={styles.buttonText}>

            {loading
              ? 'Updating...'
              : 'Update Expense'}

          </Text>

        </TouchableOpacity>

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
  },


  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },


  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },


  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },


  button: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },


  disabledButton: {
    opacity: 0.6,
  },


  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

});


export default EditExpenseScreen;