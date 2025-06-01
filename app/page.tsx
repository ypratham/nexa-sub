"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="flex items-center">
                <Image src={"/logo.png"} alt="" width={200} height={200} />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Manage All Your{" "}
                <span className="text-blue-600">Subscriptions</span> in One
                Place
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Take control of your recurring expenses with our comprehensive
                subscription management dashboard. Track spending, manage
                renewals, and optimize your budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg w-full sm:w-auto"
                  >
                    Start For Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
              <div className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-blue-600 h-16 flex items-center px-6">
                  <h3 className="text-white font-medium">
                    Subscription Dashboard
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Monthly Spending</p>
                      <p className="text-2xl font-bold">$58.97</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Active Subscriptions
                      </p>
                      <p className="text-2xl font-bold">7</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Netflix", price: "$14.99", date: "May 15" },
                      { name: "Spotify", price: "$9.99", date: "May 20" },
                      { name: "Adobe CC", price: "$19.99", date: "May 27" },
                    ].map((sub, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{sub.name}</p>
                          <p className="text-xs text-gray-500">
                            Renews {sub.date}
                          </p>
                        </div>
                        <p className="font-bold">{sub.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Subscriptions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NexaSub provides all the tools you need to take control of your
              recurring expenses and optimize your budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Calendar View</h3>
                <p className="text-gray-600">
                  See all your upcoming renewals in an intuitive calendar
                  interface. Never miss a payment or get surprised by a charge
                  again.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <DollarSign className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Budget Tracking</h3>
                <p className="text-gray-600">
                  Set monthly budgets and track your spending across all
                  subscriptions. Get alerts when you're approaching your limit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Spending Analytics</h3>
                <p className="text-gray-600">
                  Visualize your spending patterns with detailed charts and
                  reports. Identify opportunities to optimize your
                  subscriptions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How NexaSub Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is easy. Follow these simple steps to take control
              of your subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up for free and set up your profile with your monthly
                subscription budget.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Add Your Subscriptions</h3>
              <p className="text-gray-600">
                Enter your subscription details or connect your accounts to
                automatically import them.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Optimize Your Spending</h3>
              <p className="text-gray-600">
                Get insights and recommendations to reduce costs and manage your
                subscriptions more effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who are taking control of their
              subscription expenses with NexaSub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "NexaSub helped me discover I was spending over $200 on subscriptions I barely used. I've cut that in half!",
                author: "Sarah T.",
                role: "Marketing Manager",
              },
              {
                quote:
                  "The calendar view is a game-changer. I never miss a renewal date now, and I can plan my budget accordingly.",
                author: "Michael R.",
                role: "Software Developer",
              },
              {
                quote:
                  "As someone with dozens of subscriptions, NexaSub has been invaluable for keeping everything organized in one place.",
                author: "Jessica K.",
                role: "Content Creator",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <p className="italic text-gray-600 mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Pricing */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start for free, no credit card required. Upgrade when you need more features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-gray-500 mb-2">Free</p>
                <h3 className="text-4xl font-bold mb-4">
                  $0<span className="text-lg text-gray-500 font-normal">/month</span>
                </h3>
                <p className="text-gray-600 mb-6">Perfect for individuals just getting started.</p>
                <ul className="space-y-3 mb-8">
                  {["Up to 10 subscriptions", "Basic calendar view", "Monthly spending summary"].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-gray-500 mb-2">Pro</p>
                <h3 className="text-4xl font-bold mb-4">
                  $4.99<span className="text-lg text-gray-500 font-normal">/month</span>
                </h3>
                <p className="text-gray-600 mb-6">For users with multiple subscriptions.</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited subscriptions",
                    "Advanced calendar view",
                    "Detailed analytics",
                    "Budget alerts",
                    "Subscription recommendations",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-gray-500 mb-2">Family</p>
                <h3 className="text-4xl font-bold mb-4">
                  $9.99<span className="text-lg text-gray-500 font-normal">/month</span>
                </h3>
                <p className="text-gray-600 mb-6">Share with up to 5 family members.</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "All Pro features",
                    "Up to 5 user accounts",
                    "Shared subscriptions",
                    "Family budget planning",
                    "Priority support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Subscriptions?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are saving money and managing their
            subscriptions more effectively with NexaSub.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
              Get Started For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NexaSub</h3>
              <p className="text-gray-400">
                The complete subscription management platform for individuals
                and families.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ"].map(
                  (item, i) => (
                    <li key={i}>
                      <Link href="#" className="text-gray-400 hover:text-white">
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (item, i) => (
                    <li key={i}>
                      <Link href="#" className="text-gray-400 hover:text-white">
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2023 NexaSub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Twitter", "Facebook", "Instagram", "LinkedIn"].map(
                (social, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="text-gray-400 hover:text-white"
                  >
                    {social}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
