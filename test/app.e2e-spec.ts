import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/modules/users/users.service';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let taskUuid: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const usersService = app.get(UsersService);
    await usersService.createSeedUserIfNotExists(
      'admin@test.com',
      'Admin123!',
      'Admin',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('Login OK', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ email: 'admin@test.com', password: 'Admin123!' })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    accessToken = response.body.accessToken;
  });

  it('Crear task', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        titulo: 'Tarea e2e',
        descripcion: 'Validar endpoints e2e',
        completada: false,
        fechaEntrega: new Date().toISOString(),
        comentarios: 'Creada desde test',
        responsable: 'QA',
        tags: ['e2e'],
      })
      .expect(201);

    expect(response.body.uuid).toBeDefined();
    taskUuid = response.body.uuid;
  });

  it('Listar tasks', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((task) => task.uuid === taskUuid)).toBe(true);
  });

  it('Ver detalle', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tasks/${taskUuid}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.uuid).toBe(taskUuid);
  });

  it('Editar task', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/tasks/${taskUuid}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ completada: true })
      .expect(200);

    expect(response.body.completada).toBe(true);
  });

  it('Eliminar task', async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${taskUuid}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });
});
