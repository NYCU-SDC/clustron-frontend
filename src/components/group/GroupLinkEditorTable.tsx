import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeUrl } from "@/lib/normalizeUrl";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export type EditableGroupLink = {
  id?: string;
  title: string;
  url: string;
};

type Props = {
  links: EditableGroupLink[];
  newLink: EditableGroupLink;
  onLinksChange: (links: EditableGroupLink[]) => void;
  onNewLinkChange: (link: EditableGroupLink) => void;
  disabled?: boolean;
};

export default function GroupLinkEditorTable({
  links,
  newLink,
  onLinksChange,
  onNewLinkChange,
  disabled = false,
}: Props) {
  const { t } = useTranslation();

  const handleUpdateLink = (
    index: number,
    key: "title" | "url",
    value: string,
  ) => {
    const next = [...links];

    next[index] = {
      ...next[index],
      [key]: value,
    };

    onLinksChange(next);
  };

  const handleAddLink = () => {
    const title = newLink.title.trim();
    const url = normalizeUrl(newLink.url);

    if (!title || !url) {
      return;
    }

    onLinksChange([...links, { title, url }]);
    onNewLinkChange({ title: "", url: "" });
  };

  const handleRemoveLink = (index: number) => {
    onLinksChange(links.filter((_, i) => i !== index));
  };

  return (
    <Table className="min-w-lg table-fixed sm:min-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%] text-gray-500 dark:text-white">
            {t("groupPages.createGroup.title")}
          </TableHead>
          <TableHead className="w-[60%] text-gray-500 dark:text-white">
            {t("groupPages.createGroup.URL")}
          </TableHead>
          <TableHead className="w-[15%]" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {links.map((link, index) => (
          <TableRow key={link.id ?? index} className="hover:bg-muted">
            <TableCell>
              <Input
                placeholder={t("groupPages.createGroup.title")}
                value={link.title}
                disabled={disabled}
                onChange={(e) =>
                  handleUpdateLink(index, "title", e.target.value)
                }
              />
            </TableCell>

            <TableCell>
              <Input
                placeholder={t("groupPages.createGroup.URL")}
                value={link.url}
                disabled={disabled}
                onChange={(e) => handleUpdateLink(index, "url", e.target.value)}
              />

              {link.url.trim() && (
                <div className="text-xs text-muted-foreground break-all overflow-hidden">
                  <a
                    href={normalizeUrl(link.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all block"
                  >
                    {normalizeUrl(link.url)}
                  </a>
                </div>
              )}
            </TableCell>

            <TableCell className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveLink(index)}
                disabled={disabled}
              >
                <CircleMinus size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell>
            <Input
              placeholder={t("groupPages.createGroup.title")}
              value={newLink.title}
              disabled={disabled}
              onChange={(e) =>
                onNewLinkChange({
                  ...newLink,
                  title: e.target.value,
                })
              }
            />
          </TableCell>

          <TableCell>
            <Input
              placeholder={t("groupPages.createGroup.URL")}
              value={newLink.url}
              disabled={disabled}
              onChange={(e) =>
                onNewLinkChange({
                  ...newLink,
                  url: e.target.value,
                })
              }
            />

            {newLink.url.trim() && (
              <div className="text-xs text-muted-foreground break-all overflow-hidden">
                <a
                  href={normalizeUrl(newLink.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all block"
                >
                  {normalizeUrl(newLink.url)}
                </a>
              </div>
            )}
          </TableCell>

          <TableCell className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddLink}
              disabled={
                disabled || !newLink.title.trim() || !newLink.url.trim()
              }
            >
              <CirclePlus size={16} />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
