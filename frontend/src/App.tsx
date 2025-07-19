import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Register from './components/Register'
import Home from './pages/Home'
import Functions from './pages/Functions'
import TodoList from './pages/TodoList'
import AddTodo from './pages/AddTodo'
import TodoDetail from './pages/TodoDetail'
import Calendar from './pages/Calendar'
import MeetingNotes from './pages/MeetingNotes'
import Utilities from './pages/Utilities'
import JsonFormatter from './pages/JsonFormatter'
import JsonCompare from './pages/JsonCompare'
import QrGenerator from './pages/QrGenerator'
import WbsManager from './pages/WbsManager'
import MyPage from './pages/MyPage'
import AddMeeting from './pages/AddMeeting'
import MeetingDetail from './pages/MeetingDetail'
import WBSList from './pages/WBSList'
import AddWBS from './pages/AddWBS'
import EditWBS from './pages/EditWBS'
import WBSDetail from './pages/WBSDetail'
import AddWBSTask from './pages/AddWBSTask'
import ServiceIntroPage from './pages/ServiceIntroPage'
import HomeScreenCustomization from './pages/HomeScreenCustomization'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ServiceIntroPage />} />
          <Route path="/intro" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/functions"
            element={
              <ProtectedRoute>
                <Functions />
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
            path="/todo/:id"
            element={
              <ProtectedRoute>
                <TodoDetail />
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
            path="/meeting/add"
            element={
              <ProtectedRoute>
                <AddMeeting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting/:id"
            element={
              <ProtectedRoute>
                <MeetingDetail />
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
            path="/wbs"
            element={
              <ProtectedRoute>
                <WBSList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wbs/add"
            element={
              <ProtectedRoute>
                <AddWBS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wbs/edit/:id"
            element={
              <ProtectedRoute>
                <EditWBS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wbs/detail/:id"
            element={
              <ProtectedRoute>
                <WBSDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wbs/projects/:projectId/tasks/add"
            element={
              <ProtectedRoute>
                <AddWBSTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wbs/:id"
            element={
              <ProtectedRoute>
                <WBSDetail />
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
          <Route
            path="/home-screen-customization"
            element={
              <ProtectedRoute>
                <HomeScreenCustomization />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App