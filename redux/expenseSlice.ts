
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../services/api';

export interface Expense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseState {
  items: Expense[];
  loading: boolean;
  error: string | null;
  monthlyBudget?: number;
}

const initialState: ExpenseState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch expenses
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// Add expense
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (data: Omit<Expense, '_id'>, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post('/expenses', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Add failed');
    }
  }
);

// Update expense
export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async (data: Expense, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(`/expenses/${data._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// Delete expense
// Change this line:
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async ({ id }: { id: string }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Making DELETE request to:', `/expenses/${id}`);
      const response = await axios.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Delete response:', response);
      return id;
    } catch (err: any) {
      console.error('Delete API error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to delete'
      );
    }
  }
);




const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setMonthlyBudget: (state, action) => {
      state.monthlyBudget = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        console.log('Reducer deleting ID:', action.payload); // Add this line
        state.items = state.items.filter(item => item._id !== action.payload);
      })
  },
});

export default expenseSlice.reducer;
export const { setMonthlyBudget } = expenseSlice.actions;
