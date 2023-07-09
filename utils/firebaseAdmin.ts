import * as admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any)
    });
}


const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };