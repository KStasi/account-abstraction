import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";

const deployPaymaster: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const provider = ethers.provider;
  const from = await provider.getSigner().getAddress();

  const entrypoint = await hre.deployments.get("EntryPoint");
  const ret = await hre.deployments.deploy("PurePaymaster", {
    from,
    args: [entrypoint.address],
    gasLimit: 6e6,
    deterministicDeployment: false,
  });
  console.log("==PurePaymaster addr=", ret.address);

  const paymasterContract = await ethers.getContractAt(
    "PurePaymaster",
    ret.address
  );
  const entrypointContract = await ethers.getContractAt(
    "EntryPoint",
    entrypoint.address
  );
  await paymasterContract.addStake(1, { value: parseEther("0.2"), from: from });
  await entrypointContract.depositTo(paymasterContract.address, {
    value: parseEther("0.1"),
  });
};

export default deployPaymaster;
