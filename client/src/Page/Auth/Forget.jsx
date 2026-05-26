import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle, ShoppingBag, Shield, Clock, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react'
import Bg from './bg.jpg'


const Forget = () => {
  const [formData, setFormData] = useState({
    Email: '',
    newPassword: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrorMessage('')
    setSuccessMessage('')
  }

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.Email || !formData.newPassword) return
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const response = await fetch('https://www.api.creativencolourful.com/api/v1/Password-Change-Request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        setSuccessMessage(data.msg || 'Password reset request sent successfully!')
        setIsSubmitted(true)
        startCountdown()
        setTimeout(() => {
          window.location.href = `/Verify-Otp?type=password_reset&email=${formData.Email}&changepassword=true`
        }, 1400)
      } else {
        setErrorMessage(data.message || 'Failed to send request. Please try again.')
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('Connection error. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startCountdown = () => {
    setCanResend(false)
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (!formData.Email || !formData.newPassword) return
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const response = await fetch('https://www.api.creativencolourful.com/api/v1/Password-Change-Request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        setSuccessMessage('Reset link sent again!')
        startCountdown()
      } else {
        setErrorMessage(data.message || 'Failed to resend. Please try again.')
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('Resend failed. Check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setIsSubmitted(false)
    setFormData({ Email: '', newPassword: '' })
    setCanResend(false)
    setCountdown(60)
    setErrorMessage('')
    setSuccessMessage('')
    setPasswordVisible(false)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
                    backgroundImage: `url(${Bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#81190B] to-[#FFB229] p-8 text-center">
            {/* <ShoppingBag className="w-16 h-16 text-white mx-auto mb-4 drop-shadow-md" /> */}
            {/* <h1 className="text-3xl font-bold text-white mb-2">
              {isSubmitted ? 'Request Sent!' : 'Reset Password'}
            </h1> */}
            <p className="text-orange-100">
              {isSubmitted ? 'Check your email for verification' : 'Enter details to reset password'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {isSubmitted ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Request Sent!</h2>
                <p className="text-gray-600">We've sent a verification link to:</p>
                <p className="text-[#81190B] font-semibold break-all">{formData.Email}</p>

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
                    {successMessage}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                  <Clock className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Redirecting Soon</p>
                    <p className="text-xs text-[#81190B] mt-1">
                      You'll be redirected shortly
                    </p>
                  </div>
                </div>

                {canResend ? (
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin mr-2"></div>
                        Resending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Request
                      </>
                    )}
                  </button>
                ) : (
                  <p className="text-sm text-gray-600">
                    Resend available in <span className="font-semibold text-[#FFB229]">{countdown}s</span>
                  </p>
                )}

                <Link 
                to="/login"
  onClick={handleBackToLogin}

                  className="w-full bg-[#81190B] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#6a1409] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Login
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <Link
                to="/login"
                  onClick={handleBackToLogin}

                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>

                <div className="">
                  <p className="text-gray-600">Enter your email and new password below</p>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] text-lg"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full pl-11 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB229] text-lg"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#81190B] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#6a1409] transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>

                {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                  <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Secure Reset Process</p>
                    <p className="text-xs text-[#81190B] mt-1">
                      Your password will only update after verification
                    </p>
                  </div>
                </div> */}

                <div className="text-center border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">Remember your password?</p>
                  <a href="/login" className="text-[#FFB229] hover:text-orange-600 font-semibold hover:underline">
                    Sign In Instead
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
{/* 
        <div className="mt-6 text-center text-sm text-white/80 flex justify-center space-x-6">
          <button className="hover:text-white">Help Center</button>
          <button className="hover:text-white">Privacy Policy</button>
          <button className="hover:text-white">Terms of Service</button>
        </div> */}
      </div>
    </div>
  )
}

export default Forget
