import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ProductSlug, ProductTask, TaskAssignee, TaskStatus } from '../../types/productHubs';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  User,
  Calendar,
  Clock,
  Filter,
  FileText,
  X,
} from 'lucide-react';

interface ProductTaskManagerProps {
  productSlug: ProductSlug;
  productName: string;
}

export default function ProductTaskManager({
  productSlug,
  productName,
}: ProductTaskManagerProps) {
  const [tasks, setTasks] = useState<ProductTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignee, setNewAssignee] = useState<TaskAssignee | string>('geral');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [productSlug]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_tasks')
        .select('*')
        .eq('product_slug', productSlug)
        .order('created_at', { ascending: false });

      if (error) {
        // Local fallback if table doesn't exist yet
        console.warn('product_tasks table fallback:', error.message);
        const stored = localStorage.getItem(`tasks_${productSlug}`);
        if (stored) {
          setTasks(JSON.parse(stored));
        } else {
          setTasks([
            {
              id: 'demo-1',
              product_slug: productSlug,
              title: `revisar materiais de apoio do ${productName}`,
              description: 'verificar arquivos pdf e links de áudio',
              assigned_to: 'bruna',
              status: 'pending',
              due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
              notes: 'alinhamento na reunião de terças',
            },
            {
              id: 'demo-2',
              product_slug: productSlug,
              title: 'preparar mensagem de boas-vindas',
              description: 'enviar no grupo de comunidade',
              assigned_to: 'júlia',
              status: 'completed',
              notes: 'mensagem enviada com sucesso',
            },
          ]);
        }
      } else if (data) {
        setTasks(data as ProductTask[]);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    const newTask: Omit<ProductTask, 'id'> = {
      product_slug: productSlug,
      title: newTitle.trim().toLowerCase(),
      description: newDescription.trim().toLowerCase() || undefined,
      assigned_to: newAssignee.toLowerCase(),
      due_date: newDueDate || undefined,
      status: 'pending',
      notes: newNotes.trim().toLowerCase() || undefined,
    };

    try {
      const { data, error } = await supabase
        .from('product_tasks')
        .insert([newTask])
        .select();

      if (!error && data && data.length > 0) {
        setTasks((prev) => [data[0] as ProductTask, ...prev]);
      } else {
        const fallbackTask: ProductTask = {
          id: `local-${Date.now()}`,
          ...newTask,
        };
        const updated = [fallbackTask, ...tasks];
        setTasks(updated);
        localStorage.setItem(`tasks_${productSlug}`, JSON.stringify(updated));
      }

      setNewTitle('');
      setNewDescription('');
      setNewAssignee('geral');
      setNewDueDate('');
      setNewNotes('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleTaskStatus = async (task: ProductTask) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t));
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${productSlug}`, JSON.stringify(updatedTasks));

    try {
      await supabase
        .from('product_tasks')
        .update({ status: nextStatus })
        .eq('id', task.id);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${productSlug}`, JSON.stringify(updatedTasks));

    try {
      await supabase.from('product_tasks').delete().eq('id', taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending') return t.status !== 'completed';
    if (filterStatus === 'completed') return t.status === 'completed';
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-7 shadow-kraft space-y-6">
      {/* HEADER DA SEÇÃO DE TAREFAS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
              gestão interna • {productName}
            </span>
          </div>
          <h3 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            tarefas & lista de organizacao
          </h3>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            planejamento, responsáveis, prazos de entrega e notas da equipe
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ nova tarefa</span>
        </button>
      </div>

      {/* BARRA DE PROGRESSO E FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs">
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-corpo lowercase">
            <span className="font-bold text-acentoAzul">progresso das tarefas</span>
            <span className="text-tintaCarvao/70">
              {completedCount} de {tasks.length} concluídas ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-papelKraft/30 overflow-hidden">
            <div
              className="h-full bg-acentoOliva transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 border-t md:border-t-0 border-papelKraft/30 pt-2 md:pt-0">
          <Filter className="w-3.5 h-3.5 text-tintaCarvao/50" />
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-corpo lowercase transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-acentoAzul text-white font-bold'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            todas
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1 rounded-xl text-xs font-corpo lowercase transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-acentoTerracota text-white font-bold'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            pendentes
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-2.5 py-1 rounded-xl text-xs font-corpo lowercase transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-acentoOliva text-white font-bold'
                : 'text-tintaCarvao/70 hover:bg-papelKraft/20'
            }`}
          >
            concluídas
          </button>
        </div>
      </div>

      {/* LISTA DE TAREFAS */}
      {loading ? (
        <div className="py-8 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
          carregando tarefas...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-papelKraft/30 p-6 space-y-2">
          <CheckSquare className="w-8 h-8 text-acentoAzul/40 mx-auto" />
          <p className="text-sm font-editorial font-bold text-acentoAzul lowercase">
            nenhuma tarefa encontrada
          </p>
          <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
            clique em "+ nova tarefa" para adicionar itens à lista de controle.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`bg-white p-4 rounded-2xl border transition-all shadow-xs space-y-2 ${
                  isCompleted
                    ? 'border-papelKraft/30 bg-white/60 opacity-80'
                    : 'border-papelKraft/60 hover:border-acentoAzul/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-0.5 text-acentoAzul hover:scale-110 transition-transform cursor-pointer shrink-0"
                      title={isCompleted ? 'marcar como pendente' : 'marcar como concluída'}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-acentoOliva" />
                      ) : (
                        <Square className="w-5 h-5 text-tintaCarvao/40 hover:text-acentoAzul" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <h4
                        className={`text-sm font-bold font-editorial lowercase leading-snug ${
                          isCompleted
                            ? 'line-through text-tintaCarvao/50'
                            : 'text-acentoAzul'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs font-corpo text-tintaCarvao/75 lowercase">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 rounded-lg text-tintaCarvao/40 hover:text-acentoTerracota hover:bg-acentoTerracota/10 transition-colors cursor-pointer shrink-0"
                    title="excluir tarefa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* DETALHES DE RESPONSÁVEL, PRAZO E NOTAS */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-papelKraft/20 text-[11px] font-corpo text-tintaCarvao/60 lowercase">
                  <div className="flex items-center gap-1 bg-bgPlataforma px-2.5 py-0.5 rounded-full border border-papelKraft/40">
                    <User className="w-3 h-3 text-acentoAzul" />
                    <span>responsável: <strong className="text-tintaCarvao">{task.assigned_to}</strong></span>
                  </div>

                  {task.due_date && (
                    <div className="flex items-center gap-1 bg-bgPlataforma px-2.5 py-0.5 rounded-full border border-papelKraft/40">
                      <Calendar className="w-3 h-3 text-acentoTerracota" />
                      <span>entrega: <strong className="text-tintaCarvao">{task.due_date}</strong></span>
                    </div>
                  )}

                  {task.notes && (
                    <div className="flex items-center gap-1 bg-papelClaro px-2.5 py-0.5 rounded-full border border-papelKraft/40 max-w-xs truncate">
                      <FileText className="w-3 h-3 text-acentoOliva shrink-0" />
                      <span className="truncate">{task.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO DE TAREFA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-tintaCarvao/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-2xl p-6 space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
              <div>
                <h4 className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                  nova tarefa • {productName}
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  adicionar item à lista de controle da equipe
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-tintaCarvao/60 hover:text-acentoAzul"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-corpo lowercase">
              <div>
                <label className="block font-bold text-tintaCarvao mb-1">título da tarefa *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: revisar áudios binaurais"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">descrição / orientação</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="detalhes do que precisa ser feito..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">responsável</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  >
                    <option value="geral">geral (equipe)</option>
                    <option value="bruna">bruna</option>
                    <option value="júlia">júlia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-tintaCarvao mb-1">data limite</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">notas extras / links</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="observações ou links uteis..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-papelKraft/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-2xl border border-papelKraft/50 text-tintaCarvao/70 hover:bg-papelKraft/20 font-corpo text-xs lowercase transition-colors cursor-pointer"
                >
                  cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'salvando...' : 'salvar tarefa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
