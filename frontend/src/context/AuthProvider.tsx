import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeader } from "../services/apiClient"
import router from "../router"

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string>("")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)

    const login = (accessToken: string) => {
        setIsLoggedIn(true)
        setAccessToken(accessToken)
    }

    useEffect(() => {
        setHeader(accessToken)
        console.log(accessToken)
    }, [accessToken])

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const result = await apiClient.post("/auth/refresh-token")
                setAccessToken(result.data.access_token)
                setIsLoggedIn(true)

                const currentPath = window.location.pathname
                if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/") {
                    console.log("Current Path:", currentPath)
                    router.navigate("/dashboard")
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setAccessToken("")
                setIsLoggedIn(false)
            } finally {
                setIsAuthenticating(false)
            }
        }
        tryRefresh()
    }, [])

    const logout = () => setIsLoggedIn(false)

    return <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthenticating }}>{children}</AuthContext.Provider>
}
