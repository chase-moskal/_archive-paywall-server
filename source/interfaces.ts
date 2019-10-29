
import {TopicApi} from "renraku/dist-cjs/interfaces"
import {
	PaywallGuardianTopic
} from "authoritarian/dist-cjs/interfaces"

export interface Config {
	debug: boolean
	apiPort: number
	webhookPort: number
	paypalWebhookUrl: string
	authServerPublicKey: string
	paymentsDatabase: CollectionConfig
}

export interface CollectionConfig {
	uri: string
	dbName: string
	collectionName: string
}

export interface Api extends TopicApi<Api> {
	paywallGuardian: PaywallGuardianTopic
}

export interface PaywallWebhooksTopic {
	webhook(body: {}): Promise<any>
}
