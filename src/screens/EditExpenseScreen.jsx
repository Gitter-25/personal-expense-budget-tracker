import EditExpenseBackground from "../components/EditExpenseBackground";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/EditExpenseScreen.styles";
import useEditExpense from "../hooks/useEditExpense";

export default function EditExpenseScreen() {
  const { navigation, amount, description, setDescription, categoryId, setCategoryId, categories, loading, saving, hasChanges, handleAmountChange, handleSave } = useEditExpense();
  if (loading) {
    return (
      <SafeAreaView
        style={styles.layout}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.screen}>
          <ActivityIndicator size="small" color="#1677F2" />
          <Text style={styles.screen2}>
            Loading expense...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right", "bottom"]}
    >
      <EditExpenseBackground />
      <KeyboardAvoidingView
        style={styles.header3}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.header3}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.header2}
              onPress={() => navigation.goBack()}
              disabled={saving}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color="#1677F2" />
            </TouchableOpacity>
            <View style={styles.header3}>
              <Text style={styles.header4}>
                Edit Expense
              </Text>
              <Text style={styles.header5}>
                Update your expense details
              </Text>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.amount}>
            <View style={styles.amount2}>
              <View style={styles.amount3}>
                <Text style={styles.amount4}>
                  ₱
                </Text>
              </View>
              <Text style={styles.amount5}>
                Expense Amount
              </Text>
            </View>
            <View style={styles.amount6}>
              <Text style={styles.amount7}>
                ₱
              </Text>
              <View style={styles.amount8} />
              <TextInput
                style={styles.layout2}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor="#A0AEC0"
                keyboardType="decimal-pad"
                editable={!saving}
                maxLength={12}
                accessibilityLabel="Expense amount"
              />
            </View>
          </View>

          {/* Category */}
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

          {/* Description */}
          <View style={styles.description}>
            <View style={styles.amount2}>
              <View style={styles.category2}>
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category3}>
                Description
              </Text>
              <Text style={styles.description2}>Optional</Text>
            </View>
            <View style={styles.amount}>
              <TextInput
                style={styles.layout3}
                value={description}
                onChangeText={setDescription}
                placeholder="What did you spend on?"
                placeholderTextColor="#A0AEC0"
                multiline
                textAlignVertical="top"
                editable={!saving}
                maxLength={150}
                accessibilityLabel="Expense description"
              />
              <Text style={styles.description3}>
                {description.length}/150
              </Text>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            disabled={saving || !hasChanges}
            onPress={handleSave}
            style={[styles.save, saving
                ? styles.saveState
                : hasChanges
                  ? styles.saveState2
                  : styles.saveState3]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save expense changes"
            accessibilityState={{
              disabled: saving || !hasChanges,
            }}
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.save2}>
                  Saving...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name={
                    hasChanges ? "save-outline" : "checkmark-circle-outline"
                  }
                  size={21}
                  color="#FFFFFF"
                />
                <Text style={styles.save3}>
                  {hasChanges ? "Save Changes" : "No Changes"}
                </Text>

                {hasChanges && (
                  <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                )}
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

