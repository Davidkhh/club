import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-session';
import { getAdminTeachers, type StoredTeacher } from '@/lib/cms';
import TeacherForm from '../TeacherForm';

export default async function EditTeacher({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { list } = await getAdminTeachers();
  const isNew = id === 'new';
  const found = list.find((t) => t.id === id);
  if (!isNew && !found) notFound();
  const teacher: StoredTeacher = found ?? { id: 'new', name: '', specialization: '', shortBio: '', bio: '', photo: '', order: list.length, published: false };
  return (
    <main id="top" className="adm-main">
      <h1>{isNew ? 'Новый преподаватель' : teacher.name}</h1>
      <TeacherForm teacher={teacher} isNew={isNew} />
    </main>
  );
}
