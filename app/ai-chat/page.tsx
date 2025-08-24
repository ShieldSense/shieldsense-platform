"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, Shield, ArrowLeft, MessageCircle, Lightbulb, Calculator, BarChart3 } from "lucide-react"
import Link from "next/link"

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

export default function AIChatPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userContext, setUserContext] = useState<UserContext>({})

  useEffect(() => {
    // Initialize chat with comprehensive welcome message
    setChatMessages([
      {
        id: "welcome",
        type: "assistant",
        content: `Hello! I'm your dedicated AI insurance advisor for. I'm here to help you navigate Singapore's healthcare insurance landscape with confidence.

I can assist you with:
• Understanding your ShieldScore and what it means
• Explaining insurance terms like ISP, riders, MediSave, and ward types
• Running "what-if" scenarios to explore different coverage options
• Providing personalised recommendations based on your profile
• Comparing insurance plans and understanding their benefits

Whether you're just starting to explore healthcare insurance or looking to optimise your existing coverage, I'm here to provide clear, actionable guidance. What would you like to know?`,
        timestamp: new Date(),
      },
    ])

    // Try to get user context from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("age")) {
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

    // Getting started guidance
    if (lowerInput.includes("start") || lowerInput.includes("begin") || lowerInput.includes("assessment")) {
      return "Excellent! To get your personalised ShieldScore assessment, head to our calculator. It takes about 5-10 minutes and covers:\n\n• **Demographics** - Your basic profile\n• **Income & Finances** - To assess affordability\n• **Insurance Preferences** - Your coverage goals\n• **Health & Risk Factors** - To personalise recommendations\n\nOnce complete, you'll get a comprehensive ShieldScore with actionable insights. Would you like me to explain any of these sections in detail first?"
    }

    // ShieldScore explanations
    if (lowerInput.includes("shieldscore") || lowerInput.includes("score")) {
      if (context.shieldScore) {
        return `Your ShieldScore of ${context.shieldScore} is calculated from three key dimensions:

• **Ward Coverage Fit (35% weight)** - How well your coverage matches your preferred ward type
• **Out-of-Pocket Score (35% weight)** - Protection against unexpected medical expenses  
• **Premium Affordability (30% weight)** - Sustainability of insurance costs relative to income

${context.shieldScore >= 80 ? "Excellent work! Your coverage is well-optimised." : context.shieldScore >= 60 ? "You're on the right track with room for improvement." : "There are significant opportunities to enhance your coverage."}`
      } else {
        return "ShieldScore is our comprehensive rating system (0-100) that evaluates your healthcare coverage across three key dimensions:\n\n• **Ward Coverage Fit** - Alignment between your preferred care level and coverage\n• **Out-of-Pocket Protection** - How well you're protected from unexpected costs\n• **Premium Affordability** - Whether your insurance costs are sustainable\n\nComplete our assessment to get your personalised ShieldScore and detailed recommendations!"
      }
    }

    // What-if scenarios
    if (lowerInput.includes("what if") || lowerInput.includes("scenario")) {
      return "Great question! I can help you explore different scenarios:\n\n**Coverage Changes:**\n• 'What if I added a rider to my plan?'\n• 'What if I upgraded to a higher ISP tier?'\n• 'What if I chose a different ward type?'\n\n**Life Changes:**\n• 'What if my income increased by 50%?'\n• 'What if I developed a pre-existing condition?'\n• 'What if I started a family?'\n\nThese scenarios help you understand how changes might affect your ShieldScore and costs. What specific scenario interests you?"
    }

    // Insurance term explanations
    if (lowerInput.includes("rider")) {
      return "A **rider** is an add-on to your Integrated Shield Plan that covers the remaining costs after your main plan pays out.\n\n**Key Benefits:**\n• Covers deductibles and co-insurance\n• Can provide up to 100% coverage\n• Predictable healthcare costs\n• Peace of mind for major treatments\n\n**Considerations:**\n• Additional premium costs\n• May have waiting periods\n• Different riders offer varying coverage levels\n\nRiders are particularly valuable if you prefer private healthcare or want maximum cost predictability."
    }

    if (lowerInput.includes("integrated shield") || lowerInput.includes("isp")) {
      return "An **Integrated Shield Plan (ISP)** is private insurance that enhances your basic MediShield Life coverage.\n\n**Key Features:**\n• Higher coverage limits (up to $2M+ vs $150K for MediShield Life)\n• Access to private hospitals and specialists\n• Choice of ward types (A, B1 classes)\n• Shorter waiting times\n• More treatment options\n\n**Popular ISP Providers:**\n• Great Eastern (GREAT SupremeHealth)\n• AIA (HealthShield Gold Max)\n• NTUC Income (IncomeShield)\n• Prudential (PRUShield)\n\nISPs give you greater healthcare flexibility and choice."
    }

    if (lowerInput.includes("medisave")) {
      return "**MediSave** is Singapore's mandatory health savings account system.\n\n**Key Points:**\n• 8-10.5% of salary contributed monthly\n• Earns 4% interest annually\n• Can pay for approved treatments and insurance premiums\n• Has annual withdrawal limits\n• Balance carries forward throughout life\n\n**Uses:**\n• Hospital bills and day surgery\n• Insurance premiums (MediShield Life, ISP)\n• Chronic disease management\n• Preventive health screenings\n\nBuilding a healthy MediSave balance provides financial security for healthcare needs."
    }

    if (lowerInput.includes("ward") || lowerInput.includes("class")) {
      return "Singapore's hospital **ward classification system**:\n\n• **Class C** - Subsidised (8-9 beds), 65-80% government subsidy\n• **Class B2** - Subsidised (5-6 beds), 65-75% government subsidy\n• **Class B1** - 4-bed rooms, no government subsidy\n• **Class A** - 1-2 bed rooms, premium comfort\n• **Private** - Single rooms, luxury amenities\n\n**Key Considerations:**\n• Higher classes = more privacy but higher costs\n• Government subsidies only for C and B2\n• Your ISP coverage varies by ward type\n• Choice affects both premiums and out-of-pocket costs"
    }

    // General recommendations
    if (lowerInput.includes("recommend") || lowerInput.includes("advice") || lowerInput.includes("suggest")) {
      if (context.userProfile) {
        const { hasISP, hasRider, age } = context.userProfile
        let advice = "Based on your profile, here are my personalised recommendations:\n\n"

        if (!hasISP) advice += "• **Priority:** Upgrade to an Integrated Shield Plan for comprehensive coverage\n"
        if (!hasRider && hasISP) advice += "• **Consider:** Adding a rider to minimise out-of-pocket expenses\n"
        if (age > 45) advice += "• **Important:** Critical illness coverage becomes more crucial with age\n"
        if (age < 35) advice += "• **Advantage:** Lock in lower premiums while young and healthy\n"

        advice += "• **Annual Review:** Reassess coverage as life circumstances change\n"
        advice += "• **MediSave:** Build up balance for financial security\n"
        advice += "• **Emergency Fund:** Maintain 6-12 months of expenses for healthcare contingencies"

        return advice
      } else {
        return "For personalised recommendations, I'd suggest completing our coverage assessment first. This helps me understand your:\n\n• Current coverage situation\n• Financial capacity\n• Healthcare preferences\n• Risk factors\n\nWith this information, I can provide tailored advice for optimising your healthcare insurance strategy."
      }
    }

    // Plan comparison
    if (lowerInput.includes("compare") || lowerInput.includes("plans") || lowerInput.includes("difference")) {
      return "I can help you compare insurance plans! Here's what to consider:\n\n**Key Comparison Factors:**\n• **Coverage limits** - Annual and lifetime maximums\n• **Premium costs** - Monthly/annual payments\n• **Deductibles** - Amount you pay before coverage kicks in\n• **Co-insurance** - Percentage you pay after deductible\n• **Network hospitals** - Which facilities are covered\n• **Waiting periods** - Time before coverage begins\n\n**Popular ISP Tiers:**\n• **Basic** - Essential coverage, lower premiums\n• **Standard** - Balanced coverage and cost\n• **Premium** - Comprehensive coverage, higher premiums\n\nWould you like me to explain specific plan features or help you understand which tier might suit your needs?"
    }

    // Default helpful response
    return `I'm here to help with your healthcare insurance journey! Here are some areas I can assist with:

**🛡️ Coverage Assessment**
• Understanding your ShieldScore
• Identifying coverage gaps
• Personalised recommendations

**📚 Insurance Education**
• ISP, riders, MediSave explained
• Ward types and their implications
• Premium vs. coverage trade-offs

**🔍 Scenario Planning**
• "What-if" analysis for different options
• Life change impact on coverage
• Cost-benefit comparisons

**📊 Plan Comparison**
• Different ISP providers and tiers
• Feature-by-feature analysis
• Finding the right fit for your needs

What specific aspect would you like to explore? I'm here to make insurance simple and understandable!`
  }

  const quickActions = [
    {
      icon: Calculator,
      title: "Start Assessment",
      description: "Get your ShieldScore",
      action: () => setChatInput("I want to start my coverage assessment"),
    },
    {
      icon: Lightbulb,
      title: "Explain Terms",
      description: "Learn about ISP, riders, etc.",
      action: () => setChatInput("Can you explain insurance terms like ISP and riders?"),
    },
    {
      icon: BarChart3,
      title: "What-If Scenarios",
      description: "Explore different options",
      action: () => setChatInput("What if I added a rider to my insurance plan?"),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-xl text-foreground">ShieldSense</span>
            </Link>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Bot className="h-3 w-3" />
              AI Advisor
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="font-serif font-bold text-3xl lg:text-4xl text-foreground">AI Coverage Advisor</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalised guidance on healthcare insurance, understand your coverage options, and make informed
            decisions with our AI-powered advisor.
          </p>
        </div>

        {/* Quick Actions */}
        {chatMessages.length <= 1 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-muted/30"
                onClick={action.action}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <action.icon className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-serif font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chat Interface */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif">Chat with AI Advisor</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] p-4 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground border"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground p-4 rounded-lg border">
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
              <form onSubmit={handleChatSubmit} className="p-6 border-t bg-card">
                <div className="flex gap-3">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about insurance, coverage, ShieldScore, or get personalised advice..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button type="submit" disabled={!chatInput.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
