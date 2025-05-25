import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  desc: string;
};

export default function GroupDescription({ title, desc }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="whitespace-pre-line text-sm text-muted-foreground">
        {desc}
      </CardContent>
    </Card>
  );
}
