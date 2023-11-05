import request  from "supertest";
import {app} from "../../app";
import { Ticket } from "../../models/ticket";

it("should fetch order", async () => {

    const ticket = Ticket.build({
        title: 'Concert1',
        price: 200,
    });
    await ticket.save();
    
    const user = global.signin();

    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);

    const {body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchOrder.id).toEqual(order.id);    
});

it("should return when userOne try to fetch userTwo order", async () => {

    const ticket = Ticket.build({
        title: 'Concert1',
        price: 200,
    });
    await ticket.save();
    
    const user = global.signin();

    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);

    const {body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);

    
});
