import type { APIRoute } from 'astro';

const USDT_BEP20_CONTRACT = '0x55d398326f99059fF775485246999027B3197955';
const REQUIRED_AMOUNT = '2000000'; // 2 USDT with 6 decimals

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { txHash, bookingRef } = body;

    if (!txHash) {
      return new Response(JSON.stringify({ verified: false, reason: 'Transaction hash is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const bscscanKey = import.meta.env.BSCSCAN_API_KEY;
    const walletAddress = import.meta.env.WALLET_ADDRESS;

    if (!bscscanKey || !walletAddress) {
      return new Response(JSON.stringify({ verified: false, reason: 'Payment verification not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Query BscScan for BEP20 token transfers to our wallet
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${USDT_BEP20_CONTRACT}&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${bscscanKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== '1' || !data.result) {
      return new Response(JSON.stringify({ verified: false, reason: 'Could not fetch transaction data from BscScan' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the specific transaction
    const tx = data.result.find((t: any) => t.hash.toLowerCase() === txHash.toLowerCase());

    if (!tx) {
      return new Response(JSON.stringify({ verified: false, reason: 'Transaction not found. Make sure you sent USDT (BEP20) to the correct address.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify contract
    if (tx.contractAddress.toLowerCase() !== USDT_BEP20_CONTRACT.toLowerCase()) {
      return new Response(JSON.stringify({ verified: false, reason: 'Transaction is not for USDT. Please send USDT on the BEP20 network.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify recipient
    if (tx.to.toLowerCase() !== walletAddress.toLowerCase()) {
      return new Response(JSON.stringify({ verified: false, reason: 'Payment was not sent to the correct wallet address.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify amount (at least 2 USDT)
    if (BigInt(tx.value) < BigInt(REQUIRED_AMOUNT)) {
      return new Response(JSON.stringify({ verified: false, reason: 'Insufficient amount. Please send exactly 2 USDT.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify token name
    if (tx.tokenName !== 'Tether USD' && tx.tokenSymbol !== 'USDT') {
      return new Response(JSON.stringify({ verified: false, reason: 'Token is not USDT. Please send USDT (Tether USD).' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      verified: true,
      details: {
        from: tx.from,
        to: tx.to,
        amount: tx.value,
        tokenName: tx.tokenName,
        txHash: tx.hash,
        blockNumber: tx.blockNumber,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ verified: false, reason: 'Error verifying payment. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
