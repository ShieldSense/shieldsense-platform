"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Heart,
  Activity,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import Link from "next/link"

interface RiskAssessmentData {
  // Health Risks
  age: string
  bmi: string
  smokingStatus: string
  alcoholConsumption: string
  exerciseFrequency: string
  chronicConditions: string[]
  medications: string[]

  // Lifestyle Risks
  occupation: string
  hobbies: string[]
  travelFrequency: string
  stressLevel: string

  // Family History
  familyHistory: string[]
  geneticConditions: string[]

  // Financial Risks
  income: string
  dependents: string
  existingDebts: string
  emergencyFund: string
}

const steps = [
  { id: 1, title: "Health Profile", description: "Your current health status" },
  { id: 2, title: "Lifestyle Factors", description: "Daily habits and activities" },
  { id: 3, title: "Family History", description: "Genetic and hereditary factors" },
  { id: 4, title: "Financial Profile", description: "Income and financial obligations" },
  { id: 5, title: "Risk Analysis", description: "Your personalised risk assessment" },
]

const healthConditions = [
  "Diabetes",
  "High Blood Pressure",
  "Heart Disease",
  "Asthma",
  "Cancer History",
  "Mental Health Conditions",
  "Kidney Disease",
  "Liver Disease",
]

const riskHobbies = [
  "Rock Climbing",
  "Skydiving",
  "Motorcycle Racing",
  "Scuba Diving",
  "Mountain Climbing",
  "Martial Arts",
  "Extreme Sports",
  "Aviation",
]

const familyConditions = [
  "Heart Disease",
  "Cancer",
  "Diabetes",
  "Stroke",
  "Mental Health Disorders",
  "Kidney Disease",
  "Alzheimer's Disease",
  "Genetic Disorders",
]

