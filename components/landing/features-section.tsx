import { BookOpen, Star, Users, TrendingUp, Library, Book } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

export function FeaturesSection() {
  const features = [
    {
      icon: Library,
      title: "Organize Your TBR",
      description:
        "Keep track of books you want to read with categories, genres, and custom notes",
      highlightWord: "Organize",
    },
    {
      icon: BookOpen,
      title: "Track Progress",
      description:
        'Monitor your reading status from "Want to Read" to "Completed" with ease',
      highlightWord: "Track",
    },
    {
      icon: Star,
      title: "Rate & Review",
      description:
        "Give star ratings and write personal notes about your reading experience",
      highlightWord: "Rate",
    },
    {
      icon: TrendingUp,
      title: "Reading Stats",
      description:
        "Visualize your reading habits and track your progress over time",
      highlightWord: "Stats",
    },
    {
      icon: Users,
      title: "Multiple Formats",
      description:
        "Support for books, audiobooks, ebooks, graphic novels, and manga",
      highlightWord: "Multiple",
    },
    {
      icon: Book,
      title: "Genre Tracking",
      description:
        "Tag your books with genres and discover patterns in your reading preferences",
      highlightWord: "Genre",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-funnel text-3xl md:text-4xl font-bold mb-4 text-muted-foreground">
            Everything You Need to{" "}
            <span className="text-foreground">Manage</span> Your{" "}
            <span className="text-foreground">Books</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Simple, <span className="font-funnel text-primary">powerful</span>{" "}
            tools for book lovers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              highlightWord={feature.highlightWord}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
