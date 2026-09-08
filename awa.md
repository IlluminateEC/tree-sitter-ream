## Expressions
- Atoms (`:name`)
- Ints (`1`)
- Floats (`1.1`)
- Strings (`"awawa"`)
- Bytes (`<< "awawa"#utf8, some_int:16#be#signed >>`)
- Lists (`[ value, value, value ]`)
- Tuples (`{ value, value, value }`)
- Maps (`#{ key: value, key: value }`)
- Functions (`(args: Type) -> Type => { ... }`)

## Types
- Atoms: `:name`
- `Int`
- `Float`
- `String`
- `Bytes`
- `List[Item]`
- `{ Type, Type, Type }`
- Maps
  - `#{ key: Type, key: Type }`
  - `Map[Key, Value]`
- `fn(Type, Type) -> Type`
- `A | B`
- `A[B]`

## Constructs
- Function abstraction
- Function application
- Method application
- Method attachment & resolution
- Pattern matching


## Syntax
### Bytes
Represents a sequence of bytes \
Syntax: `<< content [, content] >>`
