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
  const [, params] = useRoute("/property/:id");
  const propertyId = params?.id;
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
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="mb-8 rounded-xl overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <div className="aspect-[21/9] relative">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-6 right-6 text-lg px-4 py-2 capitalize">
                {property.propertyType}
              </Badge>
            </div>
          ) : (
            <div className="aspect-[21/9] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No images available</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{property.location}, {property.city}, {property.state}</span>
              </div>
              <div className="text-4xl font-bold text-primary mb-6">
                ₹{property.price.toLocaleString('en-IN')}
                <span className="text-xl font-normal text-muted-foreground">/month</span>
              </div>
            </div>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {property.bedrooms && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Square className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{property.area.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Badge className="mb-2 capitalize" variant="outline">{property.status}</Badge>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Inquiry Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
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
