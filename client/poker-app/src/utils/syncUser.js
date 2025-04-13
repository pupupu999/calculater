import { baseURL } from './api.js';

export const syncUserToServer = async (user) => {
    console.log("hostname =", window.location.hostname);
    console.log("baseURL =", baseURL);
    try {
        console.log("=== syncUserToServer called ===");
        const idToken = await user.getIdToken();
        console.log("idToken取得成功");
        console.log("baseURL =", baseURL);

        await fetch(`${baseURL}/api/auth/sync-user`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
            }),
        });
    } catch (err) {
        console.error("syncUserToServer error:", err);
    }
};