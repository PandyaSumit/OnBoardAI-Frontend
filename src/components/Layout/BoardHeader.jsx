import React from 'react'
import { fetchTickets, setViewMode } from '../../store/slices/ticketSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Layout, List, RefreshCw } from 'lucide-react';

const BoardHeader = ({ setIsRefreshing, isRefreshing, selectedTask }) => {

    const dispatch = useDispatch();
    const {
        tickets,
        error,
        viewMode,
        selectedItems,
    } = useSelector((state) => state.tickets);

    const viewModes = [
        { id: 'kanban', icon: Layout, label: 'Kanban' },
        { id: 'list', icon: List, label: 'List' },
        { id: 'grid', icon: Grid, label: 'Grid' }
    ];

    const handleRefresh = async () => {
        console.log("first")
        setIsRefreshing(true);
        await dispatch(fetchTickets());
        setIsRefreshing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
            style={{
                width: selectedTask
                    ? "calc(100% - 41%)"
                    : "100%",
            }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Project Board
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{tickets.length} total tickets</span>
                        <span>{selectedItems.length} selected</span>
                        {error && <span className="text-red-500">⚠ {error}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-600">
                        {viewModes.map((mode) => {
                            const Icon = mode.icon;
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => dispatch(setViewMode(mode.id))}
                                    className={`p-2 transition-colors ${viewMode === mode.id
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    title={mode.label}
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 
                                     rounded transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BoardHeader