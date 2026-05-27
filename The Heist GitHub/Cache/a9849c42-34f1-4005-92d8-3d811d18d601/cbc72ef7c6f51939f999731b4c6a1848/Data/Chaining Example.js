// Simple chaining example similar to SwiftUI-style modifiers

function NameBuilder(name) {
    this.name = name;
    this.greetName = function() {
        print("Hello, " + this.name + "!");
        return this;
    };
}

// Usage: createName("Nick").greetName();
global.createName = function(str) {
    print(str);
    return new NameBuilder(str);
};