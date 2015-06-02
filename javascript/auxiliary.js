/* global define:true, console:true */
define(
    [
        'jQuery'
    ], function ($) {

    'use strict';

    // define "static" functions
    var returnedAuxiliary = {

        handlebarsFormElementHelper: function(formElements, options) {
            var html = [];

            $.each(formElements, function(key, formElement) {
                html.push('<label for="create-' + formElement.name + '">');
                html.push(formElement.title);
                html.push('</label>');
                html.push('<div>');
                html.push(returnedAuxiliary.getFormElementHtml(formElement));
                html.push('</div>');
            });

            return html.join("\n");
        },

        /**
         * retrieves a formElement-object and returns the html-code usable for displaying that formElement
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Object} formElement
         * @returns {string}
         */
        getFormElementHtml: function(formElement) {
            var html = [],
                valueHtml;

            console.log('getFormElementHtml() formElement', formElement);

            switch(formElement.type) {
                case 'input':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : ' value="' + formElement.value + '"';
                    html.push('<input type="text" id="create-' + formElement.name + '"' + valueHtml + '>');
                    break;
                case 'text':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : formElement.value;
                    html.push('<textarea id="create-' + formElement.name + '">' + valueHtml + '</textarea>');
                    break;
                case 'select':
                    html.push('<select id="create-' + formElement.name + '">');
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
                    html.push('<input type="date" id="create-' + formElement.name + '"' + valueHtml + '>');
                    break;
                case 'time':
                    valueHtml = typeof formElement.value === 'undefined' ? '' : ' value="' + formElement.value + '"';
                    html.push('<input type="time" id="create-' + formElement.name + '"' + valueHtml + '>');
                    break;
                default:
                    html.push('<span id="create-' + formElement.name + '">');
                    html.push('unknown form element type: ' + formElement.type);
                    html.push('</span>');
            }

            return html.join("\n");
        },

        /**
         * takes a number and - if necessary - adds a leading zero so the returned number has always 2 digits
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {Number} number
         * @returns {string}
         */
        pad2Digits: function(number) {
            return ('0' + number).slice(-2);
        }
    };

    return returnedAuxiliary;
});