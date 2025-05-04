// components/group/GroupLayout.tsx
export default function GroupSideBarTEMP({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 border-r p-6">
        <h2 className="text-xl font-semibold mb-4">Group 1 Title</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="font-medium">Overview</li>
          <li className="text-gray-500">Group Settings</li>
        </ul>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
