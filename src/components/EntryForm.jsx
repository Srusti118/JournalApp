import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

function EntryForm({ onAddEntry, editingEntry, onUpdateEntry, onCancelEdit }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm({
    defaultValues: {
      title: '',
      body: '',
    },
  })

  const watchedBody = watch('body') || ''
  const charCount = watchedBody.trim().length
  const wordCount = watchedBody.trim() ? watchedBody.trim().split(/\s+/).length : 0

  useEffect(() => {
    if (editingEntry) {
      setValue('title', editingEntry.title || '')
      setValue('body', editingEntry.body || '')
      setFocus('title')
    } else {
      reset({ title: '', body: '' })
      setFocus('title')
    }
  }, [editingEntry, setValue, setFocus, reset])

  const onSubmit = async (data) => {
    try {
      if (editingEntry) {
        await onUpdateEntry(editingEntry._id, {
          title: data.title.trim(),
          body: data.body.trim(),
        })
      } else {
        await onAddEntry({
          title: data.title.trim(),
          body: data.body.trim(),
        })
        reset({ title: '', body: '' })
      }
    } catch {
      reset({ title: '', body: '' })
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="entry-form-header">
        <h2 className="entry-form-title">
          {editingEntry ? 'Refine Reflection' : 'New Reflection'}
        </h2>
        {editingEntry && (
          <span className="editing-badge">Editing Mode</span>
        )}
      </div>

      <div>
        <input
          className="form-input"
          placeholder="Title this moment..."
          maxLength={100}
          {...register('title', {
            required: 'Please give your reflection a title',
            maxLength: { value: 100, message: 'Title must be 100 characters or fewer' },
          })}
        />
        {errors.title && (
          <p className="form-error-msg" style={{ marginTop: '6px' }}>
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <textarea
          className="form-textarea"
          placeholder="Pour your heart and thoughts out here. This space is entirely yours..."
          {...register('body', {
            required: 'Please write a few thoughts to save your reflection',
            minLength: {
              value: 10,
              message: 'Reflection must be at least 10 characters long',
            },
          })}
        />
        <div className="form-meta-row">
          <div className="form-stats">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>·</span>
            <span>{charCount} characters {charCount < 10 && charCount > 0 ? '(min 10)' : ''}</span>
          </div>
          {errors.body && (
            <p className="form-error-msg">{errors.body.message}</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          className="form-button"
          type="submit"
          disabled={isSubmitting}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {editingEntry ? 'Update Reflection' : 'Save Reflection'}
        </button>

        {editingEntry && (
          <button
            type="button"
            className="form-button-cancel"
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
