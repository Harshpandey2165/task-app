import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRouter } from 'next/router';
import api from '../lib/api.js';

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Tasks() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Verify token validity
    api.get('/auth/profile')
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/');
      });
  }, [router]);

  const { data: tasks, isLoading, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then((res) => res.data),
  });

  const createTask = useMutation({
    mutationFn: (newTask) => api.post('/tasks', newTask),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...task }) => api.put(`/tasks/${id}`, task),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  const deleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  const updateTaskStatus = useMutation({
    mutationFn: ({ id, newStatus }) => api.patch(`/tasks/${id}`, { status: newStatus }),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateTask.mutate({ id: editId, title, description, status });
      setEditId(null);
    } else {
      createTask.mutate({ title, description, status });
    }
    setTitle('');
    setDescription('');
    setStatus('To Do');
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;
    updateTaskStatus.mutate({ id: draggableId, newStatus });
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
          >
            Logout
          </button>
        </div>
        {(error || tasksError) && (
          <p className="text-red-500 mb-4">{error || tasksError?.message}</p>
        )}
        {isLoading && (
          <div className="text-center mb-4">
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-4">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Task Title" 
              required 
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div className="mb-4">
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Task Description" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[100px]"
            />
          </div>
          <div className="mb-4">
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            {editId ? 'Update Task' : 'Add New Task'}
          </button>
        </form>
        <DragDropContext onDragEnd={handleDragEnd}>
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="p-4 bg-gray-100 rounded-lg mb-4 min-h-[200px]"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">{status}</h2>
                  {tasks?.filter((task) => task.status === status).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div 
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps} 
                          ref={provided.innerRef} 
                          className="bg-white p-4 mb-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                          <h3 className="font-semibold text-lg mb-2 text-gray-800">{task.title}</h3>
                          <p className="text-gray-600 mb-4">{task.description}</p>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(task)} 
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300 flex-1"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteTask.mutate(task.id)} 
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300 flex-1"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
