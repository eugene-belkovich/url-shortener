import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create a new account to start shortening URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Sign Up form will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 
