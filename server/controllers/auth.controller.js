const { auth } = require('../../client/src/utils/firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = require('firebase/auth');

async function Auth(req, resp) {
  const { email, password, name } = req.body;

  try {
    let userCredential;
    if (req.params.path == 'signup') {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    }
    return resp.send({ user: userCredential.user }).status(200);
  } catch (error) {
    return resp.send({ error: error.message }).status(400);
  }
}

module.exports = { Auth };