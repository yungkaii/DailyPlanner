import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { localStore } from '../lib/storage';
import { isToday, parseISO } from 'date-fns';

export function useTasks() {
  const { user, isConfigured } = useAuth();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async (): Promise<Task[]> => {
      if (!isConfigured || !user) {
        return [];
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks from Supabase:', error);
        return localStore.getTasks();
      }

      return data as Task[];
    },
    enabled: !!user,
  });

  const tasks = tasksQuery.data || [];

  const todayTasks = tasks.filter((t) => {
    if (!t.due_date) return true; // show undated tasks as current
    try {
      return isToday(parseISO(t.due_date));
    } catch {
      return true;
    }
  });

  const completedTodayTasks = todayTasks.filter((t) => t.completed);
  const remainingTodayTasks = todayTasks.filter((t) => !t.completed);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
      const taskToInsert: Task = {
        ...newTask,
        id: 'task-' + Date.now(),
        user_id: user?.id || 'demo-user',
        created_at: new Date().toISOString(),
      };

      if (!isConfigured || !user) {
        return taskToInsert;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Toggle Complete Mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const completed_at = completed ? new Date().toISOString() : null;

      if (!isConfigured || !user) {
        return { id, completed };
      }

      const { error } = await supabase
        .from('tasks')
        .update({ completed, completed_at })
        .eq('id', id);

      if (error) throw error;
      return { id, completed };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updated: Task) => {
      if (!isConfigured || !user) {
        return updated;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updated)
        .eq('id', updated.id)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isConfigured || !user) {
        return id;
      }

      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    todayTasks,
    completedTodayTasks,
    remainingTodayTasks,
    isLoading: tasksQuery.isLoading,
    createTask: createMutation.mutateAsync,
    toggleTask: (id: string, completed: boolean) => toggleMutation.mutateAsync({ id, completed }),
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
  };
}
