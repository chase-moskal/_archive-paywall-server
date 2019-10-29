
import {
	AccessToken,
	ClaimsVanguardTopic,
	PaywallGuardianTopic,
} from "authoritarian/dist-cjs/interfaces"
import {Collection} from "mongodb"
import {verifyToken} from "authoritarian/dist-cjs/crypto"

const mockAccessToken: AccessToken = "a123"

export function createPaywallGuardian({
	claimsVanguard,
	paymentsCollection,
	authServerPublicKey,
}: {
	authServerPublicKey: string
	claimsVanguard: ClaimsVanguardTopic
	paymentsCollection: Collection
}): PaywallGuardianTopic {

	return {
		async grantUserPremium({accessToken, paypalToken}):
		 Promise<AccessToken> {
			return mockAccessToken
		},

		async revokeUserPremium({accessToken, paypalToken}):
		 Promise<AccessToken> {
			return mockAccessToken
		}
	}
}
