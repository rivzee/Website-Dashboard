'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    User,
    X,
    Bell
} from 'lucide-react';

interface Event {
    id: string;
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: 'meeting' | 'deadline' | 'appointment' | 'reminder';
    description?: string;
    location?: string;
    attendees?: string[];
    color?: string;
}

interface CalendarProps {
    events?: Event[];
    onEventClick?: (event: Event) => void;
    onAddEvent?: (date: Date) => void;
}

export default function Calendar({ events = [], onEventClick, onAddEvent }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const today = new Date();
    const isToday = (day: number) => {
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'meeting':
                return 'bg-blue-500';
            case 'deadline':
                return 'bg-red-500';
            case 'appointment':
                return 'bg-green-500';
            case 'reminder':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const renderCalendarDays = () => {
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square p-2 bg-gray-50 dark:bg-gray-900/50" />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day);
            const isTodayDate = isToday(day);

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onAddEvent && onAddEvent(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`aspect-square p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${isTodayDate
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                >
                    <div className="h-full flex flex-col">
                        <span
                            className={`text-sm font-semibold mb-1 ${isTodayDate
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                        >
                            {day}
                        </span>

                        <div className="flex-1 space-y-1 overflow-y-auto">
                            {dayEvents.slice(0, 3).map((event) => (
                                <div
                                    key={event.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEvent(event);
                                        onEventClick && onEventClick(event);
                                    }}
                                    className={`${getEventColor(event.type)} text-white text-xs px-1 py-0.5 rounded truncate hover:opacity-80 transition-opacity`}
                                >
                                    {event.title}
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    +{dayEvents.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>

                    <div className="flex gap-2">
                        <button
                            onClick={previousMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        Today
                    </button>
                </div>

                <div className="flex gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        {['month', 'week', 'day'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v as any)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${view === v
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onAddEvent && onAddEvent(new Date())}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} />
                        Add Event
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="p-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Event Details Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setSelectedEvent(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${getEventColor(selectedEvent.type)}`} />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedEvent.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Clock size={18} />
                                    <span>
                                        {new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.startTime} - {selectedEvent.endTime}
                                    </span>
                                </div>

                                {selectedEvent.location && (
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <MapPin size={18} />
                                        <span>{selectedEvent.location}</span>
                                    </div>
                                )}

                                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <User size={18} />
                                        <span>{selectedEvent.attendees.join(', ')}</span>
                                    </div>
                                )}

                                {selectedEvent.description && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-6">
                                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                        <Bell size={18} />
                                        Set Reminder
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Deadline</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Appointment</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-400">Reminder</span>
                </div>
            </div>
        </div>
    );
}

// Example usage
export function CalendarExample() {
    const sampleEvents: Event[] = [
        {
            id: '1',
            title: 'Meeting with Client',
            date: new Date(),
            startTime: '10:00',
            endTime: '11:00',
            type: 'meeting',
            location: 'Office',
            attendees: ['John Doe', 'Jane Smith'],
            description: 'Discuss Q4 financial reports'
        },
        {
            id: '2',
            title: 'Tax Filing Deadline',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            startTime: '23:59',
            endTime: '23:59',
            type: 'deadline',
            description: 'Submit annual tax returns'
        }
    ];

    return (
        <Calendar
            events={sampleEvents}
            onEventClick={(event) => console.log('Event clicked:', event)}
            onAddEvent={(date) => console.log('Add event on:', date)}
        />
    );
}
