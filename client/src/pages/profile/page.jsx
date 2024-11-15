import { useAppStore } from '@/store'
import React from 'react'

const Profile = () => {

  const {userInfo} = useAppStore()
  console.log(userInfo)

  return (
    <div>
      <h1>{userInfo.email}</h1>
    </div>
  )
}

export default Profile