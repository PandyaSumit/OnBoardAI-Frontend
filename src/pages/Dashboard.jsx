import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    Filter, ChevronDown, Plus, RefreshCw,
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
    optimisticMoveTicket,
    addActivity
} from '../store/slices/ticketSlice';

// Import components
import BacklogView from '../components/views/BacklogView';
import TimelineView from '../components/views/TimelineView';
import ReportsView from '../components/views/ReportsView';
import Column from '../components/Column';
import AIChatbot from '../components/AiChatBot';
import TaskDrawer from '../components/TaskDrawer';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import BoardHeader from '../components/Layout/BoardHeader';

// Import constants
import { navigation, sortOptions, groupOptions } from '../constants/constants';
import ListView from '../components/views/ListView';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('board');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createModalColumn, setCreateModalColumn] = useState('to-do');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
    } = useSelector((state) => state.tickets);

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

        dispatch(optimisticMoveTicket({
            ticketId: draggedItem._id,
            newStatus: targetColumnId,
            newPosition: 0
        }));

        try {
            dispatch(updateTicket({
                id: draggedItem._id,
                updatedData: { ...draggedItem, status: targetColumnId }
            }));
            scheduleAutoSave();
        } catch (err) {
            console.error('Failed to move ticket:', err);
            dispatch(fetchTickets());
        }
    };

    // const handleRefresh = async () => {
    //     setIsRefreshing(true);
    //     await dispatch(fetchTickets());
    //     setIsRefreshing(false);
    // };

    const KanbanBoard = () => (
        <div className="flex-1 overflow-hidden">
            <BoardHeader
                selectedTask={selectedTask}
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
                        <ListView
                            selectedItems={selectedItems}
                            filteredTickets={filteredTickets}
                            openTaskDrawer={openTaskDrawer}
                            toggleSelectItem={toggleSelectItem}
                        />
                    )}
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
        if (!filteredTickets.length) {
            dispatch(fetchTickets());
        }
    }, [dispatch, filteredTickets.length]);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

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

                    <div className="flex items-center gap-2">
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