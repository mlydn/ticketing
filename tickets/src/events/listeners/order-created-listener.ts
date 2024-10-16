import { Listener, OrderCreatedEvent, Subjects } from '@kaartjes/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

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

    // Save ticket
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })

    // Acknowledge message
    msg.ack()
  }
}
