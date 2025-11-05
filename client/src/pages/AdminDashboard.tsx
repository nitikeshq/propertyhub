import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { LeadWithProperty, UpdateLead, Property, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, Mail, Home as HomeIcon, LogOut, Search, Eye, Building2, ListChecks } from "lucide-react";
import { format } from "date-fns";

type PropertyWithBroker = Property & { broker: User };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("leads");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<LeadWithProperty | null>(null);
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");

  const { data: leads, isLoading } = useQuery<LeadWithProperty[]>({
    queryKey: ["/api/leads"],
  });

  const { data: properties, isLoading: isLoadingProperties } = useQuery<PropertyWithBroker[]>({
    queryKey: ["/api/properties/with-brokers"],
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLead }) => {
      return await apiRequest("PATCH", `/api/leads/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Lead updated",
        description: "Lead status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setSelectedLead(null);
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Could not update lead status.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    updateLeadMutation.mutate({
      id: leadId,
      data: { status: newStatus as any },
    });
  };

  const filteredLeads = (leads || []).filter((lead) => {
    const matchesSearch = 
      !searchQuery ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesType = typeFilter === "all" || lead.leadType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const statusCounts = {
    new: leads?.filter((l) => l.status === "new").length || 0,
    contacted: leads?.filter((l) => l.status === "contacted").length || 0,
    in_progress: leads?.filter((l) => l.status === "in_progress").length || 0,
    qualified: leads?.filter((l) => l.status === "qualified").length || 0,
    closed_won: leads?.filter((l) => l.status === "closed_won").length || 0,
    closed_lost: leads?.filter((l) => l.status === "closed_lost").length || 0,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new": return "default";
      case "contacted": return "secondary";
      case "in_progress": return "outline";
      case "qualified": return "default";
      case "closed_won": return "default";
      case "closed_lost": return "destructive";
      default: return "secondary";
    }
  };

  const filteredProperties = (properties || []).filter((property) => {
    const matchesSearch =
      !propertySearchQuery ||
      property.title.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(propertySearchQuery.toLowerCase());

    const matchesType = propertyTypeFilter === "all" || property.propertyType === propertyTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" data-testid="button-home">
                  <HomeIcon className="h-4 w-4 mr-2" />
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="leads" data-testid="tab-leads">
              <ListChecks className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="properties" data-testid="tab-properties">
              <Building2 className="h-4 w-4 mr-2" />
              Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-new-leads">{statusCounts.new}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.contacted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.in_progress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Qualified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statusCounts.qualified}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Won</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{statusCounts.closed_won}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{statusCounts.closed_lost}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-testid="input-search-leads"
                  placeholder="Search by name, email, or phone..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter" className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger data-testid="select-type-filter" className="w-full md:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="property_inquiry">Property Inquiry</SelectItem>
                  <SelectItem value="interior_design">Interior Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-12 text-center">
                <Mail className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No leads found</h3>
                <p className="text-muted-foreground">No leads match your current filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-muted-foreground">{lead.email}</div>
                            <div className="text-muted-foreground">{lead.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {lead.leadType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={lead.status}
                            onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                          >
                            <SelectTrigger data-testid={`select-status-${lead.id}`} className="w-40">
                              <SelectValue>
                                <Badge variant={getStatusBadgeVariant(lead.status)} className="capitalize">
                                  {lead.status.replace("_", " ")}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="closed_won">Closed Won</SelectItem>
                              <SelectItem value="closed_lost">Closed Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {lead.budget ? `₹${lead.budget.toLocaleString('en-IN')}` : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(lead.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-view-${lead.id}`}
                            onClick={() => setSelectedLead(lead)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            {/* Properties Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      data-testid="input-search-properties"
                      placeholder="Search by title, city, or location..."
                      className="pl-10"
                      value={propertySearchQuery}
                      onChange={(e) => setPropertySearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                    <SelectTrigger data-testid="select-property-type-filter" className="w-full md:w-48">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Properties Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Properties ({filteredProperties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingProperties ? (
                  <div className="py-12 text-center">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading properties...</p>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="py-12 text-center">
                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                    <p className="text-muted-foreground">No properties match your current filters</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Listing</TableHead>
                          <TableHead>Price Range</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Broker</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProperties.map((property) => (
                          <TableRow key={property.id} data-testid={`row-property-${property.id}`}>
                            <TableCell className="font-medium">{property.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {property.propertyType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {property.listingType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {property.priceMax ? (
                                `₹${property.priceMin.toLocaleString('en-IN')} - ₹${property.priceMax.toLocaleString('en-IN')}`
                              ) : (
                                `₹${property.priceMin.toLocaleString('en-IN')}`
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{property.city}</div>
                                <div className="text-muted-foreground">{property.state}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {property.broker ? (
                                <div className="text-sm">
                                  <div className="font-medium">{property.broker.name}</div>
                                  <div className="text-muted-foreground">{property.broker.email}</div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {format(new Date(property.createdAt), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/property/${property.id}`}>
                                <Button variant="ghost" size="sm" data-testid={`button-view-property-${property.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-lg font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-lg">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-lg">{selectedLead.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <Badge variant="outline" className="capitalize mt-1">
                    {selectedLead.leadType.replace("_", " ")}
                  </Badge>
                </div>
                {selectedLead.budget && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                    <p className="text-lg font-semibold">₹{selectedLead.budget.toLocaleString('en-IN')}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="text-lg">{format(new Date(selectedLead.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                </div>
              </div>

              {selectedLead.property && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Related Property</Label>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-10 w-10 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedLead.property.title}</p>
                          <p className="text-sm text-muted-foreground">{selectedLead.property.location}, {selectedLead.property.city}</p>
                        </div>
                        <Link href={`/property/${selectedLead.property.id}`}>
                          <Button variant="outline" size="sm">
                            View Property
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Message / Requirements</Label>
                <Card>
                  <CardContent className="p-4">
                    <p className="whitespace-pre-wrap text-muted-foreground">{selectedLead.message || selectedLead.requirements || "No message provided"}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Update Status</Label>
                <Select
                  value={selectedLead.status}
                  onValueChange={(value) => handleStatusUpdate(selectedLead.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
