import MemberDeleteMenu from "./MemberActionMenu";

type Props = {
  name: string;
  id: string;
  email: string;
  dept: string;
  role: string;
  onDelete: () => void;
};

export default function GroupMemberRow({
  name,
  id,
  email,
  dept,
  role,
  onDelete,
}: Props) {
  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2">{name}</td>
      <td className="py-2">{id || email}</td>
      <td className="py-2">{dept}</td>
      <td className="py-2">{role}</td>
      <td className="py-2 text-right pr-4">
        <MemberDeleteMenu onConfirm={onDelete} />
      </td>
    </tr>
  );
}
