import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/request/api";
import { getGroups } from "@/lib/request/getGroups";

vi.mock("@/lib/request/api", () => ({
  api: vi.fn(),
}));

describe("getGroups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes every supported query parameter", async () => {
    vi.mocked(api).mockResolvedValue({ items: [] });

    await getGroups({
      page: 2,
      size: 25,
      sort: "desc",
      sortBy: "created_at",
    });

    expect(api).toHaveBeenCalledWith(
      "/api/groups?page=2&size=25&sort=desc&sortBy=created_at",
    );
  });

  it("omits the query string when no parameters are provided", async () => {
    vi.mocked(api).mockResolvedValue({ items: [] });

    await getGroups();

    expect(api).toHaveBeenCalledWith("/api/groups");
  });
});
