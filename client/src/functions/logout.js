import {logoutGoogle} from "./api";

// Function to delete a cookie by setting its expiry date to the past
const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Logout function
export const logout = async () => {
    try {
        await logoutGoogle();
        deleteCookie('jwtToken');
        window.location.href = '/';
    } catch (err) {
        alert('Failed to log out, please try again.');
    }
};