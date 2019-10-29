
import {ClaimsVanguardTopic} from "authoritarian/dist-cjs/interfaces"

export const mockClaimsVanguard: ClaimsVanguardTopic = {
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
