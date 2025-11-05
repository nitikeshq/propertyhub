import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle2, TrendingUp, Users, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // Redirect to broker dashboard (admin dashboard will be separate route)
      setLocation("/broker-dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
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
              Welcome back to India's trusted property platform
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Sign in to manage your properties, connect with buyers, and grow your real estate business.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Unlimited Property Listings</h3>
                <p className="text-sm text-primary-foreground/70">List residential, commercial properties and land with ease</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Lead Generation</h3>
                <p className="text-sm text-primary-foreground/70">Capture and manage qualified leads automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Secure Platform</h3>
                <p className="text-sm text-primary-foreground/70">Your data is protected with enterprise-grade security</p>
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

      {/* Right Side - Login Form */}
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
            <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
            <p className="text-muted-foreground mt-2">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                placeholder="broker@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              data-testid="button-login"
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New to PropertyHub?
                </span>
              </div>
            </div>

            <Link href="/register">
              <Button variant="outline" className="w-full h-11" data-testid="button-create-account">
                Create an account
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
