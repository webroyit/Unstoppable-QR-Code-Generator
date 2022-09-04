const form = document.getElementById("generate-form");
const qr = document.getElementById("qrcode");
const domain = document.getElementById("domain");

import UAuth from '@uauth/js';

const uauth = new UAuth({
    clientID: "f2fd2105-78da-43d3-8c45-7566a5c7fdc0",
    redirectUri: "https://udqrcodegenerator.netlify.app/",
    scope: "openid wallet"
});

async function login(){
    try {
        const login = document.getElementById("login");
        login.className = "hidden";

        const authorization = await uauth.loginWithPopup();
        console.log(authorization);
        domain.innerHTML =authorization.idToken.sub;
    } catch (error) {
        console.error(error);
    }
}

document.getElementById("login").onclick = login;

const onGenerateSubmit = (e) => {
    // Prevent the default behavior because it is a form submission
    e.preventDefault();

    // Remove old QR Code
    clearUI();

    const name = domain.innerHTML;
    const size = document.getElementById("size").value;
    
    if (name === "") {
        alert("Please Login");
    } else {
        console.log(name, size);
        showSpinner();
        
        setTimeout(() => {
            hideSpinner();
            generateQRCode(name, size);

            // QR Code take time to be created
            setTimeout(() => {
                const saveUrl = qr.querySelector("img").src;
                createSaveBtn(saveUrl);
            }, 50)
        }, 1000);
    }
}

const generateQRCode = (name, size) => {
    // First parameter takes in ID
    const qrcode = new QRCode("qrcode", {
        text: name,
        width: size,
        height: size
    })
}

const showSpinner = () => {
    document.getElementById("spinner").style.display = "block";
}

const hideSpinner = () => {
    document.getElementById("spinner").style.display = "none";
}

const clearUI = () => {
    qr.innerHTML = "";
    const saveLink = document.getElementById("save-link");
    if (saveLink) saveLink.remove();
}

// saveUrl from QR Code
const createSaveBtn = (saveUrl) => {
    const link = document.createElement("a");
    link.id = "save-link";
    link.classList = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5"
    link.href = saveUrl;
    link.download = "qrcode";
    link.innerHTML = "Save Image";
    document.getElementById("generated").appendChild(link);
}

hideSpinner();

form.addEventListener("submit", onGenerateSubmit);
