"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function AIChat() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat with Charlie, Your AI Health Navigator</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Meet Charlie: Your Personal Health Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Charlie is our advanced AI-powered health navigator, designed to assist you with a wide range of healthcare-related questions and concerns. Whether you need help understanding medical terms, guidance on managing symptoms, or information about various health conditions, Charlie is here to help.
          </p>
          <p className="mb-4">
            With access to a vast database of medical knowledge, Charlie can provide you with quick, informative responses to help you navigate your health journey. Remember, while Charlie is a powerful tool, it's always best to consult with a healthcare professional for personalized medical advice.
          </p>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Charlie is a Generative AI assistant. While it strives to provide accurate and helpful information, please review and verify any important details with a qualified healthcare provider.
            </AlertDescription>
          </Alert>
          <p>
            Feel free to ask Charlie about:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>General health information and wellness tips</li>
            <li>Explanations of medical terms and procedures</li>
            <li>Guidance on managing common health conditions</li>
            <li>Information about medications and potential side effects</li>
            <li>Healthy lifestyle choices and preventive care measures</li>
            <li>Guidance on navigating the healthcare system</li>
            <li>Help in understanding and resolving medical bills</li>
            <li>Help in understanding your health insurance and what it covers</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <iframe 
            src="https://wellspaceaipatientnavigator-28560.chipp.ai" 
            height="800px" 
            width="100%" 
            frameBorder="0" 
            title="Wellspace AI Patient Navigator"
            className="w-full"
          ></iframe>
        </CardContent>
      </Card>
    </div>
  )
}
