import { useState } from 'react'

export default function EINSubmitBar({ onSubmit, loading }) {
  const [ein, setEin] = useState('')

  function handleSubmit() {
    if (ein.trim()) {
      onSubmit(ein.trim())
      setEin('')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex gap-3 mb-8">
      <input
        type="text"
        value={ein}
        onChange={e => setEin(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter nonprofit EIN (e.g. 12-3456789)..."
        className="flex-1 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 border border-white/10 outline-none focus:border-white/30"
        style={{ backgroundColor: '#0f172a' }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !ein.trim()}
        className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Verifying...' : 'Verify →'}
      </button>
    </div>
  )
}