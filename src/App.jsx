import Header from "./components/Header";
import JournalEntry from "./components/JournalEntry";
import "./App.css";
import EntryForm from "./components/EntryForm";
import { useState } from "react";

const App = () => {
    const [entries, setEntries] = useState([
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
        setEntries((prev) => [...prev, newEntry]);
    };

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