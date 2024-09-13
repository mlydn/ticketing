import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledEvent } from '@kaartjes/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  const orderId = new mongoose.Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdsah',
  })

  ticket.set({ orderId: orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: 'asd',
    version: 1,
    ticket: {
      id: ticket.id,
    },
  }

  return { listener, data, msg }
}

it('updates ticket after order is cancelled', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const ticket = await Ticket.findById(data.ticket.id)
  expect(ticket!.orderId).not.toBeDefined()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('acks the msg', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
