/**
 * @file Ream langauge
 * @author Khaumi <khaumu@khaumi.dev>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 *
 * @param {RuleOrLiteral} rule
 * @param {RuleOrLiteral} seperator
 */
function repeated_with_trailing_separator(rule, seperator) {
  return seq(rule, repeat(seq(seperator, rule)), optional(seperator))
}

/**
 *
 * @param {RuleOrLiteral} rule
 * @param {RuleOrLiteral} seperator
 */
function repeated_with_separator(rule, seperator) {
  return seq(rule, repeat(seq(seperator, rule)))
}



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
      'fn', $.identifier, optional($.generic_args_composed),
      '(',
        optional(repeated_with_trailing_separator($.function_arg, ',')),
      ')',
      optional(seq('->', $.type_composed)),
      optional(seq(
        '{',
        repeat($.expression),
        '}'))
    ),

    import_composed: $ => seq(
      'import', $.identifier, repeat(seq(token.immediate('/'), $.identifier)), optional(seq('as', $.identifier))
    ),

    generic_args_composed: $ => seq(
      token.immediate('['),
       repeated_with_separator($.identifier, ','),
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

    expression: $ => $.expr_atom,

    expr_atom: $ => choice(
      $.identifier,
      $.integer,
      $.fractional,
      $.atom,
      $.let_expression,
      $.expr_tuple,
      $.expr_map,
      seq('(', $.expression, ')'),
      $.match_expression
    ),

    let_expression: $ => seq(
      'let', $.pattern, optional(seq(':', $.type_composed)), '=', $.expression
    ),

    integer: $ => /[0-9]+/,

    fractional: $ => /[0-9]+\.[0-9]+/,

    pattern: $ => $.identifier,

    expr_tuple: $ => seq(
      '{', repeated_with_trailing_separator($.expression, ','), '}'
    ),

    expr_map_pair: $ => seq(
      $.identifier, ':', $.expression
    ),

    expr_map: $ => seq(
      '#{', repeated_with_trailing_separator($.expr_map_pair, ','), '}'
    ),

    match_clause: $ => seq(
      $.pattern, optional(seq('if', $.expression)), '=>', $.match_expression
    ),

    match_expression: $ => seq(
      'match',
      $.expression,
      '{',
        repeat($.match_clause),
      '}'
    ),

    type_composed: $ => $.type_union,

    type_definition_composed: $ => seq(
      'type', $.identifier, optional($.generic_args_composed), '=', $.type_composed
    ),

    map_pair: $ => seq($.identifier, ":", $.type_composed),

    map: $ => seq('#{', repeated_with_trailing_separator($.map_pair, ','), '}'),

    tuple: $ => seq('{', repeated_with_trailing_separator($.type_composed, ','), '}'),

    generic_application: $ => seq($.identifier, optional(seq(token.immediate('['), repeated_with_separator($.type_composed, ','), ']'))),

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
