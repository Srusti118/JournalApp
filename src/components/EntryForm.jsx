import { useState } from "react";

function EntryForm({ onAddEntry }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        onAddEntry({
            id: Date.now(), // quick way to generate a unique id
            title,
            body,
            date: new Date().toLocaleDateString()
        });
    };

    return (
        <form className="entry-form" onSubmit={handleSubmit}>
            <input
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write your title"
            />

            <textarea
                className="form-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Let your feelings out"
            />

            <button className="form-button" type="submit">Submit</button>
        </form>
    );
}

export default EntryForm;