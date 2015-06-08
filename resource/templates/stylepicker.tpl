<script id="template-stylepicker" type="text/x-handlebars-template">
    <h1>{{title}}</h1>
    <select id="style-picker">
        {{#each styles}}
            <option value="{{path}}">{{name}}</option>
        {{/each}}
    </select>
</script>