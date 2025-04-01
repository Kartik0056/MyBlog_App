import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import SignupForm from "./components/auth/SignupForm"
import LoginForm from "./components/auth/LoginForm"
import Dashboard from "./components/dashboard/Dashboard"
import { ThemeProvider } from "./components/theme-provider"

const App = () => {
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="blog-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route
              path="/signup"
              element={
                <div className="container max-w-md mx-auto py-12">
                  <SignupForm />
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div className="container max-w-md mx-auto py-12">
                  <LoginForm />
                </div>
              }
            />
            <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

