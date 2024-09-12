import { Listener, OrderCreatedEvent, Subjects } from '@kaartjes/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find ticket
    const ticket = await Ticket.findById(data.ticket.id)

    // Throw error if not found
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // Update ticket
    ticket.set({ orderId: data.id })

    // Save ticekt
    await ticket.save()

    // Acknowledge message
    msg.ack()
  }
}
