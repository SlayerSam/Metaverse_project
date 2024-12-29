const crypto = require('crypto');

const useId = () => {
    const id = () => crypto.randomBytes(16).toString('hex');
    return id();
};

module.exports = { useId };