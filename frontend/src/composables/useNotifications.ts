import { reactive } from 'vue';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const state = reactive({
  notifications: [] as Notification[]
});

let nextId = 0;

export function useNotifications() {
  
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = nextId++;
    state.notifications.push({ id, message, type });

    // Auto eliminar después de 3 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: number) => {
    const index = state.notifications.findIndex(n => n.id === id);
    if (index !== -1) state.notifications.splice(index, 1);
  };

  return {
    notifications: state.notifications,
    notify: addNotification,
    remove: removeNotification
  };
}