"fn" @keyword
"import" @keyword
"trait" @keyword
"type" @keyword
"|" @operator
"&" @operator
"as" @keyword
(atom) @constant
(type_atom (tuple (type_composed) @type))
(generic_application (identifier) @type)
(type_definition_composed (identifier) @type)
(generic_args_composed (identifier) @type)
(map_pair (identifier) @field)
(import_composed (identifier) @module)
