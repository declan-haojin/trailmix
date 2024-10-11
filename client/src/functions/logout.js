// Function to delete a cookie by setting its expiry date to the past
const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Logout function
export const logout = () => {
    deleteCookie('jwtToken'); // Delete the JWT token cookie
    window.location.href = '/';
};