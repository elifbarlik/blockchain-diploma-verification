import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();

  const diploma = await viem.deployContract("DiplomaVerification");

  console.log("DiplomaVerification contract address:");
  console.log(diploma.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});