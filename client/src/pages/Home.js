import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {getARandomPark} from '../functions/api';
import {getARandomFunFact} from '../functions/api';

function Home() {
    const [park, setPark] = useState(null);
    const [funFactData, setFunFactData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getARandomPark()
            .then((res) => {
                if (res && res.length > 0) {
                    setPark(res[0]);
                } else {
                    console.log("No park data available.");
                    setError("No park data available.");
                }
            })
            .catch((err) => {
                console.log(err);
                setError("Failed to fetch park data.");
            });

        getARandomFunFact()
            .then((res) => {
                if (res && res.funFact && res.park) {
                    setFunFactData({
                        park: res.park,
                        funFact: res.funFact
                    });
                } else {
                    console.log("No fun fact available.");
                }
            })
            .catch((err) => {
                console.log(err);
                setError("Failed to fetch fun fact.");
            })
            .finally(() => setLoading(false));
    }, []);

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
                    ) : error ? (
                        <p>{error}</p>
                    ) : park ? (
                        <h2>
                            <Link to={`/parks/${park.park_code}`}>
                                {park.name}
                            </Link>
                        </h2>
                    ) : (
                        <p>No park data available.</p>
                    )}
                    <p>Every day is an adventure waiting to happen! Discover a new national park each day, from the
                        towering peaks of the Rockies to the serene forests of the Pacific Northwest.</p>
                </article>

                <article>
                    <h1>💭&nbsp;&nbsp;Did you know...</h1>
                    <hr/>
                    {loading ? (
                        <p>Loading fun fact...</p>
                    ) : (
                        funFactData ? (
                            <div>
                                <h2>
                                    <Link to={`/parks/${funFactData.park.park_code}`}>
                                        {funFactData.park.name}
                                    </Link>
                                </h2>
                                <p>{funFactData.funFact}</p>
                            </div>
                        ) : (
                            <p>No fun fact available.</p>
                        )
                    )}
                </article>
            </div>

            <article>
                <h1>63 National Parks on the map</h1>
                <hr></hr>
                <iframe title="National Park Map" src="https://snazzymaps.com/embed/482375" width="100%" height="600px"></iframe>
            </article>
        </div>
    );
}

export default Home;