import admin from "firebase-admin";

export function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const fromEnvJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (fromEnvJson) {
    const parsed = JSON.parse(fromEnvJson) as admin.ServiceAccount;
    return admin.initializeApp({
      credential: admin.credential.cert(parsed),
    });
  }

  // If GOOGLE_APPLICATION_CREDENTIALS is set, firebase-admin will pick it up automatically.
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export function getAuth() {
  return getAdminApp().auth();
}
