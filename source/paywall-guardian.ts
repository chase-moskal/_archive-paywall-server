
import {
	AccessToken,
	BraintreeToken,
	PaywallGuardianTopic,
} from "authoritarian/dist-cjs/interfaces.js"

const mockAccessToken: AccessToken = "a123"
const mockBraintreeToken: BraintreeToken = "b123"

export function createPaywallGuardian(): PaywallGuardianTopic {
	return {

		async getBraintreeToken(): Promise<BraintreeToken> {
			return mockBraintreeToken
		},

		async grantUserPremium({accessToken, braintreeNonce}):
		 Promise<AccessToken> {
			return mockAccessToken
		},

		async revokeUserPremium({accessToken, braintreeNonce}):
		 Promise<AccessToken> {
			return mockAccessToken
		}
	}
}
