"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowRight, TrendingUp, AlertCircle, CheckCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"

interface ShieldProfile {
  wardCoverageFit: number
  outOfPocketScore: number
  premiumAffordability: number
}

interface ResultsData {
  shieldScore: number
  profile: ShieldProfile
  confidenceLevel: number
  strengths: string[]
  recommendations: string[]
  userProfile: {
    age: number
    income: number
    hasISP: boolean
    hasRider: boolean
    wardType: string
    riskFactors: string[]
  }
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<ResultsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const calculateResults = () => {
      const age = Number.parseInt(searchParams.get("age") || "0")
      const residencyStatus = searchParams.get("residencyStatus") || ""
      const householdSize = Number.parseInt(searchParams.get("householdSize") || "1")
      const annualIncome = Number.parseFloat(searchParams.get("annualIncomePerCapita") || "0")
      const totalIncome = Number.parseFloat(searchParams.get("totalHouseholdIncome") || "0")
      const residentialAV = Number.parseFloat(searchParams.get("residentialAV") || "0")
      const mediSave = Number.parseFloat(searchParams.get("mediSaveBalance") || "0")
      const wardType = searchParams.get("preferredWardType") || ""
      const hasISP = searchParams.get("hasExistingISP") === "true"
      const hasRider = searchParams.get("hasRider") === "true"
      const preExisting = searchParams.get("preExistingConditions") === "true"
      const smoking = searchParams.get("smokingStatus") === "true"
      const familyHistory = searchParams.get("familyMedicalHistory") === "true"
      const obesity = searchParams.get("obesity") === "true"

      let wardCoverageFit = 50
      let outOfPocketScore = 50
      let premiumAffordability = 50
      let confidenceLevel = 80

      if (hasISP) wardCoverageFit += 25
      if (hasRider) wardCoverageFit += 20
      if (wardType === "private") wardCoverageFit += 15
      else if (wardType === "a" || wardType === "b1") wardCoverageFit += 10

      if (hasRider) outOfPocketScore += 30
      if (hasISP) outOfPocketScore += 20
      if (mediSave > 40000) outOfPocketScore += 15
      else if (mediSave > 20000) outOfPocketScore += 10
      if (preExisting) outOfPocketScore -= 15

      const incomeRatio = totalIncome / householdSize
      if (incomeRatio > 80000) premiumAffordability += 25
      else if (incomeRatio > 50000) premiumAffordability += 15
      else if (incomeRatio < 30000) premiumAffordability -= 15

      if (age > 50) premiumAffordability -= 10
      if (smoking) premiumAffordability -= 10

      wardCoverageFit = Math.max(0, Math.min(100, wardCoverageFit))
      outOfPocketScore = Math.max(0, Math.min(100, outOfPocketScore))
      premiumAffordability = Math.max(0, Math.min(100, premiumAffordability))

      const shieldScore = Math.round(wardCoverageFit * 0.35 + outOfPocketScore * 0.35 + premiumAffordability * 0.3)

      const strengths: string[] = []
      const recommendations: string[] = []
      const riskFactors: string[] = []

      if (hasISP) strengths.push("You have an Integrated Shield Plan for enhanced coverage")
      if (hasRider) strengths.push("Your rider provides comprehensive protection against out-of-pocket costs")
      if (incomeRatio > 60000) strengths.push("Your income level supports good insurance coverage")
      if (mediSave > 30000) strengths.push("Strong MediSave balance for healthcare expenses")

      if (!hasISP) recommendations.push("Consider upgrading to an Integrated Shield Plan for better coverage")
      if (!hasRider && hasISP) recommendations.push("Add a rider to minimise out-of-pocket expenses")
      if (preExisting) {
        recommendations.push("Ensure your plan covers pre-existing conditions adequately")
        riskFactors.push("Pre-existing conditions")
      }
      if (smoking) {
        recommendations.push("Consider smoking cessation programmes to reduce premiums")
        riskFactors.push("Smoking")
      }
      if (age > 45 && !hasISP) recommendations.push("Critical illness coverage becomes more important with age")
      if (familyHistory) riskFactors.push("Family medical history")
      if (obesity) riskFactors.push("Obesity")

      if (!mediSave) confidenceLevel -= 10
      if (age < 25 || age > 65) confidenceLevel -= 5

      return {
        shieldScore,
        profile: { wardCoverageFit, outOfPocketScore, premiumAffordability },
        confidenceLevel: Math.max(60, confidenceLevel),
        strengths,
        recommendations,
        userProfile: {
          age,
          income: incomeRatio,
          hasISP,
          hasRider,
          wardType,
          riskFactors,
        },
      }
    }

