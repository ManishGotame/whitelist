# whitelist

Building a whitelisting system which checks the user adresses using merkletree 

This is just me exploring with new ideas in optimizing eth gas fees in solidity.
Merkletree is a good solution for checking whether an address exists the whitelist of a smart contract. 
Normally when people add a whitelist of addresses, most people upload a list of array which is large in size and will take time to add into the smart contract which will incur high gas fees. And in the end, the basic job of these addressess is to check whether people can mint early or not -- nothing more. Merkle tree reduces the address list to one address by generating one using cryptographic hash functions which takes less gas fees to deploy and is simple to implement. 

Badly written code and it doesn't talk to the smart contract yet. Not a reliable code as of right now.
