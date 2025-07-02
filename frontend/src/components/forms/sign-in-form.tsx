'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {signInSchema, SignInFormData} from '@/lib/schemas'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Eye, EyeOff} from 'lucide-react'
import {useAuth} from '@/contexts/auth.context'
import {ROUTES} from '@/lib/constants'

interface SignInFormProps {
  onSuccess?: () => void
}

export const SignInForm = ({onSuccess}: SignInFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const {signIn, isLoading} = useAuth()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    setSubmitError(null)

    try {
      await signIn(data)
      onSuccess?.()
      router.push(ROUTES.DASHBOARD)
    } catch (error) {
      // @ts-expect-error - backend error response structure
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to sign in'
      setSubmitError(errorMessage)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
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
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...register('password')} disabled={isLoading} className="pr-10" />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
