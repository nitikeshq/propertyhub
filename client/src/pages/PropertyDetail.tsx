import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { PropertyWithBroker, InsertLead } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MapPin, Bed, Bath, Square, ArrowLeft, User, Mail, Phone, Send } from "lucide-react";

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:slug");
  // Extract ID from slug (format: "title-slug-id")
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars with dashes)
  const slug = params?.slug || "";
  const propertyId = slug.length >= 36 ? slug.slice(-36) : slug;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    budget: "",
  });

  const { data: property, isLoading } = useQuery<PropertyWithBroker>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      return await apiRequest("POST", "/api/leads", data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent!",
        description: "The property owner will contact you soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "", budget: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
    onError: () => {
      toast({
        title: "Failed to send inquiry",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId) return;

    inquiryMutation.mutate({
      propertyId,
      leadType: "property_inquiry",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      budget: formData.budget ? parseInt(formData.budget) : undefined,
      requirements: formData.message,
      status: "new",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-32" />
            <div className="aspect-[21/9] bg-muted rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="h-96 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Link href="/properties">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Find Properties
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          {property.images && property.images.length > 0 ? (
            <div className="aspect-[21/9] relative group">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <Badge className="text-base px-5 py-2 capitalize bg-white/90 text-foreground backdrop-blur-sm">
                  {property.propertyType}
                </Badge>
                <Badge className="text-base px-5 py-2 capitalize" data-testid="badge-listing-type">
                  For {property.listingType}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="aspect-[21/9] bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No images available</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Location Card */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-card via-card to-primary/5">
              <CardContent className="p-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-base">{property.location}, {property.city}, {property.state}</span>
                  {property.pincode && <span className="ml-2 text-sm">({property.pincode})</span>}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-primary">
                    {property.listingType === 'rent' ? (
                      <>₹{property.priceMin.toLocaleString('en-IN')}<span className="text-base font-normal text-muted-foreground ml-1">/month</span></>
                    ) : property.priceMax ? (
                      <>₹{property.priceMin.toLocaleString('en-IN')} - ₹{property.priceMax.toLocaleString('en-IN')}</>
                    ) : (
                      <>₹{property.priceMin.toLocaleString('en-IN')}</>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Property Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover-elevate transition-all">
                      <Bed className="h-7 w-7 mx-auto mb-2 text-primary" />
                      <div className="text-xl font-bold">{property.bedrooms}</div>
                      <div className="text-xs text-muted-foreground mt-1">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover-elevate transition-all">
                      <Bath className="h-7 w-7 mx-auto mb-2 text-primary" />
                      <div className="text-xl font-bold">{property.bathrooms}</div>
                      <div className="text-xs text-muted-foreground mt-1">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover-elevate transition-all">
                    <Square className="h-7 w-7 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-bold">{property.area.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-muted-foreground mt-1">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover-elevate transition-all">
                    <Badge className="mb-2 capitalize text-xs" variant="outline">{property.status}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Facilities */}
            {property.facilities && property.facilities.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.facilities.map((facility, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1.5">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nearby Places */}
            {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Nearby Places</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {property.nearbyPlaces.map((place, index) => (
                      <div key={index} className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{place}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Inquiry Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardTitle className="text-xl">Interested? Get in Touch</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Fill out the form and we'll contact you shortly</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        data-testid="input-inquiry-name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        data-testid="input-inquiry-email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        data-testid="input-inquiry-phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (optional)</Label>
                    <Input
                      id="budget"
                      data-testid="input-inquiry-budget"
                      type="number"
                      placeholder="5000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      data-testid="textarea-inquiry-message"
                      placeholder="I'm interested in this property..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    data-testid="button-submit-inquiry"
                    type="submit"
                    className="w-full"
                    disabled={inquiryMutation.isPending}
                  >
                    {inquiryMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {property.broker.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">Listed by</div>
                      <div className="text-sm text-muted-foreground">{property.broker.name}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
