import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  desc: string;
  isArchived?: boolean;
  links?: { title: string; url: string }[];
};

export default function GroupDescription({
  title,
  desc,
  isArchived,
  links,
}: Props) {
  const { t } = useTranslation();
  return (
    <Card className={isArchived ? "opacity-50" : "opacity-100"}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {desc}
        </p>

        {links && links.length > 0 && (
          <>
            <div className="border-t border-gray-300" />
            <div className="pt-2">
              <h4 className="text-sm text-muted-foreground mb-2">
                {t("groupPages.createGroup.linkTitle")}
              </h4>
              <ul className="space-y-1 text-muted-foreground text-sm">
                {links.map((link, index) => (
                  <li key={index}>
                    <span className="text-muted-foreground text-sm">
                      {link.title}:{" "}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground underline break-all"
                    >
                      {link.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
