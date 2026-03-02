import { vi, beforeEach, afterEach, describe, expect, it } from "vitest";
import { api } from "./api";
import * as tokenModule from "@/lib/token";

// Mock the token module
vi.mock("@/lib/token");

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the environment variable at the module level
vi.mock("import.meta", () => ({
  env: {
    VITE_BACKEND_BASE_URL: "https://api.example.com",
  },
}));

const mockGetAccessToken = vi.mocked(tokenModule.getAccessToken);

describe("api function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful requests", () => {
    it("should make a GET request with default options", async () => {
      const mockResponseData = { id: 1, name: "test" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue(null);

      const result = await api("/test");

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/test"), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(result).toEqual(mockResponseData);
    });

    it("should include Authorization header when token is available", async () => {
      const mockResponseData = { id: 1, name: "test" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue("test-token");

      await api("/test");

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/test"), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
      });
    });

    it("should merge custom headers with default headers", async () => {
      const mockResponseData = { id: 1, name: "test" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue("test-token");

      await api("/test", {
        headers: {
          "X-Custom-Header": "custom-value",
          "Content-Type": "application/xml", // Should override default
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/test"), {
        headers: {
          "Content-Type": "application/xml",
          "X-Custom-Header": "custom-value",
          Authorization: "Bearer test-token",
        },
      });
    });

    it("should pass through other RequestInit options", async () => {
      const mockResponseData = { id: 1, name: "test" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue(null);

      const requestBody = JSON.stringify({ data: "test" });
      await api("/test", {
        method: "POST",
        body: requestBody,
        signal: new AbortController().signal,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          method: "POST",
          body: requestBody,
          signal: expect.any(AbortSignal),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    });

    it("should handle 204 No Content responses", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
      });
      mockGetAccessToken.mockReturnValue(null);

      const result = await api("/test");

      expect(result).toEqual({ message: "success" });
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/test"), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("should return parsed JSON for successful responses", async () => {
      const mockResponseData = { users: [{ id: 1 }, { id: 2 }] };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue(null);

      const result = await api<{ users: Array<{ id: number }> }>("/users");

      expect(result).toEqual(mockResponseData);
      expect(result.users).toHaveLength(2);
    });
  });

  describe("error handling", () => {
    it("should throw error for non-ok responses with default error message", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      });
      mockGetAccessToken.mockReturnValue(null);

      await expect(api("/not-found")).rejects.toThrow("API Error (404)");

      const thrownError = await api("/not-found").catch((err) => err as Error);
      expect((thrownError as Error).name).toBe("404");
      expect(console.error).toHaveBeenCalledWith(
        "❌ [api] Error:",
        "API Error (404)",
      );
    });

    it("should throw error with custom error message from response", async () => {
      const errorResponse = {
        status: 400,
        detail: "Invalid request data",
      };
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue(errorResponse),
      });
      mockGetAccessToken.mockReturnValue(null);

      await expect(api("/invalid")).rejects.toThrow("Invalid request data");

      const thrownError = await api("/invalid").catch((err) => err as Error);
      expect((thrownError as Error).name).toBe("400");
      expect(console.error).toHaveBeenCalledWith(
        "❌ [api] Error:",
        "Invalid request data",
      );
    });

    it("should use custom status from error response", async () => {
      const errorResponse = {
        status: 422,
        detail: "Validation failed",
      };
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue(errorResponse),
      });
      mockGetAccessToken.mockReturnValue(null);

      const thrownError = await api("/validation-error").catch(
        (err) => err as Error,
      );
      expect((thrownError as Error).name).toBe("422");
      expect((thrownError as Error).message).toBe("Validation failed");
    });

    it("should handle server errors (5xx)", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockRejectedValue(new Error("Server error")),
      });
      mockGetAccessToken.mockReturnValue(null);

      await expect(api("/server-error")).rejects.toThrow("API Error (500)");

      const thrownError = await api("/server-error").catch(
        (err) => err as Error,
      );
      expect((thrownError as Error).name).toBe("500");
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));
      mockGetAccessToken.mockReturnValue(null);

      await expect(api("/network-error")).rejects.toThrow("Network error");
    });

    it("should handle authorization errors", async () => {
      const errorResponse = {
        detail: "Unauthorized access",
      };
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue(errorResponse),
      });
      mockGetAccessToken.mockReturnValue("invalid-token");

      await expect(api("/protected")).rejects.toThrow("Unauthorized access");

      const thrownError = await api("/protected").catch((err) => err as Error);
      expect((thrownError as Error).name).toBe("401");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/protected"),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer invalid-token",
          },
        },
      );
    });

    it("should handle malformed error response JSON gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
      });
      mockGetAccessToken.mockReturnValue(null);

      await expect(api("/malformed-error")).rejects.toThrow("API Error (400)");

      const thrownError = await api("/malformed-error").catch(
        (err) => err as Error,
      );
      expect((thrownError as Error).name).toBe("400");
      expect(console.error).toHaveBeenCalledWith(
        "❌ [api] Error:",
        "API Error (400)",
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty path", async () => {
      const mockResponseData = { message: "root" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue(null);

      await api("");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.not.stringContaining("undefined"),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    });

    it("should handle path with query parameters", async () => {
      const mockResponseData = { results: [] };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue(null);

      await api("/search?q=test&limit=10");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/search?q=test&limit=10"),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    });

    it("should handle null/undefined headers in options", async () => {
      const mockResponseData = { id: 1 };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue(null);

      await api("/test", { headers: undefined });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/test"), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("should handle response with non-JSON content type but valid JSON", async () => {
      const mockResponseData = { message: "success" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });
      mockGetAccessToken.mockReturnValue(null);

      const result = await api("/test");

      expect(result).toEqual(mockResponseData);
    });
  });

  describe("TypeScript generics", () => {
    it("should work with typed responses", async () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockUser: User = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUser),
      });
      mockGetAccessToken.mockReturnValue(null);

      const result = await api<User>("/user/1");

      expect(result).toEqual(mockUser);
      expect(result.id).toBe(1);
      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john@example.com");
    });

    it("should work with array responses", async () => {
      interface Item {
        id: number;
        title: string;
      }

      const mockItems: Item[] = [
        { id: 1, title: "Item 1" },
        { id: 2, title: "Item 2" },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockItems),
      });
      mockGetAccessToken.mockReturnValue(null);

      const result = await api<Item[]>("/items");

      expect(result).toEqual(mockItems);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });
  });
});
