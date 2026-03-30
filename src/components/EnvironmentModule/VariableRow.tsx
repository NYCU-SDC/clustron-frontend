import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

export interface VariableRowProps {
  variableKey: string;
  variableValue: string;
  isLastRow: boolean;
  onKeyChange: (newKey: string) => void;
  onValueChange: (newValue: string) => void;
  onAdd: () => void;
  onRemove: () => void;
}

export function VariableRow({
  variableKey,
  variableValue,
  isLastRow,
  onKeyChange,
  onValueChange,
  onAdd,
  onRemove,
}: VariableRowProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-3 items-center">
      <Input
        placeholder={t("jobSubmitForm.envVarPlaceholder", "Variable")}
        value={variableKey}
        onChange={(e) => onKeyChange(e.target.value)}
      />

      <Input
        placeholder={t("jobSubmitForm.envValPlaceholder", "Value")}
        value={variableValue}
        onChange={(e) => onValueChange(e.target.value)}
      />

      <div className="flex items-center gap-2">
        {isLastRow ? (
          <Button
            type="button"
            variant="ghost"
            className="px-2"
            onClick={onAdd}
            aria-label="add env var"
          >
            <PlusCircledIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="px-2"
            onClick={onRemove}
            aria-label="remove env var"
          >
            <MinusCircledIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
