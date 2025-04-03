import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img2.png?height=1080&width=1920"
            alt="NGO team using digital devices"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Jeev Daya Sansthan
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Streamlining operations, reducing errors, and boosting efficiency with digital form-filling solutions.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/forms">
              <Button size="lg" className="bg-[#3B82F6] hover:bg-[#2563EB] transition-all">
                Explore Forms
              </Button>
            </Link>
            <Link href="/forms">
              <Button size="lg" className="bg-[#10B981] hover:bg-[#059669] transition-all">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About E-Sahayata</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                E-Sahayata is a digital initiative designed to streamline form management for NGOs across India. Our
                platform provides easy-to-use digital forms that replace traditional paper-based processes, reducing
                errors and improving efficiency.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                We work closely with NGOs to understand their unique needs and provide customized digital solutions that
                help them focus more on their mission and less on administrative tasks.
              </p>
              <div className="mt-8">
                <Link href="/about">
                  <Button className="bg-[#3B82F6] hover:bg-[#2563EB] transition-all">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/image.jpg?height=600&width=800"
                  alt="NGO volunteers using digital devices"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Digital Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide a comprehensive suite of digital form solutions tailored for NGOs
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Beneficiary Management",
                description: "Efficiently register and manage beneficiary data with our digital forms",
                icon: "👥",
              },
              {
                title: "Volunteer Coordination",
                description: "Streamline volunteer registration and assignment processes",
                icon: "🤝",
              },
              {
                title: "Donation Tracking",
                description: "Securely process and track donations with our digital forms",
                icon: "💰",
              },
              {
                title: "Event Management",
                description: "Simplify event registration and participant management",
                icon: "📅",
              },
              {
                title: "Service Requests",
                description: "Manage service requests and track their progress efficiently",
                icon: "🔧",
              },
              {
                title: "Feedback Collection",
                description: "Gather and analyze feedback to improve your services",
                icon: "📝",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{service.icon}</div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-2 flex-grow text-muted-foreground">{service.description}</p>
                <Link href="/forms" className="mt-4 text-sm font-medium text-primary hover:underline">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your NGO operations?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join hundreds of NGOs already using E-Sahayata to streamline their form management processes.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/forms">
                <Button size="lg" variant="secondary">
                  Explore Forms
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

