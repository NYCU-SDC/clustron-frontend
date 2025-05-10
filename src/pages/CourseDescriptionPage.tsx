// src/pages/CourseDescriptionPage.tsx
import { useParams } from "react-router-dom";
import { useGroupContext } from "@/context/GroupContext";
import GroupDescription from "@/components/group/GroupDes";

export default function CourseDescriptionPage() {
  const { groups } = useGroupContext();
  const { id } = useParams();

  const group = groups.find((g) => g.id === id);

  if (!group) return <div className="p-6">找不到課程</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <GroupDescription title={group.title} desc={group.description} />
    </div>
  );
}
