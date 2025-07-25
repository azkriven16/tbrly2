import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlightWord?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  highlightWord,
}: FeatureCardProps) {
  const renderTitle = () => {
    if (!highlightWord) return title;

    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="font-dancing-script text-primary">
          {highlightWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <Icon className="h-12 w-12 text-primary mb-4" />
        <CardTitle>{renderTitle()}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
