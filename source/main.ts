
import * as Koa from "koa"
import * as mount from "koa-mount"

import {PaywallGuardianApi} from "authoritarian/dist-cjs/interfaces"
import {createApiServer} from "renraku/dist/cjs/server/create-api-server"

import {createPaywallGuardian} from "./paywall-guardian"

main().catch(error => console.error(error))

export async function main() {
	const port = 8005

	//
	// PAYWALL GUARDIAN
	// renraku json rpc api
	//

	const {koa: paywallKoa} = createApiServer<PaywallGuardianApi & any>({
		debug: true,
		logger: console,
		exposures: [
			{
				allowed: /^http\:\/\/localhost\:8\d{3}$/i,
				forbidden: null,
				exposed: {
					paywallGuardian: createPaywallGuardian()
				}
			}
		]
	})

	//
	// run the koa server app
	//

	const koa = new Koa()
	koa.use(mount("/api", paywallKoa))
	koa.listen(port)
	console.log(`Paywall guardian server listening on port ${port}`)
}
