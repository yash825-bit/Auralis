import React from 'react'

import Navbar from '../components/info/Navbar'
import Footer from '../components/common/Footer'

export default function MainLayout({children})
{
  return (
    <div className='flex flex-col min-h-screen bg-black overflow-hidden'>
        <Navbar />
        <main className="flex-1 relative">
            {children}
        </main>
        <Footer/>
    </div>
  )
}
