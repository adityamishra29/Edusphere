function loginUser(username, password) {
    if (username === "student" && password === "1234") {
        return "Login Success";
    } else {
        return "Login Failed";
    }
}

test("login success", () => {
    expect(loginUser("student", "1234")).toBe("Login Success");
});