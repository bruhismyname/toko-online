import { useRouter } from "next/router"
import {  useEffect, useState } from "react"

const DashboardView = () => {

    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    const handleLogout = async () => {
        const res = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        console.log(user)
        if (res.ok) {
            router.push("/auth/login")
        } 
    }
    
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("/api/session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            
                )
                const json = await res.json()
                console.log(json)
                if (!res.ok) {
                    router.push("/auth/login")
                } else {
                    setUser(json.user)
                }
            } catch (error) {
                router.push("/auth/login")
            }
        }
        checkSession()
    } , [router])

    

    return (
         <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
                Dashboard {user ? `- Welcome ${user.id}` : ""}
            </h1>

            <h2 className="mb-4 text-2xl font-bold text-gray-800">Contoh button logout</h2>

            <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
            >
                Logout
            </button>
            </div>
    )
}

export default DashboardView    