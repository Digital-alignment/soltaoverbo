import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtdruienammtqodgfqty.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjYzNSwiZXhwIjoyMDc5MzI4NjM1fQ.dhRdq0jJLwq5pBl9K-Fkgh3WmEQwPwPSo_6Zzayl_8M';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('🚀 Iniciando povoamento de dados para Usuário Demo 2...');

  const demoEmail = 'aluno2@soltaoverbocoletivo.com';
  const demoPass = 'aluno123456';
  const displayName = 'camila oliveira (demo 2)';

  // 1. Criar ou buscar o usuário no Supabase Auth via Admin API
  let userId = null;

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Erro ao listar usuários:', listError);
  }

  const existingUser = usersData?.users?.find((u) => u.email === demoEmail);

  if (existingUser) {
    userId = existingUser.id;
    console.log('✅ Usuário Demo 2 já existe no Supabase Auth:', userId);
  } else {
    console.log('⏳ Criando Usuário Demo 2 no Auth...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPass,
      email_confirm: true,
      user_metadata: { full_name: displayName },
    });

    if (createError) {
      console.error('Erro ao criar usuário:', createError);
      process.exit(1);
    }
    userId = newUser.user.id;
    console.log('✅ Usuário Demo 2 criado com sucesso:', userId);
  }

  // 2. Garantir perfil em `users_profiles`
  const { error: profileErr } = await supabase.from('users_profiles').upsert({
    id: userId,
    display_name: displayName,
    bio: 'escritora poética e aluna do coletivo solta o verbo.',
    role: 'free',
    profile_picture_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  });

  if (profileErr) {
    console.error('Erro ao salvar perfil em users_profiles:', profileErr);
  } else {
    console.log('✅ Perfil atualizado em users_profiles.');
  }

  // 3. Buscar o curso `21 dias de escrita` e suas 5 primeiras aulas
  const { data: courseData } = await supabase
    .from('courses')
    .select('id')
    .ilike('title', '%21 dias%')
    .maybeSingle();

  if (courseData) {
    const { data: lessons } = await supabase
      .from('course_lessons')
      .select('id, title, order_index')
      .eq('course_id', courseData.id)
      .order('order_index', { ascending: true })
      .limit(5);

    if (lessons && lessons.length > 0) {
      console.log(`⏳ Povoando comentários nas 5 primeiras aulas (encontradas: ${lessons.length})...`);
      
      const commentsText = [
        'dia 01 finalizado! a provocação sobre a carta para o futuro despertou memórias esquecidas do meu primeiro caderno de escola.',
        'dia 02 concluído! descrever o som do silêncio da manhã me trouxe uma calma poética profunda.',
        'dia 03! transformar um objeto cotidiano em metáfora foi meu exercício favorito até agora.',
        'dia 04 feito! a busca pela primeira palavra que veio à tona desbloqueou o resto do meu texto.',
        'dia 05 concluído com sucesso! 5 dias seguidos de ritual de escrita autoral.',
      ];

      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const commentText = commentsText[i] || `comentário da aula ${lesson.order_index} por camila.`;

        // Verificar se já existe comentário do Demo 2 nesta aula
        const { data: existingComment } = await supabase
          .from('comments')
          .select('id')
          .eq('lesson_id', lesson.id)
          .eq('user_id', userId)
          .maybeSingle();

        if (!existingComment) {
          const { error: cErr } = await supabase.from('comments').insert({
            lesson_id: lesson.id,
            user_id: userId,
            content: commentText,
          });
          if (cErr) console.error(`Erro ao inserir comentário na aula ${lesson.title}:`, cErr);
          else console.log(`  └─ Comentário publicado na aula: "${lesson.title}"`);
        } else {
          console.log(`  └─ Comentário já existente na aula: "${lesson.title}"`);
        }
      }
    }
  }

  // 4. Criar um post na Fogueira para Demo 2 e adicionar comentário nele
  console.log('⏳ Criando post na fogueira para o Usuário Demo 2...');

  // Criar primeiro um registro em writing_exercises
  const { data: exerciseData, error: exErr } = await supabase
    .from('writing_exercises')
    .insert({
      user_id: userId,
      title: 'sopro matinal: o tempo entre duas xícaras de café',
      content: '<p>o tempo não corre quando observamos o vapor subir da xícara de porcelana. hoje escrevi sobre a desaceleração consciente do olhar e como cada minuto da manhã esconde uma poesia intacta e silenciosa.</p><p>ao pausar a rotina, percebo que os detalhes mais simples são os que sustentam a alma.</p>',
      is_published: true,
    })
    .select()
    .single();

  if (exErr) {
    console.error('Erro ao criar exercício de escrita:', exErr);
  } else if (exerciseData) {
    // Publicar em community_posts
    const { data: postData, error: postErr } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        writing_exercise_id: exerciseData.id,
        likes_count: 14,
        comments_count: 2,
        hidden_from_fogueira: false,
      })
      .select()
      .single();

    if (postErr) {
      console.error('Erro ao publicar post na fogueira:', postErr);
    } else if (postData) {
      console.log('✅ Post publicado na Fogueira (ID:', postData.id, ')');

      // Adicionar comentários no post da Fogueira
      await supabase.from('comments').insert([
        {
          post_id: postData.id,
          user_id: userId,
          content: 'esta reflexão sobre o vapor do café ressoou muito com o meu ritual matinal de hoje!',
        },
      ]);
      console.log('✅ Comentário publicado no post da Fogueira.');
    }
  }

  console.log('🎉 Povoamento concluído com sucesso!');
}

main().catch(console.error);
