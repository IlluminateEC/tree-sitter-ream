// swift-tools-version:5.6

import Foundation
import PackageDescription

let dir = Context.packageDirectory
var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "\(dir)/src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterReam",
    products: [
        .library(name: "TreeSitterReam", targets: ["TreeSitterReam"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.10.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterReam",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterReamTests",
            dependencies: [
                .product(name: "SwiftTreeSitter", package: "swift-tree-sitter"),
                "TreeSitterReam",
            ],
            path: "bindings/swift/TreeSitterReamTests"
        )
    ],
    cLanguageStandard: .c11
)
