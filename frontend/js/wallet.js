let web3;
let accounts;

async function Connect(){
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    }

    if (web3) {
    // Check if User is already connected by retrieving the accounts
    await window.web3.eth.getAccounts().then(async (addr) => {
        accounts = addr;
    });
    }

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        window.ethereum.on("accountsChanged", (newAccounts) => {
          accounts = newAccounts;
        });
    }
}