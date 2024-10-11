import {Link} from 'react-router-dom';

function Navbar({isAuthenticated, getSignUpLink}) {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/"><h2>TrailMix</h2></Link>
                </li>
            </ul>
            <ul>
                <li>
                    <Link className="contrast" to="/about">About</Link>
                </li>
                {!isAuthenticated ? (
                    <>
                        <li><a className="contrast" href={getSignUpLink()}>Log In</a></li>
                        <li>
                            <a href={getSignUpLink()}>
                                <button>Sign Up</button>
                            </a>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/profile">
                                <button>Profile</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;