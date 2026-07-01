import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateGroupTitle } from "@/lib/request/updateGroupTitle";
import { updateGroupDescription } from "@/lib/request/updateGroupDescription";
import {
  createGroupLink,
  deleteGroupLink,
  updateGroupLink,
} from "@/lib/request/groupLinks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { normalizeUrl } from "@/lib/normalizeUrl";
import GroupLinkEditorTable, {
  EditableGroupLink,
} from "@/components/group/GroupLinkEditorTable";

type Props = {
  groupId?: string;
  title: string;
  ldapGroupName: string;
  desc: string;
  links?: { id?: string; title: string; url: string }[];
  editable?: boolean;
};

export default function GroupDescription({
  groupId,
  title,
  ldapGroupName,
  desc,
  links,
  editable = false,
}: Props) {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(desc);

  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [editedLinks, setEditedLinks] = useState<EditableGroupLink[]>(
    links ?? [],
  );
  const [newLink, setNewLink] = useState<EditableGroupLink>({
    title: "",
    url: "",
  });

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    setEditedDescription(desc);
  }, [desc]);

  useEffect(() => {
    setEditedLinks(links ?? []);
  }, [links]);

  const trimmedEditedTitle = editedTitle.trim();
  const isTitleInvalid = !trimmedEditedTitle;
  const isTitleUnchanged = trimmedEditedTitle === title.trim();

  const trimmedEditedDescription = editedDescription.trim();
  const isDescriptionInvalid = !trimmedEditedDescription;
  const isDescriptionUnchanged = trimmedEditedDescription === desc.trim();

  const hasIncompleteNewLink =
    (!!newLink.title.trim() || !!newLink.url.trim()) &&
    (!newLink.title.trim() || !newLink.url.trim());

  const hasInvalidEditedLinks = editedLinks.some(
    (link) => !link.title.trim() || !link.url.trim(),
  );

  const getLinksToSubmit = () => {
    const normalizedEditedLinks = editedLinks.map((link) => ({
      ...link,
      title: link.title.trim(),
      url: normalizeUrl(link.url),
    }));

    const shouldIncludeNewLink = newLink.title.trim() && newLink.url.trim();

    if (!shouldIncludeNewLink) {
      return normalizedEditedLinks;
    }

    return [
      ...normalizedEditedLinks,
      {
        title: newLink.title.trim(),
        url: normalizeUrl(newLink.url),
      },
    ];
  };

  const areLinksUnchanged = () => {
    const currentLinks = links ?? [];
    const linksToSubmit = getLinksToSubmit();

    if (currentLinks.length !== linksToSubmit.length) {
      return false;
    }

    return linksToSubmit.every((link) => {
      if (!link.id) {
        return false;
      }

      const originalLink = currentLinks.find((item) => item.id === link.id);

      return (
        originalLink &&
        originalLink.title.trim() === link.title &&
        normalizeUrl(originalLink.url) === link.url
      );
    });
  };

  const updateTitleMutation = useMutation({
    mutationFn: () => {
      if (!groupId) {
        throw new Error("Missing group ID");
      }

      return updateGroupTitle({
        groupId,
        payload: {
          title: trimmedEditedTitle,
        },
      });
    },
    onMutate: () => {
      toast.loading(t("groupPages.groupSettings.saving", "Saving..."), {
        id: "update-group-title",
      });
    },
    onSuccess: async () => {
      toast.success(
        t(
          "groupPages.groupSettings.updateTitleSuccessToast",
          "Group title updated successfully",
        ),
        {
          id: "update-group-title",
        },
      );

      setIsEditingTitle(false);

      if (groupId) {
        await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        await queryClient.invalidateQueries({ queryKey: ["groups"] });
      }
    },
    onError: (err) => {
      const message =
        err instanceof Error
          ? err.message
          : t(
              "groupPages.groupSettings.updateTitleFailToast",
              "Failed to update group title",
            );

      toast.error(message, {
        id: "update-group-title",
      });
    },
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: () => {
      if (!groupId) {
        throw new Error("Missing group ID");
      }

      return updateGroupDescription({
        groupId,
        payload: {
          description: trimmedEditedDescription,
        },
      });
    },
    onMutate: () => {
      toast.loading(t("groupPages.groupSettings.saving", "Saving..."), {
        id: "update-group-description",
      });
    },
    onSuccess: async () => {
      toast.success(
        t(
          "groupPages.groupSettings.updateDescriptionSuccessToast",
          "Group description updated successfully",
        ),
        {
          id: "update-group-description",
        },
      );

      setIsEditingDescription(false);

      if (groupId) {
        await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        await queryClient.invalidateQueries({ queryKey: ["groups"] });
      }
    },
    onError: (err) => {
      const message =
        err instanceof Error
          ? err.message
          : t(
              "groupPages.groupSettings.updateDescriptionFailToast",
              "Failed to update group description",
            );

      toast.error(message, {
        id: "update-group-description",
      });
    },
  });

  const updateLinksMutation = useMutation({
    mutationFn: async () => {
      if (!groupId) {
        throw new Error("Missing group ID");
      }

      const currentLinks = links ?? [];
      const linksToSubmit = getLinksToSubmit();

      const submittedLinkIds = new Set(
        linksToSubmit
          .map((link) => link.id)
          .filter((id): id is string => Boolean(id)),
      );

      const deleteRequests = currentLinks
        .filter((link) => link.id && !submittedLinkIds.has(link.id))
        .map((link) => deleteGroupLink(groupId, link.id as string));

      const createRequests = linksToSubmit
        .filter((link) => !link.id)
        .map((link) =>
          createGroupLink({
            groupId,
            payload: {
              title: link.title,
              url: link.url,
            },
          }),
        );

      const updateRequests = linksToSubmit
        .filter((link): link is EditableGroupLink & { id: string } =>
          Boolean(link.id),
        )
        .flatMap((link) => {
          const originalLink = currentLinks.find((item) => item.id === link.id);

          if (!originalLink) {
            return [];
          }

          const isUnchanged =
            originalLink.title.trim() === link.title &&
            normalizeUrl(originalLink.url) === link.url;

          if (isUnchanged) {
            return [];
          }

          return [
            updateGroupLink(groupId, link.id, {
              title: link.title,
              url: link.url,
            }),
          ];
        });

      await Promise.all([
        ...deleteRequests,
        ...createRequests,
        ...updateRequests,
      ]);
    },
    onMutate: () => {
      toast.loading(t("groupPages.groupSettings.saving", "Saving..."), {
        id: "update-group-links",
      });
    },
    onSuccess: async () => {
      toast.success(
        t(
          "groupPages.groupSettings.updateLinksSuccessToast",
          "Group links updated successfully",
        ),
        {
          id: "update-group-links",
        },
      );

      setIsEditingLinks(false);
      setNewLink({ title: "", url: "" });

      if (groupId) {
        await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        await queryClient.invalidateQueries({ queryKey: ["groups"] });
      }
    },
    onError: (err) => {
      const message =
        err instanceof Error
          ? err.message
          : t(
              "groupPages.groupSettings.updateLinksFailToast",
              "Failed to update group links",
            );

      toast.error(message, {
        id: "update-group-links",
      });
    },
  });

  const handleCancelTitle = () => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  };

  const handleSaveTitle = () => {
    if (
      !editable ||
      !groupId ||
      isTitleInvalid ||
      isTitleUnchanged ||
      updateTitleMutation.isPending
    ) {
      return;
    }

    updateTitleMutation.mutate();
  };

  const handleCancelDescription = () => {
    setEditedDescription(desc);
    setIsEditingDescription(false);
  };

  const handleSaveDescription = () => {
    if (
      !editable ||
      !groupId ||
      isDescriptionInvalid ||
      isDescriptionUnchanged ||
      updateDescriptionMutation.isPending
    ) {
      return;
    }

    updateDescriptionMutation.mutate();
  };

  const handleCancelLinks = () => {
    setEditedLinks(links ?? []);
    setNewLink({ title: "", url: "" });
    setIsEditingLinks(false);
  };

  const handleSaveLinks = () => {
    if (
      !editable ||
      !groupId ||
      hasInvalidEditedLinks ||
      hasIncompleteNewLink ||
      areLinksUnchanged() ||
      updateLinksMutation.isPending
    ) {
      return;
    }

    updateLinksMutation.mutate();
  };

  return (
    <Card className="gap-4 py-4 sm:gap-6 sm:py-6">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg font-bold">
          {isEditingTitle ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                disabled={updateTitleMutation.isPending}
                className="max-w-md"
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveTitle}
                  disabled={
                    isTitleInvalid ||
                    isTitleUnchanged ||
                    updateTitleMutation.isPending
                  }
                >
                  {updateTitleMutation.isPending
                    ? t("groupPages.groupSettings.saving", "Saving...")
                    : t("groupPages.addMemberPage.save", "Save")}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelTitle}
                  disabled={updateTitleMutation.isPending}
                >
                  {t("groupSettings.cancel", "Cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{title}</span>

              {editable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditingTitle(true)}
                  aria-label="Edit group title"
                >
                  <Pencil size={16} />
                </Button>
              )}
            </div>
          )}
        </CardTitle>
        <div className="text-sm text-muted-foreground">#{ldapGroupName}</div>
      </CardHeader>

      <CardContent className="space-y-2 px-4 sm:px-6">
        {isEditingDescription ? (
          <div className="space-y-2">
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              disabled={updateDescriptionMutation.isPending}
              className="min-h-[96px]"
            />

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveDescription}
                disabled={
                  isDescriptionInvalid ||
                  isDescriptionUnchanged ||
                  updateDescriptionMutation.isPending
                }
              >
                {updateDescriptionMutation.isPending
                  ? t("groupPages.groupSettings.saving", "Saving...")
                  : t("groupPages.addMemberPage.save", "Save")}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelDescription}
                disabled={updateDescriptionMutation.isPending}
              >
                {t("groupSettings.cancel", "Cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <p className="text-muted-foreground text-sm">{desc}</p>

            {editable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setIsEditingDescription(true)}
                aria-label="Edit group description"
              >
                <Pencil size={16} />
              </Button>
            )}
          </div>
        )}

        {(editable || (links && links.length > 0)) && (
          <>
            <div className="border-t border-gray-300" />

            <div className="pt-2">
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-sm text-muted-foreground">
                  {t("groupPages.createGroup.linkTitle")}
                </h4>

                {editable && !isEditingLinks && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsEditingLinks(true)}
                    aria-label="Edit group links"
                  >
                    <Pencil size={16} />
                  </Button>
                )}
              </div>

              {isEditingLinks ? (
                <div className="space-y-3">
                  <GroupLinkEditorTable
                    links={editedLinks}
                    newLink={newLink}
                    onLinksChange={setEditedLinks}
                    onNewLinkChange={setNewLink}
                    disabled={updateLinksMutation.isPending}
                  />

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveLinks}
                      disabled={
                        hasInvalidEditedLinks ||
                        hasIncompleteNewLink ||
                        areLinksUnchanged() ||
                        updateLinksMutation.isPending
                      }
                    >
                      {updateLinksMutation.isPending
                        ? t("groupPages.groupSettings.saving", "Saving...")
                        : t("groupPages.addMemberPage.save", "Save")}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelLinks}
                      disabled={updateLinksMutation.isPending}
                    >
                      {t("groupSettings.cancel", "Cancel")}
                    </Button>
                  </div>
                </div>
              ) : links && links.length > 0 ? (
                <ul className="space-y-1 text-muted-foreground text-sm">
                  {links.map((link, index) => (
                    <li key={link.id ?? index}>
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
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t("groupPages.groupSettings.noLinks", "No links yet.")}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
