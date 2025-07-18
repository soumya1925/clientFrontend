




import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Picker } from '@react-native-picker/picker';

import {
  fetchExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  setMonthlyBudget,
} from '../../redux/expenseSlice';

const screenWidth = Dimensions.get('window').width;

const categories: Record<string, string> = {
  Food: '#f54242',
  Travel: '#4287f5',
  Entertainment: '#f5a742',
  Gadgets: '#42f554',
  Rent: '#a142f5',
  Other: '#888888',
};

export default function ExpensesScreen() {
  const dispatch = useAppDispatch();
  const { items: expenses, loading, monthlyBudget } = useAppSelector((state) => state.expenses);
  const user = useAppSelector((state) => state.auth.user);

  const [modalVisible, setModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }
  
    if (!form.title.trim() || !form.amount) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    const amount = parseFloat(form.amount);
    if (isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
  
    const expenseData = {
      userId: user._id,
      title: form.title.trim(),
      amount: amount,
      category: form.category,
      date: new Date().toISOString(),
    };
  
    try {
      if (editingExpense) {
        await dispatch(updateExpense({ ...editingExpense, ...expenseData })).unwrap();
        Alert.alert('Success', 'Expense updated successfully');
      } else {
        await dispatch(addExpense(expenseData)).unwrap();
        Alert.alert('Success', 'Expense added successfully');
      }
      
      setForm({ title: '', amount: '', category: 'Food' });
      setEditingExpense(null);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense');
    }
  };
  

  const handleEdit = (item: any) => {
    setEditingExpense(item);
    setForm({
      title: item.title,
      amount: item.amount.toString(),
      category: item.category,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    console.log('Starting delete process for ID:', id);
    
    try {
      const resultAction = await dispatch(deleteExpense({ id }));
      console.log('Dispatch result:', resultAction);
      
      if (deleteExpense.fulfilled.match(resultAction)) {
        console.log('Delete successful in reducer');
        Alert.alert('Success', 'Expense deleted successfully');
      } else {
        console.log('Delete rejected:', resultAction.payload);
       
      }
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete expense');
    }
  };
  
  

  const groupedData: { [key: string]: number } = {};
  let total = 0;

  expenses.forEach((e) => {
    total += e.amount;
    groupedData[e.category] = (groupedData[e.category] || 0) + e.amount;
  });

  const chartData = Object.keys(groupedData)
    .filter((key) => groupedData[key] && !isNaN(groupedData[key]))
    .map((key) => ({
      name: key,
      population: parseFloat(groupedData[key].toFixed(2)),
      color: categories[key] || '#cccccc',
      legendFontColor: '#333',
      legendFontSize: 14,
    }));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Expenses</Text>

      {!monthlyBudget ? (
        <>
          <Text style={styles.header}>Set Monthly Budget</Text>
          <TextInput
            placeholder="Enter your monthly budget"
            value={budgetInput}
            onChangeText={setBudgetInput}
            keyboardType="numeric"
            style={styles.input}
          />
          <Pressable
            style={styles.button}
            onPress={() => {
              const numericBudget = parseFloat(budgetInput);
              if (isNaN(numericBudget) || numericBudget <= 0) {
                Alert.alert('Invalid input', 'Please enter a valid number');
                return;
              }
              dispatch(setMonthlyBudget(numericBudget));
              setBudgetInput('');
            }}
          >
            <Text style={styles.buttonText}>Save Budget</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.budget}>Monthly Budget: ₹{monthlyBudget}</Text>
          <Text
            style={[
              styles.balance,
              total > monthlyBudget ? styles.exceeded : undefined,
            ]}
          >
            Balance: ₹{(monthlyBudget - total).toFixed(2)}
          </Text>
          {total > monthlyBudget && (
            <Text style={styles.warning}>
              ⚠️ Your current expenditure has exceeded your budget!
            </Text>
          )}
        </>
      )}

      {/* Pie Chart */}
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="20"
          absolute
        />
      ) : (
        <Text style={{ marginBottom: 10 }}>No expense data to display chart.</Text>
      )}

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableCol}>Title</Text>
        <Text style={styles.tableCol}>Amount</Text>
        <Text style={styles.tableCol}>Category</Text>
        <Text style={styles.tableCol}>Date</Text>
        <Text style={styles.tableCol}>Actions</Text>
      </View>

      {/* Expense Rows */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{item.title}</Text>
            <Text style={styles.tableCol}>₹{item.amount}</Text>
            <Text style={styles.tableCol}>{item.category}</Text>
            <Text style={styles.tableCol}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            <View style={[styles.tableCol, styles.actions]}>
              <Pressable onPress={() => handleEdit(item)}>
                <Text style={styles.link}>Edit</Text>
              </Pressable>
              <Pressable
  onPress={() => {
    console.log('Pressed delete for', item._id); // ADD THIS
    handleDelete(item._id);
  }}
>
  <Text style={[styles.link, { color: 'red' }]}>Delete</Text>
</Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No expenses yet.</Text>}
      />

      {/* Add Expense Button */}
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Expense</Text>
      </Pressable>

      {/* Modal for Add/Edit */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{editingExpense ? 'Edit' : 'Add'} Expense</Text>

          <TextInput
            placeholder="Title"
            value={form.title}
            onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Amount"
            value={form.amount}
            onChangeText={(text) => setForm((prev) => ({ ...prev, amount: text }))}
            keyboardType="numeric"
            style={styles.input}
          />
          <Picker
            selectedValue={form.category}
            style={styles.picker}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, category: value }))
            }
          >
            {Object.keys(categories).map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {editingExpense ? 'Update' : 'Add'} Expense
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: '#dc3545', marginTop: 8 }]}
            onPress={() => {
              setModalVisible(false);
              setEditingExpense(null);
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  total: { fontSize: 16, marginBottom: 10 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 6,
    borderRadius: 6,
    paddingHorizontal: 4,
    marginTop: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableCol: {
    flex: 1,
    fontSize: 13,
  },
  actions: { flexDirection: 'row', gap: 20, marginTop: 6 },
  link: { color: '#007bff' },
  addButton: {
    backgroundColor: '#007bff',
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  modal: { padding: 20, marginTop: 80 },
  modalTitle: { fontSize: 20, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  picker: {
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  budget: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  balance: { fontSize: 16, marginBottom: 10, color: 'green' },
  exceeded: { color: 'red' },
  warning: { color: 'red', marginBottom: 10 },
});
