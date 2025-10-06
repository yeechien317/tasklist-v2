import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LandingPage } from "@/components/LandingPage";
import { AuthLoginDialog } from "@/components/AuthLoginDialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task, InsertTask } from "@shared/schema";

interface User {
  id: string;
  username: string;
}

export default function TaskApp() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { username: email, password });
      return await response.json();
    },
    onSuccess: (data: { user: User }) => {
      setUser(data.user);
      setAuthDialogOpen(false);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", { username: email, password });
      return await response.json();
    },
    onSuccess: (data: { user: User }) => {
      setUser(data.user);
      setAuthDialogOpen(false);
      toast({
        title: "Account created!",
        description: "Welcome to TaskFlow. Let's get organized!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message.includes("409") ? "User already exists. Please sign in instead." : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const handleRegister = (email: string, password: string) => {
    registerMutation.mutate({ email, password });
  };

  const handleLogout = () => {
    setUser(null);
    queryClient.clear();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const handleOpenAuth = () => {
    setAuthDialogOpen(true);
  };

  if (!user) {
    return (
      <>
        <LandingPage onOpenAuth={handleOpenAuth} />
        <AuthLoginDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </>
    );
  }

  return <DashboardWithData user={user} onLogout={handleLogout} />;
}

interface DashboardWithDataProps {
  user: User;
  onLogout: () => void;
}

function DashboardWithData({ user, onLogout }: DashboardWithDataProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);

  const { data: fetchedTasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", user.id],
    queryFn: async () => {
      const response = await fetch(`/api/tasks?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  const createTaskMutation = useMutation({
    mutationFn: async (task: Omit<InsertTask, "userId">) => {
      const response = await apiRequest("POST", "/api/tasks", { ...task, userId: user.id });
      return await response.json();
    },
    onSuccess: (newTask: Task) => {
      setTasks(prev => [newTask, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", user.id] });
      toast({
        title: "Task created",
        description: "Your task has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
      return await response.json();
    },
    onSuccess: (updatedTask: Task) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", user.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/tasks/${id}`);
      return await response.json();
    },
    onSuccess: (_, id) => {
      setTasks(prev => prev.filter(t => t.id !== id));
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", user.id] });
      toast({
        title: "Task deleted",
        description: "Your task has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTaskMutation.mutate({ id, updates: { completed: !task.completed } });
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleAddTask = (task: { title: string; description?: string; dueDate?: string }) => {
    createTaskMutation.mutate({
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      completed: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardUI
      userEmail={user.username}
      tasks={tasks}
      onLogout={onLogout}
      onToggleTask={handleToggleTask}
      onDeleteTask={handleDeleteTask}
      onAddTask={handleAddTask}
    />
  );
}

interface DashboardUIProps {
  userEmail: string;
  tasks: Task[];
  onLogout: () => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: { title: string; description?: string; dueDate?: string }) => void;
}

function DashboardUI({
  userEmail,
  tasks,
  onLogout,
  onToggleTask,
  onDeleteTask,
  onAddTask,
}: DashboardUIProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      dueDate: newTaskDueDate || undefined,
    });
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setShowAddDialog(false);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  {userEmail}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground">
              {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''} • {completedTasks.length} completed
            </p>
          </div>

          <Button
            onClick={() => setShowAddDialog(true)}
            className="w-full sm:w-auto"
            data-testid="button-add-task"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>

          {activeTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Active Tasks</h2>
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <Card key={task.id} className="hover-elevate" data-testid={`task-${task.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => onToggleTask(task.id)}
                          className="mt-1"
                          data-testid={`checkbox-task-${task.id}`}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium" data-testid={`title-task-${task.id}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`menu-task-${task.id}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onDeleteTask(task.id)}
                              className="text-destructive"
                              data-testid={`delete-task-${task.id}`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Completed</h2>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <Card key={task.id} className="hover-elevate opacity-60" data-testid={`task-${task.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => onToggleTask(task.id)}
                          className="mt-1"
                          data-testid={`checkbox-task-${task.id}`}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium line-through" data-testid={`title-task-${task.id}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-through">
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`menu-task-${task.id}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onDeleteTask(task.id)}
                              className="text-destructive"
                              data-testid={`delete-task-${task.id}`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first task
              </p>
              <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-first-task">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Task
              </Button>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-testid="dialog-add-task">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task to stay organized
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTaskSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                data-testid="input-task-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description (optional)</Label>
              <Textarea
                id="task-description"
                placeholder="Add more details about this task"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
                data-testid="input-task-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date (optional)</Label>
              <Input
                id="task-due-date"
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                data-testid="input-task-due-date"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddDialog(false)}
                data-testid="button-cancel-task"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-submit-task">
                Add Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  CheckCircle2,
  Plus,
  MoreVertical,
  Trash2,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
