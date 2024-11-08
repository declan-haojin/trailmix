import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {getParks, getARandomPark, getParksByState} from '../functions/api';

function Home() {
    const [park, setPark] = useState(null);
    const [parks, setParks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getARandomPark()
            .then((res) => {
                setPark(res[0]); // Store the whole park object
                setLoading(false);
            })
            .catch((err) => console.log(err));
        
        getParks()
            .then((res) => {
                setParks(res);
            })
            .catch((err) => console.log(err));
    }, []);

    const filterByState = () => {
        getParksByState('Texas')
            .then((res) => {
                setParks(res);
            })
            .catch((err) => console.log(err));
    }

    return (
        <div>
            <h1>Explore, document, and showcase <br/><span className="gradient">Your national park journey.</span></h1>
            <hr/>
            <br/>
            <div className="group">
                <article>
                    <h1>🏞️&nbsp;&nbsp;One park a day...</h1>
                    <hr/>
                    {loading ? (
                        <p>TrailMix: fetching data...</p>
                    ) : (
                        <h2>
                            <Link to={`/parks/${park.park_code}`}>
                                {park.name}
                            </Link>
                        </h2>
                    )}
                    <p>Every day is an adventure waiting to happen! Discover a new national park each day, from the
                        towering peaks of the Rockies to the serene forests of the Pacific Northwest.</p>
                </article>

                <article>
                    <h1>💭&nbsp;&nbsp;Did you know...</h1>
                    <hr/>
                    <h2>The Least-Visited National Park Saw Just 11,000 Visitors</h2>
                    <p>The most-visited national park, the Great Smoky Mountains, welcomed more than 13 million visitors
                        in 2023.</p>
                </article>
            </div>

            <article>
                <h1>63 National Parks on the map</h1>
                <hr></hr>
                <iframe src="https://snazzymaps.com/embed/482375" width="100%" height="600px"></iframe>
            </article>

            <h1>Complete National Park list</h1>
            <div>
                <button onClick={filterByState}>Filter By State</button>
            </div>

            <div>
                {parks && parks.map((park) => (
                    <article>
                        <b>{park.name}</b>
                        <img src={park.image_url} alt={park.name}/>
                        <br/>
                        <b>state: </b>
                        {park.state}
                        <br/>
                        <b>established: </b>
                        {park.established}
                    </article>
                ))}
            </div>
        </div>
    );
}

export default Home;