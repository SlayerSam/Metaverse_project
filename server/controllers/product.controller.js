const { productsBuyed } = require("../database/db");

const buyProduct = async (socketId, productId, buyer, price, quantity, status = 'Paid') => {
    if (!productsBuyed[socketId]) {
        productsBuyed[socketId] = [];
    }

    productsBuyed[socketId].push({
        productId,
        buyer,
        price,
        status,
        quantity,
        timestamp: Date.now(),
    });
};

module.exports = { buyProduct }