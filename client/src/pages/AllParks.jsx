import React, {useState, useEffect} from 'react';
import './AllParks.css'

function AllParks() {
    const [parks, setParks] = useState([]);

    useEffect(() => {
        // Mock fetch for park data - replace this with your API call
        const fetchParks = async () => {
            const data = [
                {id: 1, name: 'Grand Canyon', description: 'Explore Now', image: 'grand-canyon.jpg'},
                {id: 2, name: 'Zion National Park', description: 'Adventure Awaits', image: 'zion.jpg'},
                {id: 3, name: 'Great Smoky', description: 'Experience Nature', image: 'great-smoky.jpg'},
                {id: 4, name: 'Glacier National', description: 'Capture Memories', image: 'glacier.jpg'},
            ];
            setParks(data);
        };

        fetchParks();
    }, []);

    return (
        <section className="container">
            <h1 className="gradient">Top Destinations</h1>
            <hr/>
            <div className="grid">
                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/grand-canyon.jpg')"}}
                >
                    <div className="card-content">
                        <h3>Grand Canyon</h3>
                        <p>Majestic chasm</p>
                    </div>
                </article>

                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/zion.jpg')"}}
                >
                    <div className="card-content">
                        <h3>Zion National Park</h3>
                        <p>Towering canyons</p>
                    </div>
                </article>

                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/great-smoky-mountains.jpg')"}}
                >
                    <div className="card-content">
                        <h3>Great Smoky Mountains</h3>
                        <p>Golden mist</p>
                    </div>
                </article>

                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/new-river-gorge.jpg')"}}
                >
                    <div className="card-content">
                        <h3>New River Gorge</h3>
                        <p>Bridged rapids</p>
                    </div>
                </article>

                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/olympic.jpg')"}}
                >
                    <div className="card-content">
                        <h3>Olympic</h3>
                        <p>Ecological symphony</p>
                    </div>
                </article>

                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/crater-lake.jpg')"}}
                >
                    <div className="card-content">
                        <h3>Crater Lake</h3>
                        <p>Heaven blue</p>
                    </div>
                </article>

                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/kenai-fjords.jpg')"}}
                >
                    <div className="card-content">
                        <h3>Kenai Fjords</h3>
                        <p>Glacial majesty</p>
                    </div>
                </article>

                <article
                    className="card"
                    style={{backgroundImage: "url('https://r2.haojin.li/grand-teton.jpg')"}}
                >
                    <div className="card-content">
                        <h3>Grand Teton</h3>
                        <p>Jagged grandeur</p>
                    </div>
                </article>
            </div>
        </section>
    );
}

export default AllParks;