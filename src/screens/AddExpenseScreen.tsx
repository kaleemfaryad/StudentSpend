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
  createExpenseApi,
} from '../api/expenseApi';

import {
  getToken,
} from '../storage/authStorage';

const AddExpenseScreen = ({
  navigation,
  route,
}: any) => {

  const [amount, setAmount] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  // ========================================
  // GET SELECTED CATEGORY
  // ========================================

  const selectedCategory =
    route.params?.category;


  // ========================================
  // SAVE EXPENSE
  // ========================================

  const handleSaveExpense =
    async () => {

      // ------------------------------------
      // 1. Validate amount
      // ------------------------------------

      if (!amount.trim()) {

        Alert.alert(
          'Invalid amount',
          'Please enter an amount.',
        );

        return;
      }


      // ------------------------------------
      // 2. Validate description
      // ------------------------------------

      if (!description.trim()) {

        Alert.alert(
          'Invalid description',
          'Please enter a description.',
        );

        return;
      }


      // ------------------------------------
      // 3. Validate category
      // ------------------------------------

      if (!selectedCategory) {

        Alert.alert(
          'Category required',
          'Please select a category first.',
        );

        return;
      }


      // ------------------------------------
      // 4. Convert amount
      // ------------------------------------

      const numericAmount =
        Number(amount.trim());


      // ------------------------------------
      // 5. Check valid number
      // ------------------------------------

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


      // ------------------------------------
      // 6. Amount must be greater than 0
      // ------------------------------------

      if (
        numericAmount <= 0
      ) {

        Alert.alert(
          'Invalid amount',
          'Amount must be greater than 0.',
        );

        return;
      }


      // ------------------------------------
      // 7. Get authentication token
      // ------------------------------------

      try {

        setLoading(true);

        const token =
          await getToken();


        if (!token) {

          Alert.alert(
            'Authentication required',
            'Please login again.',
          );

          return;
        }


        // ----------------------------------
        // 8. Create expense in backend
        // ----------------------------------

        await createExpenseApi(
          token,
          {
            amount:
              numericAmount,

            description:
              description.trim(),

            category:
              selectedCategory,

            date:
              new Date().toISOString(),
          },
        );


        // ----------------------------------
        // 9. Success
        // ----------------------------------

        Alert.alert(
          'Expense Added',
          'Your expense has been saved successfully.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.goBack(),
            },
          ],
        );

      } catch (error: any) {

        console.log(
          'Error creating expense:',
          error,
        );

        Alert.alert(
          'Error',
          error?.message ||
            'Unable to save expense. Please try again.',
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

        {/* Title */}

        <Text
          style={styles.title}>

          Add Expense

        </Text>


        {/* Selected Category */}

        <Text
          style={styles.categoryLabel}>

          Category

        </Text>


        <Text
          style={styles.category}>

          {selectedCategory}

        </Text>


        {/* Amount */}

        <Text
          style={styles.label}>

          Amount

        </Text>


        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          editable={!loading}
        />


        {/* Description */}

        <Text
          style={styles.label}>

          Description

        </Text>


        <TextInput
          style={styles.input}
          placeholder="e.g. Lunch"
          value={description}
          onChangeText={
            setDescription
          }
          editable={!loading}
        />


        {/* Save Button */}

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.disabledButton,
          ]}
          onPress={
            handleSaveExpense
          }
          disabled={loading}>

          <Text
            style={styles.buttonText}>

            {loading
              ? 'Saving...'
              : 'Save Expense'}

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

  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  category: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
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
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    marginTop: 10,
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

export default AddExpenseScreen;