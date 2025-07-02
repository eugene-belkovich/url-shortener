import {CreateShortUrlForm} from '@/components'

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className=" mx-auto max-w-6xl items-center">
          <div className="mb-8 flex flex-col items-center justify-center ">
            <h1 className="text-4xl font-bold text-gray-900">Home</h1>
            <p className="mt-2 text-2xl text-gray-600">Hi there, 🖖!</p>
          </div>

          <div>
            <CreateShortUrlForm />
          </div>
        </div>
      </div>
    </div>
  )
}
