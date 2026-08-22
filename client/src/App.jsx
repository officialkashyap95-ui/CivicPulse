import { Routes, Route, Navigate } from 'react-router-dom'
import { SignIn, SignUp, useAuth } from '@clerk/react'
import LandingPage from './pages/LandingPage'
import CitizenDashboard from './pages/CitizenDashboard'
import AuthorityDashboard from './pages/AuthorityDashboard'



function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <p>Loading...</p>

  return isSignedIn ? children : <Navigate to="/sign-in" replace />
}

// function CitizenDashboard() {
//   return <h1>Citizen Dashboard</h1>
// }

// function AuthorityDashboard() {
//   return <h1>Authority Dashboard</h1>
// }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />


      <Route
        path="/sign-in/*"
        element={
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/citizen"
          />
        }
      />

      <Route
        path="/sign-up/*"
        element={
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/citizen"
          />
        }
      />
      <Route path="/citizen" element={<CitizenDashboard />} />

      <Route path="/authority" element={<AuthorityDashboard />} />

      

      <Route path="*" element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}