import './App.css';
import {useState, useEffect} from 'react';
import {getARandomPark} from './functions/getARandomPark';
import {getUserProfile} from './functions/getUserProfile';

function App() {
    const [data, setData] = useState('TrailMix: fetching data...');
    const [profile, setProfile] = useState({name: '', email: ''});
    const [profileLoaded, setProfileLoaded] = useState(false);

    useEffect(() => {
        getARandomPark()
            .then((res) => {
                setData(res[0].name + ' National Park, ' + res[0].state);
            })
            .catch((err) => console.log(err));
    }, []);

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
                <p>No profile loaded</p>
            )}
        </div>
    );
}

export default App;