import { Card, CardContent } from "@/components/ui/card";

export default function StateCard({
  value,
  label,
}: {
  value?: number;
  label: string;
}) {
  return (
    <Card className="w-[220px] rounded-xl">
      <CardContent className="p-6">
        <div className="text-3xl font-semibold leading-none">
          {value ?? "—"}
        </div>
        <div className="mt-2 text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
