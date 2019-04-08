var authy = require('authy')('0TeHzR8QyOqdshqWpl1rNh2EW17Zm7YE');
var request = require("request");
var constants = require('./constants');
var utils = require('./commonfunctions');

exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;

/**
 *
 * [POST]
 * API to send otp via twilio, Request body requires following parameters:
 * @param {string} phone_no - mobile of the user
 * @param {string} country_code - country code of country
 * @return {JSON} Response body contains simple json object.
 *
 */

function sendOtp(phone_no, country_code) {
	if(!country_code)
		country_code = "+91"

	return new Promise((resolve, reject) => {

		if (utils.checkBlank([phone_no, country_code])) {
			return res.send(constants.parameterMissingResponse);
		}

		//hardcoded email for twilio send otp api
		var email = 'user@gmail.com';

		authy.register_user(email, phone_no, country_code, function (err, result) {
			// res = {user: {id: 1337}} where 1337 = ID given to use, store this someplace

			var options = {
				method: 'GET',
				url: 'https://api.authy.com/protected/json/sms/' + result.user.id,
				qs: {
					api_key: '0TeHzR8QyOqdshqWpl1rNh2EW17Zm7YE'
				},
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/json'
				},
				body: {
					email: email,
					phone: phone_no,
					countryCode: country_code
				},
				json: true
			};

			request(options, function (error, response, body) {
				if (error) reject(error);
				resolve({
					"log": "Successfully sent OTP",
					"flag": constants.responseFlags.ACTION_COMPLETE,
					"auth_id": result.user.id,
					"result": body
				});
			});
		});
	});

}


/**
 *
 * [POST]
 * API to verify otp via twilio, Request body requires following parameters:
 * @param {string} otp - otp sent to mobile
 * @return {JSON} Response body contains simple json object.
 *
 */

function verifyOtp(otp, auth_id) {
	console.log("verify otp called");

	return new Promise((resolve, reject) => {

		var options = {
			method: 'GET',
			url: 'https://api.authy.com/protected/json/verify/' + otp + '/' + auth_id,
			qs: {
				api_key: 'OZEiIbzs3JzcxZO91U23q1U63mR64xRu'
			},
			headers: {
				'postman-token': '0cb2cf93-23a7-1f63-37bf-bd7720819535',
				'cache-control': 'no-cache',
				'content-type': 'application/json'
			},
			json: true
		};

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

				console.log("Verify otp promise returned: " + JSON.stringify(body));

			if (!(body.success)) {
				reject({
					"log": "Invalid otp",
					"flag": constants.responseFlags.ACTION_FAILED,
					"result": body
				});
			}
				resolve({
					"log": "Successfully verfied otp",
					"flag": constants.responseFlags.ACTION_COMPLETE,
					"result": body
				});

		});
	});
}
