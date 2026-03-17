import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

const PLANS = {
  BASIC: { priceId: 'price_basic', name: 'Basic', listings: 10, price: 29 },
  PROFESSIONAL: { priceId: 'price_professional', name: 'Professional', listings: 50, price: 79 },
  ENTERPRISE: { priceId: 'price_enterprise', name: 'Enterprise', listings: -1, price: 199 },
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private stripe: Stripe;

  constructor(private config: ConfigService, private prisma: PrismaService) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY', ''), { apiVersion: '2023-10-16' });
  }

  getPlans() {
    return Object.entries(PLANS).map(([key, plan]) => ({ id: key, ...plan }));
  }

  async createCheckoutSession(userId: string, plan: string) {
    const planConfig = PLANS[plan];
    if (!planConfig) throw new Error('Invalid plan');

    let subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const customer = await this.stripe.customers.create({ email: user.email });
      customerId = customer.id;
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${this.config.get('APP_URL')}/dashboard?subscription=success`,
      cancel_url: `${this.config.get('APP_URL')}/pricing`,
      metadata: { userId, plan },
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.config.get('STRIPE_WEBHOOK_SECRET'),
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.prisma.subscription.upsert({
          where: { userId: session.metadata.userId },
          create: {
            userId: session.metadata.userId,
            plan: session.metadata.plan as any,
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string,
          },
          update: {
            plan: session.metadata.plan as any,
            status: 'ACTIVE',
            stripeSubId: session.subscription as string,
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: { status: 'CANCELLED' },
        });
        break;
      }
    }
  }
}
