// import React from "react"
import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="items-center justify-center">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <Button onClick={() => setCount((count) => count + 1)} variant="default">
        count is {count}
      </Button>

      <p>
        Edit <code>src/pages/Home.tsx</code> and save to test HMR
      </p>

      <p className="bg-chart-3">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
