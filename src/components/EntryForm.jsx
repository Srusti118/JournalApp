import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"

function EntryForm({ onAddEntry }) {
  const { register, handleSubmit, reset, formState: { errors }, setFocus } = useForm()

  useEffect(() => {
    setFocus("title")
  }, [setFocus])

  const onSubmit = (data) => {
    onAddEntry({
      title: data.title,
      body: data.body
    })
    reset()
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

      <button className="form-button" type="submit">Submit</button>
    </form>
  )
}

export default EntryForm
