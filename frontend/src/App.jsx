import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";
import AIRecommendation from "./components/AIRecommendation";
import Profile from "./pages/Profile"; 
import Loading from "./components/Loading";
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

 if (loading) {
  return <Loading />;
}

  return (
    <>
      {/* Header artık her sayfada görünsün istersen böyle bırak.
          Sadece login’de görünmesin dersen alttaki koşulu kullanabilirsin. */}
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />

        {/* Public Home */}
        <Route path="/" element={<Home />} />

        {/* Public Movie Detail */}
        <Route path="/movie/:id" element={<MovieDetail />} />

        {/* Public AI Page */}
        <Route path="/ai-recommendations" element={<AIRecommendation />} />
         <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
        />
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-netflix-black min-h-screen text-white">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
