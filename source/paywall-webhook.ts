
import {Collection} from "mongodb"
import {PaywallWebhooksTopic} from "./interfaces"
import {ClaimsVanguardTopic} from "authoritarian/dist-cjs/interfaces"

export async function createPaywallWebhook({
	claimsVanguard,
	paypalWebhookUrl,
	paymentsCollection,
}: {
	paypalWebhookUrl: string
	paymentsCollection: Collection
	claimsVanguard: ClaimsVanguardTopic
}): Promise<PaywallWebhooksTopic> {

	// TODO post this to the paypal api...
	const paypalRequestJson = {
		url: paypalWebhookUrl,
		event_types: [
			{name: "PAYMENT.AUTHORIZATION.CREATED"},
			{name: "PAYMENT.AUTHORIZATION.VOIDED"}
		]
	}
	console.warn("TODO post to paypal api")

	return {
		async webhook() {
			throw new Error(`TODO unimplemented`)
		}
	}
}
