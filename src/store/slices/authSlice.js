// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

axios.defaults.withCredentials = true;

// Token management utilities
class TokenManager {
    static getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    static setAccessToken(token) {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    static clearTokens() {
        localStorage.removeItem('accessToken');
    }

    static isTokenExpired(token) {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
}

// Refresh token queue management
let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Create axios instance for auth
const authAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Enhanced request interceptor
authAxios.interceptors.request.use((config) => {
    const token = TokenManager.getAccessToken();
    if (token && !TokenManager.isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Enhanced response interceptor with better refresh logic
// authAxios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             // If we're already refreshing, queue this request
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 }).then(token => {
//                     if (token) {
//                         originalRequest.headers.Authorization = `Bearer ${token}`;
//                         return authAxios(originalRequest);
//                     }
//                     return Promise.reject(error);
//                 });
//             }

//             isRefreshing = true;

//             try {
//                 // Use existing refresh promise if available
//                 if (!refreshPromise) {
//                     refreshPromise = authAxios.post('/refresh');
//                 }

//                 const response = await refreshPromise;
//                 const { accessToken } = response.data;

//                 if (accessToken) {
//                     TokenManager.setAccessToken(accessToken);
//                     processQueue(null, accessToken);

//                     originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//                     return authAxios(originalRequest);
//                 } else {
//                     throw new Error('No access token in refresh response');
//                 }
//             } catch (refreshError) {
//                 processQueue(refreshError, null);
//                 TokenManager.clearTokens();

//                 // Only redirect if not on auth pages
//                 const currentPath = window.location.pathname;
//                 const authPaths = ['/login', '/register', '/reset-password', '/verify-email'];
//                 if (!authPaths.some(path => currentPath.includes(path))) {
//                     window.location.href = '/login';
//                 }

//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//                 refreshPromise = null;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Don't handle refresh in interceptor to avoid conflicts
        return Promise.reject(error);
    }
);

// ====================
// ENHANCED ASYNC THUNKS
// ====================

export const initializeAuth = createAsyncThunk(
    'auth/initializeAuth',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            console.log('Starting auth initialization...');

            // Check if we have a stored access token
            const token = TokenManager.getAccessToken();
            console.log('Stored token exists:', !!token);

            // If no token, try to refresh first
            if (!token || TokenManager.isTokenExpired(token)) {
                console.log('No valid token, attempting refresh...');
                try {
                    const refreshResult = await dispatch(refreshToken()).unwrap();
                    console.log('Refresh successful:', !!refreshResult.user);
                    if (refreshResult.user) {
                        return refreshResult;
                    }
                } catch (refreshError) {
                    console.log('Refresh failed:', refreshError);
                    // Don't return rejection here, continue to check current user
                }
            }

            // If we have a token, try to get current user
            if (token && !TokenManager.isTokenExpired(token)) {
                console.log('Trying to get current user...');
                try {
                    const userResult = await dispatch(getCurrentUser()).unwrap();
                    console.log('Current user fetch successful');
                    return userResult;
                } catch (userError) {
                    console.log('Current user fetch failed:', userError);
                    // Try refresh as fallback
                    try {
                        const refreshResult = await dispatch(refreshToken()).unwrap();
                        return refreshResult;
                    } catch (finalError) {
                        console.log('Final refresh failed:', finalError);
                        TokenManager.clearTokens();
                        return rejectWithValue('Session validation failed');
                    }
                }
            }

            // No valid session found
            console.log('No valid session found, user not authenticated');
            TokenManager.clearTokens();
            return rejectWithValue('No valid session');

        } catch (error) {
            console.error('Auth initialization error:', error);
            TokenManager.clearTokens();
            return rejectWithValue('Initialization failed');
        }
    }
);

// Auto-refresh token before it expires
export const autoRefreshToken = createAsyncThunk(
    'auth/autoRefreshToken',
    async (_, { getState, rejectWithValue }) => {
        const { auth } = getState();
        const token = auth.accessToken;

        if (!token || TokenManager.isTokenExpired(token)) {
            try {
                const response = await authAxios.post('/refresh');
                TokenManager.setAccessToken(response.data.accessToken);
                return response.data;
            } catch {
                TokenManager.clearTokens();
                return rejectWithValue('Auto refresh failed');
            }
        }

        return { message: 'Token still valid' };
    }
);

// Enhanced login with auto-refresh setup
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            console.log('Attempting login...');
            const response = await authAxios.post('/login', credentials);

