import {CreateShortUrlForm} from '@/components'

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Home</h1>
            <p className="mt-2 text-gray-600">Hi there, 🖖!</p>
          </div>

          <div>
            <CreateShortUrlForm />
          </div>
        </div>
      </div>
    </div>
  )
}
