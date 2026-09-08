import XCTest
import SwiftTreeSitter
import TreeSitterReam

final class TreeSitterReamTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ream())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Ream grammar")
    }
}
