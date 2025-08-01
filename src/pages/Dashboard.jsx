import React, { useState } from 'react';
import {
    Calendar,
    Table,
    FileText,
    Kanban,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    Tag,
    Bell,
    Settings,
    ChevronDown,
    BarChart3,
    Users,
    Activity,
    Star,
    Bookmark,
    ArrowUp,
    ArrowDown,
    Minus,
    Bug,
    Zap,
    Target,
    MessageSquare,
    Link,
    Eye,
    Sun,
    Moon
} from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('board');
    const [draggedItem, setDraggedItem] = useState(null);
    // const [selectedProject, setSelectedProject] = useState('PROJ-1');
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

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetColumnId) => {
        e.preventDefault();
        if (!draggedItem) return;

        const sourceColumnId = draggedItem.status;
        if (sourceColumnId === targetColumnId) {
            setDraggedItem(null);
            return;
        }

        setColumns(prevColumns => {
            const newColumns = { ...prevColumns };
            newColumns[sourceColumnId] = {
                ...newColumns[sourceColumnId],
                items: newColumns[sourceColumnId].items.filter(item => item.id !== draggedItem.id)
            };
            const updatedItem = { ...draggedItem, status: targetColumnId };
            newColumns[targetColumnId] = {
                ...newColumns[targetColumnId],
                items: [...newColumns[targetColumnId].items, updatedItem]
            };
            return newColumns;
        });
        setDraggedItem(null);
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'highest': return <ArrowUp className="w-3 h-3 text-red-500" />;
            case 'high': return <ArrowUp className="w-3 h-3 text-orange-500" />;
            case 'medium': return <Minus className="w-3 h-3 text-yellow-500" />;
            case 'low': return <ArrowDown className="w-3 h-3 text-green-500" />;
            case 'lowest': return <ArrowDown className="w-3 h-3 text-blue-500" />;
            default: return <Minus className="w-3 h-3 text-gray-500" />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'story': return <Bookmark className="w-3.5 h-3.5 text-green-500" />;
            case 'task': return <CheckCircle className="w-3.5 h-3.5 text-blue-500" />;
            case 'bug': return <Bug className="w-3.5 h-3.5 text-red-500" />;
            case 'epic': return <Zap className="w-3.5 h-3.5 text-purple-500" />;
            default: return <Target className="w-3.5 h-3.5 text-gray-500" />;
        }
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
                        <div
                            key={column.id}
                            className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            {/* Column Header */}
                            <div className="p-4 pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        {column.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                            <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    {column.items.length} issue{column.items.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Column Content */}
                            <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]">
                                {column.items.map((item) => (
                                    <div
                                        key={item.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item)}
                                        className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-3 hover:shadow-md dark:hover:bg-gray-600 transition-all cursor-move group"
                                    >
                                        {/* Issue Title */}
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight flex-1">
                                                {item.title}
                                            </h4>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                                                    <MoreHorizontal className="w-3 h-3 text-gray-400" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Issue Key */}
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
                                            {item.id}
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        {item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {item.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs px-2 py-0.5 rounded font-medium"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {item.tags.length > 2 && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                                                        +{item.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {/* Priority */}
                                                <div className="flex items-center gap-1">
                                                    {getPriorityIcon(item.priority)}
                                                </div>

                                                {/* Story Points */}
                                                {item.storyPoints && (
                                                    <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs px-1.5 py-0.5 rounded font-medium">
                                                        {item.storyPoints}
                                                    </div>
                                                )}

                                                {/* Comments */}
                                                {item.comments > 0 && (
                                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                        <MessageSquare className="w-3 h-3" />
                                                        <span className="text-xs">{item.comments}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Assignee Avatar */}
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                {item.assignee.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Create Issue Button */}
                                <button className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm">
                                    + Create issue
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const BacklogView = () => (
        <div className="flex-1 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Backlog</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Plan and prioritize your team's work</p>
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Backlog Management</h4>
                        <p className="text-gray-600 dark:text-gray-400">Organize and prioritize your product backlog items</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const TimelineView = () => (
        <div className="flex-1 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Timeline</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track work across time with your team</p>
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Project Timeline</h4>
                        <p className="text-gray-600 dark:text-gray-400">Visualize your project schedule and dependencies</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const ReportsView = () => (
        <div className="flex-1 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reports</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your team's performance and progress</p>
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Analytics & Reports</h4>
                        <p className="text-gray-600 dark:text-gray-400">Get insights into your team's velocity and progress</p>
                    </div>
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
            {/* Secondary Navigation */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
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

                    {/* View Options */}
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
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium">
                            <Plus className="w-4 h-4" />
                            Create
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {renderContent()}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;