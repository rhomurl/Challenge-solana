//1. Calculate the wallet balance of the sender wallet. 
//2. Transfer 50% of the balance to another wallet.

const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
       63, 246, 153, 174, 171, 107, 178,  67, 135, 241, 244,
       38,  95,  39, 109, 205,  81, 208, 117, 234, 116, 229,
      102, 177, 112, 156, 218,   5,  72, 122, 124,  55, 140,
       25, 173, 226,  60, 254, 188, 155,  56, 153,  59, 194,
      231,   7,  68, 106, 155, 156, 162,   2, 178, 116, 202,
      190, 255,   9, 220, 171, 156,   9, 110, 150
    ]
);

async function getWalletBalance(publicKey, connection) {
  const walletBalance = await connection.getBalance(
            new PublicKey(publicKey)
  );
  return walletBalance;
}

const transferSol = async() => {
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

	var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
	const walletBalanceFrom = await getWalletBalance(from.publicKey, connection);
	console.log(`Wallet balance [sender]: ${parseFloat(walletBalanceFrom) / LAMPORTS_PER_SOL} SOL`);
	halfBalance = parseFloat(walletBalanceFrom) / 2;
	halfBalance = Math.round(halfBalance);
	
	const to = Keypair.generate();
	const walletBalanceTo = await getWalletBalance(to.publicKey, connection);
    
	console.log(`Wallet balance [receiver]: ${parseFloat(walletBalanceTo) / LAMPORTS_PER_SOL} SOL`);
	console.log(`Sending ${halfBalance / LAMPORTS_PER_SOL} of SOL to receiver's wallet!`);
	
    //Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: halfBalance
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);
	
	// Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();
	await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature
    });
	
	const walletBalanceTo2 = await getWalletBalance(to.publicKey, connection);
	console.log(`Wallet balance [receiver]: ${parseInt(walletBalanceTo2) / LAMPORTS_PER_SOL} SOL`);
}

transferSol();
