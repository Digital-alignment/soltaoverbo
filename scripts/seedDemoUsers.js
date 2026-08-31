import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtdruienammtqodgfqty.supabase.co';
const envServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJ1aWVuYW1tdHFvZGdmcXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzc1MjYzNSwiZXhwIjoyMDc5MzI4NjM1fQ.dhRdq0jJLwq5pBl9K-Fkgh3WmEQwPwPSo_6Zzayl_8M';

const supabase = createClient(supabaseUrl, envServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedDemoUsers() {
  console.log('🌱 Seeding demo accounts in Supabase...');

  const demoAccounts = [
    {
      email: 'admin@soltaoverbocoletivo.com',
      password: 'admin123456',
      displayName: 'Administradora Bruna',
      role: 'admin',
    },
    {
      email: 'aluno@soltaoverbocoletivo.com',
      password: 'aluno123456',
      displayName: 'Aluna Marina (Membro Registrado)',
      role: 'paid',
    },
  ];

  for (const account of demoAccounts) {
    try {
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingUser = listData?.users?.find(u => u.email === account.email);

      let userId;
      if (existingUser) {
        console.log(`ℹ️ User ${account.email} already exists (${existingUser.id}). Updating password...`);
        userId = existingUser.id;
        await supabase.auth.admin.updateUserById(userId, {
          password: account.password,
          email_confirm: true,
          user_metadata: { full_name: account.displayName },
        });
      } else {
        console.log(`✨ Creating user ${account.email}...`);
        const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: { full_name: account.displayName },
        });

        if (createErr) {
          console.error(`❌ Error creating ${account.email}:`, createErr.message);
          continue;
        }
        userId = newUser.user.id;
      }

      const { error: profileErr } = await supabase
        .from('users_profiles')
        .upsert({
          id: userId,
          display_name: account.displayName,
          bio: 'Conta de demonstração oficial do Solta o Verbo',
          role: account.role,
        });

      if (profileErr) {
        console.error(`❌ Error upserting profile for ${account.email}:`, profileErr.message);
      } else {
        console.log(`✅ Profile successfully configured for ${account.email} with role '${account.role}'`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${account.email}:`, err);
    }
  }

  console.log('🎉 Demo account seeding complete!');
}

seedDemoUsers();
