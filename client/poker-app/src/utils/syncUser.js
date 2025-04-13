import { baseURL } from './api.js';

export const syncUserToServer = async (user) => {
    try {
        const idToken = await user.getIdToken();

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