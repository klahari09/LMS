import React from 'react'
import { dummyEducatorData} from '../../assets/assets'
import {UserButton, useUser} from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Navbar = () => {
  const educatorData=dummyEducatorData
  const {user}=useUser()
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/' >
       <h1 onClick={()=> navigate('/')} className="text-2xl font-bold text-black-600 cursor-pointer">Edura</h1>
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user? user.fullName : 'Developers'}</p>
        {user ? <UserButton/> : <img className='max-w-8' src={assets.profile_img}/>}
      </div>
    </div>
  )
}

export default Navbar