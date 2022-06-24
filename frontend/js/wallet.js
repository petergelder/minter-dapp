let accounts;

async function Connect(){
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        checkChain();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
    
      if (window.web3) {
        // Check if User is already connected by retrieving the accounts
        await window.web3.eth.getAccounts().then(async (addr) => {
          accounts = addr;
        });
      }
    
      updateConnectStatus();
    
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        window.ethereum.on("accountsChanged", (newAccounts) => {
          accounts = newAccounts;
          updateConnectStatus();
        });
      }
}