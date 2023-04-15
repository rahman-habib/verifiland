import router from '@/router'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import Web3 from 'web3'
import { useWeb3Store } from '../stores/web3'

export function useLoginWithMetaMask() {
  const metaMaskLoginSupported = ref<boolean>(true)
  const { loginWithAddress } = useUserStore()
  const login = async () => {
    try {
      const account = await useWeb3Store().getWeb3()
      if (!account) {
        throw 'Account not connected to MetaMask'
      }
      await loginWithAddress(account, '')
      router.push('/assets')
    } catch (error) {
      console.log(error)
      useUIStore().showAlert({
        type: 'danger',
        message:
          'Sign in with metamask failed, \n\n\n Ensure you are connected to ethereum and transaction signing is enabled'
      })
    }
  }

  return { login, metaMaskLoginSupported }
}
