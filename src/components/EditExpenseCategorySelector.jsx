import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/EditExpenseScreen.styles";

export default function EditExpenseCategorySelector({ categories, categoryId, setCategoryId, saving }) {
  return <>
    <View style={styles.category}>
            <View style={styles.amount2}>
              <View style={styles.category2}>
                <Ionicons name="grid-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category3}>
                Category
              </Text>
            </View>

            {categories.length === 0 ? (
              <View style={styles.category4}>
                <Ionicons
                  name="folder-open-outline"
                  size={30}
                  color="#A0AEC0"
                />
                <Text style={styles.screen2}>
                  No categories available.
                </Text>
              </View>
            ) : (
              <View style={styles.category5}>
                {categories.map((category) => {
                  const selected = categoryId === category.id;

                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[styles.category6, selected
                          ? styles.categoryState
                          : styles.categoryState2]}
                      onPress={() => setCategoryId(category.id)}
                      disabled={saving}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`${category.name} category`}
                      accessibilityState={{
                        selected,
                        disabled: saving,
                      }}
                    >
                      <View
                        style={[styles.category7, selected ? styles.categoryState3 : styles.categoryState4]}
                      >
                        <Text style={styles.category8}>{category.icon ?? "📁"}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.category9, selected ? styles.categoryState5 : styles.categoryState6]}
                      >
                        {category.name}
                      </Text>

                      {selected && (
                        <View style={styles.category10}>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#FFFFFF"
                          />
                          <Text style={styles.category11}>
                            Selected
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
  </>;
}
