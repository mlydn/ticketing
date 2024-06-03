import request from 'supertest'
import { app } from '../../app'
import { cookie } from 'express-validator'
import { Ticket } from '../../models/ticket'

it('has a route handler listening to /api/tickets for POST requests', async () => {
  const response = await request(app).post('/api/tickets').send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed by signed in user', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401)
})

it('returns a status other than 401 if user is not signed in', async () => {
  const cookie = await global.signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({})
  expect(response.status).not.toEqual(401)
})

it('returns an error for invalid title', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400)
})

it('returns an error for invalid price', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'abcd',
      price: -10,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'abcd',
    })
    .expect(400)
})

it('creates a ticket for valid requests', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const title = 'abcd'

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 99,
    })
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(99)
  expect(tickets[0].title).toEqual(title)
})
