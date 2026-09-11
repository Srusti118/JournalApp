import Header from "./components/Header";
import "./App.css";
import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { useAuth } from "./hooks/useAuth";
import { useNotes } from "./hooks/useNotes";

const App = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  const { user, loading, login, register, logout } = useAuth();
  const { entries, fetchNotes, addNote: addEntry, deleteNote: deleteEntry, loading: notesLoading } =
    useNotes();

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch notes on mount if logged in
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app ${theme}`}>
        <div className="appInner">
          <Header
            onToggleTheme={toggleTheme}
            user={user}
            onLogout={logout}
          />

          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Home
                    entries={entries}
                    addEntry={addEntry}
                    deleteEntry={deleteEntry}
                    loading={notesLoading}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;