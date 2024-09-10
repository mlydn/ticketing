import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: '123',
  })
  // Save ticket to DB
  await ticket.save()
  // Fetch ticket twice
  const t1 = await Ticket.findById(ticket.id)
  const t2 = await Ticket.findById(ticket.id)
  // Make 2 separate changes to the ticket
  t1!.set({ price: 10 })
  t2!.set({ price: 15 })
  // Save the first fetched ticket
  await t1!.save()
  // Save the second fetched ticket and expect an error
  try {
    await t2!.save()
  } catch (err) {
    return
  }

  throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: '123',
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)

  await ticket.save()
  expect(ticket.version).toEqual(1)

  await ticket.save()
  expect(ticket.version).toEqual(2)
})
