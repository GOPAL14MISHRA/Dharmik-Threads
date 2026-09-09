import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { firebaseApp } from "./firebase";

// Use getAuth for both server and client. On the client, explicitly set
// browser persistence. This avoids incompatibilities that can cause
// `auth/argument-error` when calling popup-based flows.
export const auth = getAuth(firebaseApp);

export const authReady: Promise<void> = typeof window === "undefined"
  ? Promise.resolve()
  : (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.warn("Firebase persistence setup failed:", error);
      }

      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, () => {
          unsubscribe();
          resolve();
        });
      });
    })();
