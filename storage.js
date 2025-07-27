function saveWallet(address, privKey) {
 localStorage.setItem("raycoin_wallet", address);
 localStorage.setItem("raycoin_private", privKey);
}

function loadWallet() {
 return {
   address: localStorage.getItem("raycoin_wallet"),
   privateKey: localStorage.getItem("raycoin_private"),
 };
}
