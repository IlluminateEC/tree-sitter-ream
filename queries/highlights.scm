"fn" @keyword
"match" @keyword
"import" @keyword
(import_path) @module
"as" @keyword
(import_alias) @module
"type" @keyword
"->" @operator
"=>" @operator
"|" @operator
"," @punctuation.delimiter
(unary_operator) @operator
(binary_operator) @operator
(primative_types) @type
(type_identifier (identifier) @type)
(type_map (typed_identifier (identifier) @field))
(atom) @constant
(escape_sequence) @string.escape
(string) @string

; (type) @type
