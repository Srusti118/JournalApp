# React Learning Notes

A production-focused reference for concepts covered. Use this to recall patterns quickly.

---

## ES6+ Fundamentals

### Key Concepts
- Use `const` by default, `let` only when reassigning. Never `var`.
- Arrow functions: `const fn = (x) => x * 2` — implicit return when no curly braces.
- Destructuring: `const { name, age } = user` / `const [a, b] = arr`
- Spread: always create new objects/arrays instead of mutating — `{ ...obj, key: newVal }`
- `map`, `filter`, `find`, `reduce` — master these, they're everywhere in React
- `async/await` with `try/catch` for all async operations
- `import/export` — named exports `{ X }` vs default exports

### Production Tips
- Prefer named exports over default exports in large codebases — easier to refactor and search
- Always use `const` for component definitions and functions
- Use optional chaining `user?.address?.city` to avoid runtime errors on nested objects

---

## JSX

### Key Concepts
- JSX compiles to `React.createElement()` — it's JavaScript, not HTML
- Must return a single root element — use `<>...</>` fragments to avoid extra DOM nodes
- `className` instead of `class`, `htmlFor` instead of `for`
- JavaScript expressions go inside `{}`
- Self-closing tags must close: `<img />`, `<input />`

### Production Tips
- Prefer fragments `<>` over wrapper divs to keep DOM clean
- Keep JSX readable — extract complex expressions into variables before the return
- Never put logic inside JSX that belongs in the component body

---

## Components

### Key Concepts
- A component is a function that returns JSX
- Name must start with a capital letter
- One component per file — export default at the bottom
- Keep components small and focused on one responsibility

### Production Tips
- Folder structure: `src/components/`, `src/pages/`, `src/hooks/`
- Name files same as the component: `Header.jsx` exports `Header`
- Split large components into smaller ones early — easier than refactoring later
- Avoid deeply nested JSX — extract into sub-components

---

## Props

### Key Concepts
- Props pass data from parent to child — one way only
- Destructure props in function signature: `function Card({ title, date })`
- Props are read-only — never mutate them
- Use spread for passing all props: `<Component {...obj} />`

### Production Tips
- Define prop types or use TypeScript to catch bugs early
- Use default values for optional props: `function Card({ title = "Untitled" })`
- Prefix function props with `on`: `onDelete`, `onSubmit`, `onChange`
- Avoid passing too many props — if you have 5+ props, consider context or restructuring

---

## State (useState)

### Key Concepts
- `const [value, setValue] = useState(initialValue)`
- State change triggers re-render
- Never mutate state directly — always use the setter
- For object/array state, always spread: `setState({ ...state, key: val })`
- Use functional update when new state depends on previous: `setState(prev => prev + 1)`

### Production Tips
- Keep state as local as possible — lift up only when needed
- Don't create state for values you can derive: use `entries.length` not a separate `count` state
- Group related state into objects rather than multiple `useState` calls
- Initialize state with the correct type — don't start with `null` if you expect an array

---

## Event Handling

### Key Concepts
- Events are camelCase: `onClick`, `onChange`, `onSubmit`
- Always pass a function reference, not a call: `onClick={handleClick}` not `onClick={handleClick()}`
- `e.preventDefault()` to stop default browser behavior (form submit, link navigation)
- Name handlers with `handle` prefix: `handleClick`, `handleSubmit`, `handleDelete`

### Production Tips
- Extract inline handlers into named functions when logic is more than one line
- Always call `e.preventDefault()` on form submissions
- Use `e.stopPropagation()` when you need to prevent event bubbling

---

## Conditional Rendering

### Key Concepts
- `&&` operator: `{condition && <Component />}` — renders nothing if false
- Ternary: `{condition ? <A /> : <B />}`
- Early return: `if (loading) return <Spinner />`

### Production Tips
- Prefer early returns for loading/error states — keeps main JSX clean
- Be careful with `&&` and falsy values — `{0 && <X />}` renders `0`, use `{count > 0 && <X />}`
- Extract complex conditions into variables: `const isVisible = user && user.role === 'admin'`

---

## Rendering Lists

### Key Concepts
- Use `map` to render arrays: `{items.map(item => <Item key={item.id} />)}`
- Every list item needs a unique `key` prop
- Keys should be stable unique IDs — avoid using array index in dynamic lists

### Production Tips
- Always use a real ID as key, not array index — index causes bugs when list order changes
- Keep the `key` on the outermost element returned from `map`
- Extract list items into their own components for cleaner code

---

## Forms & Controlled Components

### Key Concepts
- Controlled: React owns the input value via state + `onChange`
- `value={state}` + `onChange={(e) => setState(e.target.value)}`
- `e.preventDefault()` on form submit to stop page refresh
- `<textarea>` works the same as `<input>` in React

### Production Tips
- Always use controlled components — uncontrolled inputs are harder to validate and test
- Reset form after submit: `setTitle(""); setBody("")`
- For complex forms with many fields, use React Hook Form (covered later)
- Validate before calling submit handlers — don't pass empty data up

---

## useEffect

### Key Concepts
- Runs after render — for side effects outside React (API calls, DOM, timers)
- `[]` = runs once on mount
- `[dep]` = runs when dependency changes
- No array = runs after every render
- Return a cleanup function for timers, subscriptions, event listeners

### Production Tips
- Always include all values used inside the effect in the dependency array
- Cleanup is mandatory for timers and event listeners — memory leaks are real
- Don't fetch data directly in useEffect for production apps — use React Query instead (covered later)
- Avoid multiple unrelated effects in one `useEffect` — split them

---

## useRef

