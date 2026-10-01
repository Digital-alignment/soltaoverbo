import { supabase } from '../src/lib/supabase';
import { LESSONS_21_DIAS_DATA } from '../src/data/lessons21DiasData';
import { DEFAULT_CMS_DATA } from '../src/hooks/usePageContent';

async function main() {
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@soltaoverbocoletivo.com',
    password: 'admin123456',
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    process.exit(1);
  }
  console.log('Logged in as admin successfully!');

  const { data: courses } = await supabase
    .from('courses')
    .select('*');

  console.log('All courses in DB:', courses?.map(c => ({ id: c.id, title: c.title })));

  const course21 = courses?.find(c => c.title.includes('21 dias') || c.title.includes('21 Dias'));

  if (!course21) {
    console.error('No course 21 dias found');
    process.exit(1);
  }

  const courseId = course21.id;
  console.log('Updating lessons for course:', course21.title, courseId);

  for (const l of LESSONS_21_DIAS_DATA) {
    const weekTag =
      l.week === 1
        ? 'semana 1: olhar para dentro'
        : l.week === 2
        ? 'semana 2: olhar para fora'
        : 'semana 3: olhar para o entre';

    const dayStr = l.day < 10 ? `0${l.day}` : `${l.day}`;
    const titleFormatted = `dia ${dayStr}: ${l.title}`;
    const descriptionFormatted = `${l.opening}\n\nExercício:\n${l.exercise}`;

    const { data: existing } = await supabase
      .from('course_lessons')
      .select('id')
      .eq('course_id', courseId)
      .eq('order_index', l.day);

    if (existing && existing.length > 0) {
      const { error: updateErr } = await supabase
        .from('course_lessons')
        .update({
          title: titleFormatted,
          description: descriptionFormatted,
          tags: [weekTag],
        })
        .eq('id', existing[0].id);

      if (updateErr) {
        console.error(`Error updating lesson ${l.day}:`, updateErr.message);
      } else {
        console.log(`Updated lesson ${l.day} -> "${titleFormatted}"`);
      }
    } else {
      const { error: insertErr } = await supabase.from('course_lessons').insert({
        course_id: courseId,
        order_index: l.day,
        title: titleFormatted,
        description: descriptionFormatted,
        tags: [weekTag],
      });

      if (insertErr) {
        console.error(`Error inserting lesson ${l.day}:`, insertErr.message);
      } else {
        console.log(`Inserted lesson ${l.day} -> "${titleFormatted}"`);
      }
    }
  }

  // Upload fresh CMS JSON to Supabase Storage as well to keep CMS synced
  const blob = new Blob([JSON.stringify(DEFAULT_CMS_DATA, null, 2)], {
    type: 'application/json',
  });
  const { error: uploadError } = await supabase.storage
    .from('banners')
    .upload('cms_site_pages.json', blob, { upsert: true, contentType: 'application/json' });

  if (uploadError) {
    console.log('Storage upload notice:', uploadError.message);
  } else {
    console.log('CMS Storage JSON updated successfully!');
  }

  process.exit(0);
}

main();
