export const getARandomPark = async () => {
    try {
        const response = await fetch("/api/parks/random", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return await response.json();
    } catch (err) {
    }
}