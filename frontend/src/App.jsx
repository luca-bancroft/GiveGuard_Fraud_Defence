import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  document.title = 'GiveGuard'
  return (
    <div className="min-h-screen" style={{backgroundColor: '#030712', color: 'white'}}>
      <Dashboard />
    </div>
  )
}