import { Link } from '@chakra-ui/react'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-gray-800 flex flex-row justify-center text-xl gap-4 py-2'>
        <Link href='/' color='white' _hover={{ color: 'blue.500' }}>Home</Link>
        <Link href='/about' color='white' _hover={{ color: 'blue.500' }}>About</Link>
        <Link href='/proyects' color='white' _hover={{ color: 'blue.500' }}>Proyects</Link>
        <Link href='/contact' color='white' _hover={{ color: 'blue.500' }}>Contact</Link>
    </nav> 
  )
}

export default Navbar