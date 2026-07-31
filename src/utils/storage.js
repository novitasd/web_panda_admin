const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export function saveToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export function removeUser() {
    localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
    removeToken();
    removeUser();
}