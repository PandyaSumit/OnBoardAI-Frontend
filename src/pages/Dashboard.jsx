import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    Kanban, FileText, Calendar, BarChart3, Filter, ChevronDown, Plus,
    Search, Zap, Target, RefreshCw,
    Bookmark,
    CheckCircle,
    Bug,
    ArrowUp,
    Minus,
    ArrowDown
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTickets,
    createTicket,
    updateTicket,
    setFilters,
    clearFilters,
    setSortBy,
    setGroupBy,
    toggleSelectItem,
    clearSelection,
    selectAllVisible,
    optimisticMoveTicket,
    addActivity
} from '../store/slices/ticketSlice';

// Import components
import BacklogView from '../components/BacklogView';
import TimelineView from '../components/TimelineView';
import ReportsView from '../components/ReportsView';
import Column from '../components/Column';
import AIChatbot from '../components/AiChatBot';
import TaskDrawer from '../components/TaskDrawer';
import CreateTaskModal from '../components/modals/CreateTask';
import BoardHeader from '../components/Layout/BoardHeader';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('board');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createModalColumn, setCreateModalColumn] = useState('to-do');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    // const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const draggedItemRef = useRef(null);
    const draggedOverColumnRef = useRef(null);
    const autoSaveRef = useRef(null);

    const dispatch = useDispatch();
    const {
        filteredTickets,
        columns,
        loading,
        creating,
        filters,
        sortBy,
        groupBy,
        viewMode,
        selectedItems,
        isStale
    } = useSelector((state) => state.tickets);

    // Memoized column data for performance
    const memoizedColumns = useMemo(() => {
        return Object.entries(columns)
            .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
            .reduce((acc, [key, column]) => {
                acc[key] = {
                    ...column,
                    items: filteredTickets.filter(ticket => ticket.status === key)
                };
                return acc;
            }, {});
    }, [columns, filteredTickets]);

    // Auto-refresh when data becomes stale
    useEffect(() => {
        if (isStale) {
            const timer = setTimeout(() => {
                dispatch(fetchTickets());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isStale, dispatch]);

    // Debounced search
    // useEffect(() => {
    //     const debounceTimer = setTimeout(() => {
    //         dispatch(setFilters({ search: searchQuery }));
    //     }, 300);

    //     return () => clearTimeout(debounceTimer);
    // }, [searchQuery, dispatch]);

    // Auto-save functionality
    const scheduleAutoSave = () => {
        if (autoSaveRef.current) {
            clearTimeout(autoSaveRef.current);
        }
        autoSaveRef.current = setTimeout(() => {
            console.log('Auto-saving changes...');
        }, 2000);
    };

    const openTaskDrawer = (task) => {
        setSelectedTask(task);
    };

    const closeTaskDrawer = () => {
        setSelectedTask(null);
    };

    const handleCreateIssue = (columnId = 'to-do') => {
        setCreateModalColumn(columnId);
        setShowCreateModal(true);
    };

    const addNewIssue = async (newIssue) => {
        try {
            const resultAction = await dispatch(createTicket(newIssue));
            if (createTicket.fulfilled.match(resultAction)) {
                setShowCreateModal(false);

                // Show success notification
                dispatch(addActivity({
                    type: 'ticket_created',
                    ticketId: resultAction.payload.realTicket._id,
                    message: `Created ticket: ${newIssue.title}`,
                    timestamp: new Date().toISOString()
                }));
            }
        } catch (err) {
            console.error('Failed to create issue:', err);
        }
    };

    const handleDragStart = (e, item) => {
        draggedItemRef.current = item;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item._id);

        e.target.style.opacity = '0.5';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetColumnId) => {
        e.preventDefault();
        const draggedItem = draggedItemRef.current;

        if (!draggedItem || draggedItem.status === targetColumnId) {
            return;
        }

        // Optimistic update
        dispatch(optimisticMoveTicket({
            ticketId: draggedItem._id,
            newStatus: targetColumnId,
            newPosition: 0
        }));

        try {
            await dispatch(updateTicket({
                id: draggedItem._id,
                updatedData: { ...draggedItem, status: targetColumnId }
            }));

            scheduleAutoSave();
        } catch (err) {
            console.error('Failed to move ticket:', err);
            // Revert optimistic update on error
            dispatch(fetchTickets());
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await dispatch(fetchTickets());
        setIsRefreshing(false);
    };

    const navigation = [
        { id: 'board', label: 'Board', icon: Kanban, shortcut: 'B' },
        { id: 'backlog', label: 'Backlog', icon: FileText, shortcut: 'L' },
        { id: 'timeline', label: 'Timeline', icon: Calendar, shortcut: 'T' },
        { id: 'reports', label: 'Reports', icon: BarChart3, shortcut: 'R' }
    ];

    const sortOptions = [
        { field: 'createdAt', label: 'Created Date' },
        { field: 'updatedAt', label: 'Updated Date' },
        { field: 'priority', label: 'Priority' },
        { field: 'title', label: 'Title' },
        { field: 'assignee', label: 'Assignee' },
        { field: 'dueDate', label: 'Due Date' },
        { field: 'storyPoints', label: 'Story Points' }
    ];

    const groupOptions = [
        { value: null, label: 'None' },
        { value: 'assignee', label: 'Assignee' },
        { value: 'priority', label: 'Priority' },
        { value: 'type', label: 'Type' },
        { value: 'reporter', label: 'Reporter' }
    ];

    const getTypeIcon = (type) => {
        const icons = {
            story: Bookmark,
            task: CheckCircle,
            bug: Bug,
            epic: Zap,
            subtask: Target
        };
        const Icon = icons[type] || Target;
        return <Icon className="w-3 h-3" />;
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            'to-do': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
            'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'code-review': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'testing': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            'done': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'blocked': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        return colors[status] || colors['to-do'];
    };

    const getPriorityIcon = (priority) => {
        const configs = {
            highest: { icon: ArrowUp, color: 'text-red-500' },
            high: { icon: ArrowUp, color: 'text-orange-500' },
            medium: { icon: Minus, color: 'text-yellow-500' },
            low: { icon: ArrowDown, color: 'text-green-500' },
            lowest: { icon: ArrowDown, color: 'text-blue-500' }
        };

        const config = configs[priority] || configs.medium;
        const Icon = config.icon;
        return <Icon className={`w-3 h-3 ${config.color}`} />;
    };
    console.log('viewMode', viewMode)

    const KanbanBoard = () => (
        <div className="flex-1 overflow-hidden">
            <BoardHeader
                setIsRefreshing={setIsRefreshing}
                isRefreshing={isRefreshing}
            />
            <div className="h-full overflow-x-auto">
                <div className="flex gap-4 h-full min-w-max p-6">
                    {viewMode !== "list" ? (
                        <>
                            {Object.values(memoizedColumns).map((column) => (
                                <Column
                                    key={column.id}
                                    column={column}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onDragStart={handleDragStart}
                                    onCardClick={openTaskDrawer}
                                    onCreateIssue={handleCreateIssue}
                                    selectedItems={selectedItems}
                                    onSelectItem={(itemId) => dispatch(toggleSelectItem(itemId))}
                                    isDragTarget={draggedOverColumnRef.current === column.id}
                                />
                            ))}

                            <div className="flex-shrink-0 w-80 p-4">
                                <button
                                    className="w-full border-2 border-dashed border-gray-300 
                       dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 
                       hover:border-blue-300 dark:hover:border-blue-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-all duration-200 flex p-3 
                       items-center justify-center gap-2"
                                >
                                    <Plus className="w-8 h-8" />
                                    <span className="text-sm font-medium">Add Column</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <ListView />
                    )}
                </div>
            </div>

        </div>
    );

    const ListView = () => (
        <div className="flex-1 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* List header */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-4">
                        <input
                            type="checkbox"
                            checked={selectedItems.length === filteredTickets.length && filteredTickets.length > 0}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    dispatch(selectAllVisible());
                                } else {
                                    dispatch(clearSelection());
                                }
                            }}
                            className="rounded border-gray-300"
                        />
                        <div className="grid grid-cols-12 gap-4 flex-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            <div className="col-span-4">Issue</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Assignee</div>
                            <div className="col-span-1">Priority</div>
                            <div className="col-span-1">Points</div>
                        </div>
                    </div>
                </div>

                {/* List content */}
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {filteredTickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className={`
                                border-b border-gray-100 dark:border-gray-700 p-4 hover:bg-gray-50 
                                dark:hover:bg-gray-700/50 transition-colors cursor-pointer
                                ${selectedItems.includes(ticket._id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                            `}
                            onClick={() => openTaskDrawer(ticket)}
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(ticket._id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        dispatch(toggleSelectItem(ticket._id));
                                    }}
                                    className="rounded border-gray-300"
                                />

                                <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {ticket.title}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                                            {getTypeIcon(ticket.type)}
                                            {ticket.type}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        <span className={`
                                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                            ${getStatusBadgeColor(ticket.status)}
                                        `}>
                                            {ticket.status.replace('-', ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        {ticket.assignee ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                                    {ticket.assignee.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                                    {ticket.assignee}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Unassigned</span>
                                        )}
                                    </div>

                                    <div className="col-span-1">
                                        {getPriorityIcon(ticket.priority)}
                                    </div>

                                    <div className="col-span-1">
                                        {ticket.storyPoints || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'board':
                return <KanbanBoard />;
            case 'backlog':
                return <BacklogView />;
            case 'timeline':
                return <TimelineView />;
            case 'reports':
                return <ReportsView />;
            default:
                return <KanbanBoard />;
        }
    };

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'k':
                        e.preventDefault();
                        document.getElementById('search-input')?.focus();
                        break;
                    case 'n':
                        e.preventDefault();
                        handleCreateIssue();
                        break;
                    case 'a':
                        if (filteredTickets.length > 0) {
                            e.preventDefault();
                            dispatch(selectAllVisible());
                        }
                        break;
                    case 'r':
                        e.preventDefault();
                        handleRefresh();
                        break;
                }
            }

            if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey) {
                if (document.activeElement?.tagName !== 'INPUT') {
                    setActiveTab('board');
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [filteredTickets.length, dispatch, handleRefresh]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
                <div className="flex items-center justify-between">
                    <nav className="flex space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`
                                        flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium 
                                        transition-colors relative group
                                        ${activeTab === item.id
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
                                        }
                                    `}
                                    title={`${item.label} (${item.shortcut})`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}

                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                                   bg-gray-800 text-white text-xs px-2 py-1 rounded 
                                                   opacity-0 group-hover:opacity-100 transition-opacity
                                                   pointer-events-none">
                                        {item.shortcut}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Enhanced toolbar */}
                    <div className="flex items-center gap-2">
                        {/* <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                id="search-input"
                                type="text"
                                placeholder="Search tickets... (Ctrl+K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                         bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 
                                         focus:border-transparent w-64"
                            />
                        </div> */}

                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`
                                flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors
                                ${showAdvancedFilters
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {Object.values(filters).some(f => f && f.length > 0) && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                        </button>

                        <div className="relative">
                            <select
                                value={`${sortBy.field}-${sortBy.direction}`}
                                onChange={(e) => {
                                    const [field, direction] = e.target.value.split('-');
                                    dispatch(setSortBy({ field, direction }));
                                }}
                                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 
                                         dark:border-gray-600 rounded px-3 py-2 text-sm pr-8"
                            >
                                {sortOptions.map(option => (
                                    <React.Fragment key={option.field}>
                                        <option value={`${option.field}-asc`}>{option.label} ↑</option>
                                        <option value={`${option.field}-desc`}>{option.label} ↓</option>
                                    </React.Fragment>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={groupBy || ''}
                                onChange={(e) => dispatch(setGroupBy(e.target.value || null))}
                                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 
                                         dark:border-gray-600 rounded px-3 py-2 text-sm pr-8"
                            >
                                {groupOptions.map(option => (
                                    <option key={option.value || 'none'} value={option.value || ''}>
                                        Group by: {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => handleCreateIssue()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                                     text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Create
                        </button>
                    </div>
                </div>
            </div>

            {showAdvancedFilters && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[420px] max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-5">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Advanced Filters
                            </h3>
                            <button
                                onClick={() => setShowAdvancedFilters(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Priority
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["highest", "high", "medium", "low", "lowest"].map((priority) => (
                                        <label
                                            key={priority}
                                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.priority.includes(priority)}
                                                onChange={(e) => {
                                                    const newPriorities = e.target.checked
                                                        ? [...filters.priority, priority]
                                                        : filters.priority.filter((p) => p !== priority);
                                                    dispatch(setFilters({ priority: newPriorities }));
                                                }}
                                                className="text-blue-600 focus:ring-blue-500 rounded-md border-gray-300 dark:border-gray-600"
                                            />
                                            <span className="text-sm capitalize text-gray-800 dark:text-gray-200">
                                                {priority}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Type
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["story", "task", "bug", "epic"].map((type) => (
                                        <label
                                            key={type}
                                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.type.includes(type)}
                                                onChange={(e) => {
                                                    const newTypes = e.target.checked
                                                        ? [...filters.type, type]
                                                        : filters.type.filter((t) => t !== type);
                                                    dispatch(setFilters({ type: newTypes }));
                                                }}
                                                className="text-blue-600 focus:ring-blue-500 rounded-md border-gray-300 dark:border-gray-600"
                                            />
                                            <span className="text-sm capitalize text-gray-800 dark:text-gray-200">
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900 rounded-b-2xl">
                            <button
                                onClick={() => dispatch(clearFilters())}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowAdvancedFilters(false)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {renderContent()}

            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateIssue={addNewIssue}
                defaultColumn={createModalColumn}
                isCreating={creating}
            />

            <AIChatbot />
            <TaskDrawer task={selectedTask} onClose={closeTaskDrawer} />

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Loading tickets...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;