import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  const routes = [
    "/",
    "/about",
    "/academies",
    "/gym",
    "/championships",
    "/courses",
    "/media",
    "/news",
    "/shop",
    "/cart",
    "/wishlist",
    "/checkout",
    "/orders",
    "/contact",
    "/verify",
    "/search",
    "/notifications",
    "/account",
    "/admin-login",
    "/admin",
  ];

  routes.forEach((path) => {
    it(`matches a page for ${path} instead of falling back to not found`, () => {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });
  });
});
