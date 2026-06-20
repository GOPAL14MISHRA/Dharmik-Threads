import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { firebaseApp } from "./firebase";

// Use getAuth for both server and client. On the client, explicitly set
// browser persistence. This avoids incompatibilities that can cause
// `auth/argument-error` when calling popup-based flows.
export const auth = getAuth(firebaseApp);

if (typeof window !== "undefined") {
  // Ensure browser persistence is set; ignore errors.
  setPersistence(auth, browserLocalPersistence).catch((e) => {
    // Non-fatal: log for debugging.
    // eslint-disable-next-line no-console
    console.warn("setPersistence failed:", e);
  });
}
