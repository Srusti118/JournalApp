import { useState, useRef, useEffect } from "react";

function EntryForm({ onAddEntry }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [errors, setErrors] = useState({});
    const titleRef = useRef(null);

    useEffect(() => {
        titleRef.current.focus();
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        if (body.trim().length < 10) {
            newErrors.body = "Entry must be at least 10 characters";
        }

        return newErrors;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAddEntry({
            id: Date.now(),
            title,
            body,
            date: new Date().toLocaleDateString(),
        });

        setErrors({});
        setTitle("");
        setBody("");
    };

    return (
        <form className="entry-form" onSubmit={handleSubmit}>
            <input
                className="form-input"
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })) }}
                placeholder="Write your title"
            />
            {errors.title && <p style={{ color: '#e8607a', fontSize: '0.82rem', margin: '0' }}>{errors.title}</p>}

            <textarea
                className="form-textarea"
                value={body}
                onChange={(e) => { setBody(e.target.value); setErrors(prev => ({ ...prev, body: '' })) }}
                placeholder="Let your feelings out"
            />
            {errors.body && <p style={{ color: '#e8607a', fontSize: '0.82rem', margin: '0' }}>{errors.body}</p>}

            <button className="form-button" type="submit">
                Submit
            </button>
        </form>
    );
}

export default EntryForm;