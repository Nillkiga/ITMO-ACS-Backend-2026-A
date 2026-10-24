import amqp, { Channel, ConsumeMessage } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; // 3 секунды

let channel: Channel | null = null;

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getRabbitChannel(): Promise<Channel> {
    if (channel) return channel;
    
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            await channel.assertExchange('restaurant.events', 'fanout', { durable: true });
            console.log('RabbitMQ connected');
            return channel;
        } catch (err) {
            console.log(`RabbitMQ not ready, retry ${i + 1}/${MAX_RETRIES}...`);
            await wait(RETRY_DELAY);
        }
    }
    
    throw new Error('RabbitMQ connection failed after retries');
}

export async function publishEvent(event: string, data: any) {
    const ch = await getRabbitChannel();
    ch.publish('restaurant.events', '', Buffer.from(JSON.stringify({ event, data })));
    console.log(`Published event: ${event}`, data);
}

export async function subscribeToEvents(callback: (event: string, data: any) => void) {
    const ch = await getRabbitChannel();
    
    const queue = await ch.assertQueue('', { exclusive: true });
    await ch.bindQueue(queue.queue, 'restaurant.events', '');
    
    await ch.consume(queue.queue, (msg: ConsumeMessage | null) => {
        if (msg) {
            const { event, data } = JSON.parse(msg.content.toString());
            callback(event, data);
            ch.ack(msg);
        }
    });
    
    console.log('Subscribed to restaurant.events');
}