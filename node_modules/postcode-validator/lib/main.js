"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcode_regexes_1 = require("./postcode-regexes");
exports.postcodeValidator = (postcode, country) => {
    if (!postcode_regexes_1.POSTCODE_REGEXES.has(country)) {
        // throw Error if country code is unrecognised
        throw Error(`Invalid country code: ${country}`);
    }
    return postcode_regexes_1.POSTCODE_REGEXES.get(country).test(postcode);
};
exports.postcodeValidatorExistsForCountry = (country) => {
    return postcode_regexes_1.POSTCODE_REGEXES.has(country);
};
