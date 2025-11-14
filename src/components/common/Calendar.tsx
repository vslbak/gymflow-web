import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarProps {
  availableDates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function Calendar({ availableDates, selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (availableDates.length > 0) {
      return new Date(availableDates[0]);
    }
    return new Date();
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateAvailable = (dateStr: string) => {
    return availableDates.includes(dateStr);
  };

  const formatDateToString = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-12"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateToString(year, month, day);
    const isAvailable = isDateAvailable(dateStr);
    const isSelected = dateStr === selectedDate;
    const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

    days.push(
      <button
        key={day}
        onClick={() => isAvailable && onDateSelect(dateStr)}
        disabled={!isAvailable}
        className={`
          h-12 flex items-center justify-center rounded-lg font-medium transition-all
          ${isSelected
            ? 'bg-orange-600 text-white shadow-lg scale-105'
            : isAvailable
            ? 'bg-orange-50 text-orange-900 hover:bg-orange-100 hover:scale-105 cursor-pointer'
            : 'text-gray-300 cursor-not-allowed'
          }
          ${isAvailable && !isSelected ? 'hover:shadow-md' : ''}
        `}
      >
        {day}
      </button>
    );
  }

  const hasAvailableDatesInCurrentMonth = availableDates.some(date => {
    const d = new Date(date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const canGoPrevious = availableDates.some(date => {
    const d = new Date(date);
    return d < new Date(year, month, 1);
  });

  const canGoNext = availableDates.some(date => {
    const d = new Date(date);
    return d >= new Date(year, month + 1, 1);
  });

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousMonth}
          disabled={!canGoPrevious}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          disabled={!canGoNext}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>

      {!hasAvailableDatesInCurrentMonth && (
        <div className="mt-4 text-center text-sm text-gray-500">
          No available dates this month
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
