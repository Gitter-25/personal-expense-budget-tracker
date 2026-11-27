import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseCategorySelector({ styles, editing = false, loadCategories, categories, categoryId, setCategoryId, saving, loadingCategories = false }) {
  return <>
    <View style={styles.category}>
            <View style={editing ? styles.amount2 : styles.category2}>
              <View style={editing ? styles.category2 : styles.category3}>
                <Ionicons name="grid-outline" size={20} color="#1677F2" />
              </View>
              <Text style={editing ? styles.category3 : styles.category4}>
                Category
              </Text>
            </View>

            {loadingCategories ? (
              <View style={styles.category5}>
                <ActivityIndicator size="small" color="#1677F2" />
                <Text style={styles.category6}>
                  Loading categories...
                </Text>
              </View>
            ) : categories.length === 0 ? (
              editing ? (
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
              <View style={styles.category7}>
                <View style={styles.category8}>
                  <Ionicons
                    name="folder-open-outline"
                    size={24}
                    color="#1677F2"
                  />
                </View>
                <Text style={styles.category9}>
                  No categories available
                </Text>
                <Text style={styles.category10}>
                  Try loading your categories again.
                </Text>
                <TouchableOpacity
                  style={styles.category11}
                  onPress={loadCategories}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Retry loading categories"
                >
                  <Ionicons name="refresh" size={18} color="#1677F2" />
                  <Text style={styles.category12}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
              )
            ) : (
              <View style={editing ? styles.category5 : styles.category13}>
                {categories.map((item) => {
                  const selected = categoryId === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[editing ? styles.category6 : styles.category14, selected
                          ? styles.categoryState
                          : styles.categoryState2]}
                      onPress={() => setCategoryId(item.id)}
                      disabled={saving}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`${item.name} category`}
                      accessibilityState={{
                        selected,
                        disabled: saving,
                      }}
                    >
                      <View
                        style={[editing ? styles.category7 : styles.category15, selected ? styles.categoryState3 : styles.categoryState4]}
                      >
                        <Text style={editing ? styles.category8 : styles.category16}>{item.icon ?? "📁"}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[editing ? styles.category9 : styles.category17, selected ? styles.categoryState5 : styles.categoryState6]}
                      >
                        {item.name}
                      </Text>

                      {selected && (
                        <View style={editing ? styles.category10 : styles.category18}>
                          <Ionicons
                            name="checkmark-circle"
                            size={editing ? 14 : 15}
                            color="#FFFFFF"
                          />
                          <Text style={editing ? styles.category11 : styles.category19}>
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
