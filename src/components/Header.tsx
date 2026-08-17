import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudentSpend</Text>

      <Text style={styles.subtitle}>
        Manage your student expenses
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 16,
    marginTop: 5,
    color: 'gray',
  },
});

export default Header;