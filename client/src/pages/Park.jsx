import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'; // Import useParams to access URL parameters
import {getParkByCode} from '../functions/api'; // Updated function

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

    return (
        <div>
            {loading ? (
                <p>Loading park data...</p>
            ) : (
                park && (
                    <>
                        <h1>{park.name}</h1>
                        <hr/>
                        <div className="group">
                            <article>
                                <h2>Basic Info</h2>
                                <hr/>
                                <p><strong>Location:</strong> {park.states}</p>
                                <p><strong>Description:</strong> {park.description}</p>
                            </article>
                            <article>
                                <h2>Park Image</h2>
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