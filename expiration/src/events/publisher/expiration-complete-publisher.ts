import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@b-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
