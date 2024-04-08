import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigation = useNavigate();

  async function HandleLogin(event) {
    event.preventDefault(); // Prevents the default form submission behavior
    axios
      .post(`https://kryzen-backend-p0vu.onrender.com/login`, {
        email: Email,
        password: Password,
      })
      .then((response) => {
        console.log(response)
        if (response.data === "Wrong credentials" || response.data === "email does not exist, please signup first") {
          window.alert("Login failed. Please check your credentials and try again.");
        } else {
          const token = response.data.token;
          localStorage.setItem("token", token);
          navigation("/dashboard");
          window.alert("Login successful!");
          window.location.reload()
        }
      })
      .catch((err) => {
          console.log("Login failed:", err.response.data.error);
          // You can handle other errors here, such as displaying an error message to the user
      });
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
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Text color={"blue.400"}>features</Text> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={HandleLogin}>
            <Stack spacing={4}>
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
                <Input
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Text
                    cursor={"grab"}
                    onClick={() => {
                      navigation("/signup");
                    }}
                    color={"blue.400"}
                  >
                    Sign Up
                  </Text>
                </Stack>
                <Button
                  type="submit" // Ensures the button triggers form submission
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
