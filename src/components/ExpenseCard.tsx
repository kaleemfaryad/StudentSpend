import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Expense} from '../types/expense';

interface ExpenseCardProps {
  expense: Expense;
}

const ExpenseCard = ({
  expense,
}: ExpenseCardProps) => {

  const amount = Number(expense.amount) || 0;

  return (
    <View style={styles.card}>

      <View style={styles.leftSection}>

        <Text style={styles.description}>
          {expense.description || 'No description'}
        </Text>

        <Text style={styles.category}>
          {expense.category || 'Other'}
        </Text>

        <Text style={styles.date}>
          {expense.date
            ? new Date(
                expense.date,
              ).toLocaleDateString()
            : 'No date'}
        </Text>

      </View>

      <View style={styles.rightSection}>

        <Text style={styles.amount}>
          Rs. {amount.toLocaleString()}
        </Text>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: 16,

    marginBottom: 12,

    borderRadius: 12,

    backgroundColor: '#f1f5f9',
  },

  leftSection: {
    flex: 1,
    marginRight: 10,
  },

  description: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  category: {
    marginTop: 5,

    fontSize: 14,

    color: '#2563eb',

    fontWeight: 'bold',
  },

  date: {
    marginTop: 4,

    fontSize: 13,

    color: '#64748b',
  },

  rightSection: {
    alignItems: 'flex-end',
  },

  amount: {
    fontSize: 18,

    fontWeight: 'bold',
  },
});

export default ExpenseCard;