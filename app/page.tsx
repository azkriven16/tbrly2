import {
  CTASection,
  FeaturesSection,
  FooterSection,
  HeroSection,
} from "@/components/landing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
