import type { Option, OptionGroup } from "@/src/models";
import React from "react";
import { Text, View } from "react-native";
import { OptionItem } from "./option-item";

interface OptionGroupSelectorProps {
  group: OptionGroup & { options: Option[] };
  selectedOptionIds: string[];
  onOptionToggle: (optionId: string) => void;
}

/**
 * OptionGroupSelector - Composant pour afficher un groupe d'options
 * Gère la sélection unique ou multiple selon le groupe
 */
export function OptionGroupSelector({
  group,
  selectedOptionIds,
  onOptionToggle,
}: OptionGroupSelectorProps) {
  return (
    <View className="mb-6">
      {/* En-tête du groupe */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-secondary-900">
          {group.name}
        </Text>
        {group.is_required && (
          <View className="rounded-full bg-error-100 px-3 py-1">
            <Text className="text-xs font-bold text-error-700">REQUIS</Text>
          </View>
        )}
      </View>

      {/* Description */}
      {group.description && (
        <Text className="mb-3 text-sm text-secondary-600">
          {group.description}
        </Text>
      )}

      {/* Instructions de sélection */}
      {group.allow_multiple ? (
        <Text className="mb-4 text-sm text-secondary-500">
          {group.min_selections > 0
            ? `Choisissez entre ${group.min_selections} et ${group.max_selections || "plusieurs"} options`
            : `Choisissez jusqu'à ${group.max_selections || "plusieurs"} options`}
        </Text>
      ) : (
        <Text className="mb-4 text-sm text-secondary-500">
          Choisissez une option
        </Text>
      )}

      {/* Liste des options */}
      <View>
        {group.options.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            isSelected={selectedOptionIds.includes(option.id)}
            isMultiple={group.allow_multiple}
            onPress={() => onOptionToggle(option.id)}
          />
        ))}
      </View>
    </View>
  );
}
