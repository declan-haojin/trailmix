import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'; // Import useParams to access URL parameters
import {getParkByCode} from '../functions/api';
import ParkMap from "../components/ParkMap"; // Import the ParkMap component
import {Rating} from 'react-simple-star-rating';
import CommentModal from "../components/CommentModal"; // Import the CommentModal component

function Park() {
    const {parkCode} = useParams(); // Get parkCode from the URL
    const [park, setPark] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false); // Modal control for adding/editing comments
    const [userRating, setUserRating] = useState(0); // User's rating
    const [userComment, setUserComment] = useState(''); // User's comment
    const [userReview, setUserReview] = useState(null); // Placeholder for user review data

    useEffect(() => {
        getParkByCode(parkCode)
            .then((res) => {
                setPark(res);
                // Simulate fetching the user's review and rating if it exists (you can fetch this from your backend)
                setUserReview({
                    rating: 4.5, // Example initial rating
                    comment: "Beautiful park with stunning views!"
                });
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

    // Open modal to allow users to add/edit their rating and comment
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Handle submitting a new or edited review
    const handleSubmitReview = (formData) => {
        const commentText = formData.get('commentText');
        const rating = formData.get('rating');
        // Here you would send the comment and rating to your backend (e.g., via an API)
        setUserReview({
            rating: rating,
            comment: commentText
        });
        closeModal(); // Close modal after submitting
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
                                {/* Display the user's rating */}
                                <Rating
                                    readonly={true}
                                    initialValue={userReview ? userReview.rating : 0}
                                    allowFraction={true}
                                />
                                <hr/>
                                {/* Featured review (user review or placeholder if none exist) */}
                                <strong>Featured Review</strong>
                                <blockquote>
                                    {userReview
                                        ? userReview.comment
                                        : "No reviews yet. Be the first to leave a comment!"}
                                </blockquote>

                                {/* Button to allow users to add or edit their review */}
                                <button onClick={openModal}>
                                    {userReview ? "Edit Your Review" : "Leave a Review"}
                                </button>
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

                        {/* Render the CommentModal for adding/editing reviews */}
                        <CommentModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            onSubmit={handleSubmitReview}
                            commentData={userReview} // Pass the existing review for editing
                        />
                    </>
                )
            )}
        </div>
    );
}

export default Park;