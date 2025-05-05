type Props = {
  title: string;
};

export default function GroupSideBarTEMP({ title }: Props) {
  return (
    <aside className="w-64 border-r p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-2 text-gray-700">
        <li className="font-medium">Overview</li>
        <li className="text-gray-500">Group Settings</li>
      </ul>
    </aside>
  );
}
