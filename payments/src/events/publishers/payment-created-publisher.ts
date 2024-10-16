import { PaymentCreatedEvent, Publisher, Subjects } from '@kaartjes/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
