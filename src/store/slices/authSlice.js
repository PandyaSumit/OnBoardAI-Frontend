// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

axios.defaults.withCredentials = true;

let isRefreshing = false;
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

// Create a separate axios instance for auth to avoid circular dependencies
const authAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Request interceptor
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor with improved error handling
authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for 401 errors and token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Token expired, attempting refresh...');

            // Check if we're already refreshing
            if (isRefreshing) {
                console.log('Already refreshing, queuing request...');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return authAxios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('Making refresh token request...');
                // Use the auth axios instance for refresh
                const response = await authAxios.post('/refresh');
                console.log('Refresh token response:', response.data);

                const { accessToken } = response.data;

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    processQueue(null, accessToken);

                    // Update the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    console.log('Retrying original request with new token...');
                    return authAxios(originalRequest);
                } else {
                    throw new Error('No access token in refresh response');
                }
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                processQueue(refreshError, null);

                // Clear tokens and redirect to login
                localStorage.removeItem('accessToken');

                // Only redirect if we're not already on login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ====================
// ASYNC THUNKS
// ====================

export const registerOrganization = createAsyncThunk(
    'auth/registerOrganization',
    async (orgData, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/register/organization', orgData);

            // Store tokens
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Organization registration failed'
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/register/user', userData);

            // Store tokens
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'User registration failed'
            );
        }
    }
);

// User Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        console.log('credentials: ', credentials);
        try {
            const response = await authAxios.post('/login', credentials);
            console.log('response: ', response);

            // Store access token
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            console.log('response.data: ', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

// Refresh Token - Updated with better error handling
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Manual refresh token call...');
            const response = await authAxios.post('/refresh');
            console.log('Manual refresh response:', response.data);

            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                return response.data;
            } else {
                throw new Error('No access token in response');
            }
        } catch (error) {
            console.error('Manual refresh failed:', error);
            localStorage.removeItem('accessToken');
            return rejectWithValue(
                error.response?.data?.message || 'Token refresh failed'
            );
        }
    }
);

// Get Current User - with retry logic
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await authAxios.get('/me');
            return response.data;
        } catch (error) {
            // If it's a 401, try refreshing token first
            if (error.response?.status === 401) {
                console.log('getCurrentUser got 401, token will be refreshed by interceptor');
            }
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user'
            );
        }
    }
);

// Switch Organization
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

// Update Profile
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

// Change Password
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

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authAxios.post('/logout');
            localStorage.removeItem('accessToken');
            return {};
        } catch (error) {
            // Still clear local storage even if request fails
            localStorage.removeItem('accessToken');
            return rejectWithValue(
                error.response?.data?.message || 'Logout failed'
            );
        }
    }
);

// Logout All Devices
export const logoutAll = createAsyncThunk(
    'auth/logoutAll',
    async (_, { rejectWithValue }) => {
        try {
            await authAxios.post('/logout-all');
            localStorage.removeItem('accessToken');
            return {};
        } catch (error) {
            localStorage.removeItem('accessToken');
            return rejectWithValue(
                error.response?.data?.message || 'Logout all failed'
            );
        }
    }
);

// Get User Sessions
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

// Revoke Session
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

// Email Verification
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

// Request Password Reset
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

// Reset Password
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
// MFA THUNKS
// ====================

// Generate MFA Secret
export const generateMFASecret = createAsyncThunk(
    'auth/generateMFASecret',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/mfa/generate');
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to generate MFA secret'
            );
        }
    }
);

// Enable MFA
export const enableMFA = createAsyncThunk(
    'auth/enableMFA',
    async (token, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/mfa/enable', { token });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to enable MFA'
            );
        }
    }
);

// Disable MFA
export const disableMFA = createAsyncThunk(
    'auth/disableMFA',
    async ({ password, mfaToken }, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/mfa/disable', { password, mfaToken });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to disable MFA'
            );
        }
    }
);

// Generate Backup Codes
export const generateBackupCodes = createAsyncThunk(
    'auth/generateBackupCodes',
    async (password, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/mfa/backup-codes', { password });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to generate backup codes'
            );
        }
    }
);

