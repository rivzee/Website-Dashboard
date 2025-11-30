'use client';

import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}

const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(value);
};

export function EnhancedLineChart({ data, dataKey = 'value', title }: { data: ChartData[]; dataKey?: string; title?: string }) {
    return (
        <div className="w-full h-full">
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                    />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="url(#colorValue)"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function EnhancedBarChart({ data, dataKey = 'value', title }: { data: ChartData[]; dataKey?: string; title?: string }) {
    return (
        <div className="w-full h-full">
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.7} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                    />
                    <Bar dataKey={dataKey} fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function EnhancedAreaChart({ data, dataKey = 'value', title }: { data: ChartData[]; dataKey?: string; title?: string }) {
    return (
        <div className="w-full h-full">
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#areaGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function EnhancedPieChart({ data, title }: { data: ChartData[]; title?: string }) {
    const COLORS = [
        { main: '#F59E0B', light: '#FEF3C7', name: 'Pending' },
        { main: '#8B5CF6', light: '#EDE9FE', name: 'In Progress' },
        { main: '#10B981', light: '#D1FAE5', name: 'Completed' }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        if (percent === 0) return null;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="font-bold text-sm"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="w-full h-full flex flex-col">
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>}

            {/* Donut Chart */}
            <div className="flex-1 relative min-h-[250px] max-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            {COLORS.map((color, index) => (
                                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color.main} stopOpacity={1} />
                                    <stop offset="100%" stopColor={color.main} stopOpacity={0.7} />
                                </linearGradient>
                            ))}
                        </defs>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={CustomLabel}
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#gradient-${index})`}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                                padding: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                            }}
                            formatter={(value: any) => [`${value} pesanan`, '']}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{total}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Total</p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-3">
                {data.map((entry, index) => {
                    const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
                    return (
                        <div key={index} className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full shadow-sm"
                                    style={{ backgroundColor: COLORS[index].main }}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {entry.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {entry.value}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[45px] text-right">
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
