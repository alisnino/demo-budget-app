import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { theme } from "@/styles/theme"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { checkLoginStatus } from "@/apis/api"
import { LoadingIconModal } from "@/components/loading-icon-modal"

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  )
  const router = useRouter()

  useEffect(() => {
    console.log("pageProps", pageProps)
    const authorize = async () => {
      setIsAuthenticated(false)
      try {
        const isLoggedIn = await checkLoginStatus()
        if (!isLoggedIn) {
          router.push("/login")
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error checking login status")
        router.push("/login")
      }
    }

    if (pageProps.requiresAuth) {
      console.log("requiresAuth")
      authorize()
    } else {
      setIsAuthenticated(true)
    }
  }, [pageProps, router])

  return (
    <ChakraProvider theme={theme}>
      {isAuthenticated === undefined ? (
        <></>
      ) : isAuthenticated === false ? (
        <LoadingIconModal isLoading={true} />
      ) : (
        <Component {...pageProps} />
      )}
    </ChakraProvider>
  )
}
