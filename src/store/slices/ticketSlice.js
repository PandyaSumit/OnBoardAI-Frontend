import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/tickets`;

export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async (params = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;
            const { data } = await axios.get(url, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchComments = createAsyncThunk(
    "tickets/fetchComments",
    async ({ ticketId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                sortBy,
                sortOrder
            }).toString();

            const { data } = await axios.get(`${API_URL}/${ticketId}/comments?${queryParams}`, {
                withCredentials: true
            });

            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchTicketById = createAsyncThunk(
    'tickets/fetchTicketById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createTicket = createAsyncThunk(
    'tickets/createTicket',
    async (ticketData, { rejectWithValue }) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticTicket = {
            ...ticketData,
            _id: tempId,
            id: tempId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            const { data } = await axios.post(API_URL, ticketData, { withCredentials: true });
            return { optimisticTicket, realTicket: data.data };
        } catch (err) {
            return rejectWithValue({
                error: err.response?.data || err.message,
                tempId
            });
        }
    }
);

export const bulkUpdateTickets = createAsyncThunk(
    'tickets/bulkUpdateTickets',
    async (updates, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(`${API_URL}/bulk`, { updates }, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateTicket = createAsyncThunk(
    'tickets/updateTicket',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${API_URL}/${id}`, updatedData, { withCredentials: true });
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteTicket = createAsyncThunk(
    'tickets/deleteTicket',
    async (id, { rejectWithValue }) => {
        console.log(id);
        try {
            await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addComment = createAsyncThunk(
    "tickets/addComment",
    async ({ ticketId, content, author, attachments = [] }, { rejectWithValue }) => {
        console.log('content: ', content);
        console.log('author: ', author);
        console.log('ticketId: ', ticketId);
        try {
            const res = await axios.post(`${API_URL}/${ticketId}/comments`, {
                content,
                author,
                attachments
            });

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateWatchers = createAsyncThunk(
    'tickets/updateWatchers',
    async ({ ticketId, userId, action }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(
                `${API_URL}/${ticketId}/watchers`,
                { userId, action },
                { withCredentials: true }
            );
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    tickets: [],
    filteredTickets: [],
    comments: [],
    commentsLoading: false,
    commentsPagination: {
        currentPage: 1,
        totalPages: 0,
        totalComments: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
    },
    selectedTicket: null,
    loading: false,
    creating: false,
    updating: false,
    error: null,

    columns: {},
    filters: {
        search: '',
        assignee: [],
        priority: [],
        type: [],
        status: [],
        tags: [],
        dateRange: null
    },
    sortBy: { field: 'createdAt', direction: 'desc' },
    groupBy: null,

    // UI state
    draggedItem: null,
    selectedItems: [],
    viewMode: 'kanban', // kanban, list, calendar

    // Real-time collaboration
    activeUsers: [],
    recentActivity: [],

    // Performance optimization
    lastFetch: null,
    isStale: false
};

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        // UI actions
        setDraggedItem: (state, action) => {
            state.draggedItem = action.payload;
        },

        clearDraggedItem: (state) => {
            state.draggedItem = null;
        },

        setSelectedTicket: (state, action) => {
            state.selectedTicket = action.payload;
        },

        clearSelectedTicket: (state) => {
            state.selectedTicket = null;
        },

        // Selection management
        toggleSelectItem: (state, action) => {
            const id = action.payload;
            const index = state.selectedItems.indexOf(id);
            if (index === -1) {
                state.selectedItems.push(id);
            } else {
                state.selectedItems.splice(index, 1);
            }
        },

        clearSelection: (state) => {
            state.selectedItems = [];
        },

        selectAllVisible: (state) => {
            state.selectedItems = state.filteredTickets.map(t => t._id);
        },

        // Filtering and search
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
        },

        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.filteredTickets = state.tickets;
        },

        setSortBy: (state, action) => {
            state.sortBy = action.payload;
            state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
        },

        setGroupBy: (state, action) => {
            state.groupBy = action.payload;
        },

        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },

        // Optimistic updates for drag & drop
        optimisticMoveTicket: (state, action) => {
            const { ticketId, newStatus, newPosition } = action.payload;

            // Update in tickets array
            const ticketIndex = state.tickets.findIndex(t => t._id === ticketId);
            if (ticketIndex !== -1) {
                state.tickets[ticketIndex].status = newStatus;
                state.tickets[ticketIndex].updatedAt = new Date().toISOString();
            }

            // Update in columns
            Object.keys(state.columns).forEach(columnId => {
                state.columns[columnId].items = state.columns[columnId].items.filter(
                    item => item._id !== ticketId
                );
            });

            if (state.columns[newStatus]) {
                const ticket = state.tickets[ticketIndex];
                if (ticket) {
                    state.columns[newStatus].items.splice(newPosition || 0, 0, ticket);
                }
            }

            // Update filtered tickets
            state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
        },

        // Real-time collaboration
        updateActiveUsers: (state, action) => {
            state.activeUsers = action.payload;
        },

        addActivity: (state, action) => {
            state.recentActivity.unshift(action.payload);
            if (state.recentActivity.length > 50) {
                state.recentActivity.pop();
            }
        },

        // Performance optimization
        markAsStale: (state) => {
            state.isStale = true;
        },

        updateLastFetch: (state) => {
            state.lastFetch = Date.now();
            state.isStale = false;
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch tickets
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
                state.filteredTickets = applyFilters(action.payload, state.filters, state.sortBy);
                state.columns = organizeIntoColumns(action.payload);
                state.lastFetch = Date.now();
                state.isStale = false;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single ticket
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTicket = action.payload;

                // Update in main tickets array if exists
                const index = state.tickets.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                    state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
                }
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchComments.pending, (state) => {
                state.commentsLoading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.commentsLoading = false;
                const { comments, pagination } = action.payload;

                // If it's page 1, replace comments; otherwise append
                if (pagination.currentPage === 1) {
                    state.comments = comments;
                } else {
                    state.comments = [...state.comments, ...comments];
                }

                state.commentsPagination = pagination;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.commentsLoading = false;
                state.error = action.payload;
            })

            // Create ticket with optimistic updates
            .addCase(createTicket.pending, (state, action) => {
                state.creating = true;
                state.error = null;

                // Add optimistic ticket
                if (action.meta.arg) {
                    const tempTicket = {
                        ...action.meta.arg,
                        _id: `temp-${Date.now()}`,
                        id: `TEMP-${Date.now()}`,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isOptimistic: true
                    };

                    state.tickets.push(tempTicket);
                    state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);

                    // Add to appropriate column
                    const status = tempTicket.status || 'to-do';
                    if (state.columns[status]) {
                        state.columns[status].items.push(tempTicket);
                    }
                }
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.creating = false;
                const { optimisticTicket, realTicket } = action.payload;

                // Replace optimistic ticket with real one
                state.tickets = state.tickets.map(t =>
                    t.isOptimistic && t._id === optimisticTicket._id ? realTicket : t
                );

                // Update columns
                Object.keys(state.columns).forEach(columnId => {
                    state.columns[columnId].items = state.columns[columnId].items.map(item =>
                        item.isOptimistic && item._id === optimisticTicket._id ? realTicket : item
                    );
                });

                state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload.error;

                // Remove failed optimistic ticket
                if (action.payload.tempId) {
                    state.tickets = state.tickets.filter(t => t._id !== action.payload.tempId);
                    Object.keys(state.columns).forEach(columnId => {
                        state.columns[columnId].items = state.columns[columnId].items.filter(
                            item => item._id !== action.payload.tempId
                        );
                    });
                    state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
                }
            })

            // Update ticket
            .addCase(updateTicket.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                state.updating = false;
                const updatedTicket = action.payload;

                // Update in tickets array
                state.tickets = state.tickets.map(t =>
                    t._id === updatedTicket._id ? updatedTicket : t
                );

                // Update in columns
                Object.keys(state.columns).forEach(columnId => {
                    state.columns[columnId].items = state.columns[columnId].items.map(item =>
                        item._id === updatedTicket._id ? updatedTicket : item
                    );
                });

                // Update selected ticket if it's the same one
                if (state.selectedTicket?._id === updatedTicket._id) {
                    state.selectedTicket = updatedTicket;
                }

                state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })

            // Delete ticket
            .addCase(deleteTicket.fulfilled, (state, action) => {
                const deletedId = action.payload;

                state.tickets = state.tickets.filter(t => t._id !== deletedId);

                // Remove from columns
                Object.keys(state.columns).forEach(columnId => {
                    state.columns[columnId].items = state.columns[columnId].items.filter(
                        item => item._id !== deletedId
                    );
                });

                // Clear selected if it was deleted
                if (state.selectedTicket?._id === deletedId) {
                    state.selectedTicket = null;
                }

                state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
                state.selectedItems = state.selectedItems.filter(id => id !== deletedId);
            })

            // Add comment
            .addCase(addComment.fulfilled, (state, action) => {
                const payload = action.payload;

                // Case 1: Backend returns updated ticket with comments
                if (payload?._id) {
                    const updatedTicket = payload;

                    // Update tickets array
                    const index = state.tickets.findIndex(t => t._id === updatedTicket._id);
                    if (index !== -1) {
                        state.tickets[index] = updatedTicket;
                    }

                    // Update selected ticket if it's the same one
                    if (state.selectedTicket?._id === updatedTicket._id) {
                        state.selectedTicket = updatedTicket;
                    }

                    // Sync comments
                    state.comments = updatedTicket.comments || [];
                }

                // Case 2: Backend only returns the new comment
                else if (payload?.comment) {
                    const newComment = payload.comment;

                    // Push into comments array
                    state.comments.push(newComment);

                    // Update selected ticket comments if it exists
                    if (state.selectedTicket) {
                        state.selectedTicket.comments = [
                            ...(state.selectedTicket.comments || []),
                            newComment
                        ];
                    }

                    // Update tickets array
                    const index = state.tickets.findIndex(t => t._id === newComment.ticketId);
                    if (index !== -1) {
                        state.tickets[index].comments = [
                            ...(state.tickets[index].comments || []),
                            newComment
                        ];
                    }
                }

                // Re-apply filters
                state.filteredTickets = applyFilters(state.tickets, state.filters, state.sortBy);
            })


    }
});

