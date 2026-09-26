import { useEffect } from "react"
import { useForm } from "react-hook-form"

function EntryForm({ onAddEntry, editingEntry, onUpdateEntry, onCancelEdit }) {
  const { register, handleSubmit, reset, setValue, formState: { errors }, setFocus } = useForm()

  useEffect(() => {
    if (editingEntry) {
      setValue("title", editingEntry.title)
      setValue("body", editingEntry.body)
      setFocus("title")
    } else {
      reset({ title: "", body: "" })
      setFocus("title")
    }
  }, [editingEntry, setValue, setFocus, reset])

  const onSubmit = (data) => {
    if (editingEntry) {
      onUpdateEntry(editingEntry._id, {
        title: data.title,
        body: data.body
      })
    } else {
      onAddEntry({
        title: data.title,
        body: data.body
      })
      reset()
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        className="form-input"
        placeholder="Write your title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <p style={{ color: '#e8607a', fontSize: '0.82rem', margin: 0 }}>{errors.title.message}</p>}

      <textarea
        className="form-textarea"
        placeholder="Let your feelings out"
        {...register("body", { minLength: { value: 10, message: "Entry must be at least 10 characters" } })}
      />
      {errors.body && <p style={{ color: '#e8607a', fontSize: '0.82rem', margin: 0 }}>{errors.body.message}</p>}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="form-button" type="submit">
          {editingEntry ? "Update Entry" : "Submit"}
        </button>
        {editingEntry && (
          <button
            type="button"
            className="form-button"
            style={{ background: '#888' }}
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default EntryForm
