import React, {useState, useEffect} from 'react';
import {Rating} from "react-simple-star-rating";

function CommentModal({isOpen, onClose, onSubmit, commentData}) {
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);
    const [images, setImages] = useState([]);

    // Populate form fields if editing an existing comment
    useEffect(() => {
        if (commentData) {
            setCommentText(commentData.commentText || '');
            setRating(commentData.rating || 5);
            setImages(commentData.images || []);
        }
    }, [commentData]);

    // Handle image file selection
    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleRating = (rate) => {
        setRating(rate);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the form data
        const formData = new FormData();
        formData.append('commentText', commentText);
        formData.append('rating', rating);

        // Append selected images
        images.forEach((image) => {
            formData.append('images', image);
        });

        // Pass formData to the parent component
        onSubmit(formData);

        // Close modal after submitting
        onClose();
    };

    if (!isOpen) return null; // If modal is not open, don't render it

    return (
        <dialog open className="modal">
            <article>
                <header>
                    <a href="#close" aria-label="Close" className="close" onClick={onClose}></a>
                    <h2>{commentData ? 'Edit Your Comment' : 'Leave a Comment'}</h2>
                </header>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="rating">Rating:</label>
                    <Rating
                        onClick={handleRating}
                        ratingValue={rating} // Set the current rating
                        allowFraction={true} // Allow fractional ratings
                        size={60}
                        style={{marginBottom: 'var(--pico-spacing)'}}
                    />


                    <label htmlFor="comment">Comment:</label>
                    <textarea
                        id="comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment here..."
                        required
                    ></textarea>

                    <label htmlFor="images">Upload Images (optional):</label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    <footer>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <button
                                type="submit"
                                className="primary"
                                style={{marginRight: 'var(--pico-spacing)'}}
                            >
                                {commentData ? 'Update Comment' : 'Submit Comment'}
                            </button>
                            <button
                                type="button"
                                className="secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </footer>
                </form>
            </article>
        </dialog>
    );
}

export default CommentModal;