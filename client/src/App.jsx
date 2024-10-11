import './App.css';
import {useState, useEffect} from 'react';
import {getARandomPark} from './functions/getARandomPark';
import {getUserProfile} from './functions/getUserProfile';

function App() {
    const [data, setData] = useState('TrailMix: fetching data...');
    const [profile, setProfile] = useState({name: '', email: '', profilePic: ''});
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication

    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/;SameSite=None;Secure`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const extractTokenFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            setCookie('jwtToken', token, 30);  // Store token for 30 days
            window.history.replaceState(null, null, window.location.pathname);
        }
    };

    const checkAuthentication = () => {
        const token = getCookie('jwtToken');  // Check if jwtToken exists in the cookies
        if (token) {
            setIsAuthenticated(true);  // Set the user as authenticated
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
        checkAuthentication();

        getARandomPark()
            .then((res) => {
                setData(res[0].name + ' National Park, ' + res[0].state);
            })
            .catch((err) => console.log(err));
    }, []);

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
            <nav>
                <ul>
                    <li><a href="/"><strong><h1>TrailMix</h1></strong></a></li>
                </ul>
                <ul>
                    <li><a className="contrast" href="#">About</a></li>
                    {/* Conditionally render Log In and Sign Up if not authenticated */}
                    {!isAuthenticated && (
                        <>
                            <li><a className="contrast" href={getSignUpLink()}>Log In</a></li>
                            <li>
                                <a href={getSignUpLink()}>
                                    <button>Sign Up</button>
                                </a>
                            </li>
                        </>
                    )}
                    {/* Show Profile button if authenticated */}
                    {isAuthenticated && (
                        <li>
                            <button onClick={fetchUserProfile}>Profile</button>
                        </li>
                    )}
                </ul>
            </nav>
            <h1>Explore, document, and showcase <br/><span className="gradient">Your national park
                journey.</span></h1>
            <hr/>
            <br/>

            <div className="group">
                <article>
                    <h1>🏞️&nbsp;&nbsp;One park a day...</h1>
                    <hr/>
                    <h2>{data}</h2>
                    <p>Every day is an adventure waiting to happen! Discover a new national park each day, from the
                        towering peaks of the Rockies to the serene forests of the Pacific Northwest. Whether you're
                        planning your next outdoor escape or just exploring from your screen, there's always a fresh
                        journey in store. Breathe in the beauty, embrace the wild, and let nature inspire your next
                        adventure.</p>
                </article>

                <article>
                    <h1>💭&nbsp;&nbsp;Did you know...</h1>
                    <hr/>
                    <h2>The Least-Visited National Park Saw Just 11,000 Visitors</h2>
                    <p>
                        The most-visited national park, the Great Smoky Mountains, welcomed more than 13 million
                        visitors in 2023. By comparison, the least-visited park welcomed just 11,000. That title belongs
                        to Gates of the Arctic National Park and Preserve, located in a remote part of Alaska.
                        In fact, five of the top ten least visited national parks are located in Alaska. One, Dry
                        Tortugas National Park, located in the Florida Keys, is accessible only by boat or seaplane.</p>
                </article>
            </div>


            <article>
                <h1>63 National Parks on the map</h1>
                <hr></hr>
                <iframe src="https://snazzymaps.com/embed/482375" width="100%" height="600px"
                ></iframe>
            </article>

            <article>
                <h1>Complete National Park list</h1>
                <table className="striped">
                    <thead>
                    <tr>
                        <th scope="col">Park name</th>
                        <th scope="col">Location</th>
                        <th scope="col">Established</th>
                        <th scope="col">Annual visitors</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">Mercury</th>
                        <td>4,880</td>
                        <td>0.39</td>
                        <td>88</td>
                    </tr>
                    <tr>
                        <th scope="row">Venus</th>
                        <td>12,104</td>
                        <td>0.72</td>
                        <td>225</td>
                    </tr>
                    <tr>
                        <th scope="row">Earth</th>
                        <td>12,742</td>
                        <td>1.00</td>
                        <td>365</td>
                    </tr>
                    <tr>
                        <th scope="row">Mars</th>
                        <td>6,779</td>
                        <td>1.52</td>
                        <td>687</td>
                    </tr>
                    </tbody>
                </table>
            </article>

            {/* Conditionally render profile info if loaded */}
            {profileLoaded && (
                <div>
                    <h2>User Profile</h2>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <img src={profile.profilePic} alt="User profile picture"/>
                </div>
            )}

        </div>
    );
}

export default App;