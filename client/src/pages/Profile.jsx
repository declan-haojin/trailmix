import {useEffect, useState} from 'react';
import {getUserProfile} from '../functions/getUserProfile';
import {logout} from '../functions/logout';

function Profile() {
    const [profile, setProfile] = useState({name: '', email: '', profilePic: ''});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getUserProfile();
                setProfile(profileData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile data');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <article>
                <h1>User Profile</h1>
                <hr/>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <img src={profile.profilePic} alt="User profile"/>
            </article>
            <article>
                <button onClick={logout}>Logout</button>
            </article>
        </div>
    );
}

export default Profile;