import { login } from "@/apis/api"
import { LoginRequest, LoginRequestSchema } from "@/schemas/auth"
import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
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
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const onSubmit = (data: LoginRequest) => {
    setErrorMessage("")
    login(data.username, data.password)
      .then((res) => {
        if (res) {
          router.push("/transactions")
        } else {
          setErrorMessage("Username or password is incorrect.")
        }
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
  }

  return (
    <VStack
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      gap="0"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "420px", height: "fit-content" }}
      >
        <VStack
          gap="12px"
          backgroundColor="primary.500"
          borderRadius="16px"
          p="24px 48px"
        >
          <FormControl isInvalid={!!errors.username}>
            <Text color="white">Username or email</Text>
            <Input {...register("username")} />
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <Text color="white">Password</Text>
            <InputGroup>
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
              />
              <Box onClick={() => setShowPassword(!showPassword)}>
                <InputRightElement>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </InputRightElement>
              </Box>
            </InputGroup>
          </FormControl>
          <Button type="submit">
            <Text>Login</Text>
          </Button>
        </VStack>
        {errorMessage && (
          <Box p="8px">
            <Text fontSize={"sm"} color="red" textAlign="center">
              {errorMessage}
            </Text>
          </Box>
        )}
        {(errors.username || errors.password) && (
          <VStack gap="4px" justifyContent="center" alignItems="center" p="8px">
            {errors.username && (
              <Text fontSize={"sm"} color="red" textAlign="center">
                {errors.username.message}
              </Text>
            )}
            {errors.password && (
              <Text fontSize={"sm"} color="red" textAlign="center">
                {errors.password.message}
              </Text>
            )}
          </VStack>
        )}
      </form>
    </VStack>
  )
}

export async function getStaticProps() {
  return {
    props: {
      requiresAuth: false,
    },
  }
}

export default LoginPage
