import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Milk, ArrowLeft } from 'lucide-react'
import { Input } from '../../components/UI/Input'
import { Button } from '../../components/UI/Button'

type Step = 'email' | 'code' | 'password'

const PasswordRecovery: React.FC = () => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('code')
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('password')
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Password reset successful!')
  }

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return { label: '', color: '' }
    if (newPassword.length < 6) return { label: 'Weak', color: 'text-danger' }
    if (newPassword.length < 10) return { label: 'Medium', color: 'text-warning' }
    return { label: 'Strong', color: 'text-success' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-fresh-500 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
            <Milk className="text-primary-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Password Recovery</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'code' && 'Enter the verification code sent to your email'}
            {step === 'password' && 'Create a new password'}
          </p>
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@dairy.com"
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Send Verification Code
            </Button>
          </form>
        )}

        {/* Step 2: Verification Code */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit}>
            <Input
              label="Verification Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Verify Code
            </Button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            {newPassword && (
              <div className="mb-4">
                <p className={`text-sm ${strength.color}`}>Password strength: {strength.label}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      strength.label === 'Weak' ? 'bg-danger w-1/3' :
                      strength.label === 'Medium' ? 'bg-warning w-2/3' :
                      'bg-success w-full'
                    }`}
                  ></div>
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              error={confirmPassword && confirmPassword !== newPassword ? 'Passwords do not match' : ''}
              required
            />
            <Button type="submit" variant="primary" className="w-full" disabled={newPassword !== confirmPassword}>
              Reset Password
            </Button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6">
          <Link to="/login" className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-700">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PasswordRecovery
