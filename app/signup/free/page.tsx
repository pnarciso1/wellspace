'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext'

export default function FreeSignUp() {
 const [name, setName] = useState('')
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [confirmPassword, setConfirmPassword] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const { signUp } = useAuth()
 const router = useRouter()
 const { toast } = useToast()

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault()
   if (password !== confirmPassword) {
     toast({
       title: "Passwords do not match",
       description: "Please make sure your passwords match.",
       variant: "destructive",
     })
     return
   }
   setIsLoading(true)
   try {
     await signUp(email, password, name)
     toast({
       title: "Sign Up Successful",
       description: "Please check your email to verify your account.",
     })
     router.push('/verify-email')
   } catch (error) {
     console.error('Sign up error:', error)
     toast({
       title: "Sign Up Failed",
       description: "An error occurred during sign up. Please try again.",
       variant: "destructive",
     })
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <div className="container mx-auto py-10">
     <Card className="max-w-md mx-auto">
       <CardHeader>
         <CardTitle>Sign Up for Free Plan</CardTitle>
         <CardDescription>Create your account to get started with Wellspace.</CardDescription>
       </CardHeader>
       <CardContent>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="name">Full Name</Label>
             <Input
               id="name"
               type="text"
               placeholder="John Doe"
               value={name}
               onChange={(e) => setName(e.target.value)}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
             <Input
               id="email"
               type="email"
               placeholder="you@example.com"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="password">Password</Label>
             <Input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="confirmPassword">Confirm Password</Label>
             <Input
               id="confirmPassword"
               type="password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
             />
           </div>
           <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading ? 'Signing Up...' : 'Sign Up'}
           </Button>
         </form>
       </CardContent>
     </Card>
   </div>
 )
}



