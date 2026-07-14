/**
 * /api/webhooks/stripe — REMOVED
 *
 * Stripe billing integration is not yet in scope for this release.
 * This file intentionally contains no handlers. Stripe's webhook
 * delivery will correctly receive a 405 Method Not Allowed and can
 * be configured to retry, rather than silently swallowing events.
 *
 * When billing is implemented, restore this file with:
 *   1. POST handler only (webhooks are POST requests)
 *   2. Stripe signature verification using stripe.webhooks.constructEvent()
 *   3. STRIPE_WEBHOOK_SECRET env var in .env.example
 */

export {};
