import React from 'react'
import { Button } from '../ui/button'

export default function LeftSide() {
  return (
    <div className='flex items-center gap-3'> 
    <div className='hidden items-center lg:flex'>
    <Button variant={"ghost"} className='rounded-full p-2'>

    </Button>
    </div>

    </div>
  )
}
