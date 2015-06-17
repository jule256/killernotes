# Killernotes

### @todo:

  - ⚠ form evaluation (Julian)
  - CSS Layouting (Dominik) 
    - basic ✓
    - responsive
  - ~~Importance: Stars/Flashes instead of select-dropdown~~ (Dominik) ✓
  - ~~default values for due-create and due-time in create form~~ (Julian) ✓
  - ~~reset create form after kn:created~~ (Julian) ✓
  - ~~sort view: use handlebars correctly~~ (Dominik) ✓
  - ~~style picker~~ (Dominik) ✓
  - JSDoc comments for "every" function (Beide)
  - ~~get variable-names straight: formElement/s vs. formOptions/s~~ (Julian) ✓
  - ~~find a better solution for the Date zero-padding problem~~ ✓
  - ~~don't allow edit-mode if another note is already in edit mode~~ (Julian) ✓
  - ~~maybe make preRender() and postRender() private, since they should not be called from outside~~ ✓
  - ⚠ standardize event naming (maybe 'kn:`<type`>:`<action`>') (Julian)
  - ~~add JSCS and JSHint configuration~~ (Julian) ✓
  - ~~disable sorting during edit mode~~ (Julian) ✓
  - ~~Exception Handling: Errorview & Loglevels (Dominik)~~ ✓
    - to be implemented in modules where it makes sense (auxiliary.logMessage)
  - data on server
    - rest service
  - store/precompile handlebar templates (Dominik)
  - ~~form generator: good or bad? good!~~ ✓
  - ⚠ replace `bind()` with `on()` (Julian)
  
### bugs
  - ~~note editing always sets `finished:false`~~ ✓
  - ⚠ check for dangling events: Everytime the view is newly rendered, new events are generated in privatePostRender()
  - ~~disabled buttons still work~~ (Julian) ✓
  - ~~⚠ note can be safed without duedate/time~~ (Julian)
  - ~~⚠ after create: create form gets not reset and create-form-toggle does not work~~
  - ~~⚠ edit & create: the hidden "Importance" input has no default value (should be 0)~~ (Dominik)
  - ~~⚠ fancy css: date and time input is white on white~~ (Dominik)
  - ~~⚠ finish-filter: only works if click is on label `.filter-finished` and not if on on span `.kn-filter-finished` (Dominik)~~ ✓
  - ⚠ finish-filter: `.disabled` does not work correctly (cursor, bg-color), e.g. if edit mode is active (Dominik) ✓
  - ~~⚠ line breaks in note-text~~ ✓

### @ideas
  - Additional features
    - ~~delete single note~~✓
    - maybe fallback on Cookie if Storage is not supported on browser?
    - jquery datepicker (firefox, safari, ...)
    - background depending on duedate/importance
    - save filtersettings
    - custom styles
    - include fontawesome & normalize.css with scss
    - ~~css tweaking: min-width of 590px to prevent line-breaking in create/sort/filter area and github-link~~ ✓
    - ~~css tweaking: "finished" button is not horizontally aligned with create and sort buttons~~ ✓
    
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

