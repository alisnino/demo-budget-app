import { LoginRequest, LoginRequestSchema } from "@/schemas/auth"
import { InputStyle } from "@/styles/input"
import { FormLabelStyle } from "@/styles/text"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  })

  const [showPassword, setShowPassword] = useState(false)

  return (
    <Box>
      <Flex w="360px" p="16px 24px" gap="8px">
        <form
          onSubmit={handleSubmit((data) => console.log(data))}
          style={{ width: "100%", height: "100%" }}
        >
          <VStack gap="8px">
            <FormControl isInvalid={!!errors.username}>
              <Text sx={FormLabelStyle}>Username or email</Text>
              <Input sx={InputStyle} {...register("username")} />
              {errors.username && (
                <FormErrorMessage>{errors.username.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <Text sx={FormLabelStyle}>Password</Text>
              <InputGroup>
                <Input
                  sx={InputStyle}
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                />
                <Box onClick={() => setShowPassword(!showPassword)}>
                  <InputRightElement>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </InputRightElement>
                </Box>
              </InputGroup>
              {errors.password && (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button type="submit">Login</Button>
          </VStack>
        </form>
      </Flex>
    </Box>
  )
}

export default LoginPage
