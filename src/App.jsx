import { useState } from 'react'
import HabitList from './components/HabitList'

// App = state ka MALIK (single source of truth).
// Yahan habits ka data rehta hai, neeche components props ke through leta hai.
function createId() {
  // crypto.randomUUID sirf https/localhost (secure context) mein milta hai.
  // Fallback har kahin chalta hai — is se Add button kabhi fail nahi hoga.
  const id =
    crypto.randomUUID?.() ??
    `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return id
}

function App() {
  const [habits, setHabits] = useState([])

  function addHabit(name) {
    setHabits((prev) => [
      ...prev,
      { id: createId(), name, status: 'pending' },
    ])
  }

  function toggleHabit(id) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: h.status === 'done' ? 'pending' : 'done' } : h,
      ),
    )
  }

  function removeHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
        <p className="mt-1 text-gray-500">
          Aaj wali habit, aaj karo — Done / Pending mark karte jao ✍️
        </p>
      </header>

      {/* State + callbacks props ban ke neeche pass hote hain */}
      <HabitList
        habits={habits}
        onAdd={addHabit}
        onToggle={toggleHabit}
        onRemove={removeHabit}
      />
    </main>
  )
}

export default App
