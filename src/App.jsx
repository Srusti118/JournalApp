import Header from "./components/Header";
import JournalEntry from "./components/JournalEntry";
import "./App.css";
import EntryForm from "./components/EntryForm";
import { useEffect, useReducer , useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_ENTRY":
            return [...state, action.payload];
        case "DELETE_ENTRY":
            return state.filter(entry => entry.id !== action.payload)


        default:
            return state;
    }
};

const App = () => {
    const [entries, dispatch] = useReducer(reducer, [
        {
            id: 1,
            title: "First Entry",
            date: "June 10",
            body: "Started React",
        },
        {
            id: 2,
            title: "Second Entry",
            date: "June 11",
            body: "Had ice cream",
        },
    ]);

    const addEntry = (newEntry) => {
        dispatch({
            type: "ADD_ENTRY",
            payload: newEntry,
        });
    };
    const deleteEntry = (id) => {
        dispatch({
            type: "DELETE_ENTRY",
            payload: id,
        });
    };



    useEffect(() => {
        document.title = `My Journal (${entries.length} entries)`;
    }, [entries]);

    const [theme , setTheme] = useState("light");
    return (
        <ThemeContext.Provider value={theme}>
        <div className="app">
             <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <Header />
      <EntryForm onAddEntry={addEntry} />
      {entries.map((entry) => (
        <JournalEntry key={entry.id} {...entry} onDelete={deleteEntry} />
      ))}
        </div>
        </ThemeContext.Provider>
    );
};

export default App;