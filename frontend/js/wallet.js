let accounts;

const onboardButton = document.getElementById("connectButton");

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
          await Connect();
        });
      }
    });

const updateConnectStatus = async () => {

}


async function Connect(){
  const onboarding = new MetaMaskOnboarding(); 

  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    onboardButton.innerText = "Install MetaMask!";
    onboardButton.onclick = () => {
        onboardButton.innerText = "Connecting...";
        onboardButton.disabled = true;
        onboarding.startOnboarding();
      };
    } else if (accounts && accounts.length > 0) {
        onboardButton.innerText = `✔ ...${accounts[0]}`;
        window.address = accounts[0];
        onboardButton.disabled = true;
        onboarding.stopOnboarding();
    
        window.contract = new web3.eth.Contract(abi, contractAddress);

    } else {
        onboardButton.innerText = "Connect MetaMask!";
    
        onboardButton.onclick = async () => {
          await window.ethereum
            .request({
              method: "eth_requestAccounts",
            })
            .then(function (accts) {
              onboardButton.innerText = `✔ ...${accts[0]}`;
    
              onboardButton.disabled = true;
              window.address = accts[0];
              accounts = accts;
              window.contract = new web3.eth.Contract(abi, contractAddress);

            });
        };
    };
}