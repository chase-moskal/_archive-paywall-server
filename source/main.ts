
import * as Koa from "koa"
import * as koaCors from "@koa/cors"
import * as koaBodyParser from "koa-bodyparser"
import {createApiServer} from "renraku/dist-cjs/server/create-api-server"

import {promises as fsPromises} from "fs"
const read = (path: string) => fsPromises.readFile(path, "utf8")

import {Config, Api} from "./interfaces"
import {mockClaimsVanguard} from "./mocks"
import {endpoint} from "./toolbox/endpoint"
import {createPaywallWebhook} from "./paywall-webhook"
import {createPaywallGuardian} from "./paywall-guardian"
import {createMongoCollection} from "./toolbox/create-mongo-collection"

main().catch(error => console.error(error))

export async function main() {

	//
	// configuration
	//

	const {
		debug,
		apiPort,
		webhookPort,
		paypalWebhookUrl,
		paymentsDatabase,
		authServerPublicKey: keyPath
	}: Config = JSON.parse(await read("config/config.json"))

	//
	// initialization
	//

	const authServerPublicKey = await read(keyPath)
	const paymentsCollection = await createMongoCollection(paymentsDatabase)
	const claimsVanguard = mockClaimsVanguard
	const paywallGuardian = createPaywallGuardian({
		claimsVanguard,
		paymentsCollection,
		authServerPublicKey,
	})
	const paywallWebhook = await createPaywallWebhook({
		claimsVanguard,
		paypalWebhookUrl,
		paymentsCollection,
	})

	//
	// endpoint: webhook
	// receives updates from paypal
	//

	const webhookKoa = new Koa()
		.use(koaCors())
		.use(koaBodyParser())
		.use(async(context, next) => {
			try {
				const {request, response} = context
				console.debug("🔔 webhook", request.path, request.body)
				response.type = "application/json"
				response.body = JSON.stringify(
					await paywallWebhook.webhook(request.body)
				)
				return next()
			}
			catch (error) {
				context.throw(500, debug ? error.message : "error")
			}
		})

	//
	// endpoint: json rpc api
	//

	const {koa: apiKoa} = createApiServer<Api>({
		debug,
		logger: console,
		topics: {
			paywallGuardian: {
				exposed: paywallGuardian,
				cors: {
					allowed: /^http\:\/\/localhost\:8\d{3}$/i,
					forbidden: null,
				}
			}
		}
	})

	//
	// run server
	//

	endpoint("/api", apiKoa, apiPort)
	console.log(`🌐 ${apiPort} paywall api`)

	endpoint("/webhook", webhookKoa, webhookPort)
	console.log(`🌐 ${webhookPort} paywall webhook`)
}
