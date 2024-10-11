import './App.css';
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {extractTokenFromUrl, checkAuthentication} from './functions/auth';
import {getSignUpLink} from './functions/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

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