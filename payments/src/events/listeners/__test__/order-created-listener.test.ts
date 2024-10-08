import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@kaartjes/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdad',
    expiresAt: 'asad',
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 99,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { data, listener, msg }
}

it('copies order details', async () => {
  const { data, listener, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})

it('copies order details', async () => {
  const { data, listener, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
