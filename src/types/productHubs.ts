export type ProductSlug =
  | 'programa_21_dias'
  | 'programa_ciclo'
  | 'programa_cafe_com_letras'
  | 'contrate_experiencia';

export interface ProductMeeting {
  id: string;
  product_slug: ProductSlug;
  title: string;
  date_time: string; // ISO string
  meeting_link?: string;
  description?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskAssignee = 'bruna' | 'júlia' | 'geral';

export interface ProductTask {
  id: string;
  product_slug: ProductSlug;
  title: string;
  description?: string;
  assigned_to: TaskAssignee | string;
  due_date?: string; // YYYY-MM-DD
  status: TaskStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type B2BLeadStatus =
  | 'novo_contato'
  | 'reuniao_agendada'
  | 'proposta_enviada'
  | 'fechado'
  | 'perdido';

export interface B2BLead {
  id: string;
  company_name: string;
  contact_name: string;
  email?: string;
  whatsapp?: string;
  status: B2BLeadStatus;
  proposal_value?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentProduction {
  id: string;
  title: string;
  excerpt: string;
  word_count: number;
  created_at: string;
  folder_name?: string;
}

export interface StudentCourseProgress {
  user_id: string;
  display_name: string;
  email: string;
  profile_picture_url?: string;
  current_day: number; // e.g. 14 out of 21
  total_days: number;
  completed_lessons: number;
  last_activity: string;
  role?: string;
  created_at?: string;
  facilitator_notes?: string;
  productions?: StudentProduction[];
  bio?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  substack_url?: string | null;
  email_public?: string | null;
}

export type MaterialCategory =
  | 'pdf_guia'
  | 'exercicio'
  | 'link_recomendado'
  | 'audio';

export interface ProductMaterial {
  id: string;
  product_slug: ProductSlug;
  title: string;
  category: MaterialCategory;
  file_url: string;
  description?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}
