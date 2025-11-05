import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { InsertLead } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Palette, CheckCircle, ArrowLeft } from "lucide-react";

export default function InteriorDesign() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    requirements: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      return await apiRequest("POST", "/api/leads", data);
    },
    onSuccess: () => {
      toast({
        title: "Request submitted!",
        description: "Our interior design team will contact you soon.",
      });
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
    onError: () => {
      toast({
        title: "Failed to submit request",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      leadType: "interior_design",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      budget: formData.budget ? parseInt(formData.budget) : undefined,
      requirements: formData.requirements,
      message: formData.requirements,
      status: "new",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-muted-foreground mb-8">
              Your interior design consultation request has been received. Our team will contact you within 24 hours.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-6 py-20">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center">
                <Palette className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-bold">Interior Design Services</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Transform your space with our professional interior design consultation. From concept to completion, we bring your vision to life.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Services Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
              <div className="space-y-4">
                {[
                  "Complete space planning and layout design",
                  "Color consultation and material selection",
                  "Custom furniture and decor recommendations",
                  "3D visualization and mood boards",
                  "Project management and vendor coordination",
                  "Budget-conscious solutions tailored to your needs",
                ].map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{service}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Our Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold mb-1">1. Initial Consultation</div>
                  <p className="text-sm text-muted-foreground">We discuss your vision, requirements, and budget</p>
                </div>
                <div>
                  <div className="font-semibold mb-1">2. Design Concept</div>
                  <p className="text-sm text-muted-foreground">We create mood boards and present design options</p>
                </div>
                <div>
                  <div className="font-semibold mb-1">3. Implementation</div>
                  <p className="text-sm text-muted-foreground">We manage the entire project from start to finish</p>
                </div>
                <div>
                  <div className="font-semibold mb-1">4. Final Reveal</div>
                  <p className="text-sm text-muted-foreground">Your beautiful new space is ready to enjoy</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Request a Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      data-testid="input-name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      data-testid="input-email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      data-testid="input-phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range (INR)</Label>
                    <Input
                      id="budget"
                      data-testid="input-budget"
                      type="number"
                      placeholder="10000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Project Requirements</Label>
                    <Textarea
                      id="requirements"
                      data-testid="textarea-requirements"
                      placeholder="Tell us about your space, style preferences, timeline, and any specific requirements..."
                      rows={6}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    data-testid="button-submit"
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Submitting..." : "Request Consultation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
