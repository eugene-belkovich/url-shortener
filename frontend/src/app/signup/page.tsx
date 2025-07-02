import {SignUpForm} from '@/components/forms'
import {GuestRoute} from '@/components/auth/guest-route'

export default function SignUpPage() {
  return (
    <GuestRoute>
      <div className="flex items-center justify-center">
        <SignUpForm />
      </div>
    </GuestRoute>
  )
}