    setTimeout(() => {
      const calculatedResults = calculateResults()
      setResults(calculatedResults)
      setIsLoading(false)
    }, 1500)
  }, [searchParams])

  const radarData = results
    ? [
        {
          dimension: "Ward Coverage Fit",
          score: results.profile.wardCoverageFit,
          fullMark: 100,
        },
        {
          dimension: "Out-of-Pocket Score",
          score: results.profile.outOfPocketScore,
          fullMark: 100,
        },
        {
          dimension: "Premium Affordability",
          score: results.profile.premiumAffordability,
          fullMark: 100,
        },
      ]
    : []

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  if (isLoading || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="font-serif font-semibold text-xl">Calculating Your ShieldScore...</h2>
          <p className="text-muted-foreground">Analysing your coverage and risk profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-xl text-foreground">ShieldSense</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                <BarChart3 className="h-3 w-3 mr-1" />
                ShieldScore Results
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-serif font-bold text-3xl lg:text-4xl text-foreground">Your ShieldScore Results</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, here's your comprehensive healthcare coverage assessment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-card to-muted/30">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-48 h-48 mx-auto relative">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - results.shieldScore / 100)}`}
                        className={`transition-all duration-2000 ${getScoreColor(results.shieldScore)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`font-serif font-bold text-5xl ${getScoreColor(results.shieldScore)}`}>
                          {results.shieldScore}
                        </div>
                        <div className="text-sm text-muted-foreground">ShieldScore</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-lg px-6 py-2">
                    {getScoreLabel(results.shieldScore)}
                  </Badge>
                  <p className="text-muted-foreground">Confidence Level: {results.confidenceLevel}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-xl">Your Shield Profile</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Three key dimensions weighted at 35%, 35%, and 30% respectively
                </p>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-visible" style={{ height: isMobile ? "500px" : "480px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={radarData}
                      margin={{
                        top: isMobile ? 20 : 100,
                        right: isMobile ? 20 : 100,
                        bottom: isMobile ? 20 : 100,
                        left: isMobile ? 20 : 100,
                      }}
                    >
                      <defs>
                        <linearGradient id="wardCoverageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.3} />
                        </linearGradient>
                        <linearGradient id="outOfPocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.3} />
                        </linearGradient>
                        <linearGradient id="affordabilityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#d97706" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="#e2e8f0" strokeWidth={1.5} radialLines={true} gridType="polygon" />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{
                          fontSize: isMobile ? 10 : 11,
                          fill: "hsl(var(--foreground))",
                          fontWeight: 600,
                          textAnchor: "middle",
                        }}
                        tickFormatter={(value) => {
                          if (isMobile) {
                            if (value === "Ward Coverage Fit") return "Ward Coverage"
                            if (value === "Out-of-Pocket Score") return "Out-of-Pocket"
                            if (value === "Premium Affordability") return "Affordability"
                          } else {
                            if (value === "Ward Coverage Fit") return "Ward Coverage Fit"
                            if (value === "Out-of-Pocket Score") return "Out-of-Pocket Score"
                            if (value === "Premium Affordability") return "Premium Affordability"
                          }
                          return value
                        }}
                        className="text-sm font-semibold"
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{
                          fontSize: isMobile ? 8 : 8,
                          fill: "hsl(var(--muted-foreground))",
                          fontWeight: 400,
                        }}
                        tickCount={4}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px] max-w-xs">
                                <p className="font-semibold text-gray-900 mb-2 text-sm">{label}</p>
                                <p className="text-sm text-gray-600 mb-3">
                                  Score: <span className="font-bold text-blue-600 text-lg">{data.score}/100</span>
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${data.score}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500">
                                  {data.score >= 80
                                    ? "Excellent coverage"
                                    : data.score >= 60
                                      ? "Good coverage"
                                      : data.score >= 40
                                        ? "Fair coverage"
                                        : "Needs improvement"}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                        cursor={{ fill: "transparent" }}
                        wrapperStyle={{ cursor: "pointer" }}
                      />
                      <Radar
                        name="ShieldScore"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="url(#wardCoverageGradient)"
                        fillOpacity={0.4}
                        strokeWidth={3}
                        dot={{
                          fill: "#3b82f6",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                          r: isMobile ? 5 : 4,
                        }}
                        activeDot={{
                          r: isMobile ? 7 : 6,
                          fill: "#3b82f6",
                          stroke: "#ffffff",
                          strokeWidth: 3,
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                    <div className="font-bold text-2xl text-blue-700">{results.profile.wardCoverageFit}</div>
                    <div className="text-sm font-semibold text-blue-600 mb-1">Ward Coverage Fit</div>
                    <div className="text-xs text-blue-500">(35% weight)</div>
                    <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${results.profile.wardCoverageFit}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                    <div className="font-bold text-2xl text-emerald-700">{results.profile.outOfPocketScore}</div>
                    <div className="text-sm font-semibold text-emerald-600 mb-1">Out-of-Pocket Score</div>
                    <div className="text-xs text-emerald-500">(35% weight)</div>
                    <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${results.profile.outOfPocketScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors">
                    <div className="font-bold text-2xl text-amber-700">{results.profile.premiumAffordability}</div>
                    <div className="text-sm font-semibold text-amber-600 mb-1">Premium Affordability</div>
                    <div className="text-xs text-amber-500">(30% weight)</div>
                    <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-amber-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${results.profile.premiumAffordability}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.strengths.length > 0 ? (
                  results.strengths.map((strength, index) => (
                    <p key={index} className="text-sm text-green-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {strength}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-green-600">Complete the assessment to see your strengths</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.recommendations.length > 0 ? (
                  results.recommendations.map((recommendation, index) => (
                    <p key={index} className="text-sm text-amber-600 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {recommendation}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-amber-600">Your coverage looks comprehensive!</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="h-5 w-5" />
                  Confidence Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Reliability</span>
                    <span className="font-semibold text-blue-700">{results.confidenceLevel}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${results.confidenceLevel}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600">Based on completeness of your responses and data quality</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center space-y-6 mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base" asChild>
              <Link href="/compare">
                Compare Insurance Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Get personalised plan recommendations and connect with licensed advisors for detailed comparisons
          </p>
        </div>
      </div>
    </div>
  )
}
