import {createSlice} from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        activeUserId: null,
        isAdminView: true,
    },
    reducers: {
        setActiveUser(state, action){
            state.activeUserId = action.payload;
        },
        setAdminView(state, action){
            state.isAdminView = action.payload;
        }
    }
});

export const {setActiveUser, setAdminView} = sessionSlice.actions;
export default sessionSlice.reducer;