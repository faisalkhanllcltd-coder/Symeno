export function createNotificationStore() {
  let unreadCount = $state(0);

  return {
    get count() {
      return unreadCount;
    },
    setCount: (count: number) => {
      unreadCount = count;
    },
    decrement: () => {
      if (unreadCount > 0) unreadCount--;
    },
    clear: () => {
      unreadCount = 0;
    },
  };
}
export const notifications = createNotificationStore();
