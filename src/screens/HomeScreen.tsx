import React, {
  useCallback,
  useState,
} from 'react';

import {
  SafeAreaView,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import CategorySelector from '../components/CategorySelector';
import SummaryCard from '../components/SummaryCard';
import ExpenseCard from '../components/ExpenseCard';
import EmptyState from '../components/EmptyState';

import {
  calculateTotal,
  formatCurrency,
  getMonthlyExpenses,
} from '../utils/expenseUtils';

import {
  clearAuthData,
  getToken,
} from '../storage/authStorage';

import {
  Expense,
  ExpenseCategory,
} from '../types/expense';

import {
  getExpensesApi,
} from '../api/expenseApi';

import {
  getBudgetApi,
} from '../api/budgetApi';


// ========================================
// PROPS
// ========================================

interface HomeScreenProps {
  navigation: any;
  onLogout: () => Promise<void>;
}


// ========================================
// HOME SCREEN
// ========================================

const HomeScreen = ({
  navigation,
  onLogout,
}: HomeScreenProps) => {

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<
    ExpenseCategory | ''
  >('');


  const [
    expenses,
    setExpenses,
  ] = useState<Expense[]>([]);


  const [
    budget,
    setBudget,
  ] = useState<number | null>(null);


  // ========================================
  // LOAD HOME DATA FROM BACKEND
  // ========================================

  const loadData = async () => {

    try {

      // ------------------------------------
      // Get logged-in user's token
      // ------------------------------------

      const token =
        await getToken();

      if (!token) {

        console.log(
          'No authentication token found.',
        );

        setExpenses([]);
        setBudget(null);

        return;
      }


      // ====================================
      // LOAD EXPENSES
      // ====================================

      try {

        const apiExpenses =
          await getExpensesApi(token);

        /*
         * Convert API Expense type into
         * application's Expense type.
         *
         * The backend returns category as
         * string, while the frontend expects
         * ExpenseCategory.
         */

        const formattedExpenses:
          Expense[] =
          apiExpenses.map(
            expense => ({
              id: expense.id,

              amount: Number(
                expense.amount,
              ),

              description:
                expense.description,

              category:
                expense.category as ExpenseCategory,

              date:
                expense.date,
            }),
          );

        console.log(
          'HOME EXPENSES:',
          formattedExpenses,
        );

        setExpenses(
          formattedExpenses,
        );

      } catch (error) {

        console.log(
          'Home expenses loading error:',
          error,
        );

        setExpenses([]);

      }


      // ====================================
      // LOAD BUDGET
      // ====================================

      try {

        const budgetData =
          await getBudgetApi(token);

        console.log(
          'HOME BUDGET:',
          budgetData,
        );

        if (budgetData) {

          setBudget(
            Number(
              budgetData.amount,
            ),
          );

        } else {

          setBudget(null);

        }

      } catch (error) {

        console.log(
          'Home budget loading error:',
          error,
        );

        setBudget(null);

      }

    } catch (error) {

      console.log(
        'Home authentication/data error:',
        error,
      );

      setExpenses([]);
      setBudget(null);
    }
  };


  // ========================================
  // RELOAD WHEN HOME SCREEN FOCUSES
  // ========================================

  useFocusEffect(
    useCallback(() => {

      loadData();

    }, []),
  );


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Yes, Logout',
          style: 'destructive',

          onPress: async () => {

            try {

              // Clear token and user
              await clearAuthData();

              // Tell AppNavigator
              // to show Login screen
              await onLogout();

            } catch (error) {

              console.log(
                'Logout error:',
                error,
              );

              Alert.alert(
                'Logout Error',
                'Unable to logout. Please try again.',
              );
            }
          },
        },
      ],
    );
  };


  // ========================================
  // MONTHLY EXPENSES
  // ========================================

  const monthlyExpenses =
    getMonthlyExpenses(
      expenses,
    );


  // ========================================
  // TOTAL SPENT
  // ========================================

  const totalSpent =
    calculateTotal(
      monthlyExpenses,
    );


  // ========================================
  // RECENT EXPENSES
  // ========================================

  const recentExpenses =
    expenses.slice(0, 3);


  // ========================================
  // FILTER BY CATEGORY
  // ========================================

  const filteredRecentExpenses =
    recentExpenses.filter(
      expense =>
        selectedCategory
          ? expense.category ===
          selectedCategory
          : true,
    );


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


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <Text style={styles.title}>
          StudentSpend
        </Text>

        <Text style={styles.subtitle}>
          Track your student expenses
        </Text>


        {/* ================================= */}
        {/* SUMMARY */}
        {/* ================================= */}

        <View
          style={styles.summaryRow}>

          <SummaryCard
            title="This Month"
            value={
              `Budget: ${formatCurrency(
                budget ?? 0,
              )}\n` +
              `Spent: ${formatCurrency(
                totalSpent,
              )}`
            }
          />

          <SummaryCard
            title="Expenses"
            value={
              String(
                expenses.length,
              )
            }
          />

        </View>


        {/* ================================= */}
        {/* CATEGORY FILTER */}
        {/* ================================= */}

        <Text
          style={styles.sectionTitle}>
          Filter by Category
        </Text>

        <CategorySelector
          selectedCategory={
            selectedCategory
          }
          onSelectCategory={
            setSelectedCategory
          }
        />


        {selectedCategory && (

          <Text
            style={styles.selectedText}>

            Selected:{' '}
            {selectedCategory}

          </Text>

        )}


        {/* ================================= */}
        {/* ADD EXPENSE */}
        {/* ================================= */}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {

            if (!selectedCategory) {

              Alert.alert(
                'Category Required',
                'Please select a category first.',
              );

              return;
            }

            navigation.navigate(
              'AddExpense',
              {
                category:
                  selectedCategory,
              },
            );

          }}>

          <Text
            style={styles.addButtonText}>
            + Add Expense
          </Text>

        </TouchableOpacity>


        {/* ================================= */}
        {/* RECENT EXPENSES */}
        {/* ================================= */}

        <View
          style={styles.sectionHeader}>

          <Text
            style={styles.sectionTitle}>
            Recent Expenses
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'ExpenseHistory',
              )
            }>

            <Text
              style={styles.viewAll}>
              View All
            </Text>

          </TouchableOpacity>

        </View>


        {filteredRecentExpenses.length ===
          0 ? (

          <EmptyState />

        ) : (

          filteredRecentExpenses.map(
            expense => (

              <ExpenseCard
                key={expense.id}
                expense={expense}
              />

            ),
          )

        )}


        {/* ================================= */}
        {/* BUDGET */}
        {/* ================================= */}

        <TouchableOpacity
          style={styles.budgetButton}
          onPress={() =>
            navigation.navigate(
              'Budget',
            )
          }>

          <Text
            style={styles.budgetText}>
            Manage Monthly Budget
          </Text>

        </TouchableOpacity>


        {/* ================================= */}
        {/* LOGOUT */}
        {/* ================================= */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={
            handleLogout
          }>

          <Text
            style={styles.logoutText}>
            Logout
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
    paddingBottom: 40,
  },


  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },


  subtitle: {
    marginTop: 5,
    marginBottom: 25,
    fontSize: 16,
    color: '#64748b',
  },


  summaryRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },


  sectionHeader: {
    marginTop: 30,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  sectionTitle: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 19,
    fontWeight: 'bold',
  },


  selectedText: {
    marginTop: 10,
    color: '#2563eb',
    fontWeight: 'bold',
  },


  addButton: {
    marginTop: 25,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },


  addButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },


  viewAll: {
    color: '#2563eb',
    fontWeight: 'bold',
  },


  budgetButton: {
    marginTop: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
  },


  budgetText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },


  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#dc2626',
    alignItems: 'center',
  },


  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});


export default HomeScreen;