/* global define:true, console:true */
define(
    [
        'jQuery',
        'handlebars',
        'config'
    ], function ($, handlebars, config) {

    'use strict';

    // define "static" functions
    var returnedAuxiliary = {

        /**
         * Handlbar helper to generate form-fields. Templates can be defined for each formtype by the designer
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param formElement
         * @param options
         * @returns {*}
         */
        handlebarsFormElementHelper: function(formElement, options) {
            var formElementContext = {},
                mode = options.data.root.mode,
                typeTemplate = returnedAuxiliary.getFormTypeTemplate(formElement.type);
            //TODO: Templates should only be loaded once (not a problem if we precompile them)

            formElement = returnedAuxiliary.handleMagicStrings(formElement);

            formElementContext = {
                id: formElement.id,
                formId: mode,
                title: formElement.title,
                name: formElement.name
            };

            switch(formElement.type) {
                case 'checkbox':
                    formElementContext.value = typeof formElement.value === 'undefined' ? '' : formElement.value ? 'checked' : '';
                    break;
                case 'select':
                    formElementContext.options = returnedAuxiliary.handleSelectOptions(formElement);
                    break;
                case 'input':
                case 'text':
                case 'date':
                case 'time':
                default:
                    formElementContext.value = typeof formElement.value === 'undefined' ? '' : formElement.value;
            }

            return new handlebars.SafeString(typeTemplate(formElementContext));
        },

        /**
         * Handles the select-options
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param formElement
         * @param formElementContext
         */
        handleSelectOptions: function(formElement) {
            var options = [];

            $.each(formElement.options, function (key, value) {
                var selected = typeof formElement.value !== 'undefined' && +formElement.value === +key
                    ? 'selected'
                    : '';

                options.push({
                    key: key,
                    value: value,
                    selected: selected
                });
            });

            return options;
        },

        /**
         * analyzes the value key of the given formElement. If the value key contains a "magic string" the value key's
         * value is changed to the according value
         *
         * currently implemented:
         *     - now -> 'hh:mm'
         *     - tomorrow -> 'yyyy-mm-dd' (current datetime plus 24 hours)
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {object} formElement
         * @returns {object}
         */
        handleMagicStrings: function(formElement) {
            var todayDateObj,    // dates will be set in according case (including duplicated code) to avoid expensive
                tomorrowDateObj; // "new Date()" operations which are not necessary if the switch goes to "default"

            switch (formElement.value) {
                case 'now':
                    todayDateObj = new Date();
                    formElement.value = returnedAuxiliary.formatDateTime(todayDateObj);
                    break;
                case 'tomorrow':
                    todayDateObj = new Date();
                    tomorrowDateObj = new Date();
                    tomorrowDateObj.setDate(todayDateObj.getDate() + 1);
                    formElement.value = returnedAuxiliary.formatDateDate(tomorrowDateObj);
                    break;
                default:
                    // do nothing ...
            }

            return formElement;
        },

        /**
         * gets the data of the 'new' or 'edit' note form from the DOM. Takes the configuration into consideration
         * and therefore is able to merge dependants/dependees (used for date + time = timestamp). Returns an object
         * ready for saving into storage
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param mode
         * @returns {object}
         */
        extractData: function(mode) {
            var data = {},
                date,
                time,
                formElements = config.formElements;
            $.each(formElements, function(key, formElement) {
                if (typeof formElement.dependant === 'undefined') {
                    if (typeof formElement.dependee !== 'undefined') {
                        if (formElement.type === 'date' && formElements[formElement.dependee].type === 'time') {
                            // this is a date field and the dependee is a time field -> merge the two values
                            date = $('#' + mode + '-' + formElement.name).val();
                            time = $('#' + mode + '-' + formElements[formElement.dependee].name).val();
                            data[formElement.name] = Date.parse(date + ' ' + time);
                        }
                        // @todo maybe add some fallback here to tackle missconfiguration of the config
                    }
                    else if (formElement.type === 'checkbox') {
                        data[formElement.name] = $('#' + mode + '-' + formElement.name).is(':checked');
                    }
                    else {
                        // this field has no dependee -> get its value straight from DOM
                        data[formElement.name] = $('#' + mode + '-' + formElement.name).val();
                    }
                }
            });
            return data;
        },

        /**
         * takes a number and - if necessary - adds a leading zero so the returned number has always 2 digits
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Number} number
         * @returns {string}
         */
        pad2Digits: function(number) {
            return ('00' + number).slice(-2);
        },

        /**
         * returns the hh:mm:00.000 of given date object
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Date} dateObj
         * @returns {string}
         */
        formatDateTime: function(dateObj) {
            return returnedAuxiliary.pad2Digits(dateObj.getHours()) + ':' +
                returnedAuxiliary.pad2Digits(dateObj.getMinutes()) + ':00.000';
        },

        /**
         * returns the yyyy-MM-dd of given date object
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Date} dateObj
         * @returns {string}
         */
        formatDateDate: function(dateObj) {
            return dateObj.getFullYear() + '-' +
                returnedAuxiliary.pad2Digits(dateObj.getMonth() + 1) + '-' +
                returnedAuxiliary.pad2Digits(dateObj.getDate());
        },

        /**
         * compiles the template for the specified type
         *
         * @author Dominik Süsstrunk <dominik.suestrunk@gmail.com>
         * @param {string} type
         * @returns {function}
         */
        getFormTypeTemplate: function(type) {
            var handlebarSource = $('#template-form-' + type).html();
            return handlebars.compile(handlebarSource);
        }
    };

    return returnedAuxiliary;
});