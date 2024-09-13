import { Message } from 'node-nats-streaming'
import { OrderCreatedEvent, OrderStatus, Subjects } from '@kaartjes/common'
import { Ticket } from '../../../models/ticket'
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  // Create Listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  // Create Ticket
  const ticket = await Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asahdj',
  })

  await ticket.save()

  // Create OrderCreatedEvent
  const data: OrderCreatedEvent['data'] = {
    id: 'hjhj',
    version: 0,
    status: OrderStatus.Created,
    userId: 'asasj',
    expiresAt: 'jkjk',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('it updates the orderId when a ticket is created', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(data.ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(data.id).toEqual(ticketUpdatedData.orderId)
})
