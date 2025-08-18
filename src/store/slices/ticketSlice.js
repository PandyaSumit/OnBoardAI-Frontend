import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tickets';


// Fetch all projects
export const fetchTickets = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(API_URL, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Fetch single project
export const fetchTicketById = createAsyncThunk(
    'projects/fetchProjectById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Create a project
export const createTicketThunk = createAsyncThunk(
    'projects/createProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(API_URL, projectData, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Update a project
export const updateTicketThunk = createAsyncThunk(
    'projects/updateProject',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${API_URL}/${id}`, updatedData, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Delete a project
export const deleteTicketThunk = createAsyncThunk(
    'projects/deleteProject',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
            console.log('data: ', data);
            return id; // return deleted project ID
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Add member
export const addMemberThunk = createAsyncThunk(
    'projects/addMember',
    async ({ id, memberData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/${id}/members`, memberData, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Remove member
export const removeMemberThunk = createAsyncThunk(
    'projects/removeMember',
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${API_URL}/${id}/members`, { data: { userId }, withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        ticket: null,
        loading: false,
        error: null
    },
    reducers: {
        clearProject: (state) => {
            state.project = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all projects
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single project
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create project
            .addCase(createTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets.push(action.payload);
            })
            .addCase(createTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update project
            .addCase(updateTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = state.tickets.map(p => p._id === action.payload._id ? action.payload : p);
            })
            .addCase(updateTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete project
            .addCase(deleteTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = state.tickets.filter(p => p._id !== action.payload);
            })
            .addCase(deleteTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add member
            .addCase(addMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMemberThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload;
            })
            .addCase(addMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove member
            .addCase(removeMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeMemberThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload;
            })
            .addCase(removeMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearProject } = ticketSlice.actions;
export default ticketSlice.reducer;
