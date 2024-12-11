import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getCommentsByPark, getParkByCode} from '../functions/api';
import ParkMap from "../components/ParkMap";
import {Rating} from 'react-simple-star-rating';
import CommentModal from "../components/CommentModal";
import axios from 'axios';
import AddParkToUserListButton from "../components/addParkToUserListButton";

function Park() {
    const {parkCode} = useParams();
    const [park, setPark] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [parkReviews, setParkReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);

    useEffect(() => {
        const fetchParkData = async () => {
            try {
                const parkData = await getParkByCode(parkCode);
                setPark(parkData);

                // Fetch all reviews for this park
                const reviews = await getCommentsByPark(parkData._id);
                setParkReviews(reviews);

                // Optionally set userReview if there's a specific user's review to display separately
                const existingUserReview = reviews.find(review => review.userId === "currentUserId"); // Replace with actual user ID logic
                setUserReview(existingUserReview);

                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchParkData();
    }, [parkCode]);

    const extractCoordinates = (locationString) => {
        if (!locationString) return {lat: null, long: null};
        const latMatch = locationString.match(/lat:([0-9.-]+)/);
        const longMatch = locationString.match(/long:([0-9.-]+)/);
        return {
            lat: latMatch ? parseFloat(latMatch[1]) : null,
            long: longMatch ? parseFloat(longMatch[1]) : null
        };
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Fetch updated reviews after submitting a review
    const fetchUpdatedReviews = async () => {
        try {
            const updatedReviews = await getCommentsByPark(park._id);
            setParkReviews(updatedReviews);
        } catch (error) {
            console.error("Failed to fetch updated reviews", error);
        }
    };

    const handleSubmitReview = async (formData) => {
        try {
            if (userReview) {
                // Update existing comment (PUT request)
                await axios.put(`/api/comments/${userReview._id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Create a new comment (POST request)
                formData.append('parkId', park._id);
                await axios.post(`/api/comments/${park._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // Refresh the list of reviews after submitting
            await fetchUpdatedReviews();
            closeModal(); // Close the modal after submission
        } catch (error) {
            console.error("Failed to submit review", error);
        }
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
                        <AddParkToUserListButton parkId={park._id} />
                        <div className="group">
                            <article>
                                <h1>Basic Info</h1>
                                <hr/>
                                <p><strong>Park ID:</strong> {park._id}</p>
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
                                <h1>Average Rating</h1>
                                {
                                    <Rating
                                        readonly={true}
                                        initialValue={park.cumulativeRating / park.numRatings}
                                        allowFraction={true}
                                    />
                                }
                                <h1>All Reviews</h1>
                                <hr/>
                                {parkReviews.length > 0 ? (
                                    parkReviews.map((review, index) => (
                                        <div key={index} className="review">
                                            <Rating
                                                readonly={true}
                                                initialValue={review.rating}
                                                allowFraction={true}
                                            />
                                            <p>{review.comment}</p>
                                            {review.images && review.images.length > 0 && (
                                                <div className="review-images">
                                                    {review.images.map((image, imgIndex) => (
                                                        <img
                                                            key={imgIndex}
                                                            src={image}
                                                            alt={`Review ${imgIndex + 1}`}
                                                            style={{width: '100px', height: 'auto', margin: '5px'}}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews yet. Be the first to leave a comment!</p>
                                )}

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