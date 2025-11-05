import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, Home as HomeIcon, MapPin, Bed, Bath, Square, Filter, TrendingUp, Users, Shield, ArrowRight } from "lucide-react";
import heroImage from "@assets/stock_images/modern_luxury_real_e_7f19321d.jpg";
import residentialImage from "@assets/stock_images/modern_residential_h_93df657f.jpg";
import commercialImage from "@assets/stock_images/commercial_office_bu_e3030318.jpg";
import landImage from "@assets/stock_images/vacant_land_property_82ce77fb.jpg";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [sortBy, setSortBy] = useState("newest");

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    queryFn: async () => {
      const response = await fetch("/api/properties", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
  });

  const filteredProperties = properties?.filter((property) => {
    const matchesSearch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = propertyType === "all" || property.propertyType === propertyType;
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    return matchesSearch && matchesType && matchesPrice;
  }) || [];

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-[700px] flex items-center overflow-hidden">
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
          <div className="max-w-4xl">
            <Badge className="mb-6 text-sm px-4 py-2 bg-primary/20 backdrop-blur-sm border-primary/30 text-white">
              India's Premier Property Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Find Your Dream Property in India
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl">
              Discover premium residential, commercial spaces, and land opportunities across major cities
            </p>
            
            {/* Search Bar */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      data-testid="input-search"
                      placeholder="Search by location, city, or property name..."
                      className="pl-10 h-14"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger data-testid="select-property-type" className="w-full md:w-48 h-14">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button data-testid="button-search" size="lg" className="h-14 px-8">
                    Search Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Property Categories */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Browse by Property Type</h2>
            <p className="text-xl text-muted-foreground">Find the perfect space for your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button
              onClick={() => setPropertyType("residential")}
              data-testid="button-category-residential"
              className="text-left w-full"
            >
              <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer group">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={residentialImage}
                    alt="Residential Properties"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <HomeIcon className="h-8 w-8 mb-2" />
                      <h3 className="text-2xl font-bold">Residential</h3>
                      <p className="text-white/90 mt-1">Apartments, Villas & Homes</p>
                    </div>
                  </div>
                </div>
              </Card>
            </button>

            <button
              onClick={() => setPropertyType("commercial")}
              data-testid="button-category-commercial"
              className="text-left w-full"
            >
              <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer group">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={commercialImage}
                    alt="Commercial Properties"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <Building2 className="h-8 w-8 mb-2" />
                      <h3 className="text-2xl font-bold">Commercial</h3>
                      <p className="text-white/90 mt-1">Offices, Retail & Warehouses</p>
                    </div>
                  </div>
                </div>
              </Card>
            </button>

            <button
              onClick={() => setPropertyType("land")}
              data-testid="button-category-land"
              className="text-left w-full"
            >
              <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer group">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={landImage}
                    alt="Land Properties"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <MapPin className="h-8 w-8 mb-2" />
                      <h3 className="text-2xl font-bold">Land</h3>
                      <p className="text-white/90 mt-1">Plots & Development Sites</p>
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
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

      {/* Filter & Sort Section */}
      <div className="border-y bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <label className="text-sm font-medium mb-3 block">Price Range: ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}</label>
              <Slider
                data-testid="slider-price-range"
                value={priceRange}
                onValueChange={setPriceRange}
                max={100000000}
                step={1000000}
                className="w-full md:w-80"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="select-sort" className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[16/9] bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="text-center py-24">
            <Building2 className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold mb-3">No properties found</h3>
            <p className="text-muted-foreground mb-8">Try adjusting your search filters</p>
            <Button onClick={() => { setSearchQuery(""); setPropertyType("all"); setPriceRange([0, 100000000]); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Available Properties</h2>
              <p className="text-muted-foreground">{sortedProperties.length} properties found</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <Card data-testid={`card-property-${property.id}`} className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all">
                    <div className="aspect-[16/9] bg-muted relative overflow-hidden">
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
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
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
                          <span>{property.area.toLocaleString()} sqft</span>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-primary">
                        ₹{property.price.toLocaleString('en-IN')}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
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

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PropertyHub</h3>
              <p className="text-muted-foreground">Premium real estate platform connecting brokers and buyers worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Brokers</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/login" className="block hover:text-foreground">Login</Link>
                <Link href="/register" className="block hover:text-foreground">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/" className="block hover:text-foreground">Browse Properties</Link>
                <Link href="/interior-design" className="block hover:text-foreground">Interior Design</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-muted-foreground">Get in touch with our team for any inquiries.</p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 PropertyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
