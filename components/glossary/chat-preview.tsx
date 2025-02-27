'use client'

import { useState } from 'react'
import { Bot, User, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const SAMPLE_QUESTIONS = [
  "What's the connection between acetylcholine and muscle weakness?",
  "Can you explain neuromuscular junction in simple terms?",
  "What's the difference between myasthenia and myasthenia gravis?",
]

export function ChatPreview() {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)
  const [showResponse, setShowResponse] = useState(false)

  const handleQuestionClick = (question: string) => {
    setActiveQuestion(question)
    setShowResponse(false)
    setTimeout(() => setShowResponse(true), 500)
  }

  return (
    <div className="mt-6 rounded-xl border border-primary/20 overflow-hidden">
      <div className="bg-primary/10 p-4 flex items-center gap-3">
        <Bot className="h-6 w-6 text-primary" />
        <h3 className="font-semibold text-primary">Meet Charlie, Your AI Health Navigator</h3>
      </div>
      
      <div className="p-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-4">
              Try clicking these sample questions to see how Charlie can help:
            </p>
            <div className="space-y-2">
              {SAMPLE_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleQuestionClick(question)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors
                    ${activeQuestion === question 
                      ? 'bg-primary text-white' 
                      : 'bg-primary/10 hover:bg-primary/20 text-gray-700'}`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border min-h-[200px] relative">
            {activeQuestion ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <User className="h-6 w-6 text-primary" />
                  <p className="text-sm">{activeQuestion}</p>
                </div>
                {showResponse && (
                  <div className="flex gap-3 animate-fadeIn">
                    <Bot className="h-6 w-6 text-primary" />
                    <div className="text-sm">
                      <p className="text-primary font-medium mb-1">Let me help you understand that!</p>
                      <p className="text-gray-600">Click "Chat with Charlie" to start a real conversation and get detailed explanations about any medical term.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Click a question to see a preview
              </div>
            )}
            
            <div className="absolute bottom-4 right-4">
              <Button asChild variant="default" className="gap-2">
                <Link href="/ai-chat">
                  Chat with Charlie
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
