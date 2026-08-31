# 🤖 AI Decision Log

> **Purpose:** Is project mein har important decision — library choose karna, component structure banana, ya bug solve karna — yahan log hota hai.
> **Format:** Har entry mein (1) Problem, (2) Chosen React solution, (3) Yeh solution KYUN.

---

## Entry 001 — Libraries install: Tailwind CSS v4 (Vite plugin) + React Router + Supabase + Lucide

**Problem:**
App ko styling, routing, database connection aur icons ke liye libraries chahiye thein. Vite project tha, is liye har library ko Vite ke saath sahi integration chahiye tha — khaas kar Tailwind (v3 vs v4 config bilkul alag hoti hai).

**Chosen React solution:**
- `tailwindcss@4.3.3` + `@tailwindcss/vite@4.3.3` (dev-time build, zero-config)
- `react-router-dom@7.18.3`, `@supabase/supabase-js@2.112.4`, `lucide-react@1.38.0`
- Vite config mein `plugins: [react(), tailwindcss()]` aur `index.css` mein `@import "tailwindcss";`

**KYUN:**
- **Tailwind v4 + @tailwindcss/vite:** Modern Vite-native approach — `postcss.config.js` aur `tailwind.config.js` ki zaroorat hi nahi. Official plugin hai, fast build, auto-content-detection.
- **React Router v7:** React 19 ke saath fully compatible, aur Vite ke SPA routing ke liye de-facto standard.
- **Supabase:** Client-side SDK — baad mein database add karni ho to login + realtime dono ekhi package mein.
- **Lucide:** Tree-shakeable icons, Tailwind styling ke saath clean render karte hain.

---

## Entry 002 — Component structure: Single-file App → 3-component split

**Problem:**
Starter `App.jsx` mein sab kuch (hero section, buttons, links) ek file mein tha. Habit Tracker bante waqt agar sab ek file mein hota to state logic, form, aur list-row sab mixed rehta — code barhne par unreadable ho jata.

**Chosen React solution:**
```
<App>                    ← useState owner (single source of truth)
 ├─ <HabitList>          ← add-form + list render (local state: input text)
 │    └─ <HabitItem> × N ← ek habit ka pure-display row (no state)
```

**KYUN:**
- **Single Responsibility:** Har component ka ek clear kaam — `App` state rakhta hai, `HabitList` list/form manage karta hai, `HabitItem` sirf display karta hai.
- **Reusability:** `HabitItem` alag hone se isay update karna ya doosri jagah use karna easy hai.
- **Unidirectional data flow:** State upar, props neeche, callbacks upar — React ka recommended pattern. Inheritance/mutations nahi.

---

## Entry 003 — State management: No database, sirf `useState` (App ke liye)

**Problem:**
User ne kaha — abhi database nahi, aaj ke habits ko sirf UI par "Done / Pending" toggle karna hai. Requirement simple thi, is liye heavy state library (Redux/Zustand) use karna overkill tha.

**Chosen React solution:**
- `App` mein `const [habits, setHabits] = useState([])` — data owner
- `addHabit(name)` aur `toggleHabit(id)` functions sirf `App` mein
- `HabitList` ke andar input ke liye **second local state**: `const [name, setName] = useState('')`

**KYUN:**
- **Lifting state up** ka yeh pattern React docs ka recommended hai jab multiple children ko same data chahiye.
- Sirf `habits` array ek parent (`App`) ke children ko chahiye — Redux etc. ki zaroorat abhi nahi. Jab Supabase/auth aayega, wahan context ya external store dekhna logical hoga.
- Form input ka text **global nahi hona chahiye** — wo sirf form ka internal concern hai, is liye `HabitList` mein local state rakha (rule: jo data kisi ek component ko chahiye, wahan local).
---

## Entry 004 — Bug/Decision: `status` toggle immutable update + stable IDs

**Problem:**
Habit par "Done/Pending" toggle karte waqt agar hum array/object ko mutate karein (jaise `h.status = 'done'`), to React re-render detect nahi karta aur list purani render hoti — classic React bug.

**Chosen React solution:**
```js
setHabits((prev) =>
  prev.map((h) =>
    h.id === id
      ? { ...h, status: h.status === 'done' ? 'pending' : 'done' }
      : h,
  ),
)
// + id: crypto.randomUUID() — ab index par rely nahi karte
```

