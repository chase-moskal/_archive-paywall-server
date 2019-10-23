
import * as Koa from "koa"
import * as mount from "koa-mount"

import {createApiServer} from "renraku/dist/cjs/server/create-api-server"
import {
	PaywallGuardianApi,
	ClaimsVanguardTopic,
} from "authoritarian/dist-cjs/interfaces"

import {createPaywallGuardian} from "./paywall-guardian"

main().catch(error => console.error(error))

export async function main() {
	const port = 8005
	const publicKey = "mocklol"
	const claimsVanguard: ClaimsVanguardTopic = {
		async createUser(o) {return {userId: "u123", claims: {}}},
		async getUser(o) {return {userId: "u123", claims: {}}},
		async setClaims(o) {return {userId: "u123", claims: {}}},
	}

	//
	// PAYWALL GUARDIAN
	// renraku json rpc api
	//

	const {koa: paywallGuardianKoa} = createApiServer<PaywallGuardianApi>({
		debug: true,
		logger: console,
		exposures: [
			{
				allowed: /^http\:\/\/localhost\:8\d{3}$/i,
				forbidden: null,
				exposed: {
					paywallGuardian: createPaywallGuardian({claimsVanguard, publicKey})
				}
			}
		]
	})

	//
	// run the koa server app
	//

	const koa = new Koa()
	koa.use(mount("/api", paywallGuardianKoa))
	koa.listen(port)
	console.log(`Paywall guardian server listening on port ${port}`)
}
