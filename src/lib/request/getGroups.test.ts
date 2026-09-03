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

  it("requests the selected page", async () => {
    vi.mocked(api).mockResolvedValue({ items: [] });

    await getGroups(2);

    expect(api).toHaveBeenCalledWith("/api/groups?page=2");
  });

  it("requests the first page by default", async () => {
    vi.mocked(api).mockResolvedValue({ items: [] });

    await getGroups();

    expect(api).toHaveBeenCalledWith("/api/groups?page=0");
  });
});
