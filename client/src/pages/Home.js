import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {getARandomPark} from '../functions/api';
import {getARandomFunFact} from '../functions/api';

function Home() {
    const [park, setPark] = useState(null);
    const [funFact, setFunFact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getARandomPark()
            .then((res) => {
                setPark(res[0]); // Store the whole park object
            })
            .catch((err) => console.log(err));

        getARandomFunFact()
            .then((res) => {
                setFunFact(res.funFact);
            })
            .catch((err) => console.log(err));

        setLoading(false);    
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
                    <h2>{funFact}</h2>
                    <p>The most-visited national park, the Great Smoky Mountains, welcomed more than 13 million visitors
                        in 2023.</p>
                </article>
            </div>

            <article>
                <h1>63 National Parks on the map</h1>
                <hr></hr>
                <iframe title="National Park Map" src="https://snazzymaps.com/embed/482375" width="100%"
                        height="600px"></iframe>
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
        </div>
    );
}

export default Home;