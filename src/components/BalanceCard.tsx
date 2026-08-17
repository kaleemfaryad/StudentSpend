import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const BalanceCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Current Balance
      </Text>

      <Text style={styles.balance}>
        Rs. 25,000
      </Text>

      <Text style={styles.info}>
        Available this month
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 15,
    backgroundColor: '#2563eb',
  },

  label: {
    color: 'white',
    fontSize: 16,
  },

  balance: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  info: {
    color: 'white',
    opacity: 0.8,
  },
});

export default BalanceCard;