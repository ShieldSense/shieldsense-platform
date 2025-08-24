"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Search,
  Filter,
  CheckCircle,
  X,
  Star,
  Heart,
  AlertTriangle,
  Users,
  ArrowRight,
  Compass as Compare,
  Download,
  Share2,
} from "lucide-react"
import Link from "next/link"

// Mock insurance plans data
const insurancePlans = [
  {
    id: 1,
    name: "HealthShield Gold Max",
    provider: "Great Eastern",
    type: "Integrated Shield",
    rating: 4.8,
    monthlyPremium: 180,
    annualLimit: 2000000,
    deductible: 3500,
    coInsurance: 10,
    features: {
      hospitalCoverage: "Private hospitals worldwide",
      outpatientCoverage: "Specialist consultations",
      emergencyCoverage: "24/7 emergency worldwide",
      maternity: "Up to S$12,000",
      dental: "Basic coverage",
      wellness: "Annual health screening",
    },
    pros: ["Comprehensive worldwide coverage", "Low co-insurance", "Established provider"],
    cons: ["Higher premium", "High deductible"],
    bestFor: "Comprehensive protection seekers",
    popular: true,
  },
  {
    id: 2,
    name: "Prudential PRUShield",
    provider: "Prudential",
    type: "Integrated Shield",
    rating: 4.6,
    monthlyPremium: 165,
    annualLimit: 1500000,
    deductible: 3000,
    coInsurance: 10,
    features: {
      hospitalCoverage: "Private hospitals in Singapore",
      outpatientCoverage: "Specialist consultations",
      emergencyCoverage: "Emergency coverage",
      maternity: "Up to S$10,000",
      dental: "Not included",
      wellness: "Basic health screening",
    },
    pros: ["Competitive pricing", "Good local coverage", "Fast claims processing"],
    cons: ["Limited international coverage", "No dental coverage"],
    bestFor: "Budget-conscious individuals",
    popular: false,
  },
  {
    id: 3,
    name: "AIA HealthShield Gold Max",
    provider: "AIA",
    type: "Integrated Shield",
    rating: 4.7,
    monthlyPremium: 175,
    annualLimit: 2000000,
    deductible: 3500,
    coInsurance: 5,
    features: {
      hospitalCoverage: "Private hospitals worldwide",
      outpatientCoverage: "Comprehensive outpatient",
      emergencyCoverage: "Global emergency coverage",
      maternity: "Up to S$15,000",
      dental: "Comprehensive dental",
      wellness: "Premium wellness program",
    },
    pros: ["Lowest co-insurance", "Excellent wellness benefits", "Strong international network"],
    cons: ["Premium pricing", "Complex claims process"],
    bestFor: "Premium coverage seekers",
    popular: false,
  },
]

