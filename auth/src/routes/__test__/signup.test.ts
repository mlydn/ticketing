import request from 'supertest'

import { app } from '../../app'

it('returns a 201 on successful sign up', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
})

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalid',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'x',
    })
    .expect(400)
})

it('returns a 400 without email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400)
})

it('disallows duplicate passwords', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('sets a cookie after succesful sign up', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})
