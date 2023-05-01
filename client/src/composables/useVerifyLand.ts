import { useUserStore } from '@/stores/user'
import ipfs from '@/services/ipfs'
import { useWeb3Store } from './../stores/web3'
import { ref } from 'vue'
import type { Land, User } from '@/stores/types'
import { Buffer } from 'buffer'
import { useUIStore } from '@/stores/ui'

export function useVerifyLand() {
  const landId = ref('')
  const land = ref<Land>()
  const previousOwnerUsers = ref<Map<String, User>>(new Map())
  const isShowVerifyModal = ref<boolean>(false)

  const verify = async () => {
    try {
      if (landId.value.length < 1) {
        throw new Error('Land ID not valid')
      }
      const res = await useWeb3Store().getLand(landId.value)
      if (res == undefined || !Array.isArray(res)) {
        useUIStore().showAlert({
          type: 'danger',
          message: "Land asset with the speicified ID doesn't exist"
        })
      }
      if (res.is_govt_approved == false) {
        throw new Error('Land ID not valid')
      }

      displayModal(res)
    } catch (error) {
      useUIStore().showAlert({
        type: 'danger',
        message: 'Land asset with the specified ID either does not exist or has not been approved.'
      })
      console.log(error)
    }
  }

  const displayModal = async (detail: any) => {
    const chunks = []
    for await (const chunk of ipfs.cat(detail['ipfsHash'])) {
      chunks.push(chunk)
    }

    for (const owner of [...detail['previous_owners'], detail['current_owner']]) {
      try {
        const user = await useUserStore().getUserByAddress(owner)
        if (user) {
          previousOwnerUsers.value.set(owner, user)
        }
      } catch (error) {
        console.log(error)
      }
    }

    land.value = {
      current_owner: detail['current_owner'],
      created_at: detail['created_at'] * 1000,
      approved_at: detail['approved_at'] * 1000,
      is_govt_approved: detail['is_govt_approved'],
      land_id: detail['land_id'],
      previous_owners: detail['previous_owners'],
      users: previousOwnerUsers.value,
      ...JSON.parse(Buffer.concat(chunks).toString())
    }
    isShowVerifyModal.value = true
  }

  const closeVerifyModal = () => {
    isShowVerifyModal.value = false
  }
  return { verify, landId, isShowVerifyModal, closeVerifyModal, land, previousOwnerUsers }
}
