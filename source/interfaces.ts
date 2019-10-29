
import {TopicApi} from "renraku/dist-cjs/interfaces"
import {
	PaywallGuardianTopic
} from "authoritarian/dist-cjs/interfaces"

export interface Config {
	port: number
	authServerPublicKey: string
}

export interface Api extends TopicApi<Api> {
	paywallGuardian: PaywallGuardianTopic
}
