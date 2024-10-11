import {useEffect, useState} from 'react';
import {getParks, getARandomPark} from '../functions/api';

function Home() {
    const [parks, setParks] = useState([]);
    const [data, setData] = useState('TrailMix: fetching data...');

    useEffect(() => {
        getARandomPark()
            .then((res) => {
                setData(res[0].name + ' National Park, ' + res[0].state);
            })
            .catch((err) => console.log(err));
        
        getParks()
            .then((res) => {
                setParks(res);
            })
            .catch((err) => console.log(err));
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
                    <h2>{data}</h2>
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
                    </tr>
                    </thead>
                    <tbody>
                    {parks.map((park) => (
                        <tr>
                            <th scope="row">{park.name}</th>
                            <td>{park.state}</td>
                            <td>{park.established}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </article>
        </div>
    );
}

export default Home;