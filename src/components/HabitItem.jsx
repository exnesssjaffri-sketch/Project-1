import { Trash2 } from 'lucide-react'

// HabitItem — sirf EK habit ka row render karta hai.
// Props: habit (object) + onToggle/onRemove (functions) — App se HabitList ke through aate hain.
function HabitItem({ habit, onToggle, onRemove }) {
  const isDone = habit.status === 'done'

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm transition-colors ${
        isDone ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-white'
      }`}
    >
      <span
        className={`text-gray-800 font-medium ${
          isDone ? 'line-through text-emerald-700' : ''
        }`}
      >
        {habit.name}
      </span>

      <div className="flex items-center gap-2">
        {/* Click → upar wale App.toggleHabit(id) ko call karta hai */}
        <button
          type="button"
          onClick={() => onToggle(habit.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            isDone
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isDone ? '✓ Done' : 'Pending'}
        </button>

        {/* Click → upar wale App.removeHabit(id) ko call karta hai */}
        <button
          type="button"
          onClick={() => onRemove(habit.id)}
          aria-label={`Delete ${habit.name}`}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )
}

export default HabitItem