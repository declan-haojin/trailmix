import {useEffect, useState} from 'react';
import {getARandomPark} from '../functions/api';

function Park() {
    const [parks, setParks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getARandomPark()
            .then((res) => {
                setParks(res);
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading parks data...</p>
            ) : (
                <>
                    {parks.map((park) => (
                        <>
                            <h1>{park.name}</h1>
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
                        </>
                    ))}
                </>
            )}
        </div>
    );
}

export default Park;