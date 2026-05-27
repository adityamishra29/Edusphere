function loginUser(username, password) {
    if (!username || !password) {
        return "Invalid Input";
    }

    if (username === "student" && password === "1234") {
        return "Login Success";
    } else {
        return "Login Failed";
    }
}

// Test cases
console.log(loginUser("student", "1234")); // Success
console.log(loginUser("student", "wrong")); // Failed
console.log(loginUser("", "")); // Invalid