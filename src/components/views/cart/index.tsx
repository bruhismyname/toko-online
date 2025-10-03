import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Navbar from "@/components/fragment/navbar"

const CartView = () => {
    const [user, setUser] = useState<any>(null)
    const [cart, setCart] = useState<any>([])
    const [cartId, setCartId] = useState<any>(null)
    const router = useRouter()

    console.log(cart)
    console.log(cartId)

    useEffect(() => {
        const checkUser = async () => {
            const res = await fetch('/api/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.ok) {
                const json = await res.json()
                if (json.user === 'admin') {
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

    const getCart = async (id: string) => {
        try {
            const res = await fetch(`/api/cart?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res.ok) {
                const json = await res.json()
                setCart(json.data)
                console.log(json.data)
                console.log(json.data[0].id)
                setCartId(json.data[0].id)
            } else {
                console.log('error')
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    console.log(user)

    const handleIncreaseQty = async (product_id : string , cart_id : string) => {
        console.log('Increase qty for item:', product_id, cart_id)
        try {
            const res = await fetch(`/api/cart`, {
                method: "PUT" , 
                headers: {
                    "Content-Type": "application/json",
                } , 
                body: JSON.stringify({ product_id, cart_id , action : 'increase' }),
                credentials: "include",
            })
            if (res.ok) {
                const json = await res.json()
                setCart(json.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDecreaseQty = async (product_id: string , cart_id: string) => {
        console.log('Decrease qty for item:', product_id, cart_id)

        try {
            const res = await fetch(`/api/cart`, {
                method: "PUT" , 
                headers: {
                    "Content-Type": "application/json",
                } , 
                body: JSON.stringify({ product_id, cart_id , action : 'decrease' }),
                credentials: "include",
            }) 
            if (res.ok) {
                const json = await res.json()
                setCart(json.data)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const handleDelete = async (product_id: string , cart_id: string) => {
        console.log('Delete item:', product_id, cart_id)

        try {
            const res = await fetch(`/api/cart`, {
                method: "DELETE" , 
                headers: {
                    "Content-Type": "application/json",
                } , 
                body: JSON.stringify({ product_id, cart_id }),
                credentials: "include",
            })

            if (res.ok) {
                const json = await res.json()
                setCart(json.data)
            } else {
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCheckout = (itemId: string, productName: string, total: number) => {
        console.log('Checkout item:', itemId, productName, total)
        // TODO: Implementasi checkout per item
    }

    console.log(user)
    console.log(cart)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Cart</h1>

                {cart.length === 0 || cart[0].cart_items.length === 0  ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Your cart is empty.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.map((cartItem: any) => (
                            <div key={cartItem.id}>
                                {cartItem.cart_items.map((item: any) => {
                                    const subtotal = (item.product.price * item.qty).toFixed(2)
                                    return (
                                        <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-4">
                                            <div className="flex gap-6">
                                                {/* Product Image */}
                                                <div className="w-32 h-32 relative flex-shrink-0">
                                                    <Image
                                                        src={item.image || "/images/placeholder.png"}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex-1">
                                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                            {item.product.name}
                                                        </h2>
                                                        <p className="text-gray-600 mb-1">
                                                            Price: <span className="font-semibold">Rp {Number(item.product.price).toLocaleString("id-ID")}</span>
                                                        </p>
                                                        
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-3 mt-4">
                                                            <span className="text-gray-700 font-medium">Quantity:</span>
                                                            <button
                                                                onClick={() => handleDecreaseQty(item.product.id , cartId)}
                                                                className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition font-semibold text-gray-700 text-lg"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-14 text-center font-semibold text-gray-900 text-lg">
                                                                {item.qty}
                                                            </span>
                                                            <button
                                                                onClick={() => handleIncreaseQty(item.product.id , cartId)}
                                                                className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition font-semibold text-gray-700 text-lg"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Delete Button */}
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => handleDelete(item.product.id , cartId)}
                                                            className="text-red-500 hover:text-red-700 font-medium transition flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Right Section - Total & Checkout */}
                                                <div className="flex flex-col justify-between items-end min-w-[200px]">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                                                        <p className="text-2xl font-bold text-gray-900">Rp {Number(subtotal).toLocaleString("id-ID")}</p>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => handleCheckout(item.id, item.product.name, parseFloat(subtotal))}
                                                        className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 transition"
                                                    >
                                                        Checkout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default CartView