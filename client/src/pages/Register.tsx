import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle2, Users, Briefcase, Home } from "lucide-react";
import { Link } from "wouter";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"broker" | "owner">("broker");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await register(email, password, name, role);
      toast({
        title: "Account created!",
        description: "Welcome to PropertyHub.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 text-primary-foreground">
        <div>
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer" data-testid="link-home-logo">
              <div className="h-12 w-12 bg-primary-foreground/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Building2 className="h-7 w-7" />
              </div>
              <span className="text-2xl font-bold">PropertyHub</span>
            </div>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Join thousands of property professionals
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Create your account and start listing properties, managing leads, and growing your business today.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Quick Setup</h3>
                <p className="text-sm text-primary-foreground/70">Get started in minutes with our simple onboarding</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Connect with Buyers</h3>
                <p className="text-sm text-primary-foreground/70">Reach thousands of potential buyers across India</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Professional Tools</h3>
                <p className="text-sm text-primary-foreground/70">Manage listings, leads, and analytics in one place</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 text-sm text-primary-foreground/60">
          <span>© 2024 PropertyHub</span>
          <Link href="/about">
            <span className="hover:text-primary-foreground cursor-pointer transition-colors">About</span>
          </Link>
          <Link href="/contact">
            <span className="hover:text-primary-foreground cursor-pointer transition-colors">Contact</span>
          </Link>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden">
            <Link href="/">
              <div className="flex items-center gap-3 mb-8 cursor-pointer" data-testid="link-home-logo-mobile">
                <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">PropertyHub</span>
              </div>
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground mt-2">
              Start managing your properties professionally
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                data-testid="input-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account type</Label>
              <Select value={role} onValueChange={(value: "broker" | "owner") => setRole(value)}>
                <SelectTrigger data-testid="select-role" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broker">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Property Broker</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="owner">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Property Owner</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              data-testid="button-register"
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link href="/login">
              <Button variant="outline" className="w-full h-11" data-testid="button-sign-in">
                Sign in instead
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors" data-testid="link-home">
                ← Back to home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
