import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("authToken");
            const userType = localStorage.getItem("userType");

            if (!token || !userType) {
                return rejectWithValue("No token or userType found");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Choose API based on role
            let response;
            if (userType === "organization") {
                response = await axios.get(`${API_URL}/org/me`, config);
            } else {
                response = await axios.get(`${API_URL}/emp/me`, config);
            }

            return { user: response.data, userType, token };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user"
            );
        }
    }
);

export const registerOrganization = createAsyncThunk(
    'auth/registerOrganization',
    async (orgData, { rejectWithValue }) => {
        console.log('orgData', orgData)
        try {
            const response = await axios.post(`${API_URL}/org/register`, orgData);
            console.log('response.data', response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

export const loginOrganization = createAsyncThunk(
    'auth/loginOrganization',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/org/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userType', 'organization');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

export const registerEmployee = createAsyncThunk(
    'auth/registerEmployee',
    async (empData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/emp/register`, empData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

export const loginEmployee = createAsyncThunk(
    'auth/loginEmployee',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/emp/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userType', 'employee');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

export const getOrganizations = createAsyncThunk(
    'auth/getOrganizations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/org`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch organizations'
            );
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userType');
            return {};
        } catch {
            return rejectWithValue('Logout failed');
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('authToken'),
    userType: localStorage.getItem('userType'),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    organizations: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuthState: (state) => {
            state.user = null;
            state.token = null;
            state.userType = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.userType = action.payload.userType;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.user = null;
                state.token = null;
                state.userType = null;
                state.isAuthenticated = false;
            })

            // Organization Registration
            .addCase(registerOrganization.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerOrganization.fulfilled, (state, action) => {

                console.log('action.payload', action.payload)
                state.isLoading = false;
                state.user = action.payload.org;
                state.token = action.payload.token;
                state.userType = 'organization';
                state.isAuthenticated = true;
            })
            .addCase(registerOrganization.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Organization Login
            .addCase(loginOrganization.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginOrganization.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.org;
                state.token = action.payload.token;
                state.userType = 'organization';
                state.isAuthenticated = true;
            })
            .addCase(loginOrganization.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Employee Registration
            .addCase(registerEmployee.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.employee;
                state.token = action.payload.token;
                state.userType = 'employee';
                state.isAuthenticated = true;
            })
            .addCase(registerEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Employee Login
            .addCase(loginEmployee.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.employee;
                state.token = action.payload.token;
                state.userType = 'employee';
                state.isAuthenticated = true;
            })
            .addCase(loginEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Organizations
            .addCase(getOrganizations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrganizations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.organizations = action.payload;
            })
            .addCase(getOrganizations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.userType = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
