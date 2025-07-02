'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {signUpSchema, SignUpFormData} from '@/lib/schemas'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Eye, EyeOff, CheckCircle} from 'lucide-react'
import {useAuth} from '@/contexts/auth.context'
import {ROUTES} from '@/lib/constants'

interface SignUpFormProps {
  onSuccess?: () => void
}

export const SignUpForm = ({onSuccess}: SignUpFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const {signUp, isLoading} = useAuth()

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const passwordRequirements = {
    length: password?.length >= 6,
    match: password === confirmPassword && confirmPassword.length > 0,
  }

  const onSubmit = async (data: SignUpFormData) => {
    setSubmitError(null)

    try {
      await signUp({email: data.email, password: data.password})
      onSuccess?.()
      router.push(ROUTES.DASHBOARD)
    } catch (error) {
      // @ts-expect-error - backend error response structure
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to create account'
      setSubmitError(errorMessage)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to start shortening URLs</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" placeholder="Enter your email" {...register('email')} disabled={isLoading} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" {...register('password')} disabled={isLoading} className="pr-10" />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

            {password && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className={`h-3 w-3 ${passwordRequirements.length ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}>At least 6 characters</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                disabled={isLoading}
                className="pr-10"
              />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}

            {confirmPassword && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`h-3 w-3 ${passwordRequirements.match ? 'text-green-500' : 'text-red-500'}`} />
                <span className={passwordRequirements.match ? 'text-green-600' : 'text-red-600'}>{passwordRequirements.match ? 'Passwords match' : "Passwords don't match"}</span>
              </div>
            )}
          </div>

          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
