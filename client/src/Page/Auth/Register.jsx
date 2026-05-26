import React, { useEffect, useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Phone, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Bg from './bg.jpg'


const Register = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Password: '',
        ContactNumber: '',
        newsletter: false,
        terms: false
    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            console.log("Submitting Registration Form with Data:", formData);
            const response = await axios.post(`https://www.api.creativencolourful.com/api/v1/regsiter-user`, formData)
            console.log("Submitting Registration Form with Data: done");
            const user = response.data.data
            // window.location.href = `/Verify-Otp?type=register&email=${user?.Email || formData.Email}&number=${user?.ContactNumber || formData.ContactNumber}`

            setTimeout(() => {
                window.location.href = `/Verify-Otp?type=register&email=${user?.Email || formData.Email}&number=${user?.ContactNumber || formData.ContactNumber}`
            }, 2000)
            setFormData({
                Name: '',
                Email: '',
                Password: '',
                ContactNumber: ''
            })
        } catch (error) {
            if (error?.response?.data.message === "An account already exists with this email. Please verify your email or reset your password if you forgot it.") {
                toast.success('Account already exists. Redirecting for verification...')
                setTimeout(() => {
                    window.location.href = `/Verify-Otp?type=register&email=${formData.Email}&number=${formData.ContactNumber}&reverify=true`
                }, 2000)
            } else {
                toast.error(error?.response?.data.message || 'An error occurred during registration')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    if (isSubmitted) {
        return (
            <div
                className="min-h-screen flex items-center justify-center p-4 relative"
                style={{
                    backgroundImage: 'url("/assets/bg-8ZRWFVDD.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-[#FFB229]/30">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#81190B] mb-4">Welcome to Creative N Colourful  !</h2>
                    <p className="text-gray-600 mb-6">
                        Your account has been created successfully. Start exploring our exclusive collection!
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="w-full bg-gradient-to-r from-[#81190B] to-[#FFB229] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen py-12 px-4 relative"
            style={{
                backgroundImage: `url(${Bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-[#FFB229]/30">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#81190B] to-[#FFB229] p-8 text-center">
                        {/* <ShoppingBag className="w-16 h-16 text-white mx-auto mb-4 drop-shadow-lg" /> */}
                     
                        <p className="text-[#fff]/80"> Create your account and step into flavor</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-[#FFB229]" /> Personal Info
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] focus:border-transparent transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            name="ContactNumber"
                                            value={formData.ContactNumber}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] focus:border-transparent transition-all"
                                            placeholder="+91 988xxxxxxx"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-[#FFB229]" /> Account Info
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="Email"
                                            value={formData.Email}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] focus:border-transparent transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="Password"
                                            value={formData.Password}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] focus:border-transparent transition-all"
                                            placeholder="Create a strong password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#81190B]"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms + Newsletter */}
                        <div className="mt-8 space-y-4">
                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    name="newsletter"
                                    checked={formData.newsletter}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-[#FFB229] focus:ring-[#FFB229] border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">
                                    Subscribe to our newsletter for exclusive offers
                                </span>
                            </label>

                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-[#FFB229] focus:ring-[#FFB229] border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">
                                    I agree to the <Link to={"/terms"} className="text-[#FFB229] hover:underline">Terms of Service</Link> and <Link to={"/privacy"} className="text-[#FFB229] hover:underline">Privacy Policy</Link>
                                </span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.terms}
                            className="w-full mt-8 bg-[#81190B] hover:bg-[#6a1508] text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                        >
                            {loading ? "Creating Account..." : "Create My Account"}
                        </button>

                        {/* Already have account */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to={'/login'} className="text-[#FFB229] hover:text-[#81190B] font-semibold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
