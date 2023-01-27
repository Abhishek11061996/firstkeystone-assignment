import path from 'path';
import { resetDatabase } from '@keystone-6/core/testing';
import { getContext } from '@keystone-6/core/context';
import baseConfig from './keystone';
import * as PrismaModule from '.prisma/client';

const dbUrl = `file:./test-${process.env.JEST_WORKER_ID}.db`;
const prismaSchemaPath = path.join(__dirname, 'schema.prisma');
const config = { ...baseConfig, db: { ...baseConfig.db, url: dbUrl } };

const context = getContext(config, PrismaModule);

beforeEach(async () => {
  await resetDatabase(dbUrl, prismaSchemaPath);
});

test('Create a Person using the Query API', async () => {
  const person = await context.query.Person.createOne({
    data: { name: 'Alice', email: 'alice@example.com', password: 'super-secret' },
    query: 'id name email password { isSet }',
  });
  expect(person.name).toEqual('Alice');
  expect(person.email).toEqual('alice@example.com');
  expect(person.password.isSet).toEqual(true);
});

test('Check that trying to create user with no name (required field) fails', async () => {
  const { data, errors } = (await context.graphql.raw({
    query: `mutation {
          createPerson(data: { email: "alice@example.com", password: "super-secret" }) {
            id name email password { isSet }
          }
        }`,
  })) as any;
  expect(data!.createPerson).toBe(null);
  expect(errors).toHaveLength(1);
  expect(errors![0].path).toEqual(['createPerson']);
  expect(errors![0].message).toEqual(
    'You provided invalid data for this operation.\n  - Person.name: Name must not be empty'
  );
});

test('Check access control by running updateTask as a specific user via context.withSession()', async () => {
  const [alice, bob] = await context.query.Person.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', password: 'super-secret' },
      { name: 'Bob', email: 'bob@example.com', password: 'super-secret' },
    ],
    query: 'id name',
  });
  expect(alice.name).toEqual('Alice');
  expect(bob.name).toEqual('Bob');

  // Create a task assigned to Alice
  const task = await context.query.Task.createOne({
    data: {
      label: 'Experiment with Keystone',
      priority: 'high',
      isComplete: false,
      assignedTo: { connect: { id: alice.id } },
    },
    query: 'id label priority isComplete assignedTo { name }',
  });
  expect(task.label).toEqual('Experiment with Keystone');
  expect(task.priority).toEqual('high');
  expect(task.isComplete).toEqual(false);
  expect(task.assignedTo.name).toEqual('Alice');

  // Check that we can't update the task (not logged in)
  {
    const { data, errors } = (await context.graphql.raw({
      query: `mutation update($id: ID!) {
            updateTask(where: { id: $id }, data: { isComplete: true }) {
              id
            }
          }`,
      variables: { id: task.id },
    })) as any;
    expect(data!.updateTask).toBe(null);
    expect(errors).toHaveLength(1);
    expect(errors![0].path).toEqual(['updateTask']);
    expect(errors![0].message).toEqual(
      `Access denied: You cannot update that Task - it may not exist`
    );
  }

  {
    const { data, errors } = (await context
      .withSession({ itemId: alice.id, data: {} })
      .graphql.raw({
        query: `mutation update($id: ID!) {
              updateTask(where: { id: $id }, data: { isComplete: true }) {
                id
              }
            }`,
        variables: { id: task.id },
      })) as any;
    expect(data!.updateTask.id).toEqual(task.id);
    expect(errors).toBe(undefined);
  }

  // Check that we can't update the task when logged in as Bob
  {
    const { data, errors } = (await context.withSession({ itemId: bob.id, data: {} }).graphql.raw({
      query: `mutation update($id: ID!) {
              updateTask(where: { id: $id }, data: { isComplete: true }) {
                id
              }
            }`,
      variables: { id: task.id },
    })) as any;
    expect(data!.updateTask).toBe(null);
    expect(errors).toHaveLength(1);
    expect(errors![0].path).toEqual(['updateTask']);
    expect(errors![0].message).toEqual(
      `Access denied: You cannot update that Task - it may not exist`
    );
  }
});
