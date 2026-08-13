import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userApi from '../../api/userApi';

export const loadUsers = createAsyncThunk('users/load', async()=>{
    return userApi.fetchUsers();
});

export const addUser = createAsyncThunk('users/add', async(userData)=>{
    return userApi.createUsers(userData);
});

export const changeTimezone = createAsyncThunk('users/changeTimezone', async({userId, timezone})=>{
    return userApi.updateTimezone(userId, timezone);
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) =>{
        builder
            .addCase(loadUsers.pending, (state)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loadUsers.fulfilled, (state, action)=>{
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(loadUsers.rejected, (state, action)=>{
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action)=>{
                state.items.push(action.payload);
            })
            .addCase(changeTimezone.fulfilled, (state, action)=>{
                const idx = state.items.findIndex((p)=> p._id === action.payload._id);
                if(idx!==-1) state.items[idx] = action.payload;
            });
    },
});

export default userSlice.reducer;