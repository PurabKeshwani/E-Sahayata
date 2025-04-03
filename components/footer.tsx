import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="text-xl font-bold">
              E-Sahayata
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Empowering NGOs through digital transformation with efficient form management solutions.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Forms</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/forms/beneficiary" className="text-sm text-muted-foreground hover:text-foreground">
                  Beneficiary Registration
                </Link>
              </li>
              <li>
                <Link href="/forms/volunteer" className="text-sm text-muted-foreground hover:text-foreground">
                  Volunteer Registration
                </Link>
              </li>
              <li>
                <Link href="/forms/feedback" className="text-sm text-muted-foreground hover:text-foreground">
                  Feedback & Suggestions
                </Link>
              </li>
              <li>
                <Link href="/forms/service" className="text-sm text-muted-foreground hover:text-foreground">
                  Service Request
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">123 NGO Street, Digital City</li>
              <li className="text-sm text-muted-foreground">info@esahayata.org</li>
              <li className="text-sm text-muted-foreground">+91 1234567890</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} E-Sahayata. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

