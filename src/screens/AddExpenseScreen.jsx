
import AddExpenseBackground from "../components/AddExpenseBackground";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/AddExpenseScreen.styles";
import useAddExpense from "../hooks/useAddExpense";

export default function AddExpenseScreen() {
  const { amount, description, setDescription, categoryId, setCategoryId, categories, loadingCategories, saving, handleAmountChange, handleSaveExpense, navigation } = useAddExpense();
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <AddExpenseBackground />
      <KeyboardAvoidingView
        style={styles.tip3}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.tip3}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.header2}>
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.header3}>
                Add Expense
              </Text>
              <Text style={styles.header4}>
                Record your spending
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
                placeholder="0.00"
                placeholderTextColor="#A0AEC0"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={handleAmountChange}
                editable={!saving}
                maxLength={12}
                accessibilityLabel="Expense amount"
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.category}>
            <View style={styles.category2}>
              <View style={styles.category3}>
                <Ionicons name="grid-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category4}>
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
            ) : (
              <View style={styles.category13}>
                {categories.map((item) => {
                  const selected = categoryId === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.category14, selected
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
                        style={[styles.category15, selected ? styles.categoryState3 : styles.categoryState4]}
                      >
                        <Text style={styles.category16}>{item.icon ?? "📁"}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.category17, selected ? styles.categoryState5 : styles.categoryState6]}
                      >
                        {item.name}
                      </Text>

                      {selected && (
                        <View style={styles.category18}>
                          <Ionicons
                            name="checkmark-circle"
                            size={15}
                            color="#FFFFFF"
                          />
                          <Text style={styles.category19}>
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
            <View style={styles.category2}>
              <View style={styles.category3}>
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category4}>
                Description
              </Text>
              <Text style={styles.description2}>Optional</Text>
            </View>
            <View style={styles.description3}>
              <TextInput
                style={styles.layout3}
                placeholder="What did you spend on?"
                placeholderTextColor="#A0AEC0"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                editable={!saving}
                maxLength={150}
                accessibilityLabel="Expense description"
              />
              <Text style={styles.description4}>
                {description.length}/150
              </Text>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            style={[styles.save, saving || loadingCategories ? styles.saveState : styles.saveState2]}
            onPress={handleSaveExpense}
            disabled={saving || loadingCategories}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save expense"
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
                <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
                <Text style={styles.save3}>
                  Save Expense
                </Text>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Tip */}
          <View style={styles.tip}>
            <View style={styles.tip2}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#1677F2"
              />
            </View>
            <View style={styles.tip3}>
              <Text style={styles.tip4}>Quick tip</Text>
              <Text style={styles.tip5}>
                Choose the category that best matches your purchase so your
                statistics stay accurate.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

