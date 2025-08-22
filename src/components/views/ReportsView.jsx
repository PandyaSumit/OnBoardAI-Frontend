import React, { useState, useMemo } from 'react';
import {
    BarChart3, TrendingUp, TrendingDown, Users, Clock, Target,
    CheckCircle, AlertCircle, Calendar, Download, Filter,
    PieChart, Activity, Zap, Bug, Bookmark, ChevronDown
} from 'lucide-react';

const ReportsView = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedTeam, setSelectedTeam] = useState('all');
    const [selectedMetric, setSelectedMetric] = useState('velocity');

    // Sample metrics data
    const metricsData = {
        overview: {
            totalTasks: 156,
            completedTasks: 89,
            inProgress: 34,
            velocity: 23.5,
            burndownRate: 87,
            teamEfficiency: 92
        },
        velocity: [
            { period: 'Week 1', completed: 18, planned: 20 },
            { period: 'Week 2', completed: 22, planned: 25 },
            { period: 'Week 3', completed: 19, planned: 22 },
            { period: 'Week 4', completed: 26, planned: 24 },
            { period: 'Week 5', completed: 21, planned: 23 }
        ],
        taskDistribution: [
            { type: 'Story', count: 45, color: 'bg-blue-500' },
            { type: 'Bug', count: 28, color: 'bg-red-500' },
            { type: 'Task', count: 67, color: 'bg-green-500' },
            { type: 'Epic', count: 16, color: 'bg-purple-500' }
        ],
        teamPerformance: [
            { member: 'Sarah Chen', completed: 23, assigned: 28, efficiency: 82 },
            { member: 'Alex Johnson', completed: 19, assigned: 22, efficiency: 86 },
            { member: 'Emily Rodriguez', completed: 21, assigned: 24, efficiency: 88 },
            { member: 'David Kim', completed: 15, assigned: 18, efficiency: 83 },
            { member: 'Lisa Wang', completed: 18, assigned: 20, efficiency: 90 }
        ],
        priorityBreakdown: [
            { priority: 'Highest', count: 12, percentage: 8 },
            { priority: 'High', count: 34, percentage: 22 },
            { priority: 'Medium', count: 78, percentage: 50 },
            { priority: 'Low', count: 25, percentage: 16 },
            { priority: 'Lowest', count: 7, percentage: 4 }
        ]
    };

    const MetricCard = ({ title, value, change, icon: Icon, trend = 'up' }) => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {change}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    );

    const VelocityChart = () => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sprint Velocity</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        <span>Planned</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {metricsData.velocity.map((week, index) => {
                    const completionRate = (week.completed / week.planned) * 100;
                    return (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-16 text-sm text-gray-600 dark:text-gray-400">{week.period}</div>
                            <div className="flex-1 relative">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                                        <div
                                            className="bg-blue-500 h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                                            style={{ width: `${Math.min(completionRate, 100)}%` }}
                                        >
                                            <span className="text-white text-xs font-medium">
                                                {week.completed}
                                            </span>
                                        </div>
                                        {completionRate > 100 && (
                                            <div className="absolute right-0 top-0 h-6 bg-green-500 rounded-r-full flex items-center px-2">
                                                <span className="text-white text-xs">+{week.completed - week.planned}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 w-12">
                                        /{week.planned}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const TaskDistributionChart = () => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Task Distribution</h3>

            <div className="space-y-4">
                {metricsData.taskDistribution.map((item, index) => {
                    const percentage = (item.count / metricsData.overview.totalTasks) * 100;
                    return (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center gap-2 w-20">
                                {item.type === 'Story' && <Bookmark className="w-4 h-4" />}
                                {item.type === 'Bug' && <Bug className="w-4 h-4" />}
                                {item.type === 'Task' && <CheckCircle className="w-4 h-4" />}
                                {item.type === 'Epic' && <Zap className="w-4 h-4" />}
                                <span className="text-sm text-gray-600 dark:text-gray-400">{item.type}</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                    <div
                                        className={`${item.color} h-4 rounded-full transition-all duration-300`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">
                                    {item.count}
                                </div>
                                <div className="text-xs text-gray-500 w-8">
                                    {Math.round(percentage)}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const TeamPerformanceTable = () => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Team Performance</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Team Member</th>
                            <th className="text-center py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Completed</th>
                            <th className="text-center py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Assigned</th>
                            <th className="text-center py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Efficiency</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {metricsData.teamPerformance.map((member, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                            {member.member.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {member.member}
                                        </span>
                                    </div>
                                </td>
                                <td className="text-center py-3">
                                    <span className="text-sm text-gray-900 dark:text-gray-100">{member.completed}</span>
                                </td>
                                <td className="text-center py-3">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{member.assigned}</span>
                                </td>
                                <td className="text-center py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${member.efficiency >= 85 ? 'bg-green-500' :
                                                    member.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${member.efficiency}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {member.efficiency}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const BurndownChart = () => {
        const burndownData = [
            { day: 'Day 1', ideal: 100, actual: 100 },
            { day: 'Day 3', ideal: 85, actual: 92 },
            { day: 'Day 5', ideal: 70, actual: 78 },
            { day: 'Day 7', ideal: 55, actual: 61 },
            { day: 'Day 9', ideal: 40, actual: 45 },
            { day: 'Day 11', ideal: 25, actual: 28 },
            { day: 'Day 13', ideal: 10, actual: 13 },
            { day: 'Day 15', ideal: 0, actual: 0 }
        ];

        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sprint Burndown</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-blue-500 rounded"></div>
                            <span>Ideal</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-orange-500 rounded"></div>
                            <span>Actual</span>
                        </div>
                    </div>
                </div>

                <div className="h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map(y => (
                            <line
                                key={y}
                                x1="40" y1={200 - (y * 1.6)}
                                x2="380" y2={200 - (y * 1.6)}
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-gray-200 dark:text-gray-600"
                                strokeDasharray="2,2"
                            />
                        ))}

                        {/* Ideal line */}
                        <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            points={burndownData.map((point, index) =>
                                `${40 + (index * 45)},${200 - (point.ideal * 1.6)}`
                            ).join(' ')}
                        />

                        {/* Actual line */}
                        <polyline
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                            points={burndownData.map((point, index) =>
                                `${40 + (index * 45)},${200 - (point.actual * 1.6)}`
                            ).join(' ')}
                        />

                        {/* Y-axis labels */}
                        {[0, 25, 50, 75, 100].map(y => (
                            <text
                                key={y}
                                x="35" y={205 - (y * 1.6)}
                                textAnchor="end"
                                className="text-xs fill-current text-gray-500"
                            >
                                {y}
                            </text>
                        ))}
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track your team's performance and progress
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm"
                            >
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                                <option value="quarter">Last Quarter</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Tasks"
                        value={metricsData.overview.totalTasks}
                        change={12}
                        icon={Target}
                        trend="up"
                    />
                    <MetricCard
                        title="Completed"
                        value={metricsData.overview.completedTasks}
                        change={8}
                        icon={CheckCircle}
                        trend="up"
                    />
                    <MetricCard
                        title="Team Velocity"
                        value={`${metricsData.overview.velocity} SP`}
                        change={5}
                        icon={Activity}
                        trend="up"
                    />
                    <MetricCard
                        title="Efficiency"
                        value={`${metricsData.overview.teamEfficiency}%`}
                        change={3}
                        icon={TrendingUp}
                        trend="up"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <VelocityChart />
                    <TaskDistributionChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BurndownChart />
                    <TeamPerformanceTable />
                </div>

                {/* Priority Breakdown */}
                <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Priority Breakdown</h3>

                    <div className="grid grid-cols-5 gap-4">
                        {metricsData.priorityBreakdown.map((priority, index) => (
                            <div key={index} className="text-center">
                                <div className={`
                                    h-24 rounded-lg mb-2 flex items-end justify-center pb-2 text-white font-medium
                                    ${priority.priority === 'Highest' ? 'bg-red-500' :
                                        priority.priority === 'High' ? 'bg-orange-500' :
                                            priority.priority === 'Medium' ? 'bg-yellow-500' :
                                                priority.priority === 'Low' ? 'bg-green-500' : 'bg-blue-500'}
                                `} style={{ height: `${priority.percentage * 2 + 20}px` }}>
                                    {priority.count}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{priority.priority}</div>
                                <div className="text-xs text-gray-500">{priority.percentage}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;