import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRouter } from 'next/router';
import api from '../lib/api.js';

export default function Tasks() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/');
    }
  }, [router]);

  const { data: tasks } = useQuery({
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
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full mb-2 p-2 border rounded" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full mb-2 p-2 border rounded" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">{editId ? 'Update' : 'Add'}</button>
        </form>
        <DragDropContext onDragEnd={handleDragEnd}>
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="p-4 bg-gray-200 rounded mb-4">
                  <h2 className="text-xl mb-2">{status}</h2>
                  {tasks?.filter((task) => task.status === status).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="bg-white p-2 mb-2 rounded shadow-md">
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          <button onClick={() => handleEdit(task)} className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">Edit</button>
                          <button onClick={() => deleteTask.mutate(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
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