            if (response.data.accessToken) {
                TokenManager.setAccessToken(response.data.accessToken);
                console.log('Login successful, token stored');
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data?.message);
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

// Silent refresh (won't show loading states)
export const silentRefresh = createAsyncThunk(
    'auth/silentRefresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/refresh');

            if (response.data.accessToken) {
                TokenManager.setAccessToken(response.data.accessToken);
                return response.data;
            } else {
                throw new Error('No access token in response');
            }
        } catch {
            TokenManager.clearTokens();
            return rejectWithValue('Silent refresh failed');
        }
    }
);

export const setupAutoRefresh = createAsyncThunk(
    'auth/setupAutoRefresh',
    async (_, { dispatch }) => {
        const token = TokenManager.getAccessToken();
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiresIn = payload.exp * 1000 - Date.now();

            const refreshIn = Math.max(expiresIn - 120000, 30000);

            setTimeout(() => {
                dispatch(silentRefresh());
            }, refreshIn);

            return { refreshIn };
        } catch {
            TokenManager.clearTokens();
        }
    }
);

// Enhanced refresh token
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Attempting token refresh...');
            const response = await authAxios.post('/refresh');

            console.log('Refresh response received:', response.status);

            if (response.data.accessToken) {
                TokenManager.setAccessToken(response.data.accessToken);
                console.log('New access token stored');
                return response.data;
            } else {
                throw new Error('No access token in response');
            }
        } catch (error) {
            console.error('Refresh token error:', error.response?.status, error.response?.data?.message);
            TokenManager.clearTokens();
            return rejectWithValue(
                error.response?.data?.message || 'Token refresh failed'
            );
        }
    }
);

// User Registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            const response = await authAxios.post('/register/user', userData);

            if (response.data.accessToken) {
                TokenManager.setAccessToken(response.data.accessToken);
                dispatch(setupAutoRefresh());
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'User registration failed'
            );
        }
    }
);

// Organization Registration
export const registerOrganization = createAsyncThunk(
    'auth/registerOrganization',
    async (orgData, { dispatch, rejectWithValue }) => {
        try {
            const response = await authAxios.post('/register/organization', orgData);

            if (response.data.accessToken) {
                TokenManager.setAccessToken(response.data.accessToken);
                dispatch(setupAutoRefresh());
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Organization registration failed'
            );
        }
    }
);

// Enhanced logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authAxios.post('/logout');
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            TokenManager.clearTokens();
        }
        return {};
    }
);

// Logout from all devices
export const logoutAll = createAsyncThunk(
    'auth/logoutAll',
    async (_, { rejectWithValue }) => {
        try {
            await authAxios.post('/logout-all');
        } catch (error) {
            console.warn('Logout all request failed:', error);
        } finally {
            TokenManager.clearTokens();
        }
        return {};
    }
);

// Get Current User with retry logic
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching current user...');
            const response = await authAxios.get('/me');
            console.log('Current user response received');
            return response.data;
        } catch (error) {
            console.error('Get current user error:', error.response?.status, error.response?.data?.message);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user'
            );
        }
    }
);

