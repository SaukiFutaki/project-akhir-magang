import React from 'react'
import LeftSide from './left-side'
import RightSide from './right-side'
import { auth } from '@/auth';
import { headers } from 'next/headers';

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
});

const userImage = session?.user.image
  return (
    <div className='mx-3 flex items-center justify-between py-4'>
      <LeftSide />
      <RightSide avatar={userImage ?? ""} />
    </div>
  )
}
