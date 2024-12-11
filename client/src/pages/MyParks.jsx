import React, { useState, useEffect } from 'react';
import './AllParks.css';
import { getUserParkList } from '../functions/api';
import { Link } from 'react-router-dom';

function MyParks() {
    const [parks, setParks] = useState([]);
    const [noParks, setNoParks] = useState(false);

    useEffect(() => {
        const fetchParks = async () => {
            try {
                const userParks = await getUserParkList();
                setParks(userParks);
                setNoParks(userParks.length === 0);
            } catch (error) {
                console.error('Error fetching user parks:', error);
                setNoParks(true);
            }
        };

        fetchParks();
    }, []);

    return (
        <section className="container">
            <h1 className="gradient">My Parks</h1>
            <hr />
            <div className="grid">
                {!noParks ? (parks.length > 0 ? (
                    parks.map((park) => (
                        <Link to={`/parks/${park.park_code}`} key={park.id}>
                            <article
                                key={park._id}
                                className="card"
                                style={{ backgroundImage: `url(${park.image})` }}
                            >
                                <div className="card-content">
                                    <h3>{park.name.replace(/ National Park$/, '')}</h3>
                                    <p>{`Rating : ${park.numRatings > 0 ? (park.cumulativeRating / park.numRatings).toFixed(2) : 'No ratings yet'}`}</p>
                                    <p>{`Reviews : ${park.numRatings ? park.numRatings : 0}`}</p>
                                </div>
                            </article>
                        </Link>
                    ))
                ) : (
                    <p>Loading parks...</p>
                )) : (
                    <p>You haven't added any parks to your list yet!</p>
                )}
            </div>
        </section>
    );
}

export default MyParks;