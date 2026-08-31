# 🧠 Habit Tracker — Component Architecture & State Management

> **Goal:** React `useState` + Component Splitting samajhna
> **Location:** `my-react-app/`
> **Stack:** React 19 + Vite + Tailwind CSS v4 (no database — sirf local state)

---

## 1. Data Model

Har habit ek object hai:

| Field    | Type   | Example         |
|----------|--------|-----------------|
| `id`     | string | `"a1b2c3-..."`  |
| `name`   | string | `"Exercise"`    |
| `status` | enum   | `"pending"` \| `"done"` |

```js
// App.jsx ke andar state is tarah hoti hai:
const [habits, setHabits] = useState([])
// => [{ id, name, status }, { id, name, status }, ...]
```

---

## 2. Component Tree

```
<App>                       ← state ka MALIK (top-level)
 ├─ <HabitList>             ← add-form + list render
 │    └─ <HabitItem> × N    ← ek habit ka row (Epak habit = ek component)
```

| File                          | Kaam |
|-------------------------------|------|
| `src/App.jsx`                 | `useState` rakhta hai + add/toggle functions define karta hai |
| `src/components/HabitList.jsx`| Form + list. Input ka apna **local** `useState` bhi yahi |
| `src/components/HabitItem.jsx`| Pure display — bas ek row dikhata hai, khud koi state nahi |

---

## 3. Props Flow — "State upar, data neeche, events upar"

React mein data **ek taraf** (top → down) flow hota hai. Isko **unidirectional data flow** kehte hain.

```
        <App>
   ┌──────┼──────────────────────┐
   │  habits (data ↓)            │  onAdd / onToggle (callbacks ↑)
   ▼                             ▼
<HabitList> ── habit object ─▶ <HabitItem>
                                 │
                              button click
                                 │
                      onToggle(habit.id)  ──upar call──▶  App.toggleHabit
```

| Component | Props milte hain (in) | Actions    |
|-----------|----------------------|------------|
| `App`     | — (khud state owner) | `addHabit(name)`, `toggleHabit(id)` |
| `HabitList` | `habits` (array), `onAdd` (fn), `onToggle` (fn) | form submit par `onAdd(name)` call karta hai |
| `HabitItem` | `habit` (object), `onToggle` (fn) | button click par `onToggle(habit.id)` call karta hai |

### 💡 Key concept: child state kabhi directly change nahi karta

`HabitItem` ko `status` change karne ka **adhikaar nahi hai**. Wo sirf signal upar bhejta hai:

```
User clicks "Done" button
        │
        ▼
HabitItem: onToggle(habit.id)     ← prop se mila hua function
        │
        ▼
App: toggleHabit(id)              ← yahan asli setHabits(update)
        │
        ▼
React re-render → nayi habits array → props → neeche list update
```

Isliye callbacks ka naam `onToggle` / `onAdd` rakhte hain — ye batata hai ke
"ye event upar wale ko bata raha hai", data ko khud change nahi kar raha.

---

## 4. Do tarah ka state — farq samjho

| Type          | Kahan | Kab use hota hai |
|---------------|-------|------------------|
| **Global/App state** | `App.jsx` | `habits` array — poori app ko chahiye |
| **Local state**      | `HabitList.jsx` | `name` (input ka text) — sirf form ko chahiye |

> **Rule of thumb:** Jo data kisi ek hi component ko chahiye wo wahan local rakh do.
> Jo data multiple components (ya state ko "lift" kar ke neeche pass karna ho) to upar `App` mein.

---

## 5. Yaad rakhne wali samajh

1. **State upar:** `useState` sirf `App` mein — "single source of truth".
2. **Data neeche:** `habits` array props ke through neeche jata hai.
3. **Events upar:** child event ko callback (prop) ke zariye upar report karta hai.
4. **React re-render:** `setHabits` call → App re-render → nayi props → sab dobara render.

### Ab practice:
- `npm run dev` karo aur `localhost:5173` par test karo.
- Nayi cheez try karni ho: **Delete button** add karo — `App` mein `removeHabit(id)`,
  `HabitList`/`HabitItem` mein `onRemove` prop pass karna. [Practice Exercise 🏋️]