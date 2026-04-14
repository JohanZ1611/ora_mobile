import { ScrollView, Pressable, Text, View } from "react-native";

export type FilterType = "all" | "INCOME" | "EXPENSE" | "group";

interface Props {
  active: FilterType;
  onChange: (f: FilterType) => void;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "Todos", value: "all" },
  { label: "Ingresos", value: "INCOME" },
  { label: "Egresos", value: "EXPENSE" },
  { label: "Grupos", value: "group" },
];

export function FilterChips({ active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingHorizontal: 20, 
        alignItems: "center", // ESTO EVITA QUE SE ESTIREN
        gap: 10 
      }}
    >
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <Pressable
            key={f.value}
            onPress={() => onChange(f.value)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 50,
              backgroundColor: isActive ? "#71573b" : "#EDE8DF",
            }}
          >
            <Text style={{
              fontFamily: "DMSans_600SemiBold",
              fontSize: 13,
              color: isActive ? "#fff" : "#4e453d",
            }}>
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}