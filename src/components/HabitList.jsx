import { useState } from 'react'
import HabitItem from './HabitItem'

// HabitList — form + poori list manage karta hai.
// Props: habits (array), onAdd (fn), onToggle (fn) — sab App se aaye hain.
function HabitList({ habits, onAdd, onToggle, onRemove }) {
  const [name, setName] = useState('') // form ka apna LOCAL state (sirf input ke liye)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed) // data upar App ko dete hain
    setName('')
  }

  return (
    <section>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nayi habit likhein… e.g. Exercise"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-violet-700"
        >
          + Add
        </button>
      </form>

      {habits.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
          Abhi koi habit nahi — upar se add karein! 🚀
        </p>
      ) : (
        <ul className="space-y-2">
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default HabitList