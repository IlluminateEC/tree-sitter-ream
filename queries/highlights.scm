"fn" @keyword
"import" @keyword
"trait" @keyword
"type" @keyword
"|" @operator
"&" @operator
"=" @operator
":" @operator
"," @punctuation.delimiter
"as" @keyword
(atom) @constant
(type_atom (tuple (type_composed) @type))
(generic_application (identifier) @type)
(type_definition_composed (identifier) @type)
(generic_args_composed (identifier) @type)
(map_pair (identifier) @property)
(import_composed (identifier) @module)
(comment) @comment
(doc_comment) @comment.doc
(superdoc_comment) @comment.doc
(function_definition_composed (identifier) @function)
(function_arg (identifier) @variable.parameter)
(trait_composed (identifier) @type)
