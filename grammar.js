/**
 * @file Ream langauge
 * @author Khaumi <khaumu@khaumi.dev>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "ream",
  extras: $ => [
    $._comment,
    $._whitespace,
  ],

  word: $ => $.identifier,

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.definition),

    _whitespace: $ => /[\s\t\n\r\f]+/,

    word: $ => /[_\p{Alphabetic}\p{Extended_Pictographic}][_\p{Alphabetic}\p{Nd}\p{Extended_Pictographic}]*/u,

    definition: $ => choice(
      $.import_composed,
      $.trait_composed,
      $.type_definition_composed,
      $.function_definition_composed
    ),

    function_arg: $ => seq(
      $.identifier, ":", $.type_composed
    ),

    function_definition_composed: $ => seq(
      'fn', $.identifier, optional($.generic_args_composed), '(', optional(seq($.function_arg, repeat(seq(',', $.function_arg)))), ')',
      optional(seq('->', $.type_composed))
    ),

    import_composed: $ => seq(
      'import', $.identifier, repeat(seq(token.immediate('/'), $.identifier)), optional(seq('as', $.identifier))
    ),

    generic_args_composed: $ => seq(
      token.immediate('['),
        $.identifier, optional(repeat(seq(',', $.identifier))),
      ']'
    ),

    trait_composed: $ => seq(
      'trait', $.identifier, optional($.generic_args_composed), '{',
      repeat(choice(
        $.type_definition_composed,
        $.function_definition_composed
      )),
      '}'
    ),

    type_composed: $ => $.type_union,

    type_definition_composed: $ => seq(
      'type', $.identifier, optional($.generic_args_composed), '=', $.type_composed
    ),

    map_pair: $ => seq($.identifier, ":", $.type_composed),

    map: $ => seq('#{', $.map_pair, repeat(seq(",", $.map_pair)), '}'),

    tuple: $ => seq('{', $.type_composed, repeat(seq(",", $.type_composed)), '}'),

    generic_application: $ => seq($.identifier, optional(seq(token.immediate('['), $.type_composed, repeat(seq(",", $.type_composed)), ']'))),

    type_atom: $ => choice(
      $.generic_application,
      $.atom,
      $.map,
      $.tuple
    ),

    type_intersection: $ => prec.left(seq(
      $.type_atom,
      optional(seq('&', $.type_intersection))
    )),

    type_union: $ => seq(
      $.type_intersection,
      optional(seq('|', $.type_union))
    ),



    // import: $ => seq(
    //   'import',
    //   $.import_path,
    //   field('alias', optional($.import_alias)),
    // ),
    // import_alias: $ => seq('as', $.identifier),
    // import_path: $ => seq($.identifier, repeat(seq('/', $.identifier))),

    _comment: $ => seq('//', /[^\n]*/),

    atom: $ => /:[_\p{Alphabetic}\p{Nd}\p{Extended_Pictographic}]+/u,
    identifier: $ => /[_\p{Alphabetic}\p{Extended_Pictographic}][_\p{Alphabetic}\p{Nd}\p{Extended_Pictographic}]*/u,

    // generic_args_type: $ => seq("[")

    // type_defintion: $ => seq("type", $.type_identifier, "=", $.type),

    // type: $ => choice(
    //   $.atom,
    //   $.type_identifier,
    //   $.type_binary_expression,
    //   $.type_tuple,
    //   $.type_list,
    //   $.type_lambda,
    //   $.type_map,
    //   $.primative_types
    // ),

    // typed_identifier: $ => seq($.identifier, ":", $.type),

    // type_list: $ => seq("List[", $.type, "]"),

    // type_lambda: $ => seq("fn", "(", $.type, repeat(seq(",", $.type)), ")", "->", $.type),

    // type_identifier: $ => seq(
    //   field("identifer", $.identifier), optional(seq(
    //     "[",
    //     $.type,
    //     repeat(seq(",", $.type)),
    //     "]"
    //   ))),

    // primative_types: $ => choice(
    //   "Int",
    //   "Float",
    //   "String",
    //   "Bytes",
    //   "Never",
    //   "Any"
    // ),

    // type_map: $ => choice(
    //   seq("Map", "[", $.typed_identifier, ", ", $.typed_identifier, "]"),
    //   seq("#{", $.typed_identifier, repeat(seq(",", $.typed_identifier)), "}")
    // ),

    // type_tuple: $ => seq("{",
    //   optional(
    //     seq($.type, repeat(seq(",", $.type)))
    //   ),
    //   "}"
    // ),

    // type_binary_expression: $ => choice(
    //   prec.left(10, seq($.type, "|", $.type)) // union
    // ),



    // function_definition: $ => seq("fn", $.identifier, $.function_signature_body,
    //   optional(seq("->", $.type)),
    //   "{",
    //   optional($.function_body),
    //   "}"),


    // function_body: $ => seq($.expression, repeat($.expression)),

    // function_signature: $ => seq("fn", $.identifier, $.function_signature_body, optional(seq("->", $.type))),

    // function_signature_body: $ => seq("(",
    //   optional(seq(
    //     $.typed_identifier,
    //     repeat(seq(",", $.typed_identifier))
    //   )), ")"),

    // tuple_definition: $ => seq("{",
    //   optional(
    //     seq($.expression, repeat(seq(",", $.expression)))
    //   ),
    //   "}"
    // ),

    // match_pattern: $ => seq(
    //   $.expression,
    //   "=>",
    //   $.expression
    // ),

    // match_expression: $ => seq("match", $.expression, "{",
    //   optional(
    //     seq($.match_pattern, repeat(seq(",", $.match_pattern)))
    //   ),
    //   "}"),


    // tuple_expression: $ => seq("{",
    //   optional(
    //     seq($.expression, repeat(seq(",", $.expression)))
    //   ),
    //   "}",
    // ),

    // access_expression: $ => seq($.identifier, ".", $.identifier, repeat(seq(".", $.identifier))),

    // binary_operator: $ => choice(
    //   "+",
    //   "-",
    //   "*",
    //   "/",
    //   "%",
    //   "&&",
    //   "||",
    //   "|>",
    //   "^",
    //   "&",
    //   "|",
    //   "<=>",
    //   "==",
    //   "!=",
    //   "<",
    //   ">",
    //   "<=",
    //   ">=",
    // ),

    // binary_expression: $ => prec.left(20, seq($.expression, $.binary_operator, $.expression)),

    // unary_operator: $ => prec(10, choice(
    //   "!",
    //   "~",
    //   "-",
    // )),



    // expression: $ => choice(
    //   $.unary_expression,
    //   $.binary_expression,
    //   $.atom,
    //   $.identifier,
    //   $.match_expression,
    //   $.access_expression,
    //   $.tuple_expression,
    //   $.literal
    // ),
    //
    //     unary_expression: $ =>
    // choice(
    //   seq($.unary_operator, $.expression),
    //   ),

    // literal: $ => choice(
    //   $.number,
    //   $.string,
    // ),

    // number: $ => seq(
    //   optional("-"),
    //   choice(
    //     seq(/\d+/, optional(/\.\d+/)),
    //     seq("0", optional(/x[0-9a-fA-F]+/)),
    //     seq("0", optional(/b[01]+/)),
    //   ),
    // ),

    // _str_content: $ => token.immediate(prec(1, /[^"\\]+/)),
    // escape_sequence: $ => choice(
    //   token.immediate(prec(1, /\\./)),
    //   token.immediate(prec(1, /\\u[0-9a-fA-F]{4}/)),
    //   token.immediate(prec(1, /\\U[0-9a-fA-F]{8}/)),
    // ),
    // string: $ => seq(
    //   "\"",
    //   repeat(choice($._str_content, $.escape_sequence)),
    //   "\"",
    // ),


  }
});
