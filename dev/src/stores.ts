import { create } from 'zustand'

// Counter Store
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: (count: number) => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (count: number) => set({ count }),
}))

// User Store
interface UserState {
  user: { name: string; email: string; loginTime: string } | null
  isLoading: boolean
  setUser: (user: { name: string; email: string }) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (userData) => set({ 
    user: { 
      ...userData, 
      loginTime: new Date().toISOString() 
    },
    isLoading: false
  }),
  logout: () => set({ user: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}))

// Todo Store
interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  setFilter: (filter: 'all' | 'active' | 'completed') => void
  clearCompleted: () => void
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  filter: 'all',
  addTodo: (text: string) => set((state) => ({
    todos: [
      ...state.todos,
      {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
  })),
  toggleTodo: (id: string) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),
  removeTodo: (id: string) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  setFilter: (filter) => set({ filter }),
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter((todo) => !todo.completed),
  })),
}))

// Settings Store
interface SettingsState {
  theme: 'light' | 'dark'
  notifications: boolean
  autoSave: boolean
  language: string
  setTheme: (theme: 'light' | 'dark') => void
  toggleNotifications: () => void
  toggleAutoSave: () => void
  setLanguage: (language: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'light',
  notifications: true,
  text: "This is a long text that should be wrapped to the next line, 一只色彩斑斓的飞鸟在黄金时刻的天空中优雅翱翔，虹彩般的羽毛闪耀着翡翠绿、宝石蓝、宝石红和琥珀金的光泽，在温暖的阳光下轻盈地掠过郁郁葱葱的热带雨林树冠。它舒展着修长而优美的双翅，每一根羽毛的尖端都泛着微微的荧光。下方，薄雾从树梢轻轻升起，远处的瀑布倾泻入一汪清澈见底的水潭。画面如电影般壮美，如梦境般迷人——一场大自然运动之美的盛宴。",
  autoSave: false,
  language: 'en',
  setTheme: (theme) => set({ theme }),
  toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
  toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
  setLanguage: (language) => set({ language }),
}))