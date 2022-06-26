let accounts;

const onboardButton = document.getElementById("connectButton");


window.addEventListener("DOMContentLoaded", async () => {
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

    await Connect();
});

async function loadInfo() {
  window.info = await window.contract.methods.getInfo().call();
  const publicMintActive = await contract.methods.mintingActive().call();
  const presaleMintActive = await contract.methods.presaleActive().call();
  const mainHeading = document.getElementById("mainHeading");
  const subHeading = document.getElementById("subHeading");
  const mainText = document.getElementById("mainText");
  const mintContainer = document.getElementById("mintContainer");
  const mintButton = document.getElementById("mintButton");

  let startTime = "";
  if (publicMintActive) {
    mainHeading.innerText = h1_public_mint;
    mainText.innerText = p_public_mint;
    mintButton.innerText = button_public_mint;
    mintContainer.classList.remove('hidden');
  } else if (presaleMintActive) {
    startTime = window.info.runtimeConfig.publicMintStart;
    mainHeading.innerText = h1_presale_mint;
    subHeading.innerText = h2_presale_mint;

    try {
        // CHECK IF WHITELISTED
        const merkleData = await fetch(
          `/.netlify/functions/merkleProof/?wallet=${window.address}&chain=${chain}&contract=${contractAddress}`
        );
        const merkleJson = await merkleData.json();
        const whitelisted = await contract.methods.isWhitelisted(window.address, merkleJson).call();
        if(!whitelisted) {
          mainText.innerText = p_presale_mint_not_whitelisted;
        } else {
          mainText.innerText = p_presale_mint_whitelisted;
          mintButton.innerText = button_presale_mint_whitelisted;
          mintContainer.classList.remove('hidden');
        }
      } catch(e) {
        // console.log(e);
        mainText.innerText = p_presale_mint_already_minted;
      }
  }
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
        onboardButton.innerText = `✔ ...${accounts[0].slice(-12)}`;
        window.address = accounts[0];
        onboardButton.disabled = true;
        onboarding.stopOnboarding();
    
        window.contract = new web3.eth.Contract(abi, contractAddress);
        loadInfo();
    } else {
        onboardButton.innerText = "Connect MetaMask!";
    
        onboardButton.onclick = async () => {
          await window.ethereum
            .request({
              method: "eth_requestAccounts",
            })
            .then(function (accts) {
              onboardButton.innerText = `✔ ...${accts[0].slice(-12)}`;
    
              onboardButton.disabled = true;
              window.address = accts[0];
              accounts = accts;
              window.contract = new web3.eth.Contract(abi, contractAddress);
              loadInfo();
            });
        };
    };
}

async function checkChain() {
    let chainId = 0;
    if(chain === 'rinkeby') {
      chainId = 4;
    } else if(chain === 'polygon') {
      chainId = 137;
    }
    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(chainId) }],
        });
        await Connect();
      } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask.
        if (err.code === 4902) {
          try {
            if(chain === 'rinkeby') {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Rinkeby Test Network',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                  },
                ],
              });
            } else if(chain === 'polygon') {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Polygon Mainnet',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                    rpcUrls: ['https://polygon-rpc.com/'],
                  },
                ],
              });
            }
            await Connect();
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }