import { ArrowDown, ArrowUp, Bookmark, Bug, CheckCircle, Minus, Target, Zap } from 'lucide-react';
import React from 'react'
import { useDispatch } from 'react-redux';

const ListView = ({ selectedItems, filteredTickets, openTaskDrawer, toggleSelectItem }) => {

    const dispatch = useDispatch()

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

    return (
        <div className="flex-1 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-4">
                        {/* <input
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
                        /> */}
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
    )
}

export default ListView