// Other thunks (keeping existing functionality)...
export const switchOrganization = createAsyncThunk(
    'auth/switchOrganization',
    async (orgSlug, { rejectWithValue }) => {
        try {
            const response = await authAxios.post(`/switch-org/${orgSlug}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to switch organization'
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await authAxios.patch('/profile', profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update profile'
            );
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/change-password', passwordData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to change password'
            );
        }
    }
);

// Session management
export const getUserSessions = createAsyncThunk(
    'auth/getUserSessions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAxios.get('/sessions');
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch sessions'
            );
        }
    }
);

export const revokeSession = createAsyncThunk(
    'auth/revokeSession',
    async (sessionId, { rejectWithValue }) => {
        try {
            await authAxios.delete(`/sessions/${sessionId}`);
            return { sessionId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to revoke session'
            );
        }
    }
);

// Email verification
export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/verify-email', { token });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Email verification failed'
            );
        }
    }
);

// Password reset
export const requestPasswordReset = createAsyncThunk(
    'auth/requestPasswordReset',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/forgot-password', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Password reset request failed'
            );
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/reset-password', { token, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Password reset failed'
            );
        }
    }
);

// ====================
// ENHANCED INITIAL STATE
// ====================

const initialState = {
    // User data
    user: null,
    organization: null,
    organizations: [],

    // Authentication state
    isAuthenticated: !!TokenManager.getAccessToken(),
    accessToken: TokenManager.getAccessToken(),
    authInitialized: false,
    isInitializing: false,

    // UI state
    isLoading: false,
    error: null,

    // Session management
    sessions: [],
    lastActivity: Date.now(),

    // Auto-refresh state
    autoRefreshEnabled: false,
    refreshInterval: null,

    // MFA state
    mfaSecret: null,
    mfaQRCode: null,
    backupCodes: [],
    requiresMFA: false,
    mfaUserId: null,

    // Password reset state
    resetRequested: false,
    resetSuccess: false,

    // Email verification
    emailVerified: false,

    // Organization joining
    joinRequestSent: false,
    invitationProcessed: false,
};

// ====================
// ENHANCED SLICE
// ====================

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear success states
        clearSuccessStates: (state) => {
            state.resetRequested = false;
            state.resetSuccess = false;
            state.emailVerified = false;
            state.joinRequestSent = false;
            state.invitationProcessed = false;
        },

        // Update last activity
        updateLastActivity: (state) => {
            state.lastActivity = Date.now();
        },

        // Set authentication state manually (for edge cases)
        setAuthState: (state, action) => {
            const { user, organization, organizations, accessToken } = action.payload;
            state.user = user;
            state.organization = organization;
            state.organizations = organizations || [];
            state.accessToken = accessToken;
            state.isAuthenticated = !!accessToken;

            if (accessToken) {
                TokenManager.setAccessToken(accessToken);
            }
        },

        // Reset auth state
        resetAuthState: (state) => {
            TokenManager.clearTokens();
            Object.assign(state, {
                ...initialState,
                authInitialized: true,
                isAuthenticated: false,
                accessToken: null,
            });
        },

        // Set requires MFA
        setRequiresMFA: (state, action) => {
            state.requiresMFA = action.payload.requiresMFA;
            state.mfaUserId = action.payload.userId;
        },

        // Clear MFA states
        clearMFAStates: (state) => {
            state.mfaSecret = null;
            state.mfaQRCode = null;
            state.backupCodes = [];
            state.requiresMFA = false;
            state.mfaUserId = null;
        },

        // Enable/disable auto refresh
        setAutoRefresh: (state, action) => {
            state.autoRefreshEnabled = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            // ====================
            // INITIALIZE AUTH
            // ====================
            .addCase(initializeAuth.pending, (state) => {
                console.log('Auth initialization pending...');
                state.isInitializing = true;
                state.authInitialized = false;
                state.error = null;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                console.log('Auth initialization fulfilled');
                state.isInitializing = false;
                state.authInitialized = true;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.organizations = action.payload.organizations || [];
                state.accessToken = TokenManager.getAccessToken();
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                console.log('Auth initialization rejected:', action.payload);
                state.isInitializing = false;
                state.authInitialized = true; // Important: set to true even on failure
                state.isAuthenticated = false;
                state.user = null;
                state.organization = null;
                state.organizations = [];
                state.accessToken = null;
                state.error = null; // Don't set error for initialization failure
            })

            // ====================
            // LOGIN
            // ====================
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.organizations = action.payload.organizations || [];
                state.accessToken = TokenManager.getAccessToken();
                state.isAuthenticated = true;
                state.authInitialized = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ====================
            // REGISTRATION
            // ====================
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.organizations = action.payload.organization ? [action.payload.organization] : [];
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.authInitialized = true;
                state.autoRefreshEnabled = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(registerOrganization.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerOrganization.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.organizations = [action.payload.organization];
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.authInitialized = true;
                state.autoRefreshEnabled = true;
            })
            .addCase(registerOrganization.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ====================
            // TOKEN REFRESH
            // ====================
            .addCase(refreshToken.pending, (state) => {
                // Don't show loading for refresh
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                console.log('Refresh token fulfilled');
                if (action.payload.user) {
                    state.user = action.payload.user;
                    state.organization = action.payload.organization;
                    state.organizations = action.payload.organizations || [];
                    state.isAuthenticated = true;
                    state.authInitialized = true;
                    state.accessToken = TokenManager.getAccessToken();
                    state.error = null;
                }
            })
            .addCase(refreshToken.rejected, (state, action) => {
                console.log('Refresh token rejected');
                state.isAuthenticated = false;
                state.user = null;
                state.organization = null;
                state.organizations = [];
                state.accessToken = null;
                // Don't set error for silent refresh failures
            })

            // ====================
            // SILENT REFRESH
            // ====================
            .addCase(silentRefresh.fulfilled, (state, action) => {
                if (action.payload.user) {
                    state.user = action.payload.user;
                    state.organization = action.payload.organization;
                    state.organizations = action.payload.organizations || [];
                }
                state.accessToken = action.payload.accessToken;
                state.lastActivity = Date.now();
            })
            .addCase(silentRefresh.rejected, (state) => {
                state.isAuthenticated = false;
                state.autoRefreshEnabled = false;
            })

            // ====================
            // GET CURRENT USER
            // ====================
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                console.log('Get current user fulfilled');
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.organizations = action.payload.organizations || [];
                state.isAuthenticated = true;
                state.authInitialized = true;
                state.accessToken = TokenManager.getAccessToken();
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                console.log('Get current user rejected');
                // Don't change auth state here, let initializeAuth handle it
            })

            // ====================
            // LOGOUT
            // ====================
            .addCase(logout.fulfilled, (state) => {
                Object.assign(state, {
                    ...initialState,
                    authInitialized: true,
                    isAuthenticated: false,
                    accessToken: null,
                });
            })

            .addCase(logoutAll.fulfilled, (state) => {
                Object.assign(state, {
                    ...initialState,
                    authInitialized: true,
                    isAuthenticated: false,
                    accessToken: null,
                    autoRefreshEnabled: false,
                });
            })

            // ====================
            // OTHER EXISTING CASES
            // ====================
            .addCase(switchOrganization.fulfilled, (state, action) => {
                state.organization = action.payload.organization;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(getUserSessions.fulfilled, (state, action) => {
                state.sessions = action.payload.sessions;
            })
            .addCase(revokeSession.fulfilled, (state, action) => {
                state.sessions = state.sessions.filter(
                    session => session.id !== action.payload.sessionId
                );
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.emailVerified = true;
                if (state.user) {
                    state.user.emailVerified = true;
                }
            })
            .addCase(requestPasswordReset.fulfilled, (state) => {
                state.resetRequested = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetSuccess = true;
            })

            // ====================
            // ERROR HANDLING
            // ====================
            .addMatcher(
                (action) => action.type.endsWith('/rejected') &&
                    !action.type.includes('refreshToken') &&
                    !action.type.includes('getCurrentUser') &&
                    !action.type.includes('initializeAuth'),
                (state, action) => {
                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearError,
    clearSuccessStates,
    updateLastActivity,
    setAuthState,
    resetAuthState,
    setRequiresMFA,
    clearMFAStates,
    setAutoRefresh,
} = authSlice.actions;

export default authSlice.reducer;

// Export utilities
export { authAxios, TokenManager };