import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        No expenses yet
      </Text>

      <Text style={styles.text}>
        Add your first expense to start tracking
        your spending.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  text: {
    marginTop: 8,
    textAlign: 'center',
    color: '#64748b',
  },
});

export default EmptyState;