import React, { useState } from 'react';
import { Bookmark, CheckCircle, Bug, Zap, X, Flag, User, Tag } from 'lucide-react';

// Mock components that would normally be imported
// const BacklogView = () => <div className="p-6">Backlog View - Coming Soon</div>;
// const TimelineView = () => <div className="p-6">Timeline View - Coming Soon</div>;
// const ReportsView = () => <div className="p-6">Reports View - Coming Soon</div>;
// const AIChatbot = () => null;
// const TaskDrawer = ({ task, onClose }) => null;

// Create Issue Modal Component
const CreateTaskModal = ({ isOpen, onClose, onCreateIssue, defaultColumn = 'to-do' }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'story',
        priority: 'medium',
        assignee: '',
        reporter: 'Current User',
        dueDate: '',
        tags: '',
        storyPoints: '',
        status: defaultColumn
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const issueTypes = [
        // { id: 'story', label: 'Story', icon: Bookmark, color: 'text-green-500' },
        { id: 'task', label: 'Task', icon: CheckCircle, color: 'text-blue-500' },
        { id: 'bug', label: 'Bug', icon: Bug, color: 'text-red-500' },
        // { id: 'epic', label: 'Epic', icon: Zap, color: 'text-purple-500' }
    ];

    const priorities = [
        { id: 'highest', label: 'Highest', color: 'text-red-500' },
        { id: 'high', label: 'High', color: 'text-orange-500' },
        { id: 'medium', label: 'Medium', color: 'text-yellow-500' },
        { id: 'low', label: 'Low', color: 'text-green-500' },
        { id: 'lowest', label: 'Lowest', color: 'text-blue-500' }
    ];

    const assignees = [
        'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson',
        'David Brown', 'Alice Cooper', 'Bob Miller'
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.assignee) newErrors.assignee = 'Assignee is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const newIssue = {
            id: `PROJ-${Math.floor(Math.random() * 1000) + 100}`,
            title: formData.title,
            description: formData.description,
            type: formData.type,
            priority: formData.priority,
            assignee: formData.assignee,
            reporter: formData.reporter,
            dueDate: formData.dueDate,
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
            status: formData.status,
            storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : null,
            comments: []
        };

        onCreateIssue(newIssue);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            title: '', description: '', type: 'story', priority: 'medium',
            assignee: '', reporter: 'Current User', dueDate: '', tags: '',
            storyPoints: '', status: defaultColumn
        });
        setErrors({});
        onClose();
    };

    const selectedPriority = priorities.find(priority => priority.id === formData.priority);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create Issue</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Type *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {issueTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleInputChange('type', type.id)}
                                        className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${formData.type === type.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${type.color}`} />
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter a brief summary of the issue"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Provide more details about this issue"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                            <div className="relative">
                                <select
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 appearance-none"
                                >
                                    {priorities.map((priority) => (
                                        <option key={priority.id} value={priority.id}>{priority.label}</option>
                                    ))}
                                </select>
                                <Flag className={`absolute right-3 top-3 w-4 h-4 pointer-events-none ${selectedPriority?.color || 'text-gray-400'}`} />
                            </div>
                        </div>

                        {/* Assignee */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignee *</label>
                            <div className="relative">
                                <select
                                    value={formData.assignee}
                                    onChange={(e) => handleInputChange('assignee', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 appearance-none ${errors.assignee ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                >
                                    <option value="">Select assignee</option>
                                    {assignees.map((assignee) => (
                                        <option key={assignee} value={assignee}>{assignee}</option>
                                    ))}
                                </select>
                                <User className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.assignee && <p className="mt-1 text-sm text-red-500">{errors.assignee}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>

                        {/* Story Points */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Story Points</label>
                            <input
                                type="number"
                                value={formData.storyPoints}
                                onChange={(e) => handleInputChange('storyPoints', e.target.value)}
                                placeholder="e.g., 1, 2, 3, 5, 8"
                                min="1"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div> */}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => handleInputChange('tags', e.target.value)}
                                placeholder="Enter tags separated by commas (e.g., frontend, api, urgent)"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                            />
                            <Tag className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Create Issue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;