import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Shield, TrendingUp, Target, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">About PropertyHub</h1>
              <p className="text-xl text-muted-foreground">
                India's premier property platform connecting verified brokers with serious buyers
                across major cities
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                To revolutionize the Indian real estate market by creating a transparent,
                efficient, and trustworthy platform that empowers brokers and simplifies property
                discovery for buyers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To be India's most trusted property platform, setting the standard for
                      transparency and service excellence.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Our Community</h3>
                    <p className="text-muted-foreground">
                      Connecting thousands of verified brokers with buyers looking for their dream
                      properties.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Our Commitment</h3>
                    <p className="text-muted-foreground">
                      Delivering exceptional service, verified listings, and expert support at every
                      step.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Why Choose PropertyHub?
              </h2>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Verified Brokers Only</h3>
                    <p className="text-muted-foreground">
                      Every broker on our platform is thoroughly verified, ensuring you work with
                      professionals who meet our high standards of service and authenticity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                    <p className="text-muted-foreground">
                      All listings feature clear, competitive pricing with no hidden fees. What you
                      see is what you get, ensuring complete transparency in every transaction.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Diverse Property Portfolio</h3>
                    <p className="text-muted-foreground">
                      From residential apartments to commercial spaces and land, explore a wide
                      range of properties across India's major cities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                    <p className="text-muted-foreground">
                      Our team of real estate experts is here to guide you through every step of
                      your property journey, from discovery to closing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-muted-foreground">Properties Listed</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                  <div className="text-muted-foreground">Verified Brokers</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Cities Covered</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
                  <div className="text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
