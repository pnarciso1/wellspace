'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PremiumSignUpCancel() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Subscription Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your Premium plan subscription was cancelled. You can try again or choose a different plan.</p>
          <Button onClick={() => router.push('/')}>Return to Home</Button>
        </CardContent>
      </Card>
    </div>
  )
}
