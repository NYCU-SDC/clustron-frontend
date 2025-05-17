import { mockGroups } from "@/lib/mockGroups";

export type MemberResponse = {
  id: string;
  title: string;
  description: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  me: {
    role: {
      id: string;
      role: string;
      accessLevel: "admin" | "organizer" | "groupAdmin" | "user";
    };
  };
};

export type Paginated<T> = {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

export async function getMember(
  groupId: string,
  page: number = 1,
  size: number = 10,
): Promise<Paginated<MemberResponse>> {
  await new Promise((r) => setTimeout(r, 300)); // 模擬延遲

  const group = mockGroups.find((g) => g.id === groupId);
  if (!group) throw new Error("Group not found");

  const all: MemberResponse[] = group.members.map((m) => ({
    id: m.id,
    title: m.username, // mock title
    description: m.email, // mock description
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    me: {
      role: {
        id: `role-${m.id}`,
        role: m.role,
        accessLevel: m.accessLevel,
      },
    },
  }));

  const totalItems = all.length;
  const totalPages = Math.ceil(totalItems / size);
  const start = (page - 1) * size;
  const items = all.slice(start, start + size);

  return {
    items,
    totalPages,
    totalItems,
    currentPage: page,
    pageSize: size,
    hasNextPage: page < totalPages,
  };
}
