"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, ArrowRight, Calculator, CheckCircle, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FormData {
  // Demographics
  age: string
  residencyStatus: string
  householdSize: string

  // Income & Finances
  annualIncomePerCapita: string
  totalHouseholdIncome: string
  residentialAV: string
  mediSaveBalance: string

  // Insurance Preferences
  preferredWardType: string
  preferredInsurer: string
  hasExistingISP: boolean
  existingIPPlan: string
  hasRider: boolean

  // Health & Risk Factors
  preExistingConditions: boolean
  smokingStatus: boolean
  familyMedicalHistory: boolean
  obesity: boolean
}

const steps = [
  { id: 1, title: "Demographics", description: "Basic personal information" },
  { id: 2, title: "Income & Finances", description: "Financial situation" },
  { id: 3, title: "Insurance Preferences", description: "Coverage preferences" },
  { id: 4, title: "Health & Risk Factors", description: "Health profile" },
]

export default function CalculatorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showWardDescription, setShowWardDescription] = useState(false)
  const [showAutoComplete, setShowAutoComplete] = useState(false)
  const [filteredPlans, setFilteredPlans] = useState<string[]>([])

  const [formData, setFormData] = useState<FormData>({
    age: "",
    residencyStatus: "",
    householdSize: "1",
    annualIncomePerCapita: "",
    totalHouseholdIncome: "",
    residentialAV: "",
    mediSaveBalance: "",
    preferredWardType: "",
    preferredInsurer: "",
    hasExistingISP: false,
    existingIPPlan: "",
    hasRider: false,
    preExistingConditions: false,
    smokingStatus: false,
    familyMedicalHistory: false,
    obesity: false,
  })

  const ipPlans = [
    // Great Eastern
    "Great Eastern Supreme Health",
    "Great Eastern Supreme Health Plus",
    "Great Eastern Supreme Health Max",
    "Great Eastern Supreme Health Deluxe",

    // Prudential
    "Prudential PRUShield",
    "Prudential PRUShield Plus",
    "Prudential PRUShield Premier",
    "Prudential PRUShield Standard",

    // AIA
    "AIA HealthShield Gold",
    "AIA HealthShield Gold Max",
    "AIA HealthShield Gold Plus",
    "AIA HealthShield Silver",

    // NTUC Income
    "NTUC Income Shield",
    "NTUC Income Shield Plus",
    "NTUC Income Shield Preferred",
    "NTUC Income Shield Standard",

    // Raffles Health
    "Raffles Shield",
    "Raffles Shield Plus",
    "Raffles Shield Premier",

    // AXA
    "AXA Shield",
    "AXA Shield Plus",
    "AXA Shield Premier",

    // Other common plans
    "Aviva MyShield",
    "Tokio Marine Shield",
    "HSBC Shield Plus",
  ]

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (field === "preferredWardType" && value) {
      setShowWardDescription(true)
    }
    if (field === "existingIPPlan") {
      const filtered = ipPlans.filter((plan) => plan.toLowerCase().includes(value.toLowerCase()))
      setFilteredPlans(filtered)
      setShowAutoComplete(value.length > 0 && filtered.length > 0)
    }
    if (field === "hasExistingISP") {
      if (!value) {
        setFormData((prev) => ({ ...prev, existingIPPlan: "" }))
        setShowAutoComplete(false)
      }
    }
  }

  const selectPlan = (plan: string) => {
    updateFormData("existingIPPlan", plan)
    setShowAutoComplete(false)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        const age = Number.parseInt(formData.age)
        if (!formData.age || isNaN(age) || age < 16 || age > 100) {
          newErrors.age = "Age must be between 16 and 100"
        }
        if (!formData.residencyStatus) {
          newErrors.residencyStatus = "Please select your residency status"
        }
        const householdSize = Number.parseInt(formData.householdSize)
        if (!formData.householdSize || isNaN(householdSize) || householdSize < 1 || householdSize > 10) {
          newErrors.householdSize = "Household size must be between 1 and 10"
        }
        break

      case 2:
        const incomePerCapita = Number.parseFloat(formData.annualIncomePerCapita)
        if (!formData.annualIncomePerCapita || isNaN(incomePerCapita) || incomePerCapita <= 0) {
          newErrors.annualIncomePerCapita = "Income per capita must be greater than 0"
        }

        const totalIncome = Number.parseFloat(formData.totalHouseholdIncome)
        const householdSizeNum = Number.parseInt(formData.householdSize)
        if (!formData.totalHouseholdIncome || isNaN(totalIncome)) {
          newErrors.totalHouseholdIncome = "Please enter total household income"
        } else if (totalIncome < incomePerCapita * householdSizeNum) {
          newErrors.totalHouseholdIncome = "Total household income must be at least income per capita × household size"
        }

        if (!formData.residentialAV || Number.parseFloat(formData.residentialAV) < 0) {
          newErrors.residentialAV = "Please enter a valid residential AV"
        }

        const mediSave = Number.parseFloat(formData.mediSaveBalance)
        if (formData.mediSaveBalance && !isNaN(mediSave) && (mediSave < 0 || mediSave > 63000)) {
          newErrors.mediSaveBalance = "MediSave balance must be between 0 and 63,000"
        }
        break

      case 3:
        if (!formData.preferredWardType) {
          newErrors.preferredWardType = "Please select your preferred ward type"
        }
        if (!formData.preferredInsurer) {
          newErrors.preferredInsurer = "Please select your preferred insurer"
        }
        if (formData.hasExistingISP && !formData.existingIPPlan) {
          newErrors.existingIPPlan = "Please enter your existing IP plan name"
        }
        break

      case 4:
        // No required fields in step 4, all are toggles
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      } else {
        // Navigate to results page with form data
        const searchParams = new URLSearchParams()
        Object.entries(formData).forEach(([key, value]) => {
          searchParams.set(key, value.toString())
        })
        router.push(`/calculator/results?${searchParams.toString()}`)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const TooltipField = ({ children, tooltip }: { children: React.ReactNode; tooltip: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [openedByClick, setOpenedByClick] = useState(false)
    const [isContentReady, setIsContentReady] = useState(false)

    const handleClick = () => {
      if (!isOpen) {
        setIsContentReady(false)
        setTimeout(() => {
          setIsContentReady(true)
          setIsOpen(true)
          setOpenedByClick(true)
        }, 50)
      } else {
        setIsOpen(false)
        setOpenedByClick(false)
        setIsContentReady(false)
      }
    }

    const handleMouseEnter = () => {
      if (!openedByClick) {
        setTimeout(() => {
          setIsContentReady(true)
          setIsOpen(true)
        }, 100)
      }
    }

    const handleMouseLeave = () => {
      if (!openedByClick) {
        setIsOpen(false)
        setIsContentReady(false)
      }
    }

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setIsOpen(false)
        setOpenedByClick(false)
        setIsContentReady(false)
      }
    }

    return (
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {children}
          <Tooltip open={isOpen && isContentReady} onOpenChange={handleOpenChange}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                aria-label="Show help information"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-xs z-50 p-3"
              onPointerDownOutside={() => {
                if (openedByClick) {
                  setIsOpen(false)
                  setOpenedByClick(false)
                  setIsContentReady(false)
                }
              }}
            >
              <div className="opacity-100 transition-opacity duration-200">
                <p>{tooltip}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    )
  }

  const wardDescriptions = {
    "c-standard": {
      title: "Class C",
      amenities:
        "This is the most heavily subsidised ward type. It typically has up to eight beds in a naturally ventilated, open room with common bathrooms.",
      subsidy:
        "Patients in this class receive the highest level of government subsidy, making it the most affordable option.",
      keyFeature: "Prioritises affordability over privacy and amenities.",
    },
    "b2-standard": {
      title: "Class B2",
      amenities:
        "A step up from Class C, this ward typically has up to six beds in a naturally ventilated room with shared bathroom facilities. Some hospitals may offer an air-conditioned B2+ ward with five beds and an attached bathroom.",
      subsidy: "A significant government subsidy is still provided, but it is less than for a Class C ward.",
      keyFeature: "Offers a slight improvement in bed density while remaining highly subsidised.",
    },
    b1: {
      title: "Class B1",
      amenities:
        "This is an air-conditioned ward with four beds per room, an attached bathroom, a television, and a telephone.",
      subsidy:
        "This is considered a private-like ward within a public hospital and, as such, receives little to no government subsidy.",
      keyFeature: "Balances the cost of a public hospital with the comfort and privacy of a semi-private room.",
    },
    a: {
      title: "Class A",
      amenities:
        "This is a single, air-conditioned private room with an attached bathroom, television, telephone, personal safe, and often a sofa bed for an accompanying guest.",
      subsidy: "No government subsidy is provided for this ward type.",
      keyFeature:
        "Provides maximum privacy and comfort with a high level of amenities within a public hospital setting.",
    },
    private: {
      title: "Private Hospital Wards",
      amenities:
        "The amenities and room types vary widely by hospital, ranging from multi-bedded rooms to single private suites. They generally offer a higher level of comfort, with more personalised services, private bathrooms, and a wide array of in-room facilities.",
      subsidy: "There is no government subsidy.",
      keyFeature:
        "Offers the highest degree of comfort, privacy, and convenience, often with shorter waiting times and the ability to choose a specific doctor.",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-xl text-foreground">ShieldSense</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                <Calculator className="h-3 w-3 mr-1" />
                Coverage Calculator
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif font-bold text-2xl lg:text-3xl text-foreground">Insurance Coverage Calculator</h1>
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
            {/* Step 1: Demographics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl">Demographics</h2>
                  <p className="text-muted-foreground">Basic information to personalise your coverage assessment.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <TooltipField tooltip="Your current age affects insurance premiums and coverage options">
                      <Label htmlFor="age">Age *</Label>
                    </TooltipField>
                    <Input
                      id="age"
                      type="number"
                      min="16"
                      max="100"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      className={errors.age ? "border-red-500" : ""}
                    />
                    {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
                  </div>

                  <div className="space-y-2">
                    <TooltipField tooltip="Your residency status affects eligibility for certain government schemes">
                      <Label htmlFor="residencyStatus">Residency Status *</Label>
                    </TooltipField>
                    <Select
                      value={formData.residencyStatus}
                      onValueChange={(value) => updateFormData("residencyStatus", value)}
                    >
                      <SelectTrigger className={errors.residencyStatus ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select residency status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Singapore Citizen</SelectItem>
                        <SelectItem value="pr">Permanent Resident</SelectItem>
                        <SelectItem value="foreigner">Foreigner</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.residencyStatus && <p className="text-sm text-red-500">{errors.residencyStatus}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <TooltipField tooltip="Number of people in your household, including yourself">
                      <Label htmlFor="householdSize">Household Size *</Label>
                    </TooltipField>
                    <Select
                      value={formData.householdSize}
                      onValueChange={(value) => updateFormData("householdSize", value)}
                    >
                      <SelectTrigger className={errors.householdSize ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select household size" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 9 ? "or more" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.householdSize && <p className="text-sm text-red-500">{errors.householdSize}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Income & Finances */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl">Income & Finances</h2>
                  <p className="text-muted-foreground">
                    Financial information helps determine appropriate coverage levels and government subsidies.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <TooltipField tooltip="Your individual annual income used for subsidy calculations">
                      <Label htmlFor="annualIncomePerCapita">Annual Income per Capita (S$) *</Label>
                    </TooltipField>
                    <Input
                      id="annualIncomePerCapita"
                      type="number"
                      min="1"
                      placeholder="e.g., 60000"
                      value={formData.annualIncomePerCapita}
                      onChange={(e) => updateFormData("annualIncomePerCapita", e.target.value)}
                      className={errors.annualIncomePerCapita ? "border-red-500" : ""}
                    />
                    {errors.annualIncomePerCapita && (
                      <p className="text-sm text-red-500">{errors.annualIncomePerCapita}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <TooltipField tooltip="Combined annual income of all household members">
                      <Label htmlFor="totalHouseholdIncome">Total Household Income (S$) *</Label>
                    </TooltipField>
                    <Input
                      id="totalHouseholdIncome"
                      type="number"
                      min="1"
                      placeholder="e.g., 120000"
                      value={formData.totalHouseholdIncome}
                      onChange={(e) => updateFormData("totalHouseholdIncome", e.target.value)}
                      className={errors.totalHouseholdIncome ? "border-red-500" : ""}
                    />
                    {errors.totalHouseholdIncome && (
                      <p className="text-sm text-red-500">{errors.totalHouseholdIncome}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <TooltipField tooltip="Annual Value of your residence (typical HDB flat: S$13,000-21,000)">
                      <Label htmlFor="residentialAV">Residential Annual Value (S$) *</Label>
                    </TooltipField>
                    <Input
                      id="residentialAV"
                      type="number"
                      min="0"
                      placeholder="e.g., 15000"
                      value={formData.residentialAV}
                      onChange={(e) => updateFormData("residentialAV", e.target.value)}
                      className={errors.residentialAV ? "border-red-500" : ""}
                    />
                    {errors.residentialAV && <p className="text-sm text-red-500">{errors.residentialAV}</p>}
                  </div>

                  <div className="space-y-2">
                    <TooltipField tooltip="Current MediSave account balance (leave blank for system estimate)">
                      <Label htmlFor="mediSaveBalance">MediSave Balance (S$)</Label>
                    </TooltipField>
                    <Input
                      id="mediSaveBalance"
                      type="number"
                      min="0"
                      max="63000"
                      placeholder="e.g., 45000 (optional)"
                      value={formData.mediSaveBalance}
                      onChange={(e) => updateFormData("mediSaveBalance", e.target.value)}
                      className={errors.mediSaveBalance ? "border-red-500" : ""}
                    />
                    {errors.mediSaveBalance && <p className="text-sm text-red-500">{errors.mediSaveBalance}</p>}
                    <p className="text-xs text-muted-foreground">Maximum: S$63,000</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Insurance Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl">Insurance Preferences</h2>
                  <p className="text-muted-foreground">
                    Your preferences help us recommend suitable insurance plans and coverage levels.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <TooltipField tooltip="Hospital ward class you prefer for treatment">
                      <Label htmlFor="preferredWardType">Preferred Ward Type *</Label>
                    </TooltipField>
                    <Select
                      value={formData.preferredWardType}
                      onValueChange={(value) => updateFormData("preferredWardType", value)}
                    >
                      <SelectTrigger className={errors.preferredWardType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select ward type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c-standard">C Standard</SelectItem>
                        <SelectItem value="b2-standard">B2 Standard</SelectItem>
                        <SelectItem value="b1">B1</SelectItem>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.preferredWardType && <p className="text-sm text-red-500">{errors.preferredWardType}</p>}
                  </div>

                  <div className="space-y-2">
                    <TooltipField tooltip="Insurance company you prefer or are considering">
                      <Label htmlFor="preferredInsurer">Preferred Insurer *</Label>
                    </TooltipField>
                    <Select
                      value={formData.preferredInsurer}
                      onValueChange={(value) => updateFormData("preferredInsurer", value)}
                    >
                      <SelectTrigger className={errors.preferredInsurer ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select insurer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="great-eastern">Great Eastern</SelectItem>
                        <SelectItem value="prudential">Prudential</SelectItem>
                        <SelectItem value="aia">AIA</SelectItem>
                        <SelectItem value="ntuc-income">NTUC Income</SelectItem>
                        <SelectItem value="raffles-health">Raffles Health</SelectItem>
                        <SelectItem value="axa">AXA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.preferredInsurer && <p className="text-sm text-red-500">{errors.preferredInsurer}</p>}
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="hasExistingISP"
                        checked={formData.hasExistingISP}
                        onChange={(e) => updateFormData("hasExistingISP", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <TooltipField tooltip="Integrated Shield Plan provides enhanced coverage beyond basic MediShield Life">
                        <Label htmlFor="hasExistingISP">Has Existing Integrated Shield Plan</Label>
                      </TooltipField>
                    </div>

                    {formData.hasExistingISP && (
                      <div className="space-y-2 relative">
                        <TooltipField tooltip="Start typing your current IP plan name for suggestions">
                          <Label htmlFor="existingIPPlan">Current IP Plan Name</Label>
                        </TooltipField>
                        <Input
                          id="existingIPPlan"
                          type="text"
                          placeholder="e.g., Great Eastern Supreme Health"
                          value={formData.existingIPPlan}
                          onChange={(e) => updateFormData("existingIPPlan", e.target.value)}
                          onFocus={() => {
                            if (formData.existingIPPlan && filteredPlans.length > 0) {
                              setShowAutoComplete(true)
                            }
                          }}
                          onBlur={() => {
                            setTimeout(() => setShowAutoComplete(false), 200)
                          }}
                          className="w-full"
                        />

                        {showAutoComplete && filteredPlans.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {filteredPlans.slice(0, 8).map((plan, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => selectPlan(plan)}
                                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm border-b border-border last:border-b-0"
                              >
                                {plan}
                              </button>
                            ))}
                            {filteredPlans.length > 8 && (
                              <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">
                                {filteredPlans.length - 8} more plans available...
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="hasRider"
                        checked={formData.hasRider}
                        onChange={(e) => updateFormData("hasRider", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <TooltipField tooltip="Rider provides additional coverage for deductibles and co-insurance">
                        <Label htmlFor="hasRider">Has Rider</Label>
                      </TooltipField>
                    </div>
                  </div>
                </div>

                {showWardDescription &&
                  formData.preferredWardType &&
                  wardDescriptions[formData.preferredWardType as keyof typeof wardDescriptions] && (
                    <div className="mt-6 p-6 bg-muted/30 rounded-lg border border-border">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif font-semibold text-lg text-foreground">
                            {wardDescriptions[formData.preferredWardType as keyof typeof wardDescriptions].title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowWardDescription(false)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-foreground mb-1">Amenities:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {wardDescriptions[formData.preferredWardType as keyof typeof wardDescriptions].amenities}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-1">Subsidy:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {wardDescriptions[formData.preferredWardType as keyof typeof wardDescriptions].subsidy}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-1">Key Feature:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {wardDescriptions[formData.preferredWardType as keyof typeof wardDescriptions].keyFeature}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Step 4: Health & Risk Factors */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-semibold text-xl">Health & Risk Factors</h2>
                  <p className="text-muted-foreground">
                    Health information helps assess your risk profile and coverage needs.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="preExistingConditions"
                        checked={formData.preExistingConditions}
                        onChange={(e) => updateFormData("preExistingConditions", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <TooltipField tooltip="Any medical conditions you currently have or have been treated for">
                        <Label htmlFor="preExistingConditions">Pre-Existing Conditions</Label>
                      </TooltipField>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="smokingStatus"
                        checked={formData.smokingStatus}
                        onChange={(e) => updateFormData("smokingStatus", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <TooltipField tooltip="Current or recent smoking habit affects insurance premiums">
                        <Label htmlFor="smokingStatus">Smoking Status</Label>
                      </TooltipField>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="familyMedicalHistory"
                        checked={formData.familyMedicalHistory}
                        onChange={(e) => updateFormData("familyMedicalHistory", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <TooltipField tooltip="Family history of major illnesses like cancer, heart disease, diabetes">
                        <Label htmlFor="familyMedicalHistory">Family Medical History – Major Illness</Label>
                      </TooltipField>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="obesity"
                        checked={formData.obesity}
                        onChange={(e) => updateFormData("obesity", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <TooltipField tooltip="BMI over 30 is considered obese and may affect insurance premiums">
                        <Label htmlFor="obesity">Obesity (BMI &gt; 30)</Label>
                      </TooltipField>
                    </div>
                  </div>
                </div>
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

          <Button onClick={nextStep} className="flex items-center gap-2">
            {currentStep < steps.length ? "Next" : "Calculate ShieldScore"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
