'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartBarProps {
    data: { label: string; value: number; color: string }[];
    maxValue?: number;
}

export function ChartBar({ data, maxValue }: ChartBarProps) {
    const max = maxValue || Math.max(...data.map(d => d.value));

    return (
        <div className="space-y-4">
            {data.map((item, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                        <span className="text-gray-900 dark:text-white font-bold">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / max) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                            className={`absolute inset-y-0 left-0 ${item.color} rounded-full`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface ChartLineProps {
    data: number[];
    labels: string[];
    color?: string;
}

export function ChartLine({ data, labels, color = 'blue' }: ChartLineProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    const points = data.map((value, idx) => {
        const x = (idx / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80 - 10;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                    <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="text-gray-300 dark:text-gray-700"
                    />
                ))}

                {/* Area Fill */}
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 1 }}
                    d={`M 0,100 L ${points} L 100,100 Z`}
                    className={`fill-${color}-500`}
                />

                {/* Line */}
                <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    points={points}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-${color}-600 dark:text-${color}-400`}
                    vectorEffect="non-scaling-stroke"
                />

                {/* Points */}
                {data.map((value, idx) => {
                    const x = (idx / (data.length - 1)) * 100;
                    const y = 100 - ((value - min) / range) * 80 - 10;
                    return (
                        <motion.circle
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                            cx={x}
                            cy={y}
                            r="1.5"
                            className={`fill-${color}-600 dark:fill-${color}-400`}
                        />
                    );
                })}
            </svg>

            {/* Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                {labels.map((label, idx) => (
                    <span key={idx}>{label}</span>
                ))}
            </div>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
}

export function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
    const isPositive = change && change > 0;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-${color}-500/10`}>
                    <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </motion.div>
    );
}

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
}

export function ProgressRing({ progress, size = 120, strokeWidth = 8, color = 'blue', label }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress Circle */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    className={`text-${color}-600 dark:text-${color}-400`}
                />
            </svg>
            <div className="absolute text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{progress}%</div>
                {label && <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>}
            </div>
        </div>
    );
}
