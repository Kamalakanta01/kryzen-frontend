"use client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate();

  async function HandleSignup(event) {
    event.preventDefault(); // Prevents the default form submission behavior
    setLoading(true);
    try {
      const response = await axios.post(
        `https://kryzen-backend-p0vu.onrender.com/signup`,
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }
      );
      // Assuming your backend returns a message indicating the email already exists
      const data = response.data;
      console.log(data);
      if (
        data ===
        "This Email already exists, please login or use a different email"
      ) {
        setLoading(false)
        window.alert(data);
      } else {
        setLoading(false)
        window.alert("Signup successful!");
        navigation("/login");
      }
    } catch (err) {
      setLoading(false)
      console.log("Signup failed:", err.response.data.error);
      // You can handle other errors here, such as displaying an error message to the user
    }
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {loading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}
          {!loading && (
            <form onSubmit={HandleSignup}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    loadingText="Submitting"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={"center"}>
                    Already a user?{" "}
                    <Link
                      onClick={() => {
                        navigation("/login");
                      }}
                      color={"blue.400"}
                    >
                      Login
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          )}
        </Box>
      </Stack>
    </Flex>
  );
}
