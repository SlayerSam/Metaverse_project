const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
async function main() {
  const Auth = await hre.ethers.getContractFactory("Auth");
  const auth = await Auth.deploy();

  await auth.waitForDeployment();

  console.log("contract deployed to:", await auth.getAddress());
  const data = {
    address: await auth.getAddress(),
    abi: JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/Auth.sol/Auth.json"), "utf8")).abi,
  };

  fs.writeFileSync(
    path.join(__dirname, "../deployedContract.json"),
    JSON.stringify(data, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
