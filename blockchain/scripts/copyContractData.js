const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "../deployedContract.json");
const destinations = [
    path.join(__dirname, "../../client/src/contracts/deployedContract.json"),
    path.join(__dirname, "../../server/deployedContract.json"),
];

destinations.forEach((destination) => {
    fs.copyFileSync(source, destination);
    console.log(`Copied to ${destination}`);
});
