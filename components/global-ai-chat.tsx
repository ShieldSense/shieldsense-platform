"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface UserContext {
  shieldScore?: number
  profile?: {
    wardCoverageFit: number
    outOfPocketScore: number
    premiumAffordability: number
  }
  userProfile?: {
    age: number
    income: number
    hasISP: boolean
    hasRider: boolean
    wardType: string
    riskFactors: string[]
  }
  currentPage?: string
}

export default function GlobalAIChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userContext, setUserContext] = useState<UserContext>({})
  const [shouldShowChat, setShouldShowChat] = useState(false)

  useEffect(() => {
    const currentPath = window.location.pathname
    const allowedPages = ["/", "/calculator/results"]
    setShouldShowChat(allowedPages.includes(currentPath))

    // Initialize chat with welcome message
    setChatMessages([
      {
        id: "welcome",
        type: "assistant",
        content:
          "Hello! I'm your AI insurance advisor. I can help you understand healthcare coverage, explain insurance terms, and provide personalised guidance. How can I assist you today?",
        timestamp: new Date(),
      },
    ])

    // Detect current page context
    setUserContext((prev) => ({ ...prev, currentPage: currentPath }))

    // Try to get user context from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("age")) {
      // Extract context from calculator results
      const age = Number.parseInt(urlParams.get("age") || "0")
      const hasISP = urlParams.get("hasExistingISP") === "true"
      const hasRider = urlParams.get("hasRider") === "true"
      const wardType = urlParams.get("preferredWardType") || ""

      setUserContext((prev) => ({
        ...prev,
        userProfile: { age, income: 0, hasISP, hasRider, wardType, riskFactors: [] },
      }))
    }
  }, [])

  if (!shouldShowChat) {
    return null
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    setTimeout(
      () => {
        const response = generateAIResponse(chatInput, userContext)
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const generateAIResponse = (input: string, context: UserContext): string => {
    const lowerInput = input.toLowerCase()

    // Context-aware responses based on current page
    if (context.currentPage === "/" && (lowerInput.includes("start") || lowerInput.includes("begin"))) {
      return "Great! To get started with your personalised coverage assessment, click the 'Start Free Assessment' button on this page. The calculator will guide you through 4 simple steps to analyse your healthcare insurance needs and generate your ShieldScore."
    }

    if (context.currentPage === "/calculator/results" && lowerInput.includes("help")) {
      return "I can help you with the calculator results! Each section provides important information:\n\n• **Ward Coverage Fit** - How well your coverage matches your preferred ward type\n• **Out-of-Pocket Score** - Protection against unexpected medical expenses\n• **Premium Affordability** - Sustainability of insurance costs relative to income\n\nReview these sections to understand your ShieldScore and coverage options."
    }

    // ShieldScore explanations
    if (lowerInput.includes("shieldscore") || lowerInput.includes("score")) {
      if (context.shieldScore) {
        return `Your ShieldScore of ${context.shieldScore} is calculated from three key dimensions:

• **Ward Coverage Fit (35% weight)** - How well your coverage matches your preferred ward type
• **Out-of-Pocket Score (35% weight)** - Protection against unexpected medical expenses  
• **Premium Affordability (30% weight)** - Sustainability of insurance costs relative to income

${context.shieldScore >= 80 ? "Excellent work!" : context.shieldScore >= 60 ? "You're on the right track!" : "There's room for improvement."}`
      } else {
        return "ShieldScore is our comprehensive rating system that evaluates your healthcare coverage across three key dimensions: Ward Coverage Fit, Out-of-Pocket Protection, and Premium Affordability. Complete our assessment to get your personalised ShieldScore!"
      }
    }

    // What-if scenarios
    if (lowerInput.includes("what if") || lowerInput.includes("scenario")) {
      return "I can help you explore different scenarios! Try asking:\n\n• 'What if I added a rider to my plan?'\n• 'What if I increased my income?'\n• 'What if I chose a different ward type?'\n• 'What if I had pre-existing conditions?'\n\nThese scenarios help you understand how changes might affect your coverage and costs."
    }

    // Insurance term explanations
    if (lowerInput.includes("rider")) {
      return "A **rider** is an add-on to your basic Integrated Shield Plan that covers remaining costs (deductibles and co-insurance) after your main plan pays out. Think of it as 'topping up' your coverage to potentially 100% of medical bills, giving you greater peace of mind and predictable healthcare costs."
    }

    if (lowerInput.includes("integrated shield") || lowerInput.includes("isp")) {
      return "An **Integrated Shield Plan (ISP)** is private insurance that works alongside your basic MediShield Life coverage. It provides higher coverage limits, access to private hospitals and specialists, and more treatment options. ISPs give you greater choice and flexibility in your healthcare decisions."
    }

    if (lowerInput.includes("medisave")) {
      return "**MediSave** is a mandatory health savings account that helps pay for medical expenses and insurance premiums. It's part of Singapore's healthcare financing system and can be used for approved treatments and insurance plans. Building a healthy MediSave balance provides a financial cushion for healthcare needs."
    }

    if (lowerInput.includes("ward") || lowerInput.includes("class")) {
      return "Hospital **ward types** in Singapore:\n\n• **Class C** - Subsidised, shared rooms (6-9 beds)\n• **Class B2** - Subsidised, shared rooms (5-6 beds)  \n• **Class B1** - Shared rooms (4 beds), higher comfort\n• **Class A** - Single/double rooms, more privacy\n• **Private** - Single rooms, premium amenities\n\nYour choice affects both coverage needs and costs."
    }

    // General recommendations
    if (lowerInput.includes("recommend") || lowerInput.includes("advice") || lowerInput.includes("suggest")) {
      if (context.userProfile) {
        const { hasISP, hasRider, age } = context.userProfile
        let advice = "Based on your profile, here are my recommendations:\n\n"

        if (!hasISP) advice += "• Consider upgrading to an Integrated Shield Plan for better coverage\n"
        if (!hasRider && hasISP) advice += "• Add a rider to minimise out-of-pocket expenses\n"
        if (age > 45) advice += "• Critical illness coverage becomes more important with age\n"

        advice +=
          "• Review your coverage annually as circumstances change\n• Build up your MediSave balance for financial security"

        return advice
      } else {
        return "For personalised recommendations, I'd suggest completing our coverage assessment first. This will help me understand your specific situation and provide tailored advice for your healthcare insurance needs."
      }
    }

    // Default helpful response
    return `I'm here to help with your healthcare insurance questions! I can assist with:

• **ShieldScore explanations** - Understanding your coverage rating
• **Insurance terms** - ISP, riders, MediSave, ward types, etc.
• **What-if scenarios** - Exploring different coverage options
• **Personalised advice** - Based on your profile and needs
• **Plan comparisons** - Understanding different insurance options

What specific aspect would you like to explore?`
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isChatOpen ? (
        <Button
          onClick={() => setIsChatOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          aria-label="Open AI Chat Advisor"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-96 h-[500px] shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg font-serif">AI Coverage Advisor</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[420px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground p-3 rounded-lg text-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleChatSubmit} className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about insurance, coverage, or your ShieldScore..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button type="submit" size="sm" disabled={!chatInput.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
