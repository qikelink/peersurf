import { ethers } from 'ethers';

// Livepeer contract addresses (Arbitrum One)
const LIVEPEER_CONTRACTS = {
  arbitrum: {
    bondingManager: '0x511bc4556d823ae99630ae8de28b9b80cdf92d89',
    token: '0x58b6a8a3302369daec383334672404ee733ab239',
  }
};

// ABI for Livepeer functions
const BONDING_MANAGER_ABI = [
  'function delegate(address _orchestrator, uint256 _amount) external',
  'function undelegate(address _orchestrator, uint256 _amount) external',
  'function withdrawStake(address _orchestrator, uint256 _amount) external',
  'function withdrawFees(address _orchestrator, address payable _recipient) external',
  'function pendingStake(address _orchestrator, address _delegator) external view returns (uint256)',
  'function pendingFees(address _orchestrator, address _delegator) external view returns (uint256)',
  'function delegators(address _orchestrator, address _delegator) external view returns (uint256 bondedAmount, uint256 fees, uint256 delegateAddress, uint256 delegatedAmount, uint256 startRound, uint256 lastClaimRound, uint256 nextUnbondingLockId)',
];

const LPT_TOKEN_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
];

// Initialize provider and contracts
export const initializeLivepeerContracts = (signer: any) => {
  const bondingManager = new ethers.Contract(
    LIVEPEER_CONTRACTS.arbitrum.bondingManager,
    BONDING_MANAGER_ABI,
    signer
  );
  
  const lptToken = new ethers.Contract(
    LIVEPEER_CONTRACTS.arbitrum.token,
    LPT_TOKEN_ABI,
    signer
  );

  return { bondingManager, lptToken };
};

// Delegate LPT tokens to an orchestrator
export const delegateTokens = async (
  orchestratorAddress: string,
  amount: string,
  signer: any
) => {
  try {
    const { bondingManager, lptToken } = initializeLivepeerContracts(signer);
    const userAddress = await signer.getAddress();
    
    // Convert amount to wei (LPT has 18 decimals)
    const amountWei = ethers.parseEther(amount);
    
    // Check user's LPT balance
    const balance = await lptToken.balanceOf(userAddress);
    if (balance < amountWei) {
      return { 
        success: false, 
        error: `Insufficient balance. Please check your available funds and try again.` 
      };
    }
    
    // Check allowance and approve if needed
    const allowance = await lptToken.allowance(userAddress, bondingManager.address);
    if (allowance < amountWei) {
      const approveTx = await lptToken.approve(bondingManager.address, amountWei);
      await approveTx.wait();
    }
    
    // Delegate tokens
    const tx = await bondingManager.delegate(orchestratorAddress, amountWei);
    const receipt = await tx.wait();
    
    return { success: true, tx: receipt };
  } catch (error: any) {
    console.error('Delegation error:', error);
    return { success: false, error: "Transaction failed. Please try again." };
  }
};

// Undelegate LPT tokens from an orchestrator
export const undelegateTokens = async (
  orchestratorAddress: string,
  amount: string,
  signer: any
) => {
  try {
    const { bondingManager } = initializeLivepeerContracts(signer);
    
    // Convert amount to wei
    const amountWei = ethers.parseEther(amount);
    
    // Undelegate tokens
    const tx = await bondingManager.undelegate(orchestratorAddress, amountWei);
    const receipt = await tx.wait();
    
    return { success: true, tx: receipt };
  } catch (error: any) {
    console.error('Undelegation error:', error);
    return { success: false, error: "Transaction failed. Please try again." };
  }
};

// Withdraw rewards from an orchestrator
export const withdrawRewards = async (
  orchestratorAddress: string,
  signer: any
) => {
  try {
    const { bondingManager } = initializeLivepeerContracts(signer);
    const userAddress = await signer.getAddress();
    
    // Withdraw fees
    const tx = await bondingManager.withdrawFees(orchestratorAddress, userAddress);
    const receipt = await tx.wait();
    
    return { success: true, tx: receipt };
  } catch (error: any) {
    console.error('Withdrawal error:', error);
    return { success: false, error: "Transaction failed. Please try again." };
  }
};

// Get delegation info for a user
export const getDelegationInfo = async (
  userAddress: string,
  orchestratorAddress: string,
  signer: any
) => {
  try {
    const { bondingManager } = initializeLivepeerContracts(signer);
    
    // Get delegation info
    const delegation = await bondingManager.delegators(orchestratorAddress, userAddress);
    
    return { 
      success: true, 
      delegation: {
        bondedAmount: ethers.formatEther(delegation.bondedAmount),
        fees: ethers.formatEther(delegation.fees),
        delegatedAmount: ethers.formatEther(delegation.delegatedAmount),
        startRound: delegation.startRound.toString(),
        lastClaimRound: delegation.lastClaimRound.toString(),
      }
    };
  } catch (error: any) {
    console.error('Get delegation info error:', error);
    return { success: false, error: "Failed to load investment data." };
  }
};

// Get pending rewards for a user
export const getPendingRewards = async (
  userAddress: string,
  orchestratorAddress: string,
  signer: any
) => {
  try {
    const { bondingManager } = initializeLivepeerContracts(signer);
    
    // Get pending fees
    const pendingFees = await bondingManager.pendingFees(orchestratorAddress, userAddress);
    
    return { 
      success: true, 
      rewards: ethers.formatEther(pendingFees)
    };
  } catch (error: any) {
    console.error('Get pending rewards error:', error);
    return { success: false, error: "Failed to load reward data." };
  }
};

// Get orchestrator info (basic implementation)
export const getOrchestratorInfo = async (orchestratorAddress: string) => {
  try {
    // This would require additional contract calls to get orchestrator details
    // For now, return basic info
    return { 
      success: true, 
      orchestrator: {
        address: orchestratorAddress,
        // Additional info would be fetched from contract
      }
    };
  } catch (error: any) {
    console.error('Get orchestrator info error:', error);
    return { success: false, error: "Failed to load orchestrator data." };
  }
}; 