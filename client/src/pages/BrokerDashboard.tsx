import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { Property, InsertProperty } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Building2, Plus, Eye, MapPin, DollarSign, LogOut, Home } from "lucide-react";
import type { UploadResult } from "@uppy/core";

export default function BrokerDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAddProperty, setShowAddProperty] = useState(false);

  const [formData, setFormData] = useState<Partial<InsertProperty>>({
    title: "",
    description: "",
    propertyType: "residential",
    price: 0,
    location: "",
    city: "",
    state: "",
    bedrooms: undefined,
    bathrooms: undefined,
    area: 0,
    images: [],
    amenities: [],
    status: "available",
    featured: false,
    brokerId: user?.id || "",
  });

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { brokerId: user?.id }],
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      return await apiRequest("POST", "/api/properties", data);
    },
    onSuccess: () => {
      toast({
        title: "Property listed!",
        description: "Your property has been successfully added.",
      });
      setShowAddProperty(false);
      setFormData({
        title: "",
        description: "",
        propertyType: "residential",
        price: 0,
        location: "",
        city: "",
        state: "",
        bedrooms: undefined,
        bathrooms: undefined,
        area: 0,
        images: [],
        amenities: [],
        status: "available",
        featured: false,
        brokerId: user?.id || "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
    onError: () => {
      toast({
        title: "Failed to add property",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const data = await response.json();
    return { method: "PUT" as const, url: data.uploadURL };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedUrls = result.successful.map((file) => file.uploadURL);
      
      const imageUrls = await Promise.all(
        uploadedUrls.map(async (url) => {
          const response = await apiRequest("PUT", "/api/property-images", { imageURL: url });
          return response.objectPath;
        })
      );
      
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls],
      }));

      toast({
        title: "Images uploaded",
        description: `${imageUrls.length} image(s) uploaded successfully`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.location || !formData.city || !formData.state || !formData.area) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addPropertyMutation.mutate(formData as InsertProperty);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const myProperties = properties?.filter(p => p.brokerId === user?.id) || [];
  const totalViews = myProperties.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Broker Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" data-testid="button-home">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-properties">{myProperties.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-views">{totalViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-available-properties">
                {myProperties.filter(p => p.status === "available").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Property Button */}
        {!showAddProperty && (
          <Button
            data-testid="button-add-property"
            onClick={() => setShowAddProperty(true)}
            size="lg"
            className="mb-8"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Property
          </Button>
        )}

        {/* Add Property Form */}
        {showAddProperty && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Property</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      data-testid="input-title"
                      placeholder="Modern 3BR Apartment"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value: "residential" | "commercial" | "land") =>
                        setFormData({ ...formData, propertyType: value })
                      }
                    >
                      <SelectTrigger data-testid="select-property-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      data-testid="textarea-description"
                      placeholder="Describe your property..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (per month) *</Label>
                    <Input
                      id="price"
                      data-testid="input-price"
                      type="number"
                      placeholder="5000"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sqft) *</Label>
                    <Input
                      id="area"
                      data-testid="input-area"
                      type="number"
                      placeholder="1500"
                      value={formData.area || ""}
                      onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      data-testid="input-location"
                      placeholder="123 Main St"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      data-testid="input-city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      data-testid="input-state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      data-testid="input-bedrooms"
                      type="number"
                      placeholder="3"
                      value={formData.bedrooms || ""}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || undefined })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      data-testid="input-bathrooms"
                      type="number"
                      placeholder="2"
                      value={formData.bathrooms || ""}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || undefined })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities (comma separated)</Label>
                    <Input
                      id="amenities"
                      data-testid="input-amenities"
                      placeholder="Parking, Pool, Gym"
                      onChange={(e) => {
                        const amenitiesArray = e.target.value.split(",").map(a => a.trim()).filter(Boolean);
                        setFormData({ ...formData, amenities: amenitiesArray });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <ObjectUploader
                    maxNumberOfFiles={10}
                    maxFileSize={10485760}
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Images
                  </ObjectUploader>
                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-2">{formData.images.length} image(s) uploaded</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    data-testid="button-submit-property"
                    disabled={addPropertyMutation.isPending}
                  >
                    {addPropertyMutation.isPending ? "Adding..." : "Add Property"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddProperty(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Properties List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Properties</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myProperties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No properties yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first property listing</p>
                {!showAddProperty && (
                  <Button onClick={() => setShowAddProperty(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <Card key={property.id} data-testid={`card-property-${property.id}`} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <Building2 className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 capitalize">{property.status}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">{property.city}, {property.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-primary">
                        ₹{property.price.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="h-4 w-4 mr-1" />
                        {property.views}
                      </div>
                    </div>
                    <Link href={`/property/${property.id}`}>
                      <Button className="w-full mt-4" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
