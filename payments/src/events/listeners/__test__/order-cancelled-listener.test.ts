import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent, OrderStatus } from '@kaartjes/common'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdad',
    price: 99,
  })
  await order.save()

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  }

  return { data, listener, msg }
}

it('should cancel the order', async () => {
  const { data, listener, msg } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
