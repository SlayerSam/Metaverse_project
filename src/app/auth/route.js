import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function POST(req) {
    const { email, password, name, isSignUp } = await req.json();

    try {
        let userCredential;
        if (isSignUp) {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name,
            });
        } else {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        }

        return new Response(JSON.stringify({ user: userCredential.user }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}
