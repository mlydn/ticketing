import { Message } from 'node-nats-streaming'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { ExpirationCompleteEvent, OrderStatus } from '@kaartjes/common'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 124,
  })
  await ticket.save()

  // Create an order for ticket
  const order = Order.build({
    userId: 'asdas',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  // Create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  const data = { orderId: order.id }

  const listener = new ExpirationCompleteListener(natsWrapper.client)

  return { data, listener, msg }
}

it('changes order status to cancelled', async () => {
  const { data, listener, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.orderId)
  expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes the event', async () => {
  const { data, listener, msg } = await setup()
  await listener.onMessage(data, msg)

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(eventData.id).toEqual(data.orderId)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
