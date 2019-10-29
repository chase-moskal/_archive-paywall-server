
import * as Koa from "koa"
import * as mount from "koa-mount"

import {promises as fsPromises} from "fs"
const read = (path: string) => fsPromises.readFile(path, "utf8")

import {ClaimsVanguardTopic} from "authoritarian/dist-cjs/interfaces"
import {createApiServer} from "renraku/dist-cjs/server/create-api-server"

import {Config, Api} from "./interfaces"
import {createPaywallGuardian} from "./paywall-guardian"

main().catch(error => console.error(error))

export async function main() {

	//
	// configuration
	//

	const config: Config = JSON.parse(await read("config/config.json"))
	const {port, authServerPublicKey: keyPath} = config
	const authServerPublicKey = await read(keyPath)

	//
	// business logic objects
	//

	// mock vanguard
	const claimsVanguard: ClaimsVanguardTopic = {
		async createUser(o) {
			return {
				userId: "u123",
				public: {claims: {}},
				private: {claims: {}
			}
		}},
		async getUser(o) {
			return {
				userId: "u123",
				public: {claims: {}},
				private: {claims: {}
			}
		}},
		async setClaims(o) {
			return {
				userId: "u123",
				public: {claims: {}},
				private: {claims: {}
			}
		}},
	}

	const paywallGuardian = createPaywallGuardian({
		authServerPublicKey,
		claimsVanguard,
	})

	//
	// json rpc api
	//

	const {koa: apiKoa} = createApiServer<Api>({
		debug: true,
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

	const koa = new Koa()
	koa.use(mount("/api", apiKoa))
	koa.listen(port)
	console.log(`Paywall guardian server listening on port ${port}`)
}
