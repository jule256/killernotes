/* global define:true, console:true */
define(
    [
        'jQuery',
        'config',
        'auxiliary'
    ], function($, config, auxiliary) {

    'use strict';

    // define "static" functions
    var returnedValidate = {

        /**
         * entry point of the form validation. Checks if the key-value pairs of the given data are valid according
         * to the validators from the config's form element definition
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} data
         * @returns {{failed: boolean, messages: {}}}
         */
        validateFormData: function(data) {
            var i,
                formElements = config.formElements,
                formElement,
                validationFailed = false,
                validationMessages = [],
                allValidationMessages = {};

            // @todo set all error messages classes to "hide"

            for (i = 0; i < formElements.length; i++) {
                formElement = formElements[i];

                // validate the current formELement
                validationMessages = returnedValidate.validateField(
                    formElement.name,
                    data[formElement.name],
                    formElement.title,
                    formElement.validator
                );

                if (validationMessages.length > 0) {
                    // only add validation messages if they are not empty
                    allValidationMessages[formElement.name] = validationMessages;
                    // store the existance of validation messages for faster processing
                    validationFailed = true;
                }
            }

            return {
                failed: validationFailed,
                messages: allValidationMessages
            };
        },

        /**
         * checks if the validators of the given form-element are okay with the given value. If errors occur, the
         * returned array will contain the error-messages
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {string} key
         * @param {number} value
         * @param {string} title
         * @param {object} validators the validator-object of the form-element
         * @returns {Array}
         */
        validateField: function(key, value, title, validators) {
            var validationMessages = [],
                validateReturn;

            if (typeof validators === 'undefined') {
                throw Error('formelement "' + key + '" with value "' + value + '" has no validator.');
            }

            $.each(validators, function(validatorName, validator) {
                switch (validatorName) {
                    case 'notEmpty':
                        validateReturn = returnedValidate.validateNotEmpty(key, value, title, validator);
                        if (validateReturn !== true) {
                            // this is a message
                            validationMessages.push(validateReturn);
                        }
                        break;
                    case 'length':
                        validateReturn = returnedValidate.validateLength(key, value, title, validator);
                        if (validateReturn !== true) {
                            // this is a message
                            validationMessages.push(validateReturn);
                        }
                        break;
                    case 'values':
                        validateReturn = returnedValidate.validateValues(key, value, title, validator);
                        if (validateReturn !== true) {
                            // this is a message
                            validationMessages.push(validateReturn);
                        }
                        break;
                    case 'datetime':
                        validateReturn = returnedValidate.validateDatetime(key, value, title, validator);
                        if (validateReturn !== true) {
                            // this is a message
                            validationMessages.push(validateReturn);
                        }
                        break;
                    default:
                        throw Error('validator "' + validatorName + '" is not implemented yet.');
                }
            });

            return validationMessages;
        },

        // @todo signature of all validate*() functions are identical. Is there a usable design-pattern?

        /**
         * returns true if the given value is not empty and a message otherwise
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {string} key
         * @param {number} value
         * @param {string} title
         * @param {object} validator
         * @returns {boolean|string}
         */
        validateNotEmpty: function(key, value, title, validator) {
            if (+('' + value).length === 0) {
                return '"' + title + '" cannot be empty';
            }
            return true;
        },

        /**
         * returns true if the given value has between the validator's min and max characters and a message otherwise
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {string} key
         * @param {number} value
         * @param {string} title
         * @param {object} validator
         * @returns {boolean|string}
         */
        validateLength: function(key, value, title, validator) {
            if (!auxiliary.isString(value)) {
                throw Error('"' + value + '" is not a string');
            }
            if (('' + value).length < validator.min || ('' + value).length > validator.max) {
                return '"' + title + '" has to have a minimum length of ' + validator.min + ' characters and ' +
                    'a maximum length of ' + validator.max + ' characters';
            }
            return true;
        },

        /**
         * returns true if the given value is in the whitelist of the given validator and a message otherwise
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {string} key
         * @param {number} value
         * @param {string} title
         * @param {object} validator
         * @returns {boolean|string}
         */
        validateValues: function(key, value, title, validator) {
            var i,
                length = validator.whitelist.length;
            if (!auxiliary.isString(value)) {
                throw Error('"' + value + '" is not a string');
            }
            for (i = 0; i < length; i++) {
                if ('' + validator.whitelist[i] === value) {
                    return true;
                }
            }
            return 'the value "' + value + '" of "' + title + '" not valid';
        },

        /**
         * returns true if the given value is a valid timestamp and a message otherwise
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {string} key
         * @param {number} value
         * @param {string} title
         * @param {object} validator
         * @returns {boolean|string}
         */
        validateDatetime: function(key, value, title, validator) {
            return (new Date(value)).getTime() > 0 || 'please enter a correct date and time for "' + title + '"';
        }
    };

    return returnedValidate;
});