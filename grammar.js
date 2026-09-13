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
    $.comment,
    $.doc_comment,
    $.superdoc_comment,
    $._whitespace,
  ],

  word: $ => $.identifier,

  rules: {
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

    comment: $ => token(prec(1, /\/\/[^\n]*/)),
    doc_comment: $ => token(prec(2, /\/\/\/[^\n]*/)),
    superdoc_comment: $ => token(prec(3, /\/\/![^\n]*/)),

    atom: $ => /:[_\p{Alphabetic}\p{Nd}\p{Extended_Pictographic}]+/u,
    identifier: $ => /[_\p{Alphabetic}\p{Extended_Pictographic}][_\p{Alphabetic}\p{Nd}\p{Extended_Pictographic}]*/u,

  }
});
