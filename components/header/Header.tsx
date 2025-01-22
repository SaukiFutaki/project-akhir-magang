import React from 'react'
import LeftSide from './left-side'
import RightSide from './right-side'

export default function Header() {
  return (
    <div className='mx-3 flex items-center justify-between py-4'>
      <LeftSide />
      <RightSide />
    </div>
  )
}
