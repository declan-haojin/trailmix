import './App.css';
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {extractTokenFromUrl, checkAuthentication} from './functions/auth';
import {getSignUpLink} from './functions/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        extractTokenFromUrl();
        const isAuthenticated = checkAuthentication();
        setIsAuthenticated(isAuthenticated);
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
                    {isAuthenticated && <Route path="/profile" element={<Profile/>}/>}
                </Routes>
            </div>
        </Router>
    );
}

export default App;