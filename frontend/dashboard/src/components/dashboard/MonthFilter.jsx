const MonthFilter = ({ currentMonth, onMonthChange }) => {
    return (
        <div className="card flex items-center gap-4 mb-6 p-4">
            <label className="font-bold text-gray-700">Período:</label>
            <input
                type="month"
                value={currentMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="input-field max-w-xs"
            />
            <button
                onClick={() => onMonthChange('')}
                className="text-sm text-blue-600 hover:underline ml-auto"
            >
                Ver Todos
            </button>
        </div>
    );
};

export default MonthFilter;