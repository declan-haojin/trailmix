import './App.css';
import {useState, useEffect} from 'react';
import {getARandomPark} from './functions/getARandomPark';
import {getUserProfile} from './functions/getUserProfile';

function App() {
    const [data, setData] = useState('TrailMix: fetching data...');
    const [profile, setProfile] = useState({name: '', email: ''});
    const [profileLoaded, setProfileLoaded] = useState(false);

    // Function to extract the token from the URL query string
    const extractTokenFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            // Store the token in localStorage
            localStorage.setItem('jwtToken', token);

            // Remove the token from the URL to clean up the URL
            window.history.replaceState(null, null, window.location.pathname);
        }
    };

    // Fetch user profile and update state
    const fetchUserProfile = async () => {
        try {
            const profileData = await getUserProfile();  // Call the refactored function
            if (profileData && profileData.name && profileData.email) {
                setProfile(profileData);  // Set profile state
                setProfileLoaded(true);  // Mark the profile as loaded
                console.log(profileData);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    useEffect(() => {
        // Extract the token from the URL and clean it up
        extractTokenFromUrl();

        // Fetch the random park data
        getARandomPark()
            .then((res) => {
                setData(res[0].name + ' National Park, ' + res[0].state);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="App">
            <h1>{data}</h1>

            {/* Sign Up Button */}
            <a href="http://localhost:3001/api/auth/google"
               className="btn">Sign Up</a>

            {/* Profile Button */}
            <button onClick={fetchUserProfile}>Profile</button>

            {/* Conditionally render profile info if loaded */}
            {profileLoaded ? (
                <div>
                    <h2>User Profile</h2>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                </div>
            ) : (
                <p>No user profile loaded: please sign up first</p>
            )}
        </div>
    );
}

export default App;