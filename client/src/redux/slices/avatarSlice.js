// store/avatarStore.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  maleAvatar: {
    shirtModelUrl: ''
  },
  femaleAvatar: {
    shirtModelUrl: ''
  }
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    updateMaleAvatar: (state, action) => {
      console.log('pa',state, action)
      state.maleAvatar = { ...state.maleAvatar, ...action.payload };
    },
    updateFemaleAvatar: (state, action) => {
      state.femaleAvatar = { ...state.femaleAvatar, ...action.payload };
    },
    resetMaleAvatar: (state) => {
      state.maleAvatar = initialState.maleAvatar;
    },
    resetFemaleAvatar: (state) => {
      state.femaleAvatar = initialState.femaleAvatar;
    }
  }
});

export const { updateMaleAvatar, updateFemaleAvatar, resetMaleAvatar, resetFemaleAvatar } = avatarSlice.actions;

export default avatarSlice.reducer