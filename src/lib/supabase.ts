// Temporary migration guard: local accounts must never access the old remote database.
// Remaining financial screens will be connected to AsyncStorage in the next milestone.
export const supabase = {
  from(_table: string): any {
    throw new Error("Financial storage migration is pending.");
  },
  auth: {
    async getUser() {
      return { data: { user: null }, error: new Error("Financial storage migration is pending.") };
    },
  },
};
