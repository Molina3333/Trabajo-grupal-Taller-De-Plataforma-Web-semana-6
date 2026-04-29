/**
 * CONFIGURACIÓN DE AUTH0
 * Reemplaza con tus datos de tu Dashboard de Auth0
 */
let auth0Client = null;

const configureClient = async () => {
    auth0Client = await auth0.createAuth0Client({
        domain: "dev-ighr7lbccwgkvifa.us.auth0.com",
        client_id: "strO5dAVAFNANbaKMHsZEzRgy42qlGlJ"
    });
};

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    
    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        document.getElementById("btn-login").classList.add("hidden");
        document.getElementById("user-info").classList.remove("hidden");
        document.getElementById("welcome-msg").innerText = `Hola, ${user.name}`;
    } else {
        document.getElementById("btn-login").classList.remove("hidden");
        document.getElementById("user-info").classList.add("hidden");
    }
};

window.onload = async () => {
    await configureClient();

    // Manejar el retorno después del login
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }

    await updateUI();
};

// Eventos de botones
document.getElementById("btn-login").addEventListener("click", async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: { redirect_uri: window.location.origin }
    });
});

document.getElementById("btn-logout").addEventListener("click", () => {
    // IMPORTANTE: Al cerrar sesión, limpiamos Session Storage
    sessionStorage.clear();
    auth0Client.logout({
        logoutParams: { returnTo: window.location.origin }
    });
});