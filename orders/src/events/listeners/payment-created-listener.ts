import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@kaartjes/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  queueGroupName = queueGroupName
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId, stripeId } = data
    // Find Order
    const order = await Order.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }
    // Update Order Status
    order.set({ status: OrderStatus.Complete })
    await order.save()

    // Publish Event?

    // Acknowledge Message
    msg.ack()
  }
}
