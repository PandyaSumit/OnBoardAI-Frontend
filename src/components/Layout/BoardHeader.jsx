import React from 'react'
import { clearSelection, fetchTickets, setViewMode } from '../../store/slices/ticketSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Layout, List, RefreshCw } from 'lucide-react';

const BoardHeader = (setIsRefreshing, isRefreshing) => {


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


    const handleBulkAction = async (action) => {
        if (selectedItems.length === 0) return;

        switch (action) {
            case 'delete':
                // Implement bulk delete
                break;
            case 'assign':
                // Implement bulk assign
                break;
            case 'move':
                // Implement bulk move
                break;
            case 'archive':
                // Implement bulk archive
                break;
        }

        dispatch(clearSelection());
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await dispatch(fetchTickets());
        setIsRefreshing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
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

            {selectedItems.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {selectedItems.length} ticket{selectedItems.length !== 1 ? 's' : ''} selected
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkAction('assign')}
                                className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 
                                             dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Assign
                            </button>
                            <button
                                onClick={() => handleBulkAction('move')}
                                className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 
                                             dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Move
                            </button>
                            <button
                                onClick={() => handleBulkAction('archive')}
                                className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 
                                             dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Archive
                            </button>
                            <button
                                onClick={() => dispatch(clearSelection())}
                                className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BoardHeader