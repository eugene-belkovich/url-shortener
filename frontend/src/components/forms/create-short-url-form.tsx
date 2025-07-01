'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation} from '@tanstack/react-query'
import {createUrlSchema, CreateUrlFormData} from '@/lib/schemas'
import {UrlService} from '@/services/url.service'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {toast} from 'sonner'
import {Url} from '@/types/api'
import {AxiosError} from 'axios'

interface CreateUrlFormProps {
  onSuccess?: (url: Url) => void
  className?: string
}

export const CreateShortUrlForm = ({onSuccess}: CreateUrlFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitResponse, setSubmitResponse] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
    watch,
  } = useForm<CreateUrlFormData>({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      originalUrl: '',
    },
  })

  const createUrlMutation = useMutation({
    mutationFn: UrlService.createUrl,
    onSuccess: data => {
      console.log({data})
      toast.success('Short URL created successfully')
      setSubmitResponse(data.shortUrl)
      reset()
      onSuccess?.(data)
    },
    onError: (error: AxiosError) => {
      // @ts-ignore
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to create URL'
      setSubmitError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const onSubmit = async (data: CreateUrlFormData) => {
    setSubmitError(null)
    createUrlMutation.mutate({
      originalUrl: data.originalUrl,
    })
  }

  const originalUrl = watch('originalUrl')

  const handleClearForm = () => {
    reset()
    setSubmitError(null)
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setValue('originalUrl', text)
        toast.success('URL inserted from clipboard')
      }
    } catch {
      toast.error('Failed to read clipboard')
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>URL shortener</CardTitle>
        <CardDescription>Enter URL to shorten</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/very/long/url"
                {...register('originalUrl')}
                disabled={createUrlMutation.isPending}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handlePasteFromClipboard} disabled={createUrlMutation.isPending}>
                Insert
              </Button>
            </div>
            {errors.originalUrl && <p className="text-sm text-red-600">{errors.originalUrl.message}</p>}
            {errors.originalUrl && <p className="text-sm text-red-600">{errors.originalUrl.message}</p>}
          </div>

          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          {submitResponse && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-800">Success! Here's your short URL:</p>
              <a className="font-sm text-sm text-blue-800 hover:underline dark:text-blue-800" href={submitResponse}>
                {submitResponse}
              </a>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={createUrlMutation.isPending || !originalUrl}>
              {createUrlMutation.isPending ? 'Shortening...' : 'Shorten URL'}
            </Button>

            <Button type="button" variant="outline" onClick={handleClearForm} disabled={createUrlMutation.isPending}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
