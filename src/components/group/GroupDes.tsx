import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  desc: string;
  isArchived?: boolean;
};

export default function GroupDescription({ title, desc, isArchived }: Props) {
  return (
    <Card className={`${isArchived ? "opacity-50" : "opacity-100"}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{desc}</CardContent>
    </Card>
  );
}
