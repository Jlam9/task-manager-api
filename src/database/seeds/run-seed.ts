import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { UserEntity } from '../../modules/users/entities/user.entity';
import { TaskEntity } from '../../modules/tasks/entities/task.entity';

async function runSeed() {
  await dataSource.initialize();
  const usersRepository = dataSource.getRepository(UserEntity);
  const tasksRepository = dataSource.getRepository(TaskEntity);

  const adminEmail = 'admin@test.com';
  const adminPassword = 'Admin123!';
  let user = await usersRepository.findOne({ where: { email: adminEmail } });

  if (!user) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    user = usersRepository.create({
      email: adminEmail,
      passwordHash,
      nombre: 'Admin',
    });
    user = await usersRepository.save(user);
  }

  const demoEmail = 'user@test.com';
  const demoPassword = 'User123!';
  const demoUserExists = await usersRepository.findOne({
    where: { email: demoEmail },
  });

  if (!demoUserExists) {
    const passwordHash = await bcrypt.hash(demoPassword, 10);
    const demoUser = usersRepository.create({
      email: demoEmail,
      passwordHash,
      nombre: 'User Demo',
    });
    await usersRepository.save(demoUser);
  }

  const existingTasks = await tasksRepository.count({
    where: { user: { id: user.id } },
  });

  if (existingTasks === 0) {
    const task1 = tasksRepository.create({
      titulo: 'Bienvenida al gestor de tareas',
      descripcion: 'Esta es una tarea de ejemplo.',
      completada: false,
      fechaEntrega: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      comentarios: 'Puedes editar o eliminar esta tarea.',
      responsable: 'Admin',
      tags: ['demo', 'inicio'],
      user,
    });

    const task2 = tasksRepository.create({
      titulo: 'Configurar el entorno',
      descripcion: 'Configura variables de entorno y ejecuta migraciones.',
      completada: false,
      fechaEntrega: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
      comentarios: null,
      responsable: null,
      tags: ['setup'],
      user,
    });

    await tasksRepository.save([task1, task2]);
  }

  await dataSource.destroy();
}

runSeed()
  .then(() => {
    process.stdout.write('Seed completado\n');
  })
  .catch((error) => {
    process.stderr.write(`Seed error: ${error}\n`);
    process.exit(1);
  });
