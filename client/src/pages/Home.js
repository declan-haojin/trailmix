import {useEffect, useState} from 'react';
import {getARandomPark} from '../functions/api';

function Home() {
    const [data, setData] = useState('TrailMix: fetching data...');

    useEffect(() => {
        getARandomPark()
            .then((res) => {
                setData(res[0].name + ' National Park, ' + res[0].state);
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
        </div>
    );
}

export default Home;