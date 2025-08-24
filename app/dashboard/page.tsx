"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Calculator, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight, RefreshCw, Download, Share2, Bell, Settings, User, Heart, DollarSign, Activity } from 'lucide-react'
import Link from "next/link"

// Mock data - in a real app, this would come from an API
const mockUserData = {
  name: "Alex Chen",
  shieldScore: 85,
  lastAssessment: "2024-01-15",
  coverageBreakdown: {
    basicCoverage: { score: 30, max: 30, status: "complete" },
    privateCoverage: { score: 25, max: 25, status: "complete" },
    criticalIllness: { score: 15, max: 20, status: "partial" },
    disabilityInsurance: { score: 0, max: 15, status: "missing" },
    emergencyFund: { score: 15, max: 10, status: "excellent" },
  },
  recentActivity: [
    { type: "assessment", description: "Completed coverage assessment", date: "2024-01-15", icon: Calculator },
    { type: "recommendation", description: "New plan recommendation available", date: "2024-01-14", icon: TrendingUp },
    { type: "update", description: "Coverage gap identified", date: "2024-01-12", icon: AlertTriangle },
  ],
  recommendations: [
    {
      priority: "high",
      title: "Consider Disability Insurance",
      description: "Protect your income with disability coverage",
      impact: "+15 points",
      action: "Get Quote",
    },
    {
      priority: "medium",
      title: "Increase Critical Illness Coverage",
      description: "Your current coverage may not be sufficient",
      impact: "+5 points",
      action: "Compare Plans",
    },
    {
      priority: "low",
      title: "Review Beneficiaries",
      description: "Ensure your beneficiary information is up to date",
      impact: "Maintenance",
      action: "Update",
    },
  ],
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { shieldScore, coverageBreakdown } = mockUserData

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return <Badge variant="outline">Priority</Badge>
    }
  }

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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl lg:text-3xl text-foreground">
              Your ShieldSense Assessment
            </h1>
            <p className="text-muted-foreground mt-1">
              Last assessment: {new Date(mockUserData.lastAssessment).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ShieldScore Card */}
              <Card className="lg:col-span-1 shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="font-serif text-xl">Your ShieldScore</CardTitle>
                  <CardDescription>Overall coverage assessment</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto relative">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - shieldScore / 100)}`}
                          className={`transition-all duration-1000 ${getScoreColor(shieldScore)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`font-serif font-bold text-3xl ${getScoreColor(shieldScore)}`}>
                            {shieldScore}
                          </div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-base px-4 py-1">
                      {getScoreLabel(shieldScore)}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      You're in the top 25% of users with similar profiles
                    </p>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href="/calculator">
                      <Calculator className="h-4 w-4 mr-2" />
                      Retake Assessment
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Coverage Gaps</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2</div>
                      <p className="text-xs text-muted-foreground">Areas needing attention</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">S$2,400</div>
                      <p className="text-xs text-muted-foreground">Annual optimisation potential</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Low</div>
                      <p className="text-xs text-muted-foreground">Based on your profile</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Next Review</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">6 months</div>
                      <p className="text-xs text-muted-foreground">Recommended timeline</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Coverage Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Coverage Breakdown</CardTitle>
                    <CardDescription>Your current protection across different areas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(coverageBreakdown).map(([key, coverage]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {coverage.score}/{coverage.max}
                            </span>
                            {coverage.status === "complete" && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {coverage.status === "partial" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                            {coverage.status === "missing" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {coverage.status === "excellent" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          </div>
                        </div>
                        <Progress value={(coverage.score / coverage.max) * 100} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Quick Actions</CardTitle>
                <CardDescription>Common tasks and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                    asChild
                  >
                    <Link href="/calculator">
                      <Calculator className="h-6 w-6" />
                      <span className="text-sm">Retake Assessment</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                    asChild
                  >
                    <Link href="/compare">
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-sm">Compare Plans</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                    asChild
                  >
                    <Link href="/risk-assessment">
                      <Shield className="h-6 w-6" />
                      <span className="text-sm">Risk Assessment</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Heart className="h-6 w-6" />
                    <span className="text-sm">Health Check</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coverage Details Tab */}
          <TabsContent value="coverage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Active Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">MediShield Life</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Private Health Insurance</span>
                      <Badge variant="secondary">S$150,000</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical Illness</span>
                      <Badge variant="secondary">S$100,000</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                    Coverage Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Disability Insurance</span>
                      <Badge variant="outline">Missing</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical Illness (Additional)</span>
                      <Badge variant="outline">Insufficient</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {mockUserData.recommendations.map((rec, index) => (
                <Card key={index} className={getPriorityColor(rec.priority)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      {getPriorityBadge(rec.priority)}
                    </div>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Impact: {rec.impact}</span>
                      </div>
                      <Button size="sm">
                        {rec.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Recent Activity</CardTitle>
                <CardDescription>Your recent actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <activity.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
