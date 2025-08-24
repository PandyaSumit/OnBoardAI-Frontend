// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

// Configure axios defaults
axios.defaults.withCredentials = true; // Important for refresh token cookies

// Create axios interceptor for token refresh
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

// Axios request interceptor to add token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Axios response interceptor for token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(`${API_URL}/refresh`);
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
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

// Register Organization (Creates org + admin user)
export const registerOrganization = createAsyncThunk(
    'auth/registerOrganization',
    async (orgData, { rejectWithValue }) => {
        console.log('orgData: ', orgData);
        try {
            const response = await axios.post(`${API_URL}/register`, orgData);

            // Store tokens
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

// User Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);

            // Store access token
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

// Refresh Token
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/refresh`);

            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            localStorage.removeItem('accessToken');
            return rejectWithValue(
                error.response?.data?.message || 'Token refresh failed'
            );
        }
    }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/me`);
            return response.data;
        } catch (error) {
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
            const response = await axios.post(`${API_URL}/switch-org/${orgSlug}`);
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
            const response = await axios.patch(`${API_URL}/profile`, profileData);
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
            const response = await axios.post(`${API_URL}/change-password`, passwordData);
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
            await axios.post(`${API_URL}/logout`);
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
            await axios.post(`${API_URL}/logout-all`);
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
            const response = await axios.get(`${API_URL}/sessions`);
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
            await axios.delete(`${API_URL}/sessions/${sessionId}`);
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
            const response = await axios.post(`${API_URL}/verify-email`, { token });
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
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
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
            const response = await axios.post(`${API_URL}/reset-password`, { token, password });
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
            const response = await axios.post(`${API_URL}/mfa/generate`);
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
            const response = await axios.post(`${API_URL}/mfa/enable`, { token });
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
            const response = await axios.post(`${API_URL}/mfa/disable`, { password, mfaToken });
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
            const response = await axios.post(`${API_URL}/mfa/backup-codes`, { password });
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
            const response = await axios.post(`${API_URL}/join/invitation`, invitationData);

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
            const response = await axios.post(`${API_URL}/join/code`, { code, orgSlug });
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
            const response = await axios.post(`${API_URL}/join/request`, { orgSlug, message });
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
            // REGISTRATION & LOGIN
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
                state.userType = 'user'; // New unified type
            })
            .addCase(registerOrganization.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

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
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.user = null;
                state.organization = null;
                state.organizations = [];
                state.accessToken = null;
                state.isAuthenticated = false;
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
                state.isAuthenticated = false;
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