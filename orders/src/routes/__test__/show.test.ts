import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('shows an order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const user = global.signin()
  // make a request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if one user tries to access anothers order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const userOne = global.signin()
  const userTwo = global.signin()
  // make a request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401)
})