import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Register from './components/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import TodoList from './pages/TodoList'
import AddTodo from './pages/AddTodo'
import Calendar from './pages/Calendar'
import MeetingNotes from './pages/MeetingNotes'
import Utilities from './pages/Utilities'
import JsonFormatter from './pages/JsonFormatter'
import JsonCompare from './pages/JsonCompare'
import QrGenerator from './pages/QrGenerator'
import WbsManager from './pages/WbsManager'
import MyPage from './pages/MyPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todo"
            element={
              <ProtectedRoute>
                <TodoList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todolist"
            element={
              <ProtectedRoute>
                <TodoList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todo/add"
            element={
              <ProtectedRoute>
                <AddTodo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-todo"
            element={
              <ProtectedRoute>
                <AddTodo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting-notes"
            element={
              <ProtectedRoute>
                <MeetingNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/utilities"
            element={
              <ProtectedRoute>
                <Utilities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/json-formatter"
            element={
              <ProtectedRoute>
                <JsonFormatter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/json-compare"
            element={
              <ProtectedRoute>
                <JsonCompare />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-generator"
            element={
              <ProtectedRoute>
                <QrGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wbs-manager"
            element={
              <ProtectedRoute>
                <WbsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App