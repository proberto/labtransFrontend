import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { ReservationsPage } from './pages/ReservationsPage'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <ReservationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/reservations" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
