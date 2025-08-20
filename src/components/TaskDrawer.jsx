import React, { useState, useEffect } from 'react';
import {
    X, Edit2, MessageSquare, Calendar, User, Flag, Tag, Clock,
    MoreHorizontal, Share2, Copy, Trash2, Archive, Paperclip,
    ArrowUp, ArrowDown, Minus, CheckCircle2, Circle, AlertTriangle,
    Plus, Send, Eye, UserPlus, Bell
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../store/slices/ticketSlice';

const TaskDrawer = ({ task, onClose, onUpdateTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task || {});
    const [activeTab, setActiveTab] = useState('overview');
    const [comment, setComment] = useState("");

    const dispatch = useDispatch();
    const { comments } = useSelector((state) => state.tickets);
    console.log('comments: ', comments);

    useEffect(() => {
        if (task) {
            setEditedTask(task);
        }
    }, [task]);

    const handleAddComment = () => {
        if (!comment.trim()) return;

        dispatch(addComment({
            ticketId: editedTask._id,
            content: comment,
            author: editedTask.reporter,
            attachments: []
        }))
            .unwrap()
            .then(() => setComment(""))
            .catch((err) => console.error("Failed to add comment:", err));
    };


    if (!task) return null;

    const priorityConfig = {
        highest: {
            color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400',
            icon: ArrowUp,
            label: 'Highest',
            dotColor: 'bg-red-500'
        },
        high: {
            color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400',
            icon: ArrowUp,
            label: 'High',
            dotColor: 'bg-orange-500'
        },
        medium: {
            color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400',
            icon: Minus,
            label: 'Medium',
            dotColor: 'bg-yellow-500'
        },
        low: {
            color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400',
            icon: ArrowDown,
            label: 'Low',
            dotColor: 'bg-green-500'
        },
        lowest: {
            color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400',
            icon: ArrowDown,
            label: 'Lowest',
            dotColor: 'bg-blue-500'
        }
    };

    const typeConfig = {
        story: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400', label: 'Story', icon: '📖' },
        task: { color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400', label: 'Task', icon: '✅' },
        bug: { color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400', label: 'Bug', icon: '🐛' },
        epic: { color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-400', label: 'Epic', icon: '🎯' }
    };

    const statusConfig = {
        'to-do': { color: 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400', label: 'To Do' },
        'in-progress': { color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400', label: 'In Progress' },
        'code-review': { color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400', label: 'Code Review' },
        'done': { color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400', label: 'Done' }
    };

    const handleSave = () => {
        if (onUpdateTask) {
            onUpdateTask(editedTask);
        }
        setIsEditing(false);
    };

    const PriorityIcon = priorityConfig[task.priority]?.icon || Minus;
    const priorityStyle = priorityConfig[task.priority] || priorityConfig.medium;
    const typeStyle = typeConfig[task.type] || typeConfig.task;
    const statusStyle = statusConfig[task.status] || statusConfig['to-do'];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'subtasks', label: 'Subtasks' },
        { id: 'activity', label: 'Activity' }
    ];

    return (
        <>
            <div
                className="fixed inset-0 transition-all duration-200 z-40"
                onClick={onClose}
            />
            <div
                className="fixed right-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col"
                style={{
                    top: '103px',
                    bottom: '0',
                    height: 'calc(100vh - 103px)'
                }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b space-y-0.5 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${typeStyle.color}`}>
                            <span className="mr-1.5">{typeConfig[task.type]?.icon}</span>
                            {typeConfig[task.type]?.label || task.type}
                        </div>
                        <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 select-all">{task.id}</span>
                            <div className={`w-2 h-2 rounded-full ${priorityStyle.dotColor}`} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-4">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                            <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                            <UserPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                            <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {activeTab === 'overview' && (
                        <div className="p-6 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedTask.title}
                                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                            className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none flex-1 pb-2 mr-4"
                                            autoFocus
                                        />
                                    ) : (
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-tight flex-1 mr-4">
                                            {task.title}
                                        </h1>
                                    )}
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex-shrink-0"
                                    >
                                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>

                                {isEditing && (
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Save changes
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                    Description
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        value={editedTask.description}
                                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        rows="4"
                                        placeholder="Add a description..."
                                    />
                                ) : (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                            {task.description || 'No description provided.'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                        Status
                                    </label>
                                    <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${statusStyle.color}`}>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        {statusStyle.label}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                        Priority
                                    </label>
                                    <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${priorityStyle.color}`}>
                                        <PriorityIcon className="w-4 h-4 mr-2" />
                                        {priorityStyle.label}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                        Assignee
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                            {task.assignee?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">{task.assignee || 'Unassigned'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                        Reporter
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                            {task.reporter?.charAt(0) || 'R'}
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">{task.reporter || 'Unknown'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                        Due Date
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{task.dueDate || 'Not set'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                        Story Points
                                    </label>
                                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{task.storyPoints || '?'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {task.tags && task.tags.length > 0 ? (
                                        task.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                                            >
                                                <Tag className="w-3 h-3 mr-1" />
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">No tags assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Activity ({comments.length})
                                </h3>
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                    View all
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                                        Y
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            rows="3"
                                        />
                                        <div className="flex justify-between items-center">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                                                <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            </button>
                                            <button
                                                onClick={handleAddComment}
                                                disabled={!comment.trim()}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                                            {comment.avatar}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {comment.author}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {comment.createdAt}
                                                </span>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'subtasks' && (
                        <div className="p-6">
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                    <CheckCircle2 className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No subtasks yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Break this task down into smaller, manageable pieces.</p>
                                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add subtask
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TaskDrawer;