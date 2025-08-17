import React, { useRef, useState } from 'react';
import { Kanban, FileText, Calendar, BarChart3, Filter, Users, ChevronDown, Plus } from 'lucide-react';
import BacklogView from '../components/BacklogView';
import TimelineView from '../components/TimelineView';
import ReportsView from '../components/ReportsView';
import Column from '../components/Column';
import AIChatbot from '../components/AiChatBot';
import TaskDrawer from '../components/TaskDrawer';
import CreateTaskModal from '../components/modals/CreateTask';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('board');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createModalColumn, setCreateModalColumn] = useState('to-do');
    const draggedItemRef = useRef(null);
    const [columns, setColumns] = useState({
        'to-do': {
            id: 'to-do',
            title: 'TO DO',
            color: '#DFE1E6',
            items: [
                {
                    id: 'PROJ-101',
                    title: 'Setup Slack Integration',
                    description: 'Configure Slack webhook for notifications',
                    priority: 'highest',
                    type: 'story',
                    assignee: 'John Doe',
                    reporter: 'Jane Smith',
                    dueDate: '2025-07-28',
                    tags: ['integration', 'slack'],
                    status: 'to-do',
                    storyPoints: 5,
                    comments: 2
                },
                {
                    id: 'PROJ-102',
                    title: 'Database Migration Script',
                    description: 'Migrate user data to new schema',
                    priority: 'high',
                    type: 'task',
                    assignee: 'Jane Smith',
                    reporter: 'John Doe',
                    dueDate: '2025-07-30',
                    tags: ['database', 'migration'],
                    status: 'to-do',
                    storyPoints: 8,
                    comments: 0
                }
            ]
        },
        'in-progress': {
            id: 'in-progress',
            title: 'IN PROGRESS',
            color: '#0052CC',
            items: [
                {
                    id: 'PROJ-103',
                    title: 'API Rate Limiting Implementation',
                    description: 'Implement rate limiting for external APIs to prevent abuse',
                    priority: 'highest',
                    type: 'bug',
                    assignee: 'Mike Johnson',
                    reporter: 'Alice Cooper',
                    dueDate: '2025-07-26',
                    tags: ['api', 'security'],
                    status: 'in-progress',
                    storyPoints: 13,
                    comments: 5
                },
                {
                    id: 'PROJ-104',
                    title: 'Email Automation Flow',
                    description: 'Create automated email sequences for user onboarding',
                    priority: 'medium',
                    type: 'story',
                    assignee: 'Sarah Wilson',
                    reporter: 'David Brown',
                    dueDate: '2025-07-29',
                    tags: ['email', 'automation'],
                    status: 'in-progress',
                    storyPoints: 3,
                    comments: 1
                }
            ]
        },
        'code-review': {
            id: 'code-review',
            title: 'CODE REVIEW',
            color: '#FFAB00',
            items: [
                {
                    id: 'PROJ-105',
                    title: 'Security Audit Implementation',
                    description: 'Review and implement security best practices',
                    priority: 'highest',
                    type: 'epic',
                    assignee: 'David Brown',
                    reporter: 'Admin User',
                    dueDate: '2025-07-27',
                    tags: ['security', 'audit'],
                    status: 'code-review',
                    storyPoints: 21,
                    comments: 8
                }
            ]
        },
        'done': {
            id: 'done',
            title: 'DONE',
            color: '#36B37E',
            items: [
                {
                    id: 'PROJ-106',
                    title: 'User Authentication System',
                    description: 'Implement OAuth 2.0 authentication with multiple providers',
                    priority: 'highest',
                    type: 'story',
                    assignee: 'Alice Cooper',
                    reporter: 'John Doe',
                    dueDate: '2025-07-25',
                    tags: ['auth', 'security'],
                    status: 'done',
                    storyPoints: 8,
                    comments: 12
                },
                {
                    id: 'PROJ-107',
                    title: 'Dashboard Analytics Integration',
                    description: 'Add comprehensive analytics tracking to dashboard',
                    priority: 'low',
                    type: 'task',
                    assignee: 'Bob Miller',
                    reporter: 'Sarah Wilson',
                    dueDate: '2025-07-24',
                    tags: ['analytics', 'tracking'],
                    status: 'done',
                    storyPoints: 2,
                    comments: 3
                }
            ]
        }
    });

    const openTaskDrawer = (task) => setSelectedTask(task);
    const closeTaskDrawer = () => setSelectedTask(null);

    const handleCreateIssue = (columnId = 'to-do') => {
        setCreateModalColumn(columnId);
        setShowCreateModal(true);
    };

    const addNewIssue = (newIssue) => {
        setColumns(prevColumns => ({
            ...prevColumns,
            [newIssue.status]: {
                ...prevColumns[newIssue.status],
                items: [...prevColumns[newIssue.status].items, newIssue]
            }
        }));
    };

    const handleDragStart = (e, item) => {
        draggedItemRef.current = item;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetColumnId) => {
        e.preventDefault();
        const draggedItem = draggedItemRef.current;
        if (!draggedItem) return;

        const sourceColumnId = draggedItem.status;
        if (sourceColumnId === targetColumnId) return;

        setColumns(prevColumns => {
            const newColumns = { ...prevColumns };
            newColumns[sourceColumnId] = {
                ...newColumns[sourceColumnId],
                items: newColumns[sourceColumnId].items.filter(i => i.id !== draggedItem.id)
            };
            newColumns[targetColumnId] = {
                ...newColumns[targetColumnId],
                items: [...newColumns[targetColumnId].items, { ...draggedItem, status: targetColumnId }]
            };
            return newColumns;
        });

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
                    {/* Filters */}
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

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {renderContent()}
            </div>

            {/* Create Issue Modal */}
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

