
import {
	AccessToken,
	PaywallGuardianTopic,
	ClaimsVanguardTopic,
} from "authoritarian/dist-cjs/interfaces"

import {verifyToken} from "authoritarian/dist-cjs/crypto"

const mockAccessToken: AccessToken = "a123"

export function createPaywallGuardian({authServerPublicKey, claimsVanguard}: {
	authServerPublicKey: string
	claimsVanguard: ClaimsVanguardTopic
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
