import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAILS = [
    'muhammadashikurrahman2892@gmail.com'
  ];

  // Sync profile from backend MongoDB database
  const fetchProfile = async (token, userObj = null) => {
    try {
      if (token) {
        localStorage.setItem('acadex_token', token);
      }
      const res = await apiRequest('/auth/me');
      const user = res.user;
      const email = user?.email || userObj?.email || currentUser?.email || '';
      if (ADMIN_EMAILS.includes(email.toLowerCase()) && user) {
        user.role = 'admin';
      }
      setUserProfile(user);
    } catch (err) {
      console.warn('Could not fetch MongoDB user profile:', err.message);
      // Fallback demo profile
      const email = userObj?.email || currentUser?.email || 'student@acadex.edu';
      const isUserAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      setUserProfile({
        _id: userObj?.uid || currentUser?.uid || (isUserAdmin ? 'user-admin-ashikur' : 'demo-user-student'),
        firebaseUid: userObj?.uid || currentUser?.uid || (isUserAdmin ? 'user-admin-ashikur' : 'demo-user-student'),
        fullName: userObj?.displayName || currentUser?.displayName || (isUserAdmin ? 'Muhammad Ashikur Rahman (Admin)' : 'Siam Chowdhury'),
        email: email,
        studentId: isUserAdmin ? 'ADM-002' : '2023-1-60-089',
        department: 'CSE',
        batch: isUserAdmin ? 'Faculty' : '54th',
        semester: isUserAdmin ? 8 : 5,
        role: isUserAdmin ? 'admin' : 'student'
      });
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          try {
            const token = await user.getIdToken();
            await fetchProfile(token, user);
          } catch (e) {
            console.warn('Token error:', e);
          }
        } else {
          // Check if demo token exists in localStorage
          const localToken = localStorage.getItem('acadex_token');
          if (localToken && localToken.startsWith('demo-token-')) {
            const isDemoAdmin = localToken.includes('admin');
            const mockUser = {
              uid: isDemoAdmin ? 'demo-user-admin' : 'demo-user-student',
              email: isDemoAdmin ? 'admin@acadex.edu' : 'student@acadex.edu',
              displayName: isDemoAdmin ? 'Dr. Sarah Connor (Admin)' : 'Siam Chowdhury'
            };
            setCurrentUser(mockUser);
            setUserProfile({
              _id: mockUser.uid,
              firebaseUid: mockUser.uid,
              fullName: mockUser.displayName,
              email: mockUser.email,
              studentId: isDemoAdmin ? 'ADM-001' : '2023-1-60-089',
              department: 'CSE',
              batch: isDemoAdmin ? 'Faculty' : '54th',
              semester: isDemoAdmin ? 8 : 5,
              role: isDemoAdmin ? 'admin' : 'student'
            });
          } else {
            setCurrentUser(null);
            setUserProfile(null);
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      await fetchProfile(token);
      return result.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const token = await result.user.getIdToken();
      localStorage.setItem('acadex_token', token);

      // Create MongoDB User profile
      const profileRes = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firebaseUid: result.user.uid,
          fullName: data.fullName,
          email: data.email,
          studentId: data.studentId,
          department: data.department,
          batch: data.batch,
          semester: parseInt(data.semester) || 5
        })
      });

      setUserProfile(profileRes.user);
      setCurrentUser(result.user);
      setLoading(false);
      return result.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('acadex_token', token);

      // Try registering/fetching MongoDB user profile
      const isAdminEmail = ADMIN_EMAILS.includes(result.user.email?.toLowerCase());
      try {
        await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            firebaseUid: result.user.uid,
            fullName: result.user.displayName || (isAdminEmail ? 'Muhammad Ashikur Rahman (Admin)' : 'Acadex Student'),
            email: result.user.email,
            studentId: isAdminEmail ? 'ADM-002' : '',
            department: 'CSE',
            batch: isAdminEmail ? 'Faculty' : '54th',
            semester: isAdminEmail ? 8 : 5
          })
        });
      } catch (e) {
        // Profile already exists
      }

      await fetchProfile(token, result.user);
      setLoading(false);
      return result.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Demo accounts for fast UI testing
  const demoStudentLogin = async () => {
    setLoading(true);
    const token = 'demo-token-demo-user-student';
    localStorage.setItem('acadex_token', token);
    const mockUser = {
      uid: 'demo-user-student',
      email: 'student@acadex.edu',
      displayName: 'Siam Chowdhury'
    };
    setCurrentUser(mockUser);
    setUserProfile({
      _id: 'demo-user-student',
      firebaseUid: 'demo-user-student',
      fullName: 'Siam Chowdhury',
      email: 'student@acadex.edu',
      studentId: '2023-1-60-089',
      department: 'CSE',
      batch: '54th',
      semester: 5,
      role: 'student'
    });
    setLoading(false);
  };

  const demoAdminLogin = async () => {
    setLoading(true);
    const token = 'demo-token-user-admin-ashikur';
    localStorage.setItem('acadex_token', token);
    const mockUser = {
      uid: 'user-admin-ashikur',
      email: 'muhammadashikurrahman2892@gmail.com',
      displayName: 'Muhammad Ashikur Rahman (Admin)'
    };
    setCurrentUser(mockUser);
    setUserProfile({
      _id: 'user-admin-ashikur',
      firebaseUid: 'muhammadashikurrahman2892@gmail.com',
      fullName: 'Muhammad Ashikur Rahman (Admin)',
      email: 'muhammadashikurrahman2892@gmail.com',
      studentId: 'ADM-001',
      department: 'CSE',
      batch: 'Faculty',
      semester: 8,
      role: 'admin'
    });
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('acadex_token');
    if (auth) {
      try { await signOut(auth); } catch (e) {}
    }
    setCurrentUser(null);
    setUserProfile(null);
    setLoading(false);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    googleLogin,
    demoStudentLogin,
    demoAdminLogin,
    logout,
    resetPassword,
    isAdmin: userProfile?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
