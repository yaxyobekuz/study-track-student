// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { testBindingsAPI } from "@/features/tests/api/tests.api";
import { testSeasonsAPI } from "@/features/tests/api/testSeasons.api";
import { testResultsAPI } from "@/features/grading/api/testResults.api";

/**
 * Key factory for the `tests` feature. Only the genuinely `["tests", ...]`-prefixed
 * keys use this (e.g. the available-tests cache the submit mutation invalidates).
 *
 * The student-facing reads below historically use their own ad-hoc top-level keys
 * (`["bindings", "available"]`, `["my-results"]`, `["season-standings", ...]`, etc.).
 * Those are PRESERVED verbatim — moving them under `tests` would change the cache
 * identity and break invalidation, so they intentionally stay as literal arrays.
 */
export const testsKeys = createQueryKeys("tests");

export const testsQueries = {
  /** Tests the student can currently take (published bindings). */
  availableBindings: () =>
    queryOptions({
      queryKey: ["bindings", "available"],
      queryFn: () =>
        testBindingsAPI.getAvailable().then((res) => res.data.data),
    }),

  /** All of the student's own test results ("Natijalar" tab). */
  myResults: () =>
    queryOptions({
      queryKey: ["my-results"],
      queryFn: () => testResultsAPI.getMy().then((res) => res.data.data),
    }),

  /** A single result of the student, with answers + grading breakdown. */
  myResult: (id) =>
    queryOptions({
      queryKey: ["my-result", id],
      queryFn: () => testResultsAPI.getOne(id).then((res) => res.data.data),
    }),

  /** Active seasons list (season rewards entry point). */
  activeSeasons: () =>
    queryOptions({
      queryKey: ["test-seasons", "active"],
      queryFn: () => testSeasonsAPI.getActive().then((res) => res.data.data),
    }),

  /** A single season (rewards page). Note: the API swallows errors → null. */
  season: (seasonId) =>
    queryOptions({
      queryKey: ["test-season", seasonId],
      queryFn: () =>
        testSeasonsAPI.getOne(seasonId).then((res) => res?.data?.data),
    }),

  /** The student's own stats within a season ("Siz" tab). */
  seasonMyStats: (seasonId) =>
    queryOptions({
      queryKey: ["season-my-stats", seasonId],
      queryFn: () =>
        testSeasonsAPI.getMyStats(seasonId).then((res) => res.data.data),
    }),

  /** Class-scoped standings within a season ("Sinf" tab). */
  seasonClassStandings: (seasonId, classId) =>
    queryOptions({
      queryKey: ["season-standings", seasonId, "class", classId],
      queryFn: () =>
        testSeasonsAPI
          .getClassStats(seasonId, classId)
          .then((res) => res.data.data),
      enabled: Boolean(classId),
    }),

  /** School-wide standings within a season ("Maktab" tab). */
  seasonSchoolStandings: (seasonId) =>
    queryOptions({
      queryKey: ["season-standings", seasonId, "school"],
      queryFn: () =>
        testSeasonsAPI.getStats(seasonId).then((res) => res.data.data),
    }),
};
