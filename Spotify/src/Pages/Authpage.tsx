import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const location = useLocation()
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        setIsLogin(location.pathname === "/login")
    }, [location])

    const onSubmit = (data : any) => {
        console.log(data)
        // Handle form submission here
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", { required: true })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: true })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                {...register("confirmPassword", { required: true })}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    )}
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage