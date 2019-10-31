
# paywall-server: [authoritarian](https://github.com/chase-moskal/authoritarian-client) microservice

## hypothetical paywall-server usage
&nbsp;&nbsp; *concept usage instructions for paywall-server*

1. prerequisites
	- run an `auth-server`, so we can change user claims
	- configure a sandbox app in the paypal developer panel
		- set the webhook url to your paywall-server location
1. configure the paywall-server
	- `config.json`
		- set `auth-server` url
		- provide paypal config, (client-id, secret)
		- relate which paypal subscriptions relate to which claims
	- key exchange for secure communications
		- generate keys with `npm run generate-keys`
		- copy `paywall-server.public.pem` to the `auth-server/config/whitelist/`
			- now the auth-server will allow paywall-server to change user claims
1. use `<paywall-panel>` authoritarian-client in your ui
	- configure authoritarian to point at your `paywall-server` url

<br/><br/>

------

# paypal tutorial: how paywall-server was implemented

## (A) paypal setup
&nbsp;&nbsp; *define subscription billing details like the monthly price*

1. **sign up for the paypal developer sandbox,**  
	create a sandbox app, get the credentials, client_id, secret, whatever
1. **follow the curl commands to set up your subscription service,**  
	because paypal lacks a web interface for this for some reason
	- https://developer.paypal.com/docs/subscriptions/integrate/
	- fetch an access token from the paypal api, using your client id and secret
	- log these interactions with paypal; keep track of the tokens and id's you get back
	- plop the access token into the next curl commands which provide details about your subscription service
	- first you make a "product", then you add the "plans" for that product
	- [billing cycle reference...](https://developer.paypal.com/docs/api/subscriptions/v1/#definition-billing_cycle) my billing cycle plan looked like:
		```json
		{
			"billing_cycles": [
				{
					"frequency": {
						"interval_unit": "MONTH",
						"interval_count": 1
					},
					"tenure_type": "REGULAR",
					"sequence": 1,
					"total_cycles": 0,
					"pricing_scheme": {
						"fixed_price": {
							"value": "10",
							"currency_code": "CAD"
						}
					}
				}
			]
		}
		```
	- now you have a product-id, and a plan-id 👍

## (B) implement paypal button into a popup
&nbsp;&nbsp; *render a paypal button and do some clientside processing*

1. **popup: because paypal clientside sdk is *disgustingly* huge**
	- at *300 kilobytes(!!)* the [paypal render button](https://github.com/paypal/paypal-checkout-components/blob/master/dist/button.js) weighs a ton
	- it's not acceptable to load this honker on every page
	- instead, we'll have a special popup page dedicated to presenting the paypal button
	- sadly, this means a bunch of `postMessage` shenanigans
1. **make the popup window**
	- we'll have the paywall microservice serve up this popup
	- use browserify, because paypal code is all commonjs
	- set up a postmessage bridge
1. **install the paypal components sdk**
	- [paypal docs on "create a subscription"](https://developer.paypal.com/docs/subscriptions/integrate/#4-create-a-subscription)
	- those docs are partly obsolete, there is now an npm package
	- import [@paypal/checkout-components](https://github.com/paypal/paypal-checkout-components)
1. **render the button onto the page**
	- call the paypal buttons function
		```js
		import {Buttons} from "@paypal/checkout-components/dist/button.js"

		function setupPaypalButton({planId, clientId}) {
			const paypalArea = document.createElement("div")
			div.id = "paypal-area"
			document.body.appendChild(paypalArea)

			const buttons = Buttons({
				createSubscription(data, actions) {},
				onApprove(data, actions) {},
				onCancel(data, actions) {},
				onError(error) {},
			})

			buttons.render("#paypal-area")
		}
		```
	- `createSubscription`
		- we tell paypal what we're making the button for
		- this is where we give it the `plan_id`
	- `onApproved`
		- tell paypal to capture the payment
		- tell your server about the transaction and our userId
	- still not sure where to pass in the `client_id`...

## (C) verify paypal transactions on our server
&nbsp;&nbsp; *verify paypal transactions and change user claims*

- our clientside popup tells our server about the completed paypal transaction
- sadly, paypal wants us to launch an http request to confirm every transaction
- this is where our server will update our user's claims

## (D) receive paypal webhooks on our server
&nbsp;&nbsp; *we also must stay vigilant of payment failures etc*

- `BILLING.PLAN.CREATED`
- *...todo...*
