import { Publisher, Subjects, TicketUpdatedEvent } from '@kaartjes/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
