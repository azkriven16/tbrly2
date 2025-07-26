"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Book, BOOK_CATEGORIES, BOOK_STATUSES } from "@/db/schema";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface TBRFiltersProps {
  books: Book[];
  onFilteredBooksChange: (filteredBooks: Book[]) => void;
}

export const TBRFilters = ({
  books,
  onFilteredBooksChange,
}: TBRFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Extract all unique genres from books
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    books.forEach((book) => {
      if (book.genres) {
        book.genres.forEach((genre) => genres.add(genre));
      }
    });
    return Array.from(genres).sort();
  }, [books]);

  // Filter and sort books based on current filters
  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      // Search filter
      if (
        searchTerm &&
        !book.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && book.status !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && book.category !== selectedCategory) {
        return false;
      }

      // Genre filter
      if (selectedGenres.length > 0) {
        const hasSelectedGenre = selectedGenres.some((genre) =>
          book.genres?.includes(genre)
        );
        if (!hasSelectedGenre) return false;
      }

      // Rating filter
      if (ratingFilter !== "all") {
        if (ratingFilter === "rated" && !book.rating) return false;
        if (ratingFilter === "unrated" && book.rating) return false;
        if (ratingFilter === "high" && (!book.rating || book.rating < 4))
          return false;
      }

      return true;
    });

    // Sort books
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "status":
          return a.status.localeCompare(b.status);
        case "category":
          return a.category.localeCompare(b.category);
        case "recent":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return sorted;
  }, [
    books,
    searchTerm,
    selectedStatus,
    selectedCategory,
    selectedGenres,
    ratingFilter,
    sortBy,
  ]);

  // Update parent component when filtered books change
  useEffect(() => {
    onFilteredBooksChange(filteredBooks);
  }, [filteredBooks, onFilteredBooksChange]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedCategory("all");
    setSelectedGenres([]);
    setRatingFilter("all");
    setSortBy("recent");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedStatus !== "all" ||
    selectedCategory !== "all" ||
    selectedGenres.length > 0 ||
    ratingFilter !== "all" ||
    sortBy !== "recent";

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search books by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Filter Toggle and Clear */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-center sm:justify-start bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${
                  isFiltersOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              {/* Mobile-first: Stack filters vertically, then responsive grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {BOOK_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {BOOK_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="rated">Rated Books</SelectItem>
                      <SelectItem value="unrated">Unrated Books</SelectItem>
                      <SelectItem value="high">High Rated (4+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recently Added</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="rating">
                        Rating (High to Low)
                      </SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Genre Filter */}
              {allGenres.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant={
                          selectedGenres.includes(genre)
                            ? "default"
                            : "secondary"
                        }
                        className={`cursor-pointer transition-colors text-xs px-3 py-1 min-h-[32px] ${
                          selectedGenres.includes(genre)
                            ? "bg-blue-600 text-blue-100 hover:bg-blue-700"
                            : "border hover:bg-secondary/80"
                        }`}
                        onClick={() => handleGenreToggle(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full sm:w-auto bg-transparent"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Active Filters:
          </div>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="outline" className="text-xs">
                Search: &quot;{searchTerm}&quot;
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedStatus !== "all" && (
              <Badge variant="outline" className="text-xs">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus("all")}
                  className="ml-2 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="outline" className="text-xs">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-2 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedGenres.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                Genre: {genre}
                <button
                  onClick={() => handleGenreToggle(genre)}
                  className="ml-2 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
        Showing {filteredBooks.length} of {books.length} books
      </div>
    </div>
  );
};
