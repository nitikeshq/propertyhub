import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Bed, Bath, Square, TrendingUp, Users, Shield, ArrowRight, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import heroImage from "@assets/stock_images/modern_luxury_real_e_7f19321d.jpg";

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Get featured properties (limit to 8 for slider)
  const featuredProperties = properties?.slice(0, 8) || [];
  
  const itemsPerSlide = 3;
  const maxSlides = Math.max(1, Math.ceil(featuredProperties.length / itemsPerSlide));

  // Lead submission mutation
  const createLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/leads", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Request submitted!",
        description: "Our team will contact you shortly with property details.",
      });
      handleCloseDialog();
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRequestDetails = (property: Property) => {
    setSelectedProperty(property);
    setLeadForm({
      name: "",
      email: "",
      phone: "",
      message: `I'm interested in ${property.title} at ${property.location}, ${property.city}.`
    });
    setShowLeadForm(true);
  };

  const handleCloseDialog = () => {
    setShowLeadForm(false);
    setSelectedProperty(null);
    setLeadForm({ name: "", email: "", phone: "", message: "" });
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate({
      ...leadForm,
      propertyId: selectedProperty?.id,
      leadType: "property"
    });
  };

  const nextSlide = () => {
    if (maxSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }
  };

  const prevSlide = () => {
    if (maxSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <Badge className="mb-6 text-sm px-4 py-2 bg-primary/20 backdrop-blur-sm border-primary/30 text-white">
              India's Premier Property Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Find Your Dream Property in India
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Discover premium residential, commercial spaces, and land opportunities across major cities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button size="lg" className="px-8 py-6 text-lg" data-testid="button-find-properties">
                  Find Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/interior-design">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" data-testid="button-interior-cta">
                  Interior Design Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Slider */}
      <div id="properties" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-xl text-muted-foreground">Discover our handpicked selection of premium properties</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[16/9] bg-muted animate-pulse" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No properties available</h3>
              <p className="text-muted-foreground">Check back soon for new listings</p>
            </div>
          ) : (
            <div className="relative">
              {/* Navigation Buttons */}
              {maxSlides > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-background shadow-lg"
                    onClick={prevSlide}
                    data-testid="button-prev-slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-background shadow-lg"
                    onClick={nextSlide}
                    data-testid="button-next-slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Property Cards Slider */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: maxSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                        {featuredProperties
                          .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                          .map((property) => (
                            <Card
                              key={property.id}
                              data-testid={`card-property-${property.id}`}
                              className="overflow-hidden hover-elevate active-elevate-2"
                            >
                              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                    <Building2 className="h-16 w-16 text-muted-foreground" />
                                  </div>
                                )}
                                <Badge className="absolute top-3 right-3 capitalize">
                                  {property.propertyType}
                                </Badge>
                              </div>

                              <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{property.title}</h3>
                                <div className="flex items-center text-muted-foreground mb-4">
                                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                  <span className="text-sm line-clamp-1">{property.location}, {property.city}</span>
                                </div>

                                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                  {property.bedrooms && (
                                    <div className="flex items-center gap-1">
                                      <Bed className="h-4 w-4" />
                                      <span>{property.bedrooms}</span>
                                    </div>
                                  )}
                                  {property.bathrooms && (
                                    <div className="flex items-center gap-1">
                                      <Bath className="h-4 w-4" />
                                      <span>{property.bathrooms}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Square className="h-4 w-4" />
                                    <span>{property.area.toLocaleString()}</span>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <div className="text-2xl font-bold text-primary">
                                    {property.listingType === 'rent' ? (
                                      <>₹{property.priceMin.toLocaleString('en-IN')}<span className="text-sm font-normal text-muted-foreground">/month</span></>
                                    ) : property.priceMax ? (
                                      <>₹{property.priceMin.toLocaleString('en-IN')} - ₹{property.priceMax.toLocaleString('en-IN')}</>
                                    ) : (
                                      <>₹{property.priceMin.toLocaleString('en-IN')}</>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="mt-1 capitalize text-xs">
                                    For {property.listingType}
                                  </Badge>
                                </div>

                                <Button
                                  className="w-full"
                                  onClick={() => handleRequestDetails(property)}
                                  data-testid={`button-request-details-${property.id}`}
                                >
                                  Request Details
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              {maxSlides > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: maxSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                      }`}
                      data-testid={`dot-${index}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose PropertyHub?</h2>
            <p className="text-xl text-muted-foreground">Your trusted partner in real estate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Best Market Prices</h3>
              <p className="text-muted-foreground">
                Get access to competitive pricing and the best deals in the market with transparent listings
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Verified Listings</h3>
              <p className="text-muted-foreground">
                All properties are verified by professional brokers ensuring authenticity and reliability
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Expert Support</h3>
              <p className="text-muted-foreground">
                Dedicated broker support to guide you through every step of your property journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interior Design CTA */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-y">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-sm px-4 py-2">Premium Service</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Transform Your Space</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Get expert interior design consultation to create the perfect living or working environment
            </p>
            <Link href="/interior-design">
              <Button size="lg" data-testid="button-interior-design" className="px-8 py-6 text-lg">
                Request a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      {/* Lead Request Form Dialog */}
      <Dialog open={showLeadForm} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Property Details</DialogTitle>
            <DialogDescription>
              {selectedProperty && (
                <span>Fill in your details and we'll contact you about <strong>{selectedProperty.title}</strong></span>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                data-testid="input-lead-name"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  data-testid="input-lead-email"
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="your@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  data-testid="input-lead-phone"
                  type="tel"
                  required
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                data-testid="input-lead-message"
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                placeholder="Any specific requirements or questions..."
                rows={4}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-testid="button-cancel-lead"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLeadMutation.isPending}
                data-testid="button-submit-lead"
              >
                {createLeadMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
