import { useEffect, useState } from "react";
import EntryForm from "../components/EntryForm";
import JournalEntry from "../components/JournalEntry";

const Home = ({ entries, addEntry, deleteEntry }) => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuote = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                "https://dummyjson.com/quotes/random"
            );

            if (!res.ok) {
                throw new Error("Failed to fetch quote");
            }

            const data = await res.json();
            setQuote(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <>
            <div className="inspiration-section">
                {loading && <p className="inspiration-loading">Loading inspiration...</p>}
                {error && <p className="inspiration-error">Error: {error}</p>}
                {quote && (
                    <div className="inspiration-card">
                        <p className="inspiration-quote">"{quote.quote}"</p>
                        <p className="inspiration-author">— {quote.author}</p>
                        <button className="form-button" onClick={fetchQuote}>New Quote</button>
                    </div>
                )}
            </div>

            <EntryForm onAddEntry={addEntry} />

            {entries.map((entry) => (
                <JournalEntry
                    key={entry._id}
                    {...entry}
                    onDelete={deleteEntry}
                />
            ))}
        </>
    );
};

export default Home;