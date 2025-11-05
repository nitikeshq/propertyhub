import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PropertyHub</h3>
            <p className="text-muted-foreground">
              India's premier real estate platform connecting brokers and buyers across major cities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Brokers</h4>
            <div className="space-y-2 text-muted-foreground">
              <Link href="/login">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-login">
                  Login
                </span>
              </Link>
              <Link href="/register">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-register">
                  Register
                </span>
              </Link>
              <Link href="/broker">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-dashboard">
                  Dashboard
                </span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="space-y-2 text-muted-foreground">
              <Link href="/properties">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-browse">
                  Find Properties
                </span>
              </Link>
              <Link href="/interior-design">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-interior">
                  Interior Design
                </span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-muted-foreground">
              <Link href="/about">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-about">
                  About Us
                </span>
              </Link>
              <Link href="/contact">
                <span className="block hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-contact">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 PropertyHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
