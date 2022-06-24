let accounts;
const onboarding = new MetaMaskOnboarding();

window.addEventListener("DOMContentLoaded", async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
    
      if (window.web3) {
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
      else {
        onboarding.startOnboarding()
      }
    });

    const onClickConnect = async () => {
        try {
          const newAccounts = await ethereum.request({
            method: 'eth_requestAccounts',
          })
          handleNewAccounts(newAccounts)
        } catch (error) {
          console.error(error)
        }
      }