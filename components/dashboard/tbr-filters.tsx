"use client";

import { useState, useMemo, useEffect } from "react";
import { Book, BOOK_CATEGORIES, BOOK_STATUSES } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

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
    let filtered = books.filter((book) => {
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
    filtered.sort((a, b) => {
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

    return filtered;
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search books by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
        />
      </div>

      {/* Filter Toggle and Clear */}
      <div className="flex items-center justify-between">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-white">
                      All Statuses
                    </SelectItem>
                    {BOOK_STATUSES.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="text-white"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-white">
                      All Categories
                    </SelectItem>
                    {BOOK_CATEGORIES.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-white"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Rating
                </label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-white">
                      All Ratings
                    </SelectItem>
                    <SelectItem value="rated" className="text-white">
                      Rated Books
                    </SelectItem>
                    <SelectItem value="unrated" className="text-white">
                      Unrated Books
                    </SelectItem>
                    <SelectItem value="high" className="text-white">
                      High Rated (4+)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="recent" className="text-white">
                      Recently Added
                    </SelectItem>
                    <SelectItem value="title" className="text-white">
                      Title A-Z
                    </SelectItem>
                    <SelectItem value="rating" className="text-white">
                      Rating (High to Low)
                    </SelectItem>
                    <SelectItem value="status" className="text-white">
                      Status
                    </SelectItem>
                    <SelectItem value="category" className="text-white">
                      Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Genre Filter */}
            {allGenres.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={
                        selectedGenres.includes(genre) ? "default" : "secondary"
                      }
                      className={`cursor-pointer transition-colors ${
                        selectedGenres.includes(genre)
                          ? "bg-blue-600 text-blue-100 hover:bg-blue-700"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge
              variant="outline"
              className="bg-gray-800 text-gray-300 border-gray-600"
            >
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge
              variant="outline"
              className="bg-gray-800 text-gray-300 border-gray-600"
            >
              Status: {selectedStatus}
              <button
                onClick={() => setSelectedStatus("all")}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge
              variant="outline"
              className="bg-gray-800 text-gray-300 border-gray-600"
            >
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="bg-gray-800 text-gray-300 border-gray-600"
            >
              Genre: {genre}
              <button
                onClick={() => handleGenreToggle(genre)}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredBooks.length} of {books.length} books
      </div>
    </div>
  );
};