**KYUN:**
- **Immutability:** `map` + spread (`{ ...h }`) nayi array + nayi object banata hai → React ko reference change dikhta hai → re-render guaranteed.
- **`crypto.randomUUID()`:** `key={index}` nahi use kiya. Index key par delete/reorder hote hi UI tabah ho jati hai. Unique ID stable key deta hai — `HabitItem` ko `key` milti hai jo list mein kabhi change nahi hogi.

---

## Entry 005 — Styling approach: Tailwind utility-first (no CSS modules, no styled-components)

**Problem:**
Starter app mein `App.css` aur `index.css` mein hand-written CSS classes thein (`.hero`, `.ticks`, `.counter`) jo starter boilerplate thi — habit tracker ke liye irrelevant.

**Chosen React solution:**
- `App.css` delete kiya, `index.css` sirf `@import "tailwindcss";` + base body styles tak minify kiya
- Saari styling inline Tailwind classes se: `flex`, `rounded-xl`, `bg-violet-600`, `line-through`, etc.

**KYUN:**
- Utility classes components ke saath rahti hain — background state ke hisaab se green/gray conditional classes sirf JSX mein readable milti hain.
- Purana CSS remove kiya kyunki wo dead code tha — bundle chota, build fast (verified: build ~800ms, CSS 12.59 kB).
- Tailwind ka specificity predictable hota hai — CSS modules/cascade conflicts nahi.

---

## Entry 006 — Documentation: Docs folder as single source of knowledge

**Problem:**
Har decision/architecture kahin likha na ho to 2 hafte baad koi nahi jaanta ke app ne yeh cheezein kyon choose ki. Baar-baar sawal aate — "yeh state App mein kyon hai?"

**Chosen React solution:**
```
docs/
 ├─ COMPONENT_ARCHITECTURE.md   ← component tree, props flow, state concept
 └─ ai_decision_log.md          ← YE file — har decision with "KYUN"
```

**KYUN:**
- **Institutional knowledge:** Docs code ke saath version control mein rehta hai — koi bhi (INSAN ho ya AI) project ko quickly samajh leta hai.
- **AI-friendly:** Future AI agents ko context dena easy ho jata hai — wo docs parh kar same patterns follow karta hai, wrong architecture banane se bachta hai.
- Yeh file ab project ka standing rule hai: "jab bhi koi library choose ho, structure bane, ya bug solve ho → yahan entry."

---

### Append rule (Rule for future entries)

Jab bhi nayi decision ho:
1. `docs/ai_decision_log.md` mein nayi **Entry 0XX** add karo (last number se aage).
2. Teen sections poore karo: **Problem**, **Chosen React solution**, **KYUN**.
3. Entry ek hi kaam ke liye segment karo — "library install" and "component structure" alag entries rakho.
---

## Entry 007 — Bug fix: "Add" button dead + missing Delete feature

**Problem:**
User ne report kiya — Add button par click karne par kuch nahi hota. Do possible root causes thein:
1. `crypto.randomUUID()` sirf **secure contexts** (https / localhost) mein available hota hai. Non-secure context ya purane browser mein `crypto.randomUUID` `undefined` hota hai → Add par click karte hi throw → habit add nahi hoti.
2. Purane dev server (port 5173) ki stale Vite cache/browser cache.

Plus, Delete button feature abhi bana hi nahi tha.

**Chosen React solution:**
```js
function createId() {
  const id =
    crypto.randomUUID?.() ??                    // secure context → UUID
    `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}` // fallback
  return id
}
```
- `removeHabit(id)` App mein: `setHabits((prev) => prev.filter((h) => h.id !== id))`
- `onRemove` prop: `App → HabitList → HabitItem`, jo row mein lucide `Trash2` icon button par `onRemove(habit.id)` call karta hai.
- Purane dono dev servers kill karke fresh server start kiya (cache reset).

**KYUN:**
- **Optional chaining `?.` + `??`:** Pehle browser/FE try karta hai modern API; na mile to kabhi fail-na-ho-ne-wala fallback. Is se button **har context / har browser** mein chalta hai — secure-context dependency khatam.
- **Delete bhi same pattern:** State upar (`App`), event upar (`onRemove`) — purana architecture mein koi naya pattern nahi, is liye codebase consistent.
- **Fresh server:** Vite ki stale dep-cache kabhi-kabhi purana module graph serve karti hai; dev server restart isse khatam karta hai — user ko `Ctrl+Shift+R` (hard refresh) bhi karna chahiye.