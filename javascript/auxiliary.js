/* global define:true, console:true */
define(
    [
        'jQuery',
        'config'
    ], function ($, config) {

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
                    html.push('<input type="checkbox" id="create-' + formElement.name + '"' + valueHtml + '>');
                    break;
                default:
                    html.push('<span id="' + mode + '-' + formElement.name + '">');
                    html.push('unknown form element type: ' + formElement.type);
                    html.push('</span>');
            }

            return html.join("\n");
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
                formOptions = config.formOptions;
            $.each(formOptions, function(key, formElement) {
                if (typeof formElement.dependant === 'undefined') {
                    if (typeof formElement.dependee !== 'undefined') {
                        if (formElement.type === 'date' && formOptions[formElement.dependee].type === 'time') {
                            // this is a date field and the dependee is a time field -> merge the two values
                            date = $('#' + mode + '-' + formElement.name).val();
                            time = $('#' + mode + '-' + formOptions[formElement.dependee].name).val();
                            data[formElement.name] = Date.parse(date + ' ' + time);
                        }
                        // @todo maybe add some fallback here to tackle missconfiguration of the config
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
        }
    };

    return returnedAuxiliary;
});