// ====================
// ORGANIZATION JOINING THUNKS
// ====================

// Join by Invitation
export const joinByInvitation = createAsyncThunk(
    'auth/joinByInvitation',
    async (invitationData, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/join/invitation', invitationData);

            // Store access token if provided (for new user registration)
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to join organization'
            );
        }
    }
);

// Join by Code
export const joinByCode = createAsyncThunk(
    'auth/joinByCode',
    async ({ code, orgSlug }, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/join/code', { code, orgSlug });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to join organization'
            );
        }
    }
);

// Request to Join
export const requestToJoin = createAsyncThunk(
    'auth/requestToJoin',
    async ({ orgSlug, message }, { rejectWithValue }) => {
        try {
            const response = await authAxios.post('/join/request', { orgSlug, message });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to request organization membership'
            );
        }
    }
);

// ====================
// INITIAL STATE
// ====================

const initialState = {
    // User data
    user: null,
    organization: null,
    organizations: [],

    // Authentication state
    isAuthenticated: !!localStorage.getItem('accessToken'),
    accessToken: localStorage.getItem('accessToken'),

    // UI state
    isLoading: false,
    error: null,

    // User sessions
    sessions: [],

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

    // Legacy compatibility
    userType: null, // For backward compatibility
};

// ====================
// SLICE
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

        // Clear MFA states
        clearMFAStates: (state) => {
            state.mfaSecret = null;
            state.mfaQRCode = null;
            state.backupCodes = [];
            state.requiresMFA = false;
            state.mfaUserId = null;
        },

        // Reset auth state
        resetAuthState: (state) => {
            Object.assign(state, {
                ...initialState,
                isAuthenticated: false,
                accessToken: null,
            });
            localStorage.removeItem('accessToken');
        },

        // Set requires MFA (for login flow)
        setRequiresMFA: (state, action) => {
            state.requiresMFA = action.payload.requiresMFA;
            state.mfaUserId = action.payload.userId;
        },

        // Update user data locally
        updateUserData: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },

        // Update organization data locally
        updateOrganizationData: (state, action) => {
            if (state.organization) {
                state.organization = { ...state.organization, ...action.payload };
            }
        },
    },

    extraReducers: (builder) => {
        builder
            // ====================
            // USER REGISTRATION
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
                state.userType = 'user';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ====================
            // ORGANIZATION REGISTRATION
            // ====================
            .addCase(registerOrganization.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerOrganization.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.organizations = action.payload.organization ? [action.payload.organization] : [];
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.userType = 'user';
            })
            .addCase(registerOrganization.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
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

                if (action.payload.requiresMFA) {
                    state.requiresMFA = true;
                    state.mfaUserId = action.payload.userId;
                } else {
                    state.user = action.payload.user;
                    state.organization = action.payload.organization;
                    state.organizations = action.payload.organizations || [];
                    state.accessToken = action.payload.accessToken;
                    state.isAuthenticated = true;
                    state.userType = 'user';
                    state.requiresMFA = false;
                    state.mfaUserId = null;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.requiresMFA = false;
                state.mfaUserId = null;
            })

            // ====================
            // TOKEN REFRESH
            // ====================
            .addCase(refreshToken.pending, (state) => {
                console.log('Refresh token pending...');
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                console.log('Refresh token fulfilled:', action.payload);
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
                if (action.payload.organization) {
                    state.organization = action.payload.organization;
                }
                if (action.payload.organizations) {
                    state.organizations = action.payload.organizations;
                }
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                console.log('Refresh token rejected:', action.payload);
                state.user = null;
                state.organization = null;
                state.organizations = [];
                state.accessToken = null;
                state.isAuthenticated = false;
                // Don't set error for refresh failures as they're handled by redirect
            })

            // ====================
            // GET CURRENT USER
            // ====================
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.organizations = action.payload.organizations || [];
                state.isAuthenticated = true;
                state.userType = 'user';
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                // Don't set isAuthenticated to false here as token refresh might fix it
            })

            // ====================
            // ORGANIZATION SWITCHING
            // ====================
            .addCase(switchOrganization.fulfilled, (state, action) => {
                state.organization = action.payload.organization;
            })
            .addCase(switchOrganization.rejected, (state, action) => {
                state.error = action.payload;
            })

            // ====================
            // PROFILE MANAGEMENT
            // ====================
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ====================
            // LOGOUT
            // ====================
            .addCase(logout.fulfilled, (state) => {
                Object.assign(state, {
                    ...initialState,
                    isAuthenticated: false,
                    accessToken: null,
                });
            })
            .addCase(logoutAll.fulfilled, (state) => {
                Object.assign(state, {
                    ...initialState,
                    isAuthenticated: false,
                    accessToken: null,
                });
            })

            // ====================
            // SESSION MANAGEMENT
            // ====================
            .addCase(getUserSessions.fulfilled, (state, action) => {
                state.sessions = action.payload.sessions;
            })
            .addCase(revokeSession.fulfilled, (state, action) => {
                state.sessions = state.sessions.filter(
                    session => session.id !== action.payload.sessionId
                );
            })

            // ====================
            // EMAIL VERIFICATION
            // ====================
            .addCase(verifyEmail.fulfilled, (state) => {
                state.emailVerified = true;
                if (state.user) {
                    state.user.emailVerified = true;
                }
            })

            // ====================
            // PASSWORD RESET
            // ====================
            .addCase(requestPasswordReset.fulfilled, (state) => {
                state.resetRequested = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetSuccess = true;
            })

            // ====================
            // MFA
            // ====================
            .addCase(generateMFASecret.fulfilled, (state, action) => {
                state.mfaSecret = action.payload.secret;
                state.mfaQRCode = action.payload.qrCode;
            })
            .addCase(enableMFA.fulfilled, (state, action) => {
                state.backupCodes = action.payload.backupCodes;
                state.mfaSecret = null;
                state.mfaQRCode = null;
                if (state.user) {
                    state.user.mfaEnabled = true;
                }
            })
            .addCase(disableMFA.fulfilled, (state) => {
                state.backupCodes = [];
                if (state.user) {
                    state.user.mfaEnabled = false;
                }
            })
            .addCase(generateBackupCodes.fulfilled, (state, action) => {
                state.backupCodes = action.payload.backupCodes;
            })

            // ====================
            // ORGANIZATION JOINING
            // ====================
            .addCase(joinByInvitation.fulfilled, (state, action) => {
                state.invitationProcessed = true;

                // If new user registration with tokens
                if (action.payload.accessToken) {
                    state.user = action.payload.user;
                    state.organization = action.payload.organization;
                    state.accessToken = action.payload.accessToken;
                    state.isAuthenticated = true;
                    state.userType = 'user';
                }

                // Update organizations list if user was already logged in
                if (state.user && action.payload.organization) {
                    const existingOrgIndex = state.organizations.findIndex(
                        org => org.id === action.payload.organization.id
                    );

                    if (existingOrgIndex === -1) {
                        state.organizations.push(action.payload.organization);
                    }
                }
            })
            .addCase(joinByCode.fulfilled, (state, action) => {
                const org = action.payload.organization;
                const existingOrgIndex = state.organizations.findIndex(o => o.id === org.id);

                if (existingOrgIndex === -1) {
                    state.organizations.push(org);
                }
            })
            .addCase(requestToJoin.fulfilled, (state) => {
                state.joinRequestSent = true;
            })

            // ====================
            // ERROR HANDLING
            // ====================
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    if (action.type !== 'auth/refreshToken/rejected') {
                        state.error = action.payload;
                    }
                    if (action.type.includes('login') || action.type.includes('register')) {
                        state.isLoading = false;
                    }
                }
            );
    },
});

// Export actions
export const {
    clearError,
    clearSuccessStates,
    clearMFAStates,
    resetAuthState,
    setRequiresMFA,
    updateUserData,
    updateOrganizationData,
} = authSlice.actions;

export default authSlice.reducer;

// Export the authAxios instance for use in other files if needed
export { authAxios };