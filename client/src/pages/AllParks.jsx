import React, {useState, useEffect} from 'react';
import './AllParks.css'
import {getAllParks, getParksByCriteria} from "../functions/api";
import ParkFilterSort from "../components/ParkFilterSort";
import {Link} from 'react-router-dom';

function AllParks() {
    const [parks, setParks] = useState([]);
    const [noParks, setNoParks] = useState(false);

    useEffect(() => {
        const fetchParks = async () => {
            setParks(await getAllParks());
        };

        fetchParks();
    }, []);

    const selectByCriteria = (stateAbbrevation, sortBy) => {
        getParksByCriteria(stateAbbrevation, sortBy)
            .then((res) => {
                setParks(res);
                if (res.length === 0) {
                    setNoParks(true);
                }
                else {
                    setNoParks(false);
                }
            })
            .catch((err) => console.log(err));
        console.log('filtering by state', parks);
    }

    return (
        <section className="container">
            <h1 className="gradient">Top Destinations</h1>
            <hr/>
            <ParkFilterSort selectByCriteria={selectByCriteria} />
            <hr/>
            <div className="grid">
                {!noParks ? (parks.length > 0 ? (
                    parks.map((park) => (
                        <Link to={`/parks/${park.park_code}`} key={park.id}>
                            <article
                                key={park._id}
                                className="card"
                                style={{backgroundImage: `url(${park.image})`}}
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
                    <p>No parks found</p>
                )}
            </div>
        </section>
    );
}

export default AllParks;