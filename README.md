# Killernotes

### @todo:

  - form evaluation (Julian)
  - CSS Layouting (Dominik)
    - basic
    - responsive
  - Importance: Stars/Flashes instead of select-dropdown (Dominik)
  - default values for due-create and due-time in create form (Julian) ✓
  - reset create form after kn:created (Julian) ✓
  - sort view: use handlebars correctly (Julian)
  - style picker (Dominik)
  - JSDoc comments for "every" function (Beide)
  - get variable-names straight: formElement/s vs. formOptions/s (Julian)
  - find a better solution for the Date zero-padding problem (???)
  - don't allow edit-mode if another note is already in edit mode (Julian)
  - maybe make preRender() and postRender() private, since they should not be called from outside ✓
  - standardize event naming (maybe 'kn:`<type`>:`<action`>') (Julian)
  - add JSCS and JSHint configuration (Julian)
  - disable sorting during edit mode (Julian)
  - Exception Handling: Errorview & Loglevels (Dominik)
  - save data on server
  - templates should only be compiled once, store/precompile handlebar templates (Dominik)
  - form generator: good or bad? (???)
  
### bugs
  - note editing always sets `finished:false` ✓

### @ideas
  - Additional features
    - delete note
    - maybe fallback on Cookie if Storage is not supported on browser?
    - jquery datepicker (firefox, safari, ...)
    - background depending on duedate/importance
    - save filtersettings
    - custom style
