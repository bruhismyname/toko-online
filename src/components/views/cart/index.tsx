import Navbar from "@/components/fragment/navbar"
import { getUserFromToken } from "@/lib/auth"
import { useEffect, useState } from "react"
import { Router, useRouter } from "next/router"
import Image from "next/image"

const CartView = () => {

    const [user,setUser] = useState<any>(null)
    const [cart, setCart] = useState<any>([])
    const router = useRouter()
    useEffect(() => {
        const checkUser = async () => {
            const res = await fetch('/api/session' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.ok) {
                const json = await res.json()
                if(json.user === 'admin') {
                    router.push('/dashboard')
                } else {
                    setUser(json.user)
                    getCart(json.user.id)
                }
            } else {
                router.push('/auth/login')
            }
        }
        checkUser()
    }, [router])

    const getCart = async (id : string) => {
        try {
            const res = await fetch(`/api/cart?id=${id}` , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res.ok) {
                const json = await res.json()
                setCart(json.data)
            } else {
                console.log('error')
            }
        } catch (error) {
            
        }
    }

    console.log(user)
    console.log(cart)

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Cart</h1>

            {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
            ) : (
            <div className="space-y-6">
                {cart.map((cartItem: any) => (
                <div key={cartItem.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow">
                    {cartItem.cart_items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
                        <div className="w-24 h-24 relative">
                        <Image
                            src={item.image || "/images/placeholder.png"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                        />
                        </div>
                        <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">{item.product.name}</h2>
                        <p className="text-gray-600">Price: ${item.product.price}</p>
                        <p className="text-gray-600">Qty: {item.qty}</p>
                        </div>
                        <button
                            className="rounded-lg bg-black px-6 py-2 font-semibold text-white hover:bg-gray-800 transition"
                            onClick={() => console.log("Checkout clicked")}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                    ))}
                </div>
                ))}

                <div className="flex justify-end">
                
                </div>
            </div>
            )}
        </main>
        </div>
    )
}

export default CartView
