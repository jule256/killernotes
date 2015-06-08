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

        handlebarsFormElementHelper: function(formElements, options) {
            var html = [],
                mode = options.data.root.mode;

            $.each(formElements, function(key, formElement) {
                html.push('<label for="' + mode + '-' + formElement.name + '">');
                html.push(formElement.title);
                html.push('</label>');
                html.push('<div>');
                html.push(returnedAuxiliary.getFormElementHtml(formElement, mode));
                html.push('</div>');
            });

            return html.join("\n");
        },

        /**
         * retrieves a formElement-object and returns the html-code usable for displaying that formElement
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Object} formElement
         * @param {string} mode (should be either "create" or "edit")
         * @returns {string}
         */
        getFormElementHtml: function(formElement, mode) {
            var html = [],
                valueHtml;

            // handle magic strings for default date functionality
            formElement = returnedAuxiliary.handleMagicStrings(formElement);

            switch(formElement.type) {
                case 'input':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : ' value="' + formElement.value + '"';
                    html.push('<input type="text" id="' + mode + '-' + formElement.name + '"' + valueHtml + '>');
                    break;
                case 'text':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : formElement.value;
                    html.push('<textarea id="' + mode + '-' + formElement.name + '">' + valueHtml + '</textarea>');
                    break;
                case 'select':
                    html.push('<select id="' + mode + '-' + formElement.name + '">');
                    $.each(formElement.options, function(key, value) {
                        valueHtml = '';
                        if (typeof formElement.value !== 'undefined' && +formElement.value === +key) {
                            valueHtml = ' selected="selected"';
                        }
                        html.push('<option value="' + key + '"' + valueHtml + '>' + value + '</option>');
                    });
                    html.push('</select>');
                    break;
                case 'date':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : ' value="' + formElement.value + '"';
                    html.push('<input type="date" id="' + mode + '-' + formElement.name + '"' + valueHtml + '>');
                    break;
                case 'time':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : ' value="' + formElement.value + '"';
                    html.push('<input type="time" id="' + mode + '-' + formElement.name + '"' + valueHtml + '>');
                    break;
                case 'checkbox':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : formElement.value ? 'checked' : '';
                    html.push('<input type="checkbox" id="' + mode + '-' + formElement.name + '"' + valueHtml + '>');
                    break;
                default:
                    html.push('<span id="' + mode + '-' + formElement.name + '">');
                    html.push('unknown form element type: ' + formElement.type);
                    html.push('</span>');
            }

            return html.join("\n");
        },

        /**
         * analyizes the value key of the given formElement. If the value key contains a "magic string" the value key's
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

        loadTemplate: function(path) {
            $.get(path, function(contents) {
                return handlebars.compile(contents);
            });
        }
    };

    return returnedAuxiliary;
});