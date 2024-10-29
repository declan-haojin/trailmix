import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function ParkMap({lat, long}) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null); // Store the map instance

    // Initial coordinates for the entire globe
    const initialCoordinates = {
        lng: 0,   // Longitude (centered globally)
        lat: 0,   // Latitude (centered globally)
        zoom: 1,  // Global view
    };

    useEffect(() => {
        // Initialize the map with a global view and enable globe mode
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12', // Map style
            center: [initialCoordinates.lng, initialCoordinates.lat],
            zoom: initialCoordinates.zoom, // Start at global zoom
            projection: 'globe', // Enable the 3D globe view
            attributionControl: false,
        });

        // Ensure globe view renders properly
        mapRef.current.on('style.load', () => {
            mapRef.current.setFog({}); // Set fog for 3D globe effect
        });

        // Automatically fly to the specific latitude and longitude passed as props
        mapRef.current.on('load', () => {
            mapRef.current.flyTo({
                center: [long, lat], // Use lat and long passed as props
                zoom: 11,            // Zoom in to this location
                speed: 1.5,          // Animation speed
                curve: 1.2,          // Animation curve
                bearing: 0,          // Keep the map flat (no rotation)
                pitch: 60,           // Tilt the map for a 3D effect
                easing: (t) => t,    // Easing function
                essential: true      // This animation is essential for accessibility
            });
        });

        return () => {
            // Clean up the map instance when the component unmounts
            mapRef.current.remove();
        };
    }, [lat, long]); // Re-run the effect if lat or long changes

    return (
        <div>
            <div
                ref={mapContainerRef}
                style={{width: '100%', height: '500px', borderRadius: '10px', marginTop: '20px'}}
            />
        </div>
    );
}

export default ParkMap;