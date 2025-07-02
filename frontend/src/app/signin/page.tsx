import {SignInForm} from '@/components/forms'
import {GuestRoute} from '@/components/auth/guest-route'

export default function SignInPage() {
  return (
    <GuestRoute>
      <div className="flex items-center justify-center">
        <SignInForm />
      </div>
    </GuestRoute>
  )
}