// Helper functions
const applyFilters = (tickets, filters, sortBy) => {
    let filtered = [...tickets];

    // Search filter
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(ticket =>
            ticket.title.toLowerCase().includes(searchLower) ||
            ticket.description?.toLowerCase().includes(searchLower) ||
            ticket.id.toLowerCase().includes(searchLower) ||
            ticket.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }

    // Assignee filter
    if (filters.assignee.length > 0) {
        filtered = filtered.filter(ticket =>
            filters.assignee.includes(ticket.assignee) ||
            (filters.assignee.includes('unassigned') && !ticket.assignee)
        );
    }

    // Priority filter
    if (filters.priority.length > 0) {
        filtered = filtered.filter(ticket => filters.priority.includes(ticket.priority));
    }

    // Type filter
    if (filters.type.length > 0) {
        filtered = filtered.filter(ticket => filters.type.includes(ticket.type));
    }

    // Status filter
    if (filters.status.length > 0) {
        filtered = filtered.filter(ticket => filters.status.includes(ticket.status));
    }

    // Tags filter
    if (filters.tags.length > 0) {
        filtered = filtered.filter(ticket =>
            filters.tags.some(tag => ticket.tags?.includes(tag))
        );
    }

    // Date range filter
    if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        filtered = filtered.filter(ticket => {
            const createdDate = new Date(ticket.createdAt);
            return createdDate >= start && createdDate <= end;
        });
    }

    // Apply sorting
    filtered.sort((a, b) => {
        const { field, direction } = sortBy;
        let comparison = 0;

        switch (field) {
            case 'priority':
                const priorityOrder = { lowest: 1, low: 2, medium: 3, high: 4, highest: 5 };
                comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
                break;
            case 'createdAt':
            case 'updatedAt':
            case 'dueDate':
                comparison = new Date(a[field] || 0) - new Date(b[field] || 0);
                break;
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'storyPoints':
                comparison = (a.storyPoints || 0) - (b.storyPoints || 0);
                break;
            default:
                comparison = 0;
        }

        return direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
};

const organizeIntoColumns = (tickets) => {
    const defaultColumns = {
        'to-do': { id: 'to-do', name: 'TO DO', color: '#DFE1E6', items: [], order: 1 },
        'in-progress': { id: 'in-progress', name: 'IN PROGRESS', color: '#0052CC', items: [], order: 2 },
        'code-review': { id: 'code-review', name: 'CODE REVIEW', color: '#FFAB00', items: [], order: 3 },
        'done': { id: 'done', name: 'DONE', color: '#36B37E', items: [], order: 4 }
    };

    const columns = { ...defaultColumns };

    tickets.forEach(ticket => {
        const status = ticket.status || 'to-do';
        if (columns[status]) {
            columns[status].items.push(ticket);
        } else {
            // Create dynamic column if doesn't exist
            columns[status] = {
                id: status,
                name: status.toUpperCase().replace('-', ' '),
                color: '#8993a4',
                items: [ticket],
                order: Object.keys(columns).length + 1
            };
        }
    });

    return columns;
};

// Selectors for better performance
export const selectTicketsForColumn = (state, columnId) => {
    return state.tickets.columns[columnId]?.items || [];
};

export const selectFilteredTickets = (state) => {
    return state.tickets.filteredTickets;
};

export const selectTicketById = (state, ticketId) => {
    return state.tickets.tickets.find(t => t._id === ticketId);
};

export const selectGroupedTickets = (state) => {
    const { filteredTickets, groupBy } = state.tickets;

    if (!groupBy) return { ungrouped: filteredTickets };

    return filteredTickets.reduce((groups, ticket) => {
        const key = ticket[groupBy] || 'unassigned';
        if (!groups[key]) groups[key] = [];
        groups[key].push(ticket);
        return groups;
    }, {});
};

export const {
    setDraggedItem,
    clearDraggedItem,
    setSelectedTicket,
    clearSelectedTicket,
    toggleSelectItem,
    clearSelection,
    selectAllVisible,
    setFilters,
    clearFilters,
    setSortBy,
    setGroupBy,
    setViewMode,
    optimisticMoveTicket,
    updateActiveUsers,
    addActivity,
    markAsStale,
    updateLastFetch
} = ticketSlice.actions;

export default ticketSlice.reducer;