export default function RiskAssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RiskAssessmentData>({
    age: "",
    bmi: "",
    smokingStatus: "",
    alcoholConsumption: "",
    exerciseFrequency: "",
    chronicConditions: [],
    medications: [],
    occupation: "",
    hobbies: [],
    travelFrequency: "",
    stressLevel: "",
    familyHistory: [],
    geneticConditions: [],
    income: "",
    dependents: "",
    existingDebts: "",
    emergencyFund: "",
  })

  const [riskScores, setRiskScores] = useState({
    health: 0,
    lifestyle: 0,
    family: 0,
    financial: 0,
    overall: 0,
  })

  const updateFormData = (field: keyof RiskAssessmentData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: keyof RiskAssessmentData, item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter((i) => i !== item)
        : [...(prev[field] as string[]), item],
    }))
  }

  const calculateRiskScores = () => {
    let healthRisk = 0
    let lifestyleRisk = 0
    let familyRisk = 0
    let financialRisk = 0

    // Health Risk Calculation
    const age = Number.parseInt(formData.age) || 0
    if (age > 50) healthRisk += 20
    else if (age > 40) healthRisk += 10
    else if (age > 30) healthRisk += 5

    const bmi = Number.parseFloat(formData.bmi) || 0
    if (bmi > 30) healthRisk += 15
    else if (bmi > 25) healthRisk += 8

    if (formData.smokingStatus === "current") healthRisk += 25
    else if (formData.smokingStatus === "former") healthRisk += 10

    healthRisk += formData.chronicConditions.length * 8
    healthRisk += formData.medications.length * 3

    if (formData.exerciseFrequency === "rarely") healthRisk += 10
    else if (formData.exerciseFrequency === "occasionally") healthRisk += 5

    // Lifestyle Risk Calculation
    if (formData.occupation === "high-risk") lifestyleRisk += 20
    else if (formData.occupation === "moderate-risk") lifestyleRisk += 10

    lifestyleRisk += formData.hobbies.length * 5

    if (formData.travelFrequency === "frequent") lifestyleRisk += 10
    else if (formData.travelFrequency === "occasional") lifestyleRisk += 5

    if (formData.stressLevel === "high") lifestyleRisk += 15
    else if (formData.stressLevel === "moderate") lifestyleRisk += 8

    // Family Risk Calculation
    familyRisk += formData.familyHistory.length * 6
    familyRisk += formData.geneticConditions.length * 10

    // Financial Risk Calculation
    const income = Number.parseInt(formData.income) || 0
    const dependents = Number.parseInt(formData.dependents) || 0
    const emergencyFund = Number.parseInt(formData.emergencyFund) || 0

    if (income < 3000) financialRisk += 20
    else if (income < 5000) financialRisk += 10

    financialRisk += dependents * 8

    if (emergencyFund < income * 3) financialRisk += 15
    else if (emergencyFund < income * 6) financialRisk += 8

    // Cap scores at 100
    healthRisk = Math.min(healthRisk, 100)
    lifestyleRisk = Math.min(lifestyleRisk, 100)
    familyRisk = Math.min(familyRisk, 100)
    financialRisk = Math.min(financialRisk, 100)

    const overallRisk = Math.round((healthRisk + lifestyleRisk + familyRisk + financialRisk) / 4)

    setRiskScores({
      health: healthRisk,
      lifestyle: lifestyleRisk,
      family: familyRisk,
      financial: financialRisk,
      overall: overallRisk,
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      if (currentStep === 4) {
        calculateRiskScores()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getRiskLevel = (score: number) => {
    if (score < 25) return { level: "Low", color: "text-green-600", bgColor: "bg-green-100" }
    if (score < 50) return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    if (score < 75) return { level: "High", color: "text-orange-600", bgColor: "bg-orange-100" }
    return { level: "Very High", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const getRiskIcon = (score: number) => {
    if (score < 25) return <TrendingDown className="h-4 w-4 text-green-600" />
    if (score < 50) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingUp className="h-4 w-4 text-red-600" />
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
              <Badge variant="outline">
                <Activity className="h-3 w-3 mr-1" />
                Risk Assessment
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif font-bold text-2xl lg:text-3xl text-foreground">Personal Risk Assessment</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </div>

          <Progress value={(currentStep / steps.length) * 100} className="mb-4" />

          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  step.id === currentStep
                    ? "text-primary"
                    : step.id < currentStep
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                        ? "bg-muted text-muted-foreground"
                        : "bg-muted/50 text-muted-foreground/50"
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Health Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Health Profile
                  </h2>
                  <p className="text-muted-foreground">
                    Help us understand your current health status to assess your risk factors.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI (Body Mass Index)</Label>
                    <Input
                      id="bmi"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 23.5"
                      value={formData.bmi}
                      onChange={(e) => updateFormData("bmi", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Calculate: Weight (kg) ÷ Height² (m²)</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Smoking Status</Label>
                    <RadioGroup
                      value={formData.smokingStatus}
                      onValueChange={(value) => updateFormData("smokingStatus", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="never" id="never-smoked" />
                        <Label htmlFor="never-smoked">Never smoked</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="former" id="former-smoker" />
                        <Label htmlFor="former-smoker">Former smoker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="current" id="current-smoker" />
                        <Label htmlFor="current-smoker">Current smoker</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Exercise Frequency</Label>
                    <RadioGroup
                      value={formData.exerciseFrequency}
                      onValueChange={(value) => updateFormData("exerciseFrequency", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily-exercise" />
                        <Label htmlFor="daily-exercise">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="regular-exercise" />
                        <Label htmlFor="regular-exercise">3-5 times per week</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occasionally" id="occasional-exercise" />
                        <Label htmlFor="occasional-exercise">1-2 times per week</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rarely" id="rarely-exercise" />
                        <Label htmlFor="rarely-exercise">Rarely</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Existing Health Conditions (select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {healthConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={() => toggleArrayItem("chronicConditions", condition)}
                        />
                        <Label htmlFor={condition} className="text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Lifestyle Factors */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Lifestyle Factors
                  </h2>
                  <p className="text-muted-foreground">
                    Your daily activities and lifestyle choices affect your risk profile.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Occupation Risk Level</Label>
                    <RadioGroup
                      value={formData.occupation}
                      onValueChange={(value) => updateFormData("occupation", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low-risk" id="low-risk-job" />
                        <Label htmlFor="low-risk-job">Low risk (office work, teaching, etc.)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate-risk" id="moderate-risk-job" />
                        <Label htmlFor="moderate-risk-job">Moderate risk (healthcare, sales, etc.)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high-risk" id="high-risk-job" />
                        <Label htmlFor="high-risk-job">High risk (construction, mining, etc.)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>High-Risk Hobbies or Activities (select all that apply)</Label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {riskHobbies.map((hobby) => (
                        <div key={hobby} className="flex items-center space-x-2">
                          <Checkbox
                            id={hobby}
                            checked={formData.hobbies.includes(hobby)}
                            onCheckedChange={() => toggleArrayItem("hobbies", hobby)}
                          />
                          <Label htmlFor={hobby} className="text-sm">
                            {hobby}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Travel Frequency</Label>
                    <RadioGroup
                      value={formData.travelFrequency}
                      onValueChange={(value) => updateFormData("travelFrequency", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rare" id="rare-travel" />
                        <Label htmlFor="rare-travel">Rarely travel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occasional" id="occasional-travel" />
                        <Label htmlFor="occasional-travel">Occasional travel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="frequent" id="frequent-travel" />
                        <Label htmlFor="frequent-travel">Frequent international travel</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Stress Level</Label>
                    <RadioGroup
                      value={formData.stressLevel}
                      onValueChange={(value) => updateFormData("stressLevel", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low-stress" />
                        <Label htmlFor="low-stress">Low stress</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate-stress" />
                        <Label htmlFor="moderate-stress">Moderate stress</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high-stress" />
                        <Label htmlFor="high-stress">High stress</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Family History */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Family History
                  </h2>
                  <p className="text-muted-foreground">
                    Family medical history helps identify genetic predispositions and hereditary risks.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Family History of Medical Conditions (select all that apply)</Label>
                    <p className="text-sm text-muted-foreground">
                      Include conditions affecting parents, siblings, or grandparents
                    </p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {familyConditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={`family-${condition}`}
                            checked={formData.familyHistory.includes(condition)}
                            onCheckedChange={() => toggleArrayItem("familyHistory", condition)}
                          />
                          <Label htmlFor={`family-${condition}`} className="text-sm">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Family history information helps us better understand your genetic risk factors. This information
                      is kept confidential and used only for risk assessment purposes.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}

            {/* Step 4: Financial Profile */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Financial Profile
                  </h2>
                  <p className="text-muted-foreground">
                    Your financial situation affects your insurance needs and risk exposure.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income (S$)</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.income}
                      onChange={(e) => updateFormData("income", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dependents">Number of Dependents</Label>
                    <Input
                      id="dependents"
                      type="number"
                      placeholder="0"
                      value={formData.dependents}
                      onChange={(e) => updateFormData("dependents", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="existingDebts">Existing Debts (S$)</Label>
                    <Input
                      id="existingDebts"
                      type="number"
                      placeholder="e.g., 200000"
                      value={formData.existingDebts}
                      onChange={(e) => updateFormData("existingDebts", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Include mortgage, loans, credit cards</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyFund">Emergency Fund (S$)</Label>
                    <Input
                      id="emergencyFund"
                      type="number"
                      placeholder="e.g., 30000"
                      value={formData.emergencyFund}
                      onChange={(e) => updateFormData("emergencyFund", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Liquid savings for emergencies</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Risk Analysis Results */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="font-serif font-bold text-2xl">Your Risk Assessment Results</h2>
                  <p className="text-muted-foreground">
                    Based on your responses, here's your comprehensive risk analysis
                  </p>
                </div>

                {/* Overall Risk Score */}
                <div className="flex justify-center">
                  <Card className="p-8 text-center shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                    <div className="space-y-4">
                      <h3 className="font-serif font-semibold text-xl">Overall Risk Level</h3>
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
                              strokeDashoffset={`${2 * Math.PI * 50 * (1 - riskScores.overall / 100)}`}
                              className={`transition-all duration-2000 ${getRiskLevel(riskScores.overall).color}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div
                                className={`font-serif font-bold text-3xl ${getRiskLevel(riskScores.overall).color}`}
                              >
                                {riskScores.overall}
                              </div>
                              <div className="text-xs text-muted-foreground">Risk Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-base px-4 py-1 ${getRiskLevel(riskScores.overall).bgColor} ${
                          getRiskLevel(riskScores.overall).color
                        }`}
                      >
                        {getRiskLevel(riskScores.overall).level} Risk
                      </Badge>
                    </div>
                  </Card>
                </div>

                {/* Risk Category Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-primary" />
                          Health Risk
                        </div>
                        {getRiskIcon(riskScores.health)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className={`font-semibold ${getRiskLevel(riskScores.health).color}`}>
                          {riskScores.health}/100
                        </span>
                      </div>
                      <Progress value={riskScores.health} className="h-2" />
                      <Badge variant="outline" className={getRiskLevel(riskScores.health).bgColor}>
                        {getRiskLevel(riskScores.health).level}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Lifestyle Risk
                        </div>
                        {getRiskIcon(riskScores.lifestyle)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className={`font-semibold ${getRiskLevel(riskScores.lifestyle).color}`}>
                          {riskScores.lifestyle}/100
                        </span>
                      </div>
                      <Progress value={riskScores.lifestyle} className="h-2" />
                      <Badge variant="outline" className={getRiskLevel(riskScores.lifestyle).bgColor}>
                        {getRiskLevel(riskScores.lifestyle).level}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Family History Risk
                        </div>
                        {getRiskIcon(riskScores.family)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className={`font-semibold ${getRiskLevel(riskScores.family).color}`}>
                          {riskScores.family}/100
                        </span>
                      </div>
                      <Progress value={riskScores.family} className="h-2" />
                      <Badge variant="outline" className={getRiskLevel(riskScores.family).bgColor}>
                        {getRiskLevel(riskScores.family).level}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          Financial Risk
                        </div>
                        {getRiskIcon(riskScores.financial)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Score</span>
                        <span className={`font-semibold ${getRiskLevel(riskScores.financial).color}`}>
                          {riskScores.financial}/100
                        </span>
                      </div>
                      <Progress value={riskScores.financial} className="h-2" />
                      <Badge variant="outline" className={getRiskLevel(riskScores.financial).bgColor}>
                        {getRiskLevel(riskScores.financial).level}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Personalised Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {riskScores.health > 50 && (
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Consider Enhanced Health Coverage</p>
                            <p className="text-sm text-muted-foreground">
                              Your health risk profile suggests additional critical illness and hospitalization coverage
                              would be beneficial.
                            </p>
                          </div>
                        </div>
                      )}

                      {riskScores.lifestyle > 50 && (
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Lifestyle Risk Mitigation</p>
                            <p className="text-sm text-muted-foreground">
                              Consider accident and disability insurance due to your lifestyle and occupation risks.
                            </p>
                          </div>
                        </div>
                      )}

                      {riskScores.financial > 50 && (
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Financial Protection Priority</p>
                            <p className="text-sm text-muted-foreground">
                              Focus on income protection and term life insurance to secure your dependents' financial
                              future.
                            </p>
                          </div>
                        </div>
                      )}

                      {riskScores.overall < 25 && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Low Risk Profile</p>
                            <p className="text-sm text-muted-foreground">
                              Your low risk profile may qualify you for preferred rates on insurance policies.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1" asChild>
                        <Link href="/compare">
                          Compare Insurance Plans
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/calculator">Retake Assessment</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
