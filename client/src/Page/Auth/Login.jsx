import React, { useEffect, useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ShoppingBag, User, ArrowRight, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Bg from './bg.jpg'

const Login = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        rememberMe: false
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await axios.post('https://www.api.creativencolourful.com/api/v1/login', formData)
            setIsLoading(false);
            toast.success('Successfully logged in')
            sessionStorage.setItem('token_login', response.data.token);
            window.location.href = '/'
        } catch (error) {
            console.log(error)
            const data = error?.response?.data?.data
            if (error.status === 403) {
                window.location.href = `/Verify-Otp?type=register&email=${data}`
                setIsLoading(false);
            } else {
                setIsLoading(false);
                toast.error(error?.response?.data?.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    if (isLoggedIn) {
        return (
            <div
                className="min-h-screen relative flex items-center justify-center p-4"
                style={{
                    backgroundImage: `url(${Bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-[#FFB229]/30">
                    {/* <div className="w-20 h-20 bg-[#FFB229]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-[#81190B]" />
                    </div> */}
                    <p className="text-gray-600 mb-6">You've successfully logged into <span className="font-semibold text-[#FFB229]">Creative N Colourful </span>. Ready to shop?</p>
                    <div className="space-y-3">
                        <Link
                            to={'/cart'}
                            onClick={() => setIsLoggedIn(false)}
                            className="w-full bg-gradient-to-r from-[#81190B] to-[#FFB229] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
                        >
                            Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                            to={'/profile'}
                            onClick={() => setIsLoggedIn(false)}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                        >
                            View My Account
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen flex items-center relative justify-center p-4"
            style={{
                backgroundImage: `url(${Bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-black/10 "></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-[#FFB229]/30">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#81190B] to-[#FFB229] p-8 text-center">
                        {/* <ShoppingBag className="w-16 h-16 text-white mx-auto mb-4 drop-shadow-lg" /> */}
                        <p className="text-[#fff]/90">Sign in to your <span className="font-semibold">Creative N Colourful </span> account</p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] focus:border-transparent transition-all text-lg"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-11 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] focus:border-transparent transition-all text-lg"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#81190B] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-[#FFB229] focus:ring-[#FFB229] border-gray-300 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-700">Remember me</label>
                            </div>
                            <Link
                                to="/forget"
                                type="button"
                                className="text-sm text-[#81190B] hover:text-[#FFB229] font-medium hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !formData.Email || !formData.Password}
                            className="w-full bg-[#81190B] hover:bg-[#6a1508] text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                    Signing In...
                                </div>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>

                        {/* Security Note */}
                        {/* <div className="bg-[#FFB229]/10 border border-[#FFB229]/30 rounded-xl p-4 flex items-start">
                            <Shield className="w-5 h-5 text-[#81190B] mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-[#81190B] font-medium">Secure Login</p>
                                <p className="text-xs text-gray-600 mt-1">Your data is protected with 256-bit SSL encryption</p>
                            </div>
                        </div> */}

                        {/* Sign Up */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to={'/register'}
                                    type="button"
                                    className="text-[#FFB229] hover:text-[#81190B] font-semibold hover:underline transition-colors"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                {/* <div className="mt-6 text-center">
                    <div className="flex justify-center space-x-6 text-sm text-white/80">
                        <button className="hover:text-[#FFB229] transition-colors">Help Center</button>
                        <button className="hover:text-[#FFB229] transition-colors">Privacy Policy</button>
                        <button className="hover:text-[#FFB229] transition-colors">Terms of Service</button>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Login
