import './App.css';
import {useState, useEffect} from 'react';
import {getARandomPark} from './functions/getARandomPark';
import {getUserProfile} from './functions/getUserProfile';

function App() {
    const [data, setData] = useState('TrailMix: fetching data...');
    const [profile, setProfile] = useState({name: '', email: '', profilePic: ''});
    const [profileLoaded, setProfileLoaded] = useState(false);

    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/;SameSite=None;Secure`;
    };

    const extractTokenFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            setCookie('jwtToken', token, 30);  // Store token for 30 days
            window.history.replaceState(null, null, window.location.pathname);
        }
    };

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
        extractTokenFromUrl();

        getARandomPark()
            .then((res) => {
                setData(res[0].name + ' National Park, ' + res[0].state);
            })
            .catch((err) => console.log(err));
    }, []);

    // Set the Sign Up URL based on the environment variable
    const getSignUpLink = () => {
        const env = process.env.REACT_APP_VERCEL_ENV;
        if (env === 'production') {
            return 'https://trailmix.haojin.li/api/auth/google';
        } else if (env === 'preview') {
            return 'https://trailmix-client-declan-haojin-haojin.vercel.app/api/auth/google';
        } else {
            return 'http://localhost:3001/api/auth/google';
        }
    };

    return (
        <div className="App">
            <h1>{data}</h1>

            {/* Sign Up Button */}
            <a href={getSignUpLink()} className="btn">Sign Up</a>

            {/* Profile Button */}
            <button onClick={fetchUserProfile}>Profile</button>

            {/* Conditionally render profile info if loaded */}
            {profileLoaded ? (
                <div>
                    <h2>User Profile</h2>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <img src={profile.profilePic} alt="User profile picture"/>
                </div>
            ) : (
                <p>No user profile loaded: please sign up first</p>
            )}
        </div>
    );
}

export default App;