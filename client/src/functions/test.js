export const getTest = async () => {
    try {
        const response = await fetch("http://localhost:3001/test", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        return await response.json();
    } catch (err) {}
}