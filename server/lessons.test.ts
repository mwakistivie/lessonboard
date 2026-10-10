import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { registerRoutes } from './routes';

async function createTestServer() {
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address();
  assert.ok(address && typeof address === 'object');

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

test('lesson CRUD routes persist via server storage', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const createResponse = await fetch(`${baseUrl}/api/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: 'Monday',
        time: '08:00',
        subject: 'Mathematics',
        className: 'Grade 7A',
        teacher: 'Sarah Wanjiku',
        room: 'Room 12',
        tone: 'blue',
      }),
    });

    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();
    assert.equal(created.subject, 'Mathematics');
    assert.ok(created.id);

    const listResponse = await fetch(`${baseUrl}/api/lessons`);
    assert.equal(listResponse.status, 200);
    const lessons = await listResponse.json();
    assert.ok(Array.isArray(lessons));
    assert.equal(lessons.length, 1);

    const updateResponse = await fetch(`${baseUrl}/api/lessons/${created.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: 'Science', room: 'Lab 2' }),
    });

    assert.equal(updateResponse.status, 200);
    const updated = await updateResponse.json();
    assert.equal(updated.subject, 'Science');
    assert.equal(updated.room, 'Lab 2');

    const deleteResponse = await fetch(`${baseUrl}/api/lessons/${created.id}`, {
      method: 'DELETE',
    });

    assert.equal(deleteResponse.status, 204);

    const confirmResponse = await fetch(`${baseUrl}/api/lessons`);
    assert.equal(confirmResponse.status, 200);
    const remaining = await confirmResponse.json();
    assert.deepEqual(remaining, []);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
