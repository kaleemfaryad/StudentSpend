import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {ExpenseCategory} from '../types/expense';

interface Props {
  selectedCategory: ExpenseCategory | '';
  onSelectCategory: (
    category: ExpenseCategory,
  ) => void;
}

const categories: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Education',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

const CategorySelector = ({
  selectedCategory,
  onSelectCategory,
}: Props) => {
  return (
    <View style={styles.container}>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.category,
            selectedCategory === category &&
              styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(category)}>
          <Text
            style={[
              styles.text,
              selectedCategory === category &&
                styles.selectedText,
            ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  category: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },

  selectedCategory: {
    backgroundColor: '#2563eb',
  },

  text: {
    fontSize: 14,
    color: '#111827',
  },

  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CategorySelector;