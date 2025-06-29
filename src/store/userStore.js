import { create } from 'zustand';
import apiClient from '@/common/utils/apiClient';

const useUserStore = create((set, get) => ({
  user: null,
  userPhoto: '',
  isLoading: false,
  isPhotoLoaded: false,

  // Fetch user data from auth endpoint
  fetchUserData: async (forceRefresh = false) => {
    const { user } = get();
    if (user && !forceRefresh) return user; // Already loaded unless force refresh

    set({ isLoading: true });
    try {
      const response = await apiClient.get('/api/v1/auth/me');
      console.log("user data response", response.data);
      set({ user: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ isLoading: false });
      return null;
    }
  },

  // Fetch user photo once and store it
  fetchUserPhoto: async () => {
    const { userPhoto, isPhotoLoaded } = get();
    if (isPhotoLoaded) return userPhoto; // Already loaded

    try {
      const photoExistsResponse = await apiClient.get('/api/users/photo/exists');
      if (photoExistsResponse.data.exists) {
        const photoResponse = await apiClient.get('/api/users/photo');
        set({ userPhoto: photoResponse.data.photoUrl, isPhotoLoaded: true });
        return photoResponse.data.photoUrl;
      } else {
        set({ isPhotoLoaded: true });
        return '';
      }
    } catch (error) {
      set({ isPhotoLoaded: true });
      return '';
    }
  },

  // Update user photo when uploaded
  updateUserPhoto: (photoUrl) => {
    set({ userPhoto: photoUrl, isPhotoLoaded: true });
  },

  // Clear user data on logout
  clearUser: () => {
    set({ user: null, userPhoto: '', isLoading: false, isPhotoLoaded: false });
  },

  // Initialize user data from cookies if available
  initializeFromCookies: (cookieUser) => {
    if (cookieUser && cookieUser.name) {
      set({ user: cookieUser });
    }
  },

  // Set user data directly (used for login)
  setUser: (userData) => {
    set({ user: userData });
  },

  // Update user data with fresh data from API (preserves existing data)
  updateUserData: (newUserData) => {
    const { user } = get();
    if (user && newUserData) {
      set({ 
        user: { 
          ...user, 
          ...newUserData 
        } 
      });
    }
  }
}));

export default useUserStore; 