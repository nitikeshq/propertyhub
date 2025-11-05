import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MapPin, Bed, Bath, Square, Search, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export default function FindProperties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const filteredAndSortedProperties = () => {
    if (!properties) return [];

    let filtered = [...properties];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by property type
    if (propertyType !== "all") {
      filtered = filtered.filter((p) => p.propertyType === propertyType);
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseInt(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "area-asc":
        filtered.sort((a, b) => a.area - b.area);
        break;
      case "area-desc":
        filtered.sort((a, b) => b.area - a.area);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  };

  const allResults = filteredAndSortedProperties();
  const results = allResults.slice(0, displayCount);
  const hasMore = displayCount < allResults.length;

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [searchQuery, propertyType, sortBy, minPrice, maxPrice]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const createSlug = (property: Property) => {
    const titleSlug = property.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${titleSlug}-${property.id}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="container mx-auto px-6 py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Properties</h1>
          <p className="text-muted-foreground">
            Browse through {properties?.length || 0} available properties
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, location, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
              </div>

              {/* Property Type */}
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger data-testid="select-property-type">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>

              {/* Min Price */}
              <Input
                type="number"
                placeholder="Min Price (₹)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                data-testid="input-min-price"
              />

              {/* Max Price */}
              <Input
                type="number"
                placeholder="Max Price (₹)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                data-testid="input-max-price"
              />
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="area-asc">Area: Small to Large</SelectItem>
                    <SelectItem value="area-desc">Area: Large to Small</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setPropertyType("all");
                  setSortBy("newest");
                  setMinPrice("");
                  setMaxPrice("");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setPropertyType("all");
                setMinPrice("");
                setMaxPrice("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {results.length} of {allResults.length} {allResults.length === 1 ? 'property' : 'properties'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((property) => (
                <Link key={property.id} href={`/property/${createSlug(property)}`}>
                  <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-property-${property.id}`}>
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Square className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 capitalize">
                        {property.propertyType}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-title-${property.id}`}>
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{property.location}, {property.city}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                          <span>{property.area.toLocaleString('en-IN')} sq ft</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary" data-testid={`text-price-${property.id}`}>
                        {formatPrice(property.price)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More Section */}
            {hasMore && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Button
                  size="lg"
                  onClick={handleLoadMore}
                  data-testid="button-load-more"
                  className="min-w-[200px]"
                >
                  Load More Properties
                </Button>
                <div ref={loadMoreRef} className="h-4 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {!hasMore && allResults.length > ITEMS_PER_PAGE && (
              <div className="text-center py-8 text-muted-foreground">
                You've reached the end of the list
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
