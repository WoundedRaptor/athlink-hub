import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { SearchView } from "@/views/search-view";

const searchSchema = z.object({
  sport: fallback(z.string(), "").default(""),
  age: fallback(z.enum(["U10", "U12", "U14", "HS", "All"]), "All").default("All"),
  location: fallback(z.string(), "").default(""),
  need: fallback(
    z.enum(["skills", "strength", "recovery", "gear", "camps", "facility"]).optional(),
    undefined,
  ).optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchView,
  head: () => ({
    meta: [
      { title: "Search providers — AthLink Hub" },
      {
        name: "description",
        content:
          "Filter local youth-athlete providers by sport, age group, location, and need.",
      },
    ],
  }),
});
