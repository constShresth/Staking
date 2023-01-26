import React,{useEffect} from 'react';
import { useWeb3Contract } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { Form } from 'web3uikit';
import { ethers } from 'ethers';
import { Button} from "web3uikit";


function StakeForm({receipt, setReceipt}) {
  const stakingAddress = "0xAd36c5D15482A8C00Ba50997386a3F202b95E274"; //replace this with the address where you have deployed your staking Smart Contract
  const tesTokenAddress = "0x02b074dB4ef4b5F7ab7602Df5D68b0336ceFA111"; //replace this with the address where you have deployed your Reward Token Smart Contract

  const { runContractFunction } = useWeb3Contract(); //allows us to execute on-chain functions(SC functions)

  let approveOptions = {
    abi: TokenAbi.abi,
    contractAddress: tesTokenAddress,
    functionName: 'approve'
  };

  let stakeOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'stake'
  };

  let withdrawOptions = {
    abi:StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'withdraw'
  }

  let claimOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "claimReward",
  };

  async function handleStakeSubmit(data) {
    const amountToApprove = data.data[0].inputResult;
    approveOptions.params = {
      amount: ethers.utils.parseEther(amountToApprove, 'ether'),
      spender: stakingAddress
    };

    const tx = await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleApproveSuccess(approveOptions.params.amount);
      }
    });
  }

  async function handleWithdrawSubmit(data){
    withdrawOptions.params = {
      amount: ethers.utils.parseEther(data.data[0].inputResult, 'ether')
    }
    const tx = await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error)
    })

    setReceipt("Loading");
    const receiving = await tx.wait();
    setReceipt(receiving);
    console.log('Withdraw transaction complete');
  }

  async function handleClaimReward() {
    const tx = await runContractFunction({
      params: claimOptions,
      onError: (error) => console.log(error),
    });

    setReceipt("Loading");
    const receiving = await tx.wait();
    setReceipt(receiving);
    console.log("Claim Reward transaction complete");
  }

  async function handleApproveSuccess(amountToStakeFormatted) {
    stakeOptions.params = {
      amount: amountToStakeFormatted
    };

    const tx = await runContractFunction({
      params: stakeOptions,
      onError: (error) => console.log(error)
    });

    setReceipt("Loading");
    const receiving = await tx.wait(); //It means wait till the tx is successfull
    setReceipt(receiving);
    console.log('Stake transaction complete');
  }

  return (
    <>
      <div className='mx-4'>
        <Button
          text="Claim Reward"
          size="large"
          icon="eth"
          type="submit"
          onClick={handleClaimReward}
        />
      </div>
      <div className='text-black mt-4'>
        <Form
          onSubmit={handleStakeSubmit}
          data={[
            {
              inputWidth: '50%',
              name: 'Amount to stake ',
              type: 'number',
              value: '',
              key: 'amountToStake'
            }
          ]}
          title="Stake Now!"
        ></Form>
      </div>

      <div className='text-black mt-4'>
        <Form
          onSubmit={handleWithdrawSubmit}
          data={[
            {
              inputWidth: '50%',
              name: 'Amount to withdraw ',
              type: 'number',
              value: '',
              key: 'amountToWithdraw'
            }
          ]}
          title="Withdraw!"
        ></Form>
    </div>
    </>
  );
}

export default StakeForm;
