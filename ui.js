let chain = new Blockchain();
let wallet = loadWallet();

async function createWallet() {
 const keys = await generateWallet();
 saveWallet(keys.publicKey, keys.privateKey);
 wallet = loadWallet();
 updateUI();
}

async function updateUI() {
 document.getElementById("address").value = wallet.address || "";
 document.getElementById("privKey").value = wallet.privateKey || "";
 document.getElementById("balance").innerText = "Balance: " + await chain.getBalance(wallet.address || "N/A") + " RAY";
 document.getElementById("chainView").innerText = JSON.stringify(chain.chain, null, 2);
}

async function sendTx() {
 const to = document.getElementById("to").value;
 const amount = parseFloat(document.getElementById("amount").value);
 if (!to || !amount || amount <= 0) return alert("Invalid input");

 const tx = { from: wallet.address, to, amount };
 await chain.addTransaction(tx);
 updateUI();
}

async function mineBlock() {
 document.getElementById("mineStatus").innerText = "Mining...";
 const block = await chain.mine(wallet.address);
 document.getElementById("mineStatus").innerText = "Mined block #" + block.index + " ✅";
 updateUI();
}

updateUI();
