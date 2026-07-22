const BSCSCAN_API = 'https://api.bscscan.com/api';
const USDT_BEP20_CONTRACT = '0x55d398326f99059fF775485246999027B3197955';
const REQUIRED_AMOUNT = '2000000'; // 2 USDT (6 decimals)
const MY_WALLET = import.meta.env.WALLET_ADDRESS || '';

function getApiKey(): string {
  const key = import.meta.env.BSCSCAN_API_KEY;
  if (!key) throw new Error('BSCSCAN_API_KEY environment variable is not set');
  return key;
}

export async function verifyUSDTTransaction(
  txHash: string,
  expectedAmount: string = REQUIRED_AMOUNT
): Promise<{
  verified: boolean;
  reason?: string;
  details?: {
    from: string;
    to: string;
    amount: string;
    tokenName: string;
    txHash: string;
  };
}> {
  try {
    const url = `${BSCSCAN_API}?module=account&action=tokentx&contractaddress=${USDT_BEP20_CONTRACT}&address=${MY_WALLET}&startblock=0&endblock=99999999&sort=desc&apikey=${getApiKey()}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== '1' || !data.result) {
      return { verified: false, reason: 'Could not fetch transaction data' };
    }

    const tx = data.result.find((t: any) => t.hash === txHash);

    if (!tx) {
      return { verified: false, reason: 'Transaction not found on BNB Smart Chain' };
    }

    if (tx.contractAddress.toLowerCase() !== USDT_BEP20_CONTRACT.toLowerCase()) {
      return { verified: false, reason: 'Transaction is not for USDT BEP20' };
    }

    if (tx.to.toLowerCase() !== MY_WALLET.toLowerCase()) {
      return { verified: false, reason: 'Payment was not sent to the correct wallet address' };
    }

    if (BigInt(tx.value) < BigInt(expectedAmount)) {
      return { verified: false, reason: 'Insufficient amount sent. Required: 2 USDT' };
    }

    if (tx.tokenName !== 'Tether USD') {
      return { verified: false, reason: 'Token is not USDT' };
    }

    return {
      verified: true,
      details: {
        from: tx.from,
        to: tx.to,
        amount: tx.value,
        tokenName: tx.tokenName,
        txHash: tx.hash,
      },
    };
  } catch (error) {
    return { verified: false, reason: 'Error verifying transaction. Please try again.' };
  }
}

export function getUSDTAddress(): string {
  return MY_WALLET;
}

export function getUSDTAmount(): string {
  return '2';
}