### Key Concepts
- `const ref = useRef(null)` — initialize with `null` for DOM refs
- Access via `ref.current`
- Attach to element: `<input ref={ref} />`
- Changing `.current` does NOT trigger re-render

### Production Tips
- Use for DOM manipulation: focus, scroll, measure elements
- Use for storing values that shouldn't trigger re-renders (previous values, timer IDs)
- Don't read refs during render — only in effects or event handlers
- For interval/timeout IDs always store in a ref so you can clear them in cleanup

---

## useReducer

### Key Concepts
- `const [state, dispatch] = useReducer(reducer, initialState)`
- Reducer: `(state, action) => newState` — pure function, no side effects
- Dispatch: `dispatch({ type: "ACTION_TYPE", payload: data })`
- Define reducer outside the component — no need to recreate on every render

### Production Tips
- Use when you have multiple related state updates or complex state logic
- Action types as constants or enums to avoid typos: `const ADD_ENTRY = "ADD_ENTRY"`
- Keep reducers pure — no API calls, no side effects inside
- `payload` is convention for action data — use it consistently
- Co-locate reducer with the component or extract to its own file for large apps

---

## useContext

### Key Concepts
- `createContext()` creates the context
- `<Context.Provider value={val}>` makes value available to all children
- `useContext(Context)` reads the value — no prop drilling needed
- Any consumer re-renders when context value changes

### Production Tips
- Best for: theme, language, auth user, app-wide settings
- Avoid for: frequently changing values (every keystroke) — causes too many re-renders
- Keep context in a separate file to avoid circular imports
- Combine with `useReducer` for scalable global state (covered in State Management)
- Don't overuse — not everything needs context, prefer props for simple parent→child data

---

## Component Communication Patterns

### Props (Parent → Child)
```
App → passes data/functions as props → Child
```

### Lifting State Up (Child → Parent)
```
App → passes callback as prop → Child → calls callback with data → App updates state
```

### Context (Any → Any)
```
Provider wraps tree → any consumer reads value directly → no prop drilling
```

### Production Tips
- Start with props, lift state when needed, reach for context only when prop drilling gets painful
- Context is not a replacement for all props — use props for direct parent→child relationships
- For large apps, consider Zustand or Redux Toolkit (covered later)

---

## General Production Rules

- Never mutate state or props directly
- Keep components small and single-responsibility
- Name things clearly: `handleSubmit`, `onDelete`, `isLoading`, `titleRef`
- Remove all `console.log` before shipping
- Always handle loading and error states when fetching data
- Use React DevTools to inspect component tree and state during development

---

## Custom Hooks

### Key Concepts
- A custom hook is a function that starts with `use` and calls other hooks inside it
- Extracts reusable stateful logic out of components
- Returns whatever the component needs — value, array, object, functions
- The `use` prefix is required — React enforces hook rules on it

```
Component A  ──┐
Component B  ──┼──► useLocalStorage (one place, reused everywhere)
Component C  ──┘
```

### Pattern
```js
const useCustomHook = (params) => {
  // hooks inside
  const [value, setValue] = useState(...)
  useEffect(() => { ... }, [...])

  // return what components need
  return [value, setValue]
}
```

### Lazy Initialization in useState
```js
// function passed to useState runs only once on mount — good for expensive operations
const [value, setValue] = useState(() => {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : initialValue
})
```

### Production Tips
- Always start the name with `use` — non-negotiable
- Keep hooks focused — one concern per hook (`useLocalStorage`, `useWindowSize`, `useFetch`)
- Store hooks in `src/hooks/` folder
- A hook can call other custom hooks inside it
- Don't call hooks conditionally — always at the top level of the function
- Custom hooks are the right pattern when you find yourself copy-pasting `useState` + `useEffect` combos across components

---

## Routing (React Router DOM)

### Key Concepts
- React has no built-in router — `react-router-dom` is the standard
- `BrowserRouter` — wraps the entire app in `main.jsx`, enables URL routing
- `Routes` — container for all route definitions
- `Route` — maps a URL path to a component
- `Link` — client-side navigation, no page refresh (use instead of `<a>`)

### Setup
```
main.jsx → BrowserRouter wraps App
App.jsx  → Routes + Route definitions
Header   → Link components for navigation
pages/   → one component per route
```

### Basic Pattern
```jsx
// main.jsx
<BrowserRouter>
  <App />
</BrowserRouter>

// App.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>

// Header.jsx
<Link to="/">Home</Link>
<Link to="/about">About</Link>
```

### Flow Diagram
```
URL changes
    ↓
BrowserRouter detects it
    ↓
Routes finds matching Route
    ↓
Renders the element for that path
```

### Production Tips
- Always use `Link` instead of `<a href>` — `<a>` causes full page refresh
- Keep `BrowserRouter` in `main.jsx`, `Routes` in `App.jsx`
- Put page components in `src/pages/`, reusable UI in `src/components/`
- Pass page-specific data as props from `App` to page components
- Use `NavLink` instead of `Link` when you need active link styling

---

## Full App Data Flow (Journal App)

```
main.jsx
└── BrowserRouter
    └── App.jsx (owns entries state + theme state)
        ├── ThemeContext.Provider → Header reads theme via useContext
        ├── Routes
        │   ├── / → Home.jsx (entries, addEntry, deleteEntry via props)
        │   │   ├── EntryForm → calls addEntry on submit
        │   │   └── JournalEntry → calls deleteEntry on delete
        │   └── /about → About.jsx
        └── useLocalStorage → persists entries to browser storage
```

### Key Principle
- State lives as high as needed, passed down only as far as needed
- Global state (theme) → Context (no prop drilling)
- Page state (entries) → props from App → page component → child components
- Browser persistence → custom hook (useLocalStorage) abstracts the logic
