import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "@/assets/react.svg";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50 dark:bg-black text-gray-900 dark:text-white p-4">
      <div className="flex gap-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="h-16 transition hover:scale-105"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="h-16 transition hover:scale-105"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-3xl font-bold">Vite + React</h1>

      <div className="flex flex-col items-center gap-2">
        <Button onClick={() => setCount(count + 1)}>count is {count}</Button>
        <p className="text-sm text-muted-foreground">
          Edit{" "}
          <code className="bg-muted px-1 py-0.5 rounded">
            src/pages/HomePage.tsx
          </code>{" "}
          and save to test HMR
        </p>
      </div>

      <p className="text-xs text-muted-foreground max-w-md text-center">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
