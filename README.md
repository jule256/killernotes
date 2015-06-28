# Killernotes

### get the application running for review
 - [download the "abgabe"-Branch as zip] [1] and unzip it
 - navigate to the folder and execute `npm install` which will install the necessary `npm` dependencies
 - execute `gulp` to precompile the handlebar templates
 - open the project in _WebStorm_ and run the `index.js` file in the project's root
 - enter `localhost:3000` in your browser of choice (we strongly recommend Google Chrome because of its native html5 
 date- and time-picker) and enjoy _a killer app_ ☻
 
```sh
machine:/ user$ cd path/to/the/project/killernotes/
machine:killernotes user$ npm install
machine:killernotes user$ gulp
```

### special features
 - killernotes running in browsertab *A* will get a refresh-notification if a note is added in another browsertab *B*
 - storage-engine architecture allows to change the storage engine (`serverstorage.js`, `localstorage.js`)
 - event based system for maximum module independency
 - form-generator allows to change formular elements (type, validation, ...) easily via `config.js`
 - reset-all link to be able to delete all notes at once

### todo Server

  - ~~Notifications über polling von hash auf alle notes auf dem server (/state)~~
  - ~~GET, POST /notes~~
  - ~~GET, PUT, DELETE /notes/:id~~ 

### @todo:

  - ~~form evaluation~~ (Julian) ✓
  - ~~CSS Layouting~~ (Dominik) 
    - ~~basic~~ ✓
  - ~~Importance: Stars/Flashes instead of select-dropdown~~ (Dominik) ✓
  - ~~default values for due-create and due-time in create form~~ (Julian) ✓
  - ~~reset create form after kn:created~~ (Julian) ✓
  - ~~sort view: use handlebars correctly~~ (Dominik) ✓
  - ~~style picker~~ (Dominik) ✓
  - ~~JSDoc comments for "every" function~~ ✓
  - ~~get variable-names straight: formElement/s vs. formOptions/s~~ (Julian) ✓
  - ~~find a better solution for the Date zero-padding problem~~ ✓
  - ~~don't allow edit-mode if another note is already in edit mode~~ (Julian) ✓
  - ~~maybe make preRender() and postRender() private, since they should not be called from outside~~ ✓
  - ⚠ standardize event naming (maybe 'kn:`<type`>:`<action`>') (Julian)
  - ~~add JSCS and JSHint configuration~~ (Julian) ✓
  - ~~disable sorting during edit mode~~ (Julian) ✓
  - ~~Exception Handling: Errorview & Loglevels (Dominik)~~ ✓
    - ~~to be implemented in modules where it makes sense (auxiliary.logMessage)~~
  - ~~data on server~~
    - ~~rest service~~
  - ~~store/precompile handlebar templates~~ ✓ (Julian)
  - ~~form generator: good or bad? good!~~ ✓
  - ~~replace `bind()` with `on()`~~ ✓ (Julian)
  - ~~server-config~~
  
### bugs
  - ~~note editing always sets `finished:false`~~ ✓
  - ⚠ check for dangling events: Everytime the view is newly rendered, new events are generated in privatePostRender()
  - ~~disabled buttons still work~~ (Julian) ✓
  - ~~⚠ note can be safed without duedate/time~~ (Julian)
  - ~~⚠ after create: create form gets not reset and create-form-toggle does not work~~
  - ~~⚠ edit & create: the hidden "Importance" input has no default value (should be 0)~~ (Dominik)
  - ~~⚠ fancy css: date and time input is white on white~~ (Dominik)
  - ~~⚠ finish-filter: only works if click is on label `.filter-finished` and not if on on span `.kn-filter-finished` (Dominik)~~ ✓
  - ~~⚠ finish-filter: `.disabled` does not work correctly (cursor, bg-color), e.g. if edit mode is active~~ (Dominik) ✓
  - ~~⚠ line breaks in note-text~~ ✓
  - ~~⚠ duedate error message in form not in right position~~

### @ideas
  - Additional features
    - ~~delete single note~~ ✓
    - maybe fallback on Cookie if Storage is not supported on browser?
    - jquery datepicker (firefox, safari, ...)
    - background depending on duedate/importance
    - save filtersettings
    - custom styles
    - include fontawesome & normalize.css with scss
    - ~~css tweaking: min-width of 590px to prevent line-breaking in create/sort/filter area and github-link~~ ✓
    - ~~css tweaking: "finished" button is not horizontally aligned with create and sort buttons~~ ✓
    
### server
#### install
```sh
machine:/ user$ cd path/to/the/project/killernotes/
machine:killernotes user$ npm install express --save
machine:killernotes user$ npm install body-parser --save
machine:killernotes user$ npm install nedb --save
```

#### app
  - Start index.js
  - Client: localhost:3000
  - Service localhost:3000/notes

#### Service
The service has following methods
  - GET /notes 
    Get all notes
  - POST /notes 
    Add new note
  - DELETE /notes
    remove all notes 
  - GET /notes/state
    Get current state/hash of all notes
  - GET /notes/:id
    Get a note by id
  - PUT /notes/:id
    Update a note by id
  - DELETE /notes/:id
    Delete a note by its id
    
### client
#### install
```sh
machine:/ user$ cd path/to/the/project/killernotes/
machine:killernotes user$ npm install gulp
machine:killernotes user$ npm install gulp-handlebars
machine:killernotes user$ npm install gulp-wrap
machine:killernotes user$ npm install gulp-declare
machine:killernotes user$ npm install gulp-concat
```

#### precompile templates
every time a template from /public/templates/ is changed, run `gulp` manually:
```sh
machine:/ user$ cd path/to/the/project/killernotes/
machine:killernotes user$ gulp
```

### code style
#### JSHint
To configure JSHint in Jetbrains WebStorm go to `Preferences` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `JSHint` and make sure the checkbox "enable" and the checkbox "Use config files" are checked. WebStorm should automatically use the file `.jshintrc` file in the project's root.

⚠ Note that dot-files might not be visible in OS X's finder.

#### JSCS
To use JSCS the according node-module has to be installed:

```sh
machine:/ user$ cd path/to/the/project/killernotes/
machine:killernotes user$ npm install jscs
```

This creates a `node_modules` folder in the project's root. Make sure not to commit this folder to GIT.

To configure JSCS in Jetbrains WebStorm go to `Preferences` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `JSCS` and make sure the checkbox "enable" is checked. The "Node Interpreter" input filed should be prepopulated with `/usr/local/bin/node`. Enter `path/to/the/project/killernotes/node_modules/jscs` in the input field "JSCS Package".

Check the "Search for config(s)" radiobutton and WebStorm should automatically use the file `.jscsrc` file in the project's root.

⚠ Note that dot-files might not be visible in OS X's finder.

##### not active:
`"requireMultipleVarDecl": true`

[1]:https://github.com/jule256/killernotes/archive/abgabe.zip

