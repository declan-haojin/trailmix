import './App.css';
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {extractTokenFromUrl, checkAuthentication} from './functions/auth';
import {getSignUpLink} from './functions/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import Park from './pages/Park';
import AllParks from './pages/AllParks';
import MyParks from "./pages/MyParks";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        extractTokenFromUrl();
        const authStatus = checkAuthentication();
        setIsAuthenticated(authStatus);
    }, []);

    return (
        <Router>
            <div className="App">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    getSignUpLink={getSignUpLink}
                />
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/myparks" element={<MyParks />}/>
                    <Route path="/parks/all" element={<AllParks/>}/>
                    <Route path="/parks/:parkCode" element={<Park/>}/>

                    {/* Use ProtectedRoute for the /profile path */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Profile/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;