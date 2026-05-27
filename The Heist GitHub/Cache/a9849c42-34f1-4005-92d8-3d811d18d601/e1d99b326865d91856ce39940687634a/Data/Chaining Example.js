// Simple chaining example similar to SwiftUI-style modifiers

function NameBuilder(name) {
    this.name = name;
    this.greetName = function() {
        var greeting = "Hello, " + this.name + "!";
        print(greeting);
        return greeting; // return the greeting string
    };
    // Coerce to string so createName(...) can be used as a string directly
    this.toString = function() { return this.name; };
    this.valueOf = function() { return this.name; };
}

// Usage:
// var name = createName("Nick");          // name coerces to "Nick" when used as string
// var greeting = createName("Nick").greetName(); // greeting === "Hello, Nick!"
global.createName = function(str) {
    print(str);
    return new NameBuilder(str);
};
