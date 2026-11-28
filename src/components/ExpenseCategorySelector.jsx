import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseCategorySelector({ editing = false, loadCategories, categories, categoryId, setCategoryId, saving, loadingCategories = false }) {
  const styles = editing ? editStyles : addStyles;
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

// Add expense styles.
const addStyles = StyleSheet.create({
  amount2: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center"
  },

  category: {
    marginTop: 24
  },

  category2: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center"
  },

  category3: {
    marginRight: 12,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EEF5FF"
  },

  category4: {
    fontSize: 20,
    fontWeight: "800",
    color: "#071B46"
  },

  category5: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    paddingVertical: 32
  },

  category6: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  category7: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 28
  },

  category8: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  category9: {
    marginTop: 12,
    fontWeight: "700",
    color: "#17335F"
  },

  category10: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  category11: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#EAF4FF",
    paddingHorizontal: 16,
    paddingVertical: 10
  },

  category12: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#1677F2"
  },

  category13: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  categoryState: {
    borderColor: "#1677F2",
    backgroundColor: "#1677F2"
  },

  categoryState2: {
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF"
  },

  category14: {
    marginBottom: 12,
    width: "48%",
    borderRadius: 22,
    borderWidth: 1,
    padding: 10
  },

  categoryState3: {
    backgroundColor: "rgba(255, 255, 255, 0.15)"
  },

  categoryState4: {
    backgroundColor: "#F5F9FF"
  },

  category15: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999
  },

  category16: {
    fontSize: 20,
    lineHeight: 28
  },

  categoryState5: {
    color: "#FFFFFF"
  },

  categoryState6: {
    color: "#071B46"
  },

  category17: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800"
  },

  category18: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center"
  },

  category19: {
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)"
  },

});

// Edit expense styles.
const editStyles = StyleSheet.create({
  screen2: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  amount2: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center"
  },

  category: {
    marginTop: 20
  },

  category2: {
    marginRight: 12,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EEF5FF"
  },

  category3: {
    fontSize: 20,
    fontWeight: "800",
    color: "#071B46"
  },

  category4: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 28
  },

  category5: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  categoryState: {
    borderColor: "#1677F2",
    backgroundColor: "#1677F2"
  },

  categoryState2: {
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF"
  },

  category6: {
    marginBottom: 8,
    width: "48%",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },

  categoryState3: {
    backgroundColor: "rgba(255, 255, 255, 0.15)"
  },

  categoryState4: {
    backgroundColor: "#F5F9FF"
  },

  category7: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999
  },

  category8: {
    fontSize: 20,
    lineHeight: 28
  },

  categoryState5: {
    color: "#FFFFFF"
  },

  categoryState6: {
    color: "#071B46"
  },

  category9: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800"
  },

  category10: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center"
  },

  category11: {
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)"
  },

});
