let accounts;

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
    });

async function Connect(){
  const onboarding = new MetaMaskOnboarding();
  const onboardButton = document.getElementById("connectButton");

  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboarding.startOnboarding();
    };
}