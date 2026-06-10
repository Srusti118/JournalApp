import Header from "./components/Header";
import JournalEntry from "./components/JournalEntry";
import "./App.css";
import EntryForm from "./components/EntryForm";
import { useEffect, useReducer } from "react";

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

    useEffect(() => {
        document.title = `My Journal (${entries.length} entries)`;
    }, [entries]);

    return (
        <div className="app">
            <Header />
            <EntryForm onAddEntry={addEntry} />

            {entries.map((entry) => (
                <JournalEntry key={entry.id} {...entry} />
            ))}
        </div>
    );
};

export default App;