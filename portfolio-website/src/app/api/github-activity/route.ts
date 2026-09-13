import { NextResponse } from "next/server";

const GITHUB_USERNAME = "voidomin";
const WEEKS_TO_SHOW = 14;

// This is the site owner's own slow-changing activity data, not real-time —
// no need to hit GitHub's API on every page load.
export const revalidate = 21600; // 6 hours

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: { contributionDays: ContributionDay[] }[];
        };
      };
    };
  };
}

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

// Purely decorative — any failure (missing token, non-OK response, timeout,
// unexpected shape) falls back to an empty list rather than a 500, matching
// the same fail-soft philosophy as the admin CMS's reverse-geocode call.
export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ days: [] });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USERNAME } }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return NextResponse.json({ days: [] });
    }

    const json: GitHubGraphQLResponse = await res.json();
    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    const days = weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => ({ date: day.date, count: day.contributionCount }))
      .slice(-WEEKS_TO_SHOW * 7);

    return NextResponse.json({ days });
  } catch {
    return NextResponse.json({ days: [] });
  } finally {
    clearTimeout(timeout);
  }
}
