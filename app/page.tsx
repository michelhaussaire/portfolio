'use client'

import { Box, Button, Center, Heading, Text } from "@chakra-ui/react"

export default function Page() {
  return (
    <Center my='8'> 
     <Box maxW='32rem'>
        <center>
          <Heading mb={4}>Haussaire Michel</Heading>
        </center>
        <Text fontSize='xl'>Dessarrollador fullstack con base en Argentina</Text>
        <center>
          <Button size='lg' colorScheme='teal' mt='24px'>Comecemos</Button>
        </center>
      </Box>
    </Center>
  )
}