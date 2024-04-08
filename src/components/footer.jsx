import React from 'react';
import { Box, Container, Grid, GridItem, Link, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.900" color="white" py={10}>
      <Container maxW="container.xl">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
          <GridItem>
            <Text fontWeight="bold" fontSize="lg" mb={4}>Contact Us</Text>
            <Text>Email: example@example.com</Text>
            <Text>Phone: 123-456-7890</Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" fontSize="lg" mb={4}>Follow Us</Text>
            <Link href="https://twitter.com/example" target="_blank">Twitter</Link>
            <Link href="https://facebook.com/example" target="_blank" ml={4}>Facebook</Link>
            <Link href="https://instagram.com/example" target="_blank" ml={4}>Instagram</Link>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" fontSize="lg" mb={4}>Address</Text>
            <Text>123 Main St</Text>
            <Text>City, State ZIP</Text>
          </GridItem>
        </Grid>
        <Box mt={8} textAlign="center">
          <Text fontSize="sm">&copy; {new Date().getFullYear()} Example Company. All rights reserved.</Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
