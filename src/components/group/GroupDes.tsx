import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  desc: string;
};

export default function GroupDescription({ title, desc }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-gray-600 text-sm whitespace-pre-line">{desc}</p>
      </CardContent>
    </Card>
  );
}
