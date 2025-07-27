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

  if (userId) redirect("/tbr");

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
