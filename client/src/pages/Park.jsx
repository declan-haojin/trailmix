import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'; // Import useParams to access URL parameters
import {getParkByCode} from '../functions/api';
import ParkMap from "../components/ParkMap"; // Import the ParkMap component
import {Rating} from 'react-simple-star-rating'

function Park() {
    const {parkCode} = useParams(); // Get parkCode from the URL
    const [park, setPark] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getParkByCode(parkCode)
            .then((res) => {
                setPark(res);
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }, [parkCode]);

    // Function to extract lat and long from the park location (assuming "lat:..., long:..." format)
    const extractCoordinates = (locationString) => {
        if (!locationString) return {lat: null, long: null};

        const latMatch = locationString.match(/lat:([0-9.-]+)/);
        const longMatch = locationString.match(/long:([0-9.-]+)/);

        const lat = latMatch ? parseFloat(latMatch[1]) : null;
        const long = longMatch ? parseFloat(longMatch[1]) : null;

        return {lat, long};
    };

    return (
        <div>
            {loading ? (
                <p>Loading park data...</p>
            ) : (
                park && (
                    <>
                        <h1 className="gradient">{park.name}</h1>
                        <hr/>
                        <div className="group">
                            <article>
                                <h1>Basic Info</h1>
                                <hr/>
                                <p><strong>Location:</strong> {park.states}</p>
                                <p><strong>Description:</strong> {park.description}</p>
                            </article>
                            <article>
                                <h1>Park on the map</h1>
                                <hr/>
                                <ParkMap {...extractCoordinates(park.location)} />
                            </article>
                        </div>
                        <div className="group">
                            <article>
                                <h1>Park Rating</h1>
                                <Rating readonly={true} initialValue={4.5} allowFraction={true}/>
                                <hr/>
                                <strong>Featured Review</strong>
                                <blockquote>Almost Heaven, West Virginia.
                                    Blue Ridge Mountains, Shenandoah River.
                                    Life is old there, older than the trees.
                                    Younger than the mountains, growin' like a breeze.
                                </blockquote>
                            </article>
                            <article>
                                <h1>Park Image</h1>
                                <hr/>
                                {park.image && (
                                    <img
                                        src={park.image}
                                        alt={`${park.name}`}
                                        style={{width: '100%', height: 'auto'}}
                                    />
                                )}
                            </article>
                        </div>
                    </>
                )
            )}
        </div>
    );
}

export default Park;