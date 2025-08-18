import React, { useEffect, useRef, useState } from 'react';
import { Kanban, FileText, Calendar, BarChart3, Filter, Users, ChevronDown, Plus } from 'lucide-react';
import BacklogView from '../components/BacklogView';
import TimelineView from '../components/TimelineView';
import ReportsView from '../components/ReportsView';
import Column from '../components/Column';
import AIChatbot from '../components/AiChatBot';
import TaskDrawer from '../components/TaskDrawer';
import CreateTaskModal from '../components/modals/CreateTask';
import { useDispatch, useSelector } from 'react-redux';
import { createTicketThunk, fetchTickets, updateTicketThunk } from '../store/slices/ticketSlice';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('board');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createModalColumn, setCreateModalColumn] = useState('to-do');
    const draggedItemRef = useRef(null);
    const [columns, setColumns] = useState({});

    const dispatch = useDispatch();
    const { tickets } = useSelector((state) => state.tickets);

    const openTaskDrawer = (task) => setSelectedTask(task);
    const closeTaskDrawer = () => setSelectedTask(null);

    const handleCreateIssue = (columnId = 'to-do') => {
        setCreateModalColumn(columnId);
        setShowCreateModal(true);
    };

    const addNewIssue = async (newIssue) => {
        console.log('newIssue: ', newIssue);
        try {
            const resultAction = await dispatch(createTicketThunk(newIssue));
            console.log('resultAction: ', resultAction);
            if (createTicketThunk.fulfilled.match(resultAction)) {
                console.log("calling1")

                const ticket = resultAction.payload;
                console.log('ticket: ', ticket);
                setColumns((prev) => ({
                    ...prev,
                    [ticket.status]: {
                        ...prev[ticket.status],
                        items: prev[ticket.status]?.items ? [...prev[ticket.status].items, ticket] : [ticket],
                    },
                }));
            }

            console.log("calling2")
        } catch (err) {
            console.error('Failed to create issue:', err);
        }
    };

    const handleDragStart = (e, item) => {
        draggedItemRef.current = item;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetColumnId) => {
        e.preventDefault();
        const draggedItem = draggedItemRef.current;
        console.log('draggedItem: ', draggedItem);
        if (!draggedItem) return;

        const sourceColumnId = draggedItem.status;
        console.log('   : ', sourceColumnId);
        if (sourceColumnId === targetColumnId) return;

        const updatedTicket = { ...draggedItem, status: targetColumnId };

        setColumns(prev => {
            const newCols = { ...prev };

            const sourceColumn = { ...newCols[sourceColumnId], items: [...newCols[sourceColumnId].items] };
            const targetColumn = { ...newCols[targetColumnId], items: [...newCols[targetColumnId].items] };

            sourceColumn.items = sourceColumn.items.filter(i => i._id !== draggedItem._id);

            targetColumn.items.push(updatedTicket);

            newCols[sourceColumnId] = sourceColumn;
            newCols[targetColumnId] = targetColumn;

            return newCols;
        });

        try {
            await dispatch(updateTicketThunk({ id: draggedItem._id, updatedData: updatedTicket }));
        } catch (err) {
            console.error('Failed to move ticket:', err);
        }

        draggedItemRef.current = null;
    };


    const navigation = [
        { id: 'board', label: 'Board', icon: Kanban },
        { id: 'backlog', label: 'Backlog', icon: FileText },
        { id: 'timeline', label: 'Timeline', icon: Calendar },
        { id: 'reports', label: 'Reports', icon: BarChart3 }
    ];

    const KanbanBoard = () => (
        <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-x-auto">
                <div className="flex gap-4 h-full min-w-max p-6">
                    {Object.values(columns).map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragStart={handleDragStart}
                            onCardClick={openTaskDrawer}
                            onCreateIssue={handleCreateIssue}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'board': return <KanbanBoard />;
            case 'backlog': return <BacklogView />;
            case 'timeline': return <TimelineView />;
            case 'reports': return <ReportsView />;
            default: return <KanbanBoard />;
        }
    };

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    useEffect(() => {
        if (tickets.length) {
            setColumns(prev => {
                const colMap = { ...prev }; // keep existing column structure
                tickets.forEach(ticket => {
                    if (!ticket.settings || !ticket.settings.columns) return;
                    ticket.settings.columns.forEach(col => {
                        if (!colMap[col.id]) colMap[col.id] = { ...col, items: [] };
                    });
                    // Remove ticket from any column it's in
                    Object.values(colMap).forEach(c => {
                        c.items = c.items.filter(i => i._id !== ticket._id);
                    });
                    // Add ticket to its current column
                    if (colMap[ticket.status]) colMap[ticket.status].items.push(ticket);
                });
                return colMap;
            });
        }
    }, [tickets]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 overflow-x-auto scrollbar-hide">
                <div className="flex items-center justify-between">
                    <nav className="flex space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${activeTab === item.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                            <Users className="w-4 h-4" />
                            Group by: None
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleCreateIssue()}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Create
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                {renderContent()}
            </div>

            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateIssue={addNewIssue}
                defaultColumn={createModalColumn}
            />

            <AIChatbot />
            <TaskDrawer task={selectedTask} onClose={closeTaskDrawer} />
        </div>
    );
};

export default Dashboard;

