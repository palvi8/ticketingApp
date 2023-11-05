import request  from "supertest";
import {app} from "../../app";
import { Ticket } from "../../models/ticket";

const builTicket = async () => {
    const ticket = Ticket.build({
        title: 'Concert1',
        price: 200,
    });
    await ticket.save();
    
    return ticket;
}


it('should fetch order for particular user', async () => {

    const ticketOne = await builTicket();
    const ticketTwo = await builTicket();
    const ticketThree = await builTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

     await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ticketId: ticketOne.id})
    .expect(201);

    const {body: orderOne} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ticketId: ticketTwo.id})
    .expect(201);

    const {body: orderTwo}  = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ticketId: ticketThree.id})
    .expect(201);

    const respone = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

    expect(respone.body.length).toEqual(2);
    expect(respone.body[0].id).toEqual(orderOne.id)
    expect(respone.body[1].id).toEqual(orderTwo.id)
    expect(respone.body[0].ticket.id).toEqual(ticketTwo.id)
    expect(respone.body[1].ticket.id).toEqual(ticketThree.id)
});