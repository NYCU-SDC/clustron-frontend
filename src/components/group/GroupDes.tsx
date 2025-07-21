import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  desc: string;
  isArchived?: boolean;
};

export default function GroupDescription({ title, desc, isArchived }: Props) {
  return (
    <Card>
      <CardHeader
        className={`text-xl font-semibold ${
          isArchived ? "text-gray-400" : "text-gray-900"
        }`}
      >
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={`mt-1 text-sm ${isArchived ? "text-gray-300" : "text-gray-600"}`}
      >
        {desc}
      </CardContent>
    </Card>
  );
}
