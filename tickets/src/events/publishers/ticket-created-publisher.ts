import { Publisher, Subjects, TicketCreatedEvent } from '@kaartjes/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
