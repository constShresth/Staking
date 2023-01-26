import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import StakingAbi from "../constants/Staking.json";
import TokenAbi from "../constants/RewardToken.json";

function StakeDetails({ receipt, setReceipt }) {
  const { account, isWeb3Enabled } = useMoralis(); //It will help us to authenticate & connect with the wallet
  const [rtBalance, setRtBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [earnedBalance, setEarnedBalance] = useState("0");

  const stakingAddress = "0xAd36c5D15482A8C00Ba50997386a3F202b95E274"; //replace this with the address where you have deployed your staking Smart Contract
  const rewardTokenAddress = "0x02b074dB4ef4b5F7ab7602Df5D68b0336ceFA111"; //replace this with the address where you have deployed your Reward Token Smart Contract

  const { runContractFunction: getRTBalance } = useWeb3Contract({
    //allows us to execute on-chain functions(SC functions)
    abi: TokenAbi.abi,
    contractAddress: rewardTokenAddress,
    functionName: "balanceOf",
    params: {
      account,
    },
  });

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "getStaked",
    params: {
      account,
    },
  });

  const { runContractFunction: getEarnedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "earned",
    params: {
      account,
    },
  });


  useEffect(() => {
    async function updateUiValues() {
      const rtBalance = (
        await getRTBalance({ onError: (error) => console.log(error) })
      ).toString();
      const formattedRtBalance = parseFloat(rtBalance) / 1e18; //converting to ether
      const formattedRtBalaceRounded = formattedRtBalance.toFixed(20);
      setRtBalance(formattedRtBalaceRounded);

      const stakedBalace = (
        await getStakedBalance({ onError: (error) => console.log(error) })
      ).toString();
      const formattedStakedBalance = parseFloat(stakedBalace) / 1e18;
      const formattedStakedBalanceRounded = formattedStakedBalance.toFixed(20);
      setStakedBalance(formattedStakedBalanceRounded);

      const earnedBalance = (
        await getEarnedBalance({ onError: (error) => console.log(error) })
      ).toString();
      const formattedEarnedBalance = parseFloat(earnedBalance) / 1e18;
      const formattedEarnedBalanceRounded = formattedEarnedBalance.toFixed(20);
      setEarnedBalance(formattedEarnedBalanceRounded);
    }

    if (isWeb3Enabled) {
      updateUiValues();
      console.log(receipt);
    }
  }, [account, receipt, isWeb3Enabled]);
  return (
    <div className="p-3">
      <div className="font-bold m-2">RT Balance is: {rtBalance}</div>
      <div className="font-bold m-2">Earned Balance is: {earnedBalance}</div>
      <div className="font-bold m-2">Staked Balance is: {stakedBalance}</div>
      
    </div>
  );
}

export default StakeDetails;
