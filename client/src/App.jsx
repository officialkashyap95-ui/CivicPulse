import { Routes, Route, Navigate } from 'react-router-dom'
import { SignIn, SignUp, useAuth } from '@clerk/react'

import LandingPage from './pages/LandingPage'
import CitizenDashboard from './pages/CitizenDashboard'
import AuthorityDashboard from './pages/AuthorityDashboard'
import ReportIssue from './pages/ReportIssue'


function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <p>Loading...</p>

  return isSignedIn ? children : <Navigate to="/sign-in" replace />
}


export default function App() {
  return (
    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />


      {/* Authentication */}
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


      {/* Citizen Dashboard */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />


      {/* Report Issue */}
      <Route
        path="/citizen/report"
        element={
          <ProtectedRoute>
            <ReportIssue />
          </ProtectedRoute>
        }
      />


      {/* Authority Dashboard */}
      <Route
        path="/authority"
        element={
          <ProtectedRoute>
            <AuthorityDashboard />
          </ProtectedRoute>
        }
      />


      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}