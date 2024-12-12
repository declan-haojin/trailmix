export const getTest = async () => {
    try {
        const response = await fetch("/api/test", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        return await response.json();
    } catch (err) {}
}
