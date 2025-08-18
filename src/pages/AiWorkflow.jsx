import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Bot,
    User,
    Clock,
    Calendar,
    Target,
    Users,
    Database,
    Server,
    Globe,
    GitBranch,
    CheckCircle,
    ArrowRight,
    Briefcase,
    TrendingUp,
    Lightbulb,
    AlertTriangle,
    FileText,
    Zap,
    Brain,
    Sparkles,
    Play,
    Pause,
    RotateCcw,
    Code,
    Shield,
    Monitor,
    Layers,
    Settings,
    Copy,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';

const AIAgentViewPanel = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hello! I'm your OnBoost AI assistant. I can help you:\n\n• Generate project architectures with timelines\n• Create employee onboarding plans\n• Estimate development resources\n• Plan team workflows\n\nWhat would you like me to help you with today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeView, setActiveView] = useState('welcome');
    const [generatedData, setGeneratedData] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleAIRequest = (requestType, userInput = '') => {
        setIsTyping(true);

        setTimeout(() => {
            if (requestType === 'project-architecture' || userInput.toLowerCase().includes('project') || userInput.toLowerCase().includes('architecture')) {
                setGeneratedData({
                    type: 'project',
                    name: 'E-commerce Platform',
                    description: 'Full-stack web application with user authentication, product catalog, shopping cart, and payment processing.',
                    architecture: {
                        components: [
                            { name: 'React Frontend', type: 'frontend', status: 'planned', time: '3 weeks', description: 'User interface and client-side logic' },
                            { name: 'Node.js API', type: 'backend', status: 'planned', time: '4 weeks', description: 'RESTful API server' },
                            { name: 'MongoDB Database', type: 'database', status: 'planned', time: '1 week', description: 'Document-based data storage' },
                            { name: 'Redis Cache', type: 'cache', status: 'planned', time: '0.5 weeks', description: 'Session and data caching' },
                            { name: 'AWS Deployment', type: 'cloud', status: 'planned', time: '1 week', description: 'Cloud infrastructure setup' },
                            { name: 'Payment Gateway', type: 'integration', status: 'planned', time: '1.5 weeks', description: 'Stripe payment integration' }
                        ]
                    },
                    timeline: {
                        total: '14 weeks',
                        phases: [
                            { name: 'Planning & Design', duration: '2 weeks', progress: 0, tasks: ['Requirements gathering', 'UI/UX design', 'Database design'] },
                            { name: 'Backend Development', duration: '5 weeks', progress: 0, tasks: ['API development', 'Authentication', 'Database integration'] },
                            { name: 'Frontend Development', duration: '4 weeks', progress: 0, tasks: ['Component development', 'State management', 'API integration'] },
                            { name: 'Integration & Testing', duration: '2 weeks', progress: 0, tasks: ['End-to-end testing', 'Performance testing', 'Bug fixes'] },
                            { name: 'Deployment & Launch', duration: '1 week', progress: 0, tasks: ['Production deployment', 'Monitoring setup', 'Go-live'] }
                        ]
                    },
                    resources: {
                        'Full-stack Developers': 2,
                        'Frontend Developer': 1,
                        'Backend Developer': 1,
                        'UI/UX Designer': 1,
                        'QA Tester': 1,
                        'DevOps Engineer': 1
                    },
                    techStack: {
                        frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit'],
                        backend: ['Node.js', 'Express.js', 'JWT', 'Bcrypt'],
                        database: ['MongoDB', 'Mongoose'],
                        deployment: ['AWS EC2', 'AWS S3', 'CloudFront', 'Route 53'],
                        tools: ['Git', 'Docker', 'Jest', 'Cypress']
                    },
                    risks: [
                        'Third-party payment integration complexity',
                        'Scalability concerns with high traffic',
                        'Security vulnerabilities in authentication'
                    ],
                    recommendations: [
                        'Implement comprehensive logging and monitoring',
                        'Set up CI/CD pipeline early in development',
                        'Conduct regular security audits'
                    ]
                });
                setActiveView('project-display');
            } else if (requestType === 'onboarding-plan' || userInput.toLowerCase().includes('onboard') || userInput.toLowerCase().includes('employee')) {
                setGeneratedData({
                    type: 'onboarding',
                    employee: 'Alex Johnson',
                    role: 'Senior Frontend Developer',
                    department: 'Engineering',
                    startDate: '2024-09-01',
                    manager: 'Sarah Chen - Engineering Manager',
                    mentor: 'Mike Rodriguez - Lead Frontend Developer',
                    weeklyPlan: [
                        {
                            week: 'Week 1',
                            focus: 'Company Introduction & Administrative Setup',
                            progress: 0,
                            tasks: [
                                { task: 'HR orientation and paperwork completion', status: 'pending', priority: 'high', estimatedTime: '2 hours' },
                                { task: 'IT equipment setup and access permissions', status: 'pending', priority: 'high', estimatedTime: '3 hours' },
                                { task: 'Office tour and facility orientation', status: 'pending', priority: 'medium', estimatedTime: '1 hour' },
                                { task: 'Team introductions and meet & greet', status: 'pending', priority: 'high', estimatedTime: '2 hours' },
                                { task: 'Company culture and values presentation', status: 'pending', priority: 'medium', estimatedTime: '1.5 hours' },
                                { task: 'Security and compliance training', status: 'pending', priority: 'high', estimatedTime: '2 hours' }
                            ],
                            goals: [
                                'Complete all administrative requirements',
                                'Meet key team members and stakeholders',
                                'Understand company culture and values',
                                'Set up workspace and development environment'
                            ],
                            deliverables: ['Signed contracts and policies', 'Completed security training', 'Development environment setup']
                        },
                        {
                            week: 'Week 2',
                            focus: 'Technical Onboarding & Codebase Familiarization',
                            progress: 0,
                            tasks: [
                                { task: 'Codebase walkthrough with mentor', status: 'pending', priority: 'high', estimatedTime: '4 hours' },
                                { task: 'Development environment and tools setup', status: 'pending', priority: 'high', estimatedTime: '3 hours' },
                                { task: 'Code review process and standards training', status: 'pending', priority: 'high', estimatedTime: '2 hours' },
                                { task: 'Testing framework and practices overview', status: 'pending', priority: 'medium', estimatedTime: '2 hours' },
                                { task: 'Documentation and knowledge base review', status: 'pending', priority: 'medium', estimatedTime: '3 hours' },
                                { task: 'First small bug fix or documentation update', status: 'pending', priority: 'medium', estimatedTime: '4 hours' }
                            ],
                            goals: [
                                'Understand the technical architecture',
                                'Set up complete development workflow',
                                'Learn team coding standards and practices',
                                'Make first small contribution to codebase'
                            ],
                            deliverables: ['Working development environment', 'First code contribution', 'Understanding of team workflows']
                        },
                        {
                            week: 'Week 3',
                            focus: 'Project Integration & Team Collaboration',
                            progress: 0,
                            tasks: [
                                { task: 'Join ongoing project team and planning meetings', status: 'pending', priority: 'high', estimatedTime: '4 hours' },
                                { task: 'Complete first feature development task', status: 'pending', priority: 'high', estimatedTime: '12 hours' },
                                { task: 'Participate in code reviews as reviewer', status: 'pending', priority: 'high', estimatedTime: '3 hours' },
                                { task: 'Attend sprint planning and retrospective', status: 'pending', priority: 'medium', estimatedTime: '2 hours' },
                                { task: 'Shadow experienced developer on complex task', status: 'pending', priority: 'medium', estimatedTime: '4 hours' },
                                { task: 'Contribute to team knowledge sharing session', status: 'pending', priority: 'low', estimatedTime: '2 hours' }
                            ],
                            goals: [
                                'Become active participant in team processes',
                                'Complete first meaningful feature development',
                                'Establish peer relationships and collaboration',
                                'Understand project roadmap and priorities'
                            ],
                            deliverables: ['Completed feature implementation', 'Code review participation', 'Team integration assessment']
                        },
                        {
                            week: 'Week 4',
                            focus: 'Independent Contribution & Performance Review',
                            progress: 0,
                            tasks: [
                                { task: 'Lead development of medium-complexity feature', status: 'pending', priority: 'high', estimatedTime: '16 hours' },
                                { task: 'Conduct code reviews for junior developers', status: 'pending', priority: 'medium', estimatedTime: '3 hours' },
                                { task: '30-day performance review with manager', status: 'pending', priority: 'high', estimatedTime: '1 hour' },
                                { task: 'Identify process improvement opportunities', status: 'pending', priority: 'low', estimatedTime: '2 hours' },
                                { task: 'Update team documentation based on learnings', status: 'pending', priority: 'medium', estimatedTime: '3 hours' },
                                { task: 'Plan next month\'s development goals', status: 'pending', priority: 'medium', estimatedTime: '1 hour' }
                            ],
                            goals: [
                                'Demonstrate independent problem-solving ability',
                                'Receive positive performance feedback',
                                'Contribute to team improvement initiatives',
                                'Establish long-term development goals'
                            ],
                            deliverables: ['Independent feature delivery', 'Performance review completion', 'Improvement suggestions', 'Goal setting for next phase']
                        }
                    ],
                    checkpoints: [
                        { day: 'Day 1', type: 'Welcome & Orientation', participants: ['HR', 'Manager', 'Mentor'] },
                        { day: 'Day 3', type: 'Initial Technical Check-in', participants: ['Mentor', 'Team Lead'] },
                        { day: 'Day 7', type: 'Week 1 Review', participants: ['Manager', 'HR'] },
                        { day: 'Day 14', type: 'Technical Skills Assessment', participants: ['Mentor', 'Senior Developer'] },
                        { day: 'Day 21', type: 'Team Integration Review', participants: ['Team Lead', 'Project Manager'] },
                        { day: 'Day 30', type: 'Formal Performance Review', participants: ['Manager', 'HR', 'Mentor'] }
                    ],
                    resources: [
                        { name: 'Employee Handbook', type: 'document', url: '/handbook' },
                        { name: 'Technical Documentation', type: 'wiki', url: '/tech-docs' },
                        { name: 'Code Style Guide', type: 'document', url: '/style-guide' },
                        { name: 'Development Setup Guide', type: 'tutorial', url: '/dev-setup' },
                        { name: 'Team Slack Channels', type: 'communication', url: '/slack-channels' }
                    ]
                });
                setActiveView('onboarding-display');
            }

            const aiResponse = {
                id: Date.now(),
                type: 'bot',
                content: requestType === 'project-architecture' || userInput.toLowerCase().includes('project') || userInput.toLowerCase().includes('architecture')
                    ? "I've generated a comprehensive project architecture for an e-commerce platform. The plan includes:\n\n✅ Complete system architecture with 6 core components\n✅ 14-week timeline with detailed phases\n✅ Team of 7 specialists required\n✅ Modern tech stack (React, Node.js, MongoDB, AWS)\n✅ Risk assessment and recommendations\n\nThe architecture is displayed in the main panel with interactive components and timeline visualization."
                    : "I've created a detailed 4-week onboarding plan for a Senior Frontend Developer. The plan includes:\n\n✅ Week-by-week structured tasks and goals\n✅ 24 specific tasks with time estimates\n✅ 6 scheduled check-in points\n✅ Mentor and manager assignments\n✅ Measurable deliverables and outcomes\n\nThe complete onboarding roadmap is now displayed in the main panel with progress tracking capabilities.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 2000);
    };

    const sendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);

        // Process AI request
        handleAIRequest('auto-detect', inputMessage);
        setInputMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // AI Agent Component
    const AIAgentChat = () => (
        <div className="h-full flex flex-col bg-slate-800 text-white">
            {/* AI Status Header */}
            <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bot className="w-8 h-8 text-blue-400" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
                    </div>
                    <div>
                        <div className="font-semibold text-lg">AI Assistant</div>
                        <div className="text-sm text-slate-400">Ready to generate workflows</div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.type === 'bot' && (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div className={`max-w-[85%] ${message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-100'
                            } rounded-xl p-4 shadow-sm`}>
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                            {message.type === 'bot' && (
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-600">
                                    <button className="text-slate-400 hover:text-green-400 transition-colors p-1">
                                        <ThumbsUp className="w-3 h-3" />
                                    </button>
                                    <button className="text-slate-400 hover:text-red-400 transition-colors p-1">
                                        <ThumbsDown className="w-3 h-3" />
                                    </button>
                                    <button className="text-slate-400 hover:text-slate-200 transition-colors p-1">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                    <button className="text-slate-400 hover:text-blue-400 transition-colors p-1">
                                        <RotateCcw className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {message.type === 'user' && (
                            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <User className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-700 rounded-xl p-4">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 mb-2">Quick Actions:</div>
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => handleAIRequest('project-architecture')}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                        📊 Project Architecture
                    </button>
                    <button
                        onClick={() => handleAIRequest('onboarding-plan')}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                        👥 Onboarding Plan
                    </button>
                </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask AI to generate project architecture, onboarding plans, or estimate timelines..."
                        className="flex-1 bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                        rows={2}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    );

    // Main View Panel Component
    const ViewPanel = () => {
        const WelcomeView = () => (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-2xl">
                    <Brain className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Workflow Generation</h2>
                    <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                        Use the AI assistant to generate comprehensive project architectures, detailed onboarding plans,
                        accurate time estimates, and optimized team workflows. Simply describe what you need or use the quick actions.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <Database className="w-12 h-12 text-blue-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Project Architecture</h3>
                            <p className="text-slate-400 text-sm">Generate complete system architectures with tech stack recommendations, timeline estimates, and resource planning.</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <Users className="w-12 h-12 text-green-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Employee Onboarding</h3>
                            <p className="text-slate-400 text-sm">Create structured onboarding plans with weekly tasks, goals, checkpoints, and mentor assignments.</p>
                        </div>
                    </div>

                    <div className="mt-8 text-slate-400">
                        <p className="text-sm">Try asking: <span className="text-blue-400 font-mono">"Generate architecture for a React e-commerce app"</span></p>
                        <p className="text-sm">Or: <span className="text-green-400 font-mono">"Create onboarding plan for senior developer"</span></p>
                    </div>
                </div>
            </div>
        );

        const ProjectArchitectureView = () => {
            if (!generatedData || generatedData.type !== 'project') return null;

            return (
                <div className="space-y-6">
                    {/* Project Header */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <Database className="w-8 h-8 text-blue-400" />
                                    {generatedData.name}
                                </h2>
                                <p className="text-slate-300">{generatedData.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-400">{generatedData.timeline.total}</div>
                                <div className="text-sm text-slate-400">Total Timeline</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* System Architecture */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Layers className="w-6 h-6 text-purple-400" />
                                System Architecture
                            </h3>
                            <div className="space-y-3">
                                {generatedData.architecture.components.map((component, index) => {
                                    const getIcon = (type) => {
                                        switch (type) {
                                            case 'frontend': return <Monitor className="w-5 h-5" />;
                                            case 'backend': return <Server className="w-5 h-5" />;
                                            case 'database': return <Database className="w-5 h-5" />;
                                            case 'cache': return <Zap className="w-5 h-5" />;
                                            case 'cloud': return <Globe className="w-5 h-5" />;
                                            case 'integration': return <GitBranch className="w-5 h-5" />;
                                            default: return <Settings className="w-5 h-5" />;
                                        }
                                    };

                                    const getColor = (type) => {
                                        switch (type) {
                                            case 'frontend': return 'text-blue-400 bg-blue-400/10';
                                            case 'backend': return 'text-green-400 bg-green-400/10';
                                            case 'database': return 'text-orange-400 bg-orange-400/10';
                                            case 'cache': return 'text-red-400 bg-red-400/10';
                                            case 'cloud': return 'text-purple-400 bg-purple-400/10';
                                            case 'integration': return 'text-yellow-400 bg-yellow-400/10';
                                            default: return 'text-slate-400 bg-slate-400/10';
                                        }
                                    };

                                    return (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-slate-700 rounded-lg">
                                            <div className={`w-10 h-10 rounded-lg ${getColor(component.type)} flex items-center justify-center`}>
                                                {getIcon(component.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-white">{component.name}</div>
                                                <div className="text-sm text-slate-400">{component.description}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-slate-300">{component.time}</div>
                                                <div className="text-xs text-slate-500">{component.status}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Timeline & Phases */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-blue-400" />
                                Development Timeline
                            </h3>
                            <div className="space-y-4">
                                {generatedData.timeline.phases.map((phase, index) => (
                                    <div key={index} className="p-4 bg-slate-700 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-semibold text-white">{phase.name}</div>
                                            <div className="text-sm text-slate-300">{phase.duration}</div>
                                        </div>
                                        <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                                            <div
                                                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${phase.progress}%` }}
                                            />
                                        </div>
                                        <ul className="text-sm text-slate-400 space-y-1">
                                            {phase.tasks.slice(0, 3).map((task, taskIndex) => (
                                                <li key={taskIndex} className="flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resources & Tech Stack */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-green-400" />
                                Team Requirements
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(generatedData.resources).map(([role, count]) => (
                                    <div key={role} className="flex items-center justify-between">
                                        <span className="text-slate-300 text-sm">{role}</span>
                                        <span className="font-bold text-green-400">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                Risk Factors
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {generatedData.risks.map((risk, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="w-1 h-1 bg-red-400 rounded-full mt-2"></div>
                                        {risk}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-400" />
                                Recommendations
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {generatedData.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2"></div>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        };

        const OnboardingPlanView = () => {
            if (!generatedData || generatedData.type !== 'onboarding') return null;

            return (
                <div className="space-y-6">
                    {/* Employee Header */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-green-400" />
                                    {generatedData.employee}
                                </h2>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <span>{generatedData.role}</span>
                                    <span>•</span>
                                    <span>{generatedData.department}</span>
                                    <span>•</span>
                                    <span>Start: {generatedData.startDate}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-400">Manager</div>
                                <div className="font-medium text-slate-200">{generatedData.manager}</div>
                                <div className="text-sm text-slate-400 mt-1">Mentor</div>
                                <div className="font-medium text-slate-200">{generatedData.mentor}</div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Plan */}
                    <div className="space-y-4">
                        {generatedData.weeklyPlan.map((week, weekIndex) => (
                            <div key={weekIndex} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="bg-slate-700 p-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">{week.week}</h3>
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                        {week.focus}
                                    </span>
                                </div>

                                <div className="p-6">
                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-400">Progress</span>
                                            <span className="text-sm text-slate-300">{week.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${week.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-6">
                                        {/* Tasks */}
                                        <div>
                                            <h4 className="font-semibold text-white mb-3">Tasks & Activities</h4>
                                            <div className="space-y-2">
                                                {week.tasks.map((task, taskIndex) => (
                                                    <div key={taskIndex} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                                                        <div className="w-5 h-5 mt-0.5">
                                                            <CheckCircle className={`w-5 h-5 ${task.status === 'completed' ? 'text-green-400' : 'text-slate-500'
                                                                }`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm text-slate-200 font-medium">{task.task}</div>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                                                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                        'bg-green-500/20 text-green-400'
                                                                    }`}>
                                                                    {task.priority}
                                                                </span>
                                                                <span className="text-xs text-slate-400">{task.estimatedTime}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Goals & Deliverables */}
                                        <div>
                                            <h4 className="font-semibold text-white mb-3">Goals</h4>
                                            <ul className="space-y-2 mb-4">
                                                {week.goals.map((goal, goalIndex) => (
                                                    <li key={goalIndex} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                        {goal}
                                                    </li>
                                                ))}
                                            </ul>

                                            <h4 className="font-semibold text-white mb-3">Deliverables</h4>
                                            <ul className="space-y-2">
                                                {week.deliverables.map((deliverable, delIndex) => (
                                                    <li key={delIndex} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <FileText className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                        {deliverable}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkpoints & Resources */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Check-in Schedule
                            </h3>
                            <div className="space-y-3">
                                {generatedData.checkpoints.map((checkpoint, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-700 rounded-lg">
                                        <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-white">{checkpoint.day}</div>
                                            <div className="text-sm text-slate-400">{checkpoint.type}</div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {checkpoint.participants.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-400" />
                                Resources & Links
                            </h3>
                            <div className="space-y-3">
                                {generatedData.resources.map((resource, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                                            {resource.type === 'document' && <FileText className="w-5 h-5" />}
                                            {resource.type === 'wiki' && <Globe className="w-5 h-5" />}
                                            {resource.type === 'tutorial' && <Play className="w-5 h-5" />}
                                            {resource.type === 'communication' && <Users className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-white text-sm">{resource.name}</div>
                                            <div className="text-xs text-slate-400 capitalize">{resource.type}</div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="h-full bg-slate-900 text-white p-8 overflow-auto">
                {activeView === 'welcome' && <WelcomeView />}
                {activeView === 'project-display' && <ProjectArchitectureView />}
                {activeView === 'onboarding-display' && <OnboardingPlanView />}
            </div>
        );
    };

    return (
        <div className="flex h-screen">
            {/* AI Agent Chat - Left Side */}
            <div className="w-96 border-r border-slate-600">
                <AIAgentChat />
            </div>

            {/* View Panel - Right Side */}
            <div className="flex-1">
                <ViewPanel />
            </div>
        </div>
    );
};

export default AIAgentViewPanel;