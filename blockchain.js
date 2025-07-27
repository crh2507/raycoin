class Block {
 constructor(index, previousHash, timestamp, transactions, nonce, hash) {
   this.index = index;
   this.previousHash = previousHash;
   this.timestamp = timestamp;
   this.transactions = transactions;
   this.nonce = nonce;
   this.hash = hash;
 }
}

class Blockchain {
 constructor() {
   this.chain = [];
   this.mempool = [];
   this.load();
 }

 getLastBlock() {
   return this.chain[this.chain.length - 1];
 }

 async addTransaction(tx) {
   this.mempool.push(tx);
   this.save();
 }

 async mine(publicKey) {
   const lastBlock = this.getLastBlock() || { index: 0, hash: "0" };
   const index = lastBlock.index + 1;
   const timestamp = Date.now();
   const rewardTx = { from: "network", to: publicKey, amount: 10 };
   const transactions = [rewardTx, ...this.mempool];
   let nonce = 0;
   let hash = "";

   while (true) {
     const data = index + lastBlock.hash + timestamp + JSON.stringify(transactions) + nonce;
     hash = await sha256(data);
     if (hash.startsWith("0000")) break;
     nonce++;
   }

   const block = new Block(index, lastBlock.hash, timestamp, transactions, nonce, hash);
   this.chain.push(block);
   this.mempool = [];
   this.save();
   return block;
 }

 async getBalance(address) {
   let balance = 0;
   for (const block of this.chain) {
     for (const tx of block.transactions) {
       if (tx.to === address) balance += tx.amount;
       if (tx.from === address) balance -= tx.amount;
     }
   }
   return balance;
 }

 save() {
   localStorage.setItem("raycoin_chain", JSON.stringify(this.chain));
   localStorage.setItem("raycoin_mempool", JSON.stringify(this.mempool));
 }

 load() {
   this.chain = JSON.parse(localStorage.getItem("raycoin_chain") || "[]");
   this.mempool = JSON.parse(localStorage.getItem("raycoin_mempool") || "[]");
 }
}

async function sha256(str) {
 const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
 return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, "0")).join("");
}
