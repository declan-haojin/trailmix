import React, {useState, useEffect} from 'react';
import './AllParks.css'
import {getAllParks} from "../functions/api";
import {Link} from 'react-router-dom';

function AllParks() {
    const [parks, setParks] = useState([]);

    useEffect(() => {
        const fetchParks = async () => {
            setParks(await getAllParks());
        };

        fetchParks();
    }, []);

    return (
        <section className="container">
            <h1 className="gradient">Top Destinations</h1>
            <hr/>
            <div className="grid">
                {parks.length > 0 ? (
                    parks.map((park) => (
                        <Link to={`/parks/${park.park_code}`} key={park.id}>
                            <article
                                key={park._id}
                                className="card"
                                style={{backgroundImage: `url(${park.image})`}}
                            >
                                <div className="card-content">
                                    <h3>{park.name.replace(/ National Park$/, '')}</h3>
                                    <p>Explore now</p>
                                </div>
                            </article>
                        </Link>
                    ))
                ) : (
                    <p>Loading parks...</p>
                )}
            </div>
        </section>
    );
}

export default AllParks;