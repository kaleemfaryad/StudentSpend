import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


interface SummaryCardProps {
  title: string;
  value: string;
}


const SummaryCard = ({
  title,
  value,
}: SummaryCardProps) => {

  return (
    <View style={styles.card}>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>

    </View>
  );
};


const styles = StyleSheet.create({

  card: {
    flex: 1,
    padding: 18,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
  },

  title: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 10,
  },

  value: {
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 27,
  },

});


export default SummaryCard;