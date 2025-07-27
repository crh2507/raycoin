// Basic ECC wallet using crypto.subtle (in-browser)

async function generateWallet() {
 const keyPair = await crypto.subtle.generateKey(
   { name: "ECDSA", namedCurve: "P-256" },
   true,
   ["sign", "verify"]
 );

 const privKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
 const pubKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

 return {
   privateKey: JSON.stringify(privKey),
   publicKey: JSON.stringify(pubKey),
 };
}