export default function ComparePage() {
  const [selectedPlans, setSelectedPlans] = useState<number[]>([1, 2])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProvider, setFilterProvider] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [maxPremium, setMaxPremium] = useState(300)

  const filteredPlans = insurancePlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = filterProvider === "all" || plan.provider === filterProvider
    const matchesType = filterType === "all" || plan.type === filterType
    const matchesPremium = plan.monthlyPremium <= maxPremium

    return matchesSearch && matchesProvider && matchesType && matchesPremium
  })

  const togglePlanSelection = (planId: number) => {
    setSelectedPlans((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((id) => id !== planId)
      } else if (prev.length < 3) {
        return [...prev, planId]
      }
      return prev
    })
  }

  const selectedPlanData = insurancePlans.filter((plan) => selectedPlans.includes(plan.id))

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
                <Compare className="h-3 w-3 mr-1" />
                Plan Comparison
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h1 className="font-serif font-bold text-2xl lg:text-3xl text-foreground">Compare Insurance Plans</h1>
          <p className="text-muted-foreground">
            Find the perfect insurance plan by comparing features, benefits, and pricing side-by-side
          </p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Plans</TabsTrigger>
            <TabsTrigger value="compare">Compare Selected ({selectedPlans.length})</TabsTrigger>
          </TabsList>

          {/* Browse Plans Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Plans</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name or provider"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select value={filterProvider} onValueChange={setFilterProvider}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Providers</SelectItem>
                        <SelectItem value="Great Eastern">Great Eastern</SelectItem>
                        <SelectItem value="Prudential">Prudential</SelectItem>
                        <SelectItem value="AIA">AIA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Plan Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Integrated Shield">Integrated Shield</SelectItem>
                        <SelectItem value="Term Life">Term Life</SelectItem>
                        <SelectItem value="Critical Illness">Critical Illness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Monthly Premium: S${maxPremium}</Label>
                    <Input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={maxPremium}
                      onChange={(e) => setMaxPremium(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plans Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all hover:shadow-lg ${
                    selectedPlans.includes(plan.id) ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-4">
                      <Badge className="bg-secondary text-secondary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="font-serif text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.provider}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{plan.rating}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Premium</span>
                        <span className="font-semibold text-lg">S${plan.monthlyPremium}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Annual Limit</span>
                        <span className="font-medium">S${plan.annualLimit.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Deductible</span>
                        <span className="font-medium">S${plan.deductible}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Features</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs">{plan.features.hospitalCoverage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs">{plan.features.outpatientCoverage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs">{plan.features.emergencyCoverage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        Best for: {plan.bestFor}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={selectedPlans.includes(plan.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePlanSelection(plan.id)}
                        disabled={!selectedPlans.includes(plan.id) && selectedPlans.length >= 3}
                        className="flex-1"
                      >
                        {selectedPlans.includes(plan.id) ? (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Compare className="h-3 w-3 mr-1" />
                            Compare
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPlans.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No plans match your current filters. Try adjusting your criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Compare Selected Tab */}
          <TabsContent value="compare" className="space-y-6">
            {selectedPlanData.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <Compare className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <h3 className="font-serif font-semibold text-lg">No plans selected</h3>
                    <p className="text-muted-foreground">
                      Select up to 3 plans from the Browse tab to compare them here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Comparison Header */}
                <div className="flex items-center justify-between">
                  <h2 className="font-serif font-semibold text-xl">Plan Comparison</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Comparison
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-full">
                    {selectedPlanData.map((plan) => (
                      <Card key={plan.id} className="relative">
                        {plan.popular && (
                          <div className="absolute -top-3 left-4">
                            <Badge className="bg-secondary text-secondary-foreground">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="text-center pb-4">
                          <CardTitle className="font-serif">{plan.name}</CardTitle>
                          <CardDescription>{plan.provider}</CardDescription>
                          <div className="text-2xl font-bold text-primary">S${plan.monthlyPremium}/mo</div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          {/* Basic Info */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm border-b pb-1">Basic Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Rating</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{plan.rating}</span>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Annual Limit</span>
                                <span>S${plan.annualLimit.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Deductible</span>
                                <span>S${plan.deductible}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Co-insurance</span>
                                <span>{plan.coInsurance}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Coverage Features */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm border-b pb-1">Coverage Features</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Heart className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">Hospital</div>
                                  <div className="text-muted-foreground text-xs">{plan.features.hospitalCoverage}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Users className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">Outpatient</div>
                                  <div className="text-muted-foreground text-xs">
                                    {plan.features.outpatientCoverage}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">Emergency</div>
                                  <div className="text-muted-foreground text-xs">{plan.features.emergencyCoverage}</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">Maternity</div>
                                  <div className="text-muted-foreground text-xs">{plan.features.maternity}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Pros & Cons */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm border-b pb-1">Pros & Cons</h4>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                {plan.pros.slice(0, 2).map((pro, index) => (
                                  <div key={index} className="flex items-start gap-2 text-xs">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-green-700">{pro}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-1">
                                {plan.cons.slice(0, 2).map((con, index) => (
                                  <div key={index} className="flex items-start gap-2 text-xs">
                                    <X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-red-700">{con}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Button className="w-full">
                            Get Quote
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      ShieldSense Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on your comparison, here's our recommendation for your profile:
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {
                          selectedPlanData.find(
                            (plan) => plan.rating === Math.max(...selectedPlanData.map((p) => p.rating)),
                          )?.name
                        }{" "}
                        appears to be the best fit
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This plan offers the best balance of coverage, pricing, and benefits for your needs.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
