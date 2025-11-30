// src/pages/TestCrashComponent.tsx
import React from "react";

const TestCrashComponent: React.FC = () => {
  // 故意將一個變數設置為 null
  const crashData = null;

  // 嘗試讀取 null (或 undefined) 的屬性，在渲染時拋出 TypeError
  // 💥 Error Boundary 會捕捉到這裡的錯誤 💥
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>測試中...</h1>
      <p>如果看到這個訊息，表示錯誤尚未發生。</p>

      {/* 故意拋錯點 */}
      {/* @ts-ignore */}
      <p>開始崩潰：{crashData.trigger}</p>
    </div>
  );
};

export default TestCrashComponent;
