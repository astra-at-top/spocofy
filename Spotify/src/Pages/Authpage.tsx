import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { login , signup } from "../Store/Reducer/AuthpageReducer"
import { AppDispatch } from "../Store/store"
import { useAppSelector } from "../Store/store"
import Loading from "./Loading"

interface AuthData {
    email: string,
    password: string,
    confirmPassword ? : string | null
}

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const location = useLocation()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthData>()
    const dispatch = useDispatch<AppDispatch>()
    const loading = useAppSelector(state  => state.auth.loading)
    const backendError  = useAppSelector(state => state.auth.error);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate()

    useEffect(() => {
        setIsLogin(location.pathname === "/login")
    }, [location])

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = (data: AuthData) => {
        if(location.pathname === "/login") dispatch(login({email : data.email , password : data.password , navigate : navigate}))
        if(location.pathname === "/signup") dispatch(signup({email : data.email , password  : data.password , navigate : navigate})) 
    }

    const watchPassword = watch("password")

    if(loading) return <Loading />
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900 font-firacode">
            <div className="mb-6 flex gap-2">
                <img src="/Logo.svg" className="h-10 w-10 "/>
                <span className="text-white text-2xl font-bold">Spocofy</span>
            </div>
            <div className="border border-purple-600 p-8  shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-white">{isLogin ? "Login" : "Sign Up"}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {backendError && (
                        <div className="mb-4 p-2 rounded">
                            <p className="text-red-700">{backendError.message}</p>
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-white">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full px-3 py-2 border  bg-gray-700 text-white"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-white">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full px-3 py-2 border  bg-gray-700 text-white"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block mb-2 text-white">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                {...register("confirmPassword", { 
                                    required: "Confirm Password is required",
                                    validate: (value) => value === watchPassword || "Passwords do not match"
                                })}
                                className="w-full px-3 py-2 border  bg-gray-700 text-white"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                    )}
                    <button type="submit" className="w-full text-white py-2 border border-purple-600 hover:bg-purple-600 transition-colors duration-300">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage