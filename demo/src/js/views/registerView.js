import { elements } from './base';

export const getFormFor = (btn) => {

    const form = btn.parentElement.parentElement.parentElement;
    var onTop = form.getAttribute("top");

    console.log("form top = " + onTop);
    // don't fire the submit form data stuff unless the screen is on top
    // otherwise it fires when we bring the screen to the front as well
    if (onTop == "false") {
        return null;
    }
    return form;
}

export const getFormData = (form) => {
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    // TODO get the right formData object for recruiter or jobseeker
    // TODO possibly this should be moved into the model
    var formData = {
        $class: "io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount",
        name: myData["name"], 
        company: myData["company"],
        accountType: "RECRUITER",
        email: myData["email"],
        password: myData["password"]
    };

    return formData;
}


export const validateData = (data) => {
    var error = false;

    if (data.name.length === 0) {
        error = true;
        var x = document.getElementById("name-error");
        checkStyle(x);
    }
    if (data.email.length === 0) {
        error = true;
        var x = document.getElementById("email-error");
        checkStyle(x);
    }
    if (data.password.length < 6) {
        error = true;
        var x = document.getElementById("password-error");
        checkStyle(x);
    } if (data.company.length === 0) {
        error = true;
        var x = document.getElementById("email-error");
        checkStyle(x);
    }
    return error;
}

export const displayServerErrorMessage = (error) => {
    var x = document.getElementById(`login-error`);
    var y = document.getElementById(`server-error`);
    
  
    if (error != null) {
        x = document.getElementById(`server-error`);
        y = document.getElementById(`login-error`);
    } 
   
    x.style.display = "block";
    y.style.display = "none";
}

export const validateField = (element) => {    
    var x = document.getElementById(`${element.id}-error`);
    console.log("value for element = " + element.value);
   
    if (element.value.length === 0) {
        checkStyle(x);
        return;
    } else if (element.id === "password") {
        if (element.value.length < 6) {
            checkStyle(x);
            return;
        }
    } 

    x.style.display = "none"; 
}

function checkStyle(x) {
    if (x.style.display != "block") {
        x.style.display = "block";
    } 
}

export const setLoggedIn = (loggedIn) => {
    var signins = elements.signins;
    console.log("QUACK>>>>> SETTING Signin to " + loggedIn + "; len = " + signins.length);
    for (var i = 0; i < signins.length; i++) {
        if (loggedIn) {
            signins[i].innerHTML = `<a href="register.html" class="link-icon"><i class="icon far fa-user"></i>Log Out</a>`;
        } else {
            signins[i].innerHTML = `<a href="register.html" class="link-icon"><i class="icon far fa-user"></i>Sign In</a>`;
        }
        
    }
}