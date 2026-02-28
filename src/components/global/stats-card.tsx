import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function StatsCard({
  label,
  stat,
  description,
}: {
  label: string;
  stat: string;
  description: string;
}) {
  return (
    <Card className="@container/card shadow-none border-primary/20 w-full h-full flex flex-col justify-between transition-colors cursor-pointer bg-linear-to-b from-card to-primary/20 ">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-3xl">
          {stat}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">{description}</div>
      </CardFooter>
    </Card>
  );
}
