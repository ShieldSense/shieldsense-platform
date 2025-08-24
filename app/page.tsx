import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Calculator, BarChart3, Users, CheckCircle, ArrowRight, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-xl text-foreground">ShieldSense</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">View My Results</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/calculator">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-serif font-bold text-4xl lg:text-6xl text-foreground leading-tight">
                  Make Smarter Healthcare Insurance Decisions
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Get personalised coverage assessments, compare plans, and discover gaps in your healthcare protection
                  with our comprehensive ShieldScore analysis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base" asChild>
                  <a href="/calculator">
                    Start My Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="text-base bg-transparent" asChild>
                  <a href="/ai-chat">Chat with AI Advisor</a>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Privacy Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">No Personal Data Required</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-6 shadow-xl border-0 bg-gradient-to-br from-card to-muted/30">
                <CardHeader className="pb-4">
                  <CardTitle className="font-serif text-xl">Your ShieldScore</CardTitle>
                  <CardDescription>Comprehensive coverage assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.85)}`}
                          className="text-primary transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="font-serif font-bold text-3xl text-primary">85</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Basic Coverage</span>
                      <Badge variant="secondary">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical Illness</span>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Disability Protection</span>
                      <Badge variant="outline">Needs Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif font-bold text-3xl lg:text-4xl text-foreground">
              Everything You Need to Assess Your Coverage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need to make informed healthcare
              insurance decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Smart Calculator</CardTitle>
                <CardDescription>
                  Interactive tools to assess your current coverage and identify potential gaps
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-serif">ShieldScore Analysis</CardTitle>
                <CardDescription>
                  Get a comprehensive score that evaluates your overall healthcare protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif">Plan Comparison</CardTitle>
                <CardDescription>
                  Side-by-side comparison of different insurance plans tailored for Singapore
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif font-bold text-3xl lg:text-4xl text-foreground">How ShieldSense Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalised healthcare insurance insights in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto">
                <span className="font-serif font-bold text-2xl text-white">1</span>
              </div>
              <h3 className="font-serif font-semibold text-xl">Answer Questions</h3>
              <p className="text-muted-foreground">
                Tell us about your current coverage, health needs, and financial situation
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <span className="font-serif font-bold text-2xl text-white">2</span>
              </div>
              <h3 className="font-serif font-semibold text-xl">Get Your ShieldScore</h3>
              <p className="text-muted-foreground">
                Receive a comprehensive analysis of your healthcare protection gaps
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                <span className="font-serif font-bold text-2xl text-white">3</span>
              </div>
              <h3 className="font-serif font-semibold text-xl">Compare & Decide</h3>
              <p className="text-muted-foreground">
                Explore personalised recommendations and compare plans that fit your needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="font-serif font-bold text-3xl lg:text-4xl text-primary-foreground">
              Ready to Optimise Your Healthcare Coverage?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of Singaporeans who have already discovered their ShieldScore and improved their healthcare
              protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-base" asChild>
                <a href="/calculator">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-serif font-bold text-lg">ShieldSense</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering Singaporeans to make smarter healthcare insurance decisions.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Calculator
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  ShieldScore
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Plan Comparison
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 ShieldSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
