window.addEventListener('DOMContentLoaded', initialize)

const initialize = async () => {

    let onboarding
    try {
      onboarding = new MetaMaskOnboarding({ forwarderOrigin })
    } catch (error) {
      console.error(error)
    }
  
    let accounts
    let accountButtonsInitialized = false
  
    const accountButtons = [
      deployButton,
      depositButton,
      withdrawButton,
      sendButton,
      createToken,
      transferTokens,
      approveTokens,
      transferTokensWithoutGas,
      approveTokensWithoutGas,
      signTypedData,
      getEncryptionKeyButton,
      encryptMessageInput,
      encryptButton,
      decryptButton,
    ]
  
    const isMetaMaskConnected = () => accounts && accounts.length > 0
  
    const onClickInstall = () => {
      onboardButton.innerText = 'Onboarding in progress'
      onboardButton.disabled = true
      onboarding.startOnboarding()
    }
  
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
  
    const clearTextDisplays = () => {
      encryptionKeyDisplay.innerText = ''
      encryptMessageInput.value = ''
      ciphertextDisplay.innerText = ''
      cleartextDisplay.innerText = ''
    }
  
    const updateButtons = () => {
      const accountButtonsDisabled = !isMetaMaskInstalled() || !isMetaMaskConnected()
      if (accountButtonsDisabled) {
        for (const button of accountButtons) {
          button.disabled = true
        }
        clearTextDisplays()
      } else {
        deployButton.disabled = false
        sendButton.disabled = false
        createToken.disabled = false
        signTypedData.disabled = false
        getEncryptionKeyButton.disabled = false
      }
  
      if (!isMetaMaskInstalled()) {
        onboardButton.innerText = 'Click here to install MetaMask!'
        onboardButton.onclick = onClickInstall
        onboardButton.disabled = false
      } else if (isMetaMaskConnected()) {
        onboardButton.innerText = 'Connected'
        onboardButton.disabled = true
        if (onboarding) {
          onboarding.stopOnboarding()
        }
      } else {
        onboardButton.innerText = 'Connect'
        onboardButton.onclick = onClickConnect
        onboardButton.disabled = false
      }
    }
  
    const initializeAccountButtons = () => {
  
      if (accountButtonsInitialized) {
        return
      }
      accountButtonsInitialized = true
  
    function handleNewAccounts (newAccounts) {
      accounts = newAccounts
      accountsDiv.innerHTML = accounts
      if (isMetaMaskConnected()) {
        initializeAccountButtons()
      }
      updateButtons()
    }
  
    function handleNewChain (chainId) {
      chainIdDiv.innerHTML = chainId
    }
  
    function handleNewNetwork (networkId) {
      networkDiv.innerHTML = networkId
    }
  
    async function getNetworkAndChainId () {
      try {
        const chainId = await ethereum.request({
          method: 'eth_chainId',
        })
        handleNewChain(chainId)
  
        const networkId = await ethereum.request({
          method: 'net_version',
        })
        handleNewNetwork(networkId)
      } catch (err) {
        console.error(err)
      }
    }
  
    updateButtons()
  
    if (isMetaMaskInstalled()) {
  
      ethereum.autoRefreshOnNetworkChange = false
      getNetworkAndChainId()
  
      ethereum.on('chainChanged', handleNewChain)
      ethereum.on('networkChanged', handleNewNetwork)
      ethereum.on('accountsChanged', handleNewAccounts)
  
      try {
        const newAccounts = await ethereum.request({
          method: 'eth_accounts',
        })
        handleNewAccounts(newAccounts)
      } catch (err) {
        console.error('Error on init when getting accounts', err)
      }
    }
  }
}