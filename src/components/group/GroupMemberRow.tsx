import MemberDeleteMenu from "./MemberActionMenu";

type Props = {
  name: string;
  id: string;
  email: string;
  dept: string;
  role: string;
  onDelete?: () => void;
  showActions?: boolean;
  isArchived?: boolean;
};

export default function GroupMemberRow({
  name,
  id,
  email,
  dept,
  role,
  onDelete,
  showActions = false,
  isArchived = false,
}: Props) {
  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2">{name}</td>
      <td className="py-2">
        <div className="flex flex-col">
          <span className="font-medium">{id}</span>
          <span className="text-gray-500 text-xs">{email}</span>
        </div>
      </td>
      <td className="py-2">{dept}</td>
      <td className="py-2">{role}</td>

      {showActions && (
        <td className="py-2 text-right pr-4">
          <MemberDeleteMenu onConfirm={onDelete!} isArchived={isArchived} />
        </td>
      )}
    </tr>
  );
}
