import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="add-expense"
        options={{
          title: "Add Expense",
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
