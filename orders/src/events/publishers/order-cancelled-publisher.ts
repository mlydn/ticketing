import { Publisher, Subjects, OrderCancelledEvent } from '@kaartjes/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
