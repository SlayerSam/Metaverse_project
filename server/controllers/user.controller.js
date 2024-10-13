const { db } = require('../utils/firebaseAdmin');

async function avatarStore(data) {
    console.log(data)
    await db.collection('avatars').doc(data.userId).set(data);
    return true;
}

module.exports = { avatarStore }