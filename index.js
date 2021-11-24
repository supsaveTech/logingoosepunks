const serverUrl = "https://mtjdohwjvdny.usemoralis.com:2053/server"; //Server url from moralis.io
const appId = "7LQlxPher3yPMvhoYy9uj9kPR53pJ6Q7TTuyrpDn"; // Application id from moralis.io
Moralis.start({ serverUrl, appId });

const appHeaderContainer = document.getElementById("app-header-btns");
const contentContainer = document.getElementById("content");
const contentContainer1 = document.getElementById("content1");

const registercontentContainer = document.getElementById("registercontent");
const homeContainer = document.getElementById("home");
   
async function logOut() {
  await Moralis.User.logOut();
  render();
  console.log("logged out. User:", Moralis.User.current());
}

async function loginWithMetaMask() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate();
  }
  console.log(user);
   location.replace("home.html");
  render();
}

async function loginWithEmail(isSignUp) {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;
  if (!email || !pass) {
    alert("please provide both email and password");
    return;
  }
  try {
    if (isSignUp) {
      // when using email for username
      // assign it to the username property
      const user = new Moralis.User();
      user.set("username", email);
      user.set("password", pass);
      await user.signUp();
    } else {
      await Moralis.User.logIn(email, pass);
      alert("Welcome to GoosePunks.io!");
      location.replace("home.html");
    }  
  
    render();
  } catch (error) {
    console.log(error);
    alert("Error: " + error.code + " " + error.message);
  }
}



async function registerWithEmail(isSignUpEmail) {
  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;
  console.log(name);
  console.log(email);
  console.log(pass);  
  if (!name || !email || !pass) {
    alert("Please fill all fields");
    return;
  }
  
  try {
    if (isSignUpEmail) {
      // when using email for username
      // assign it to the username property
      const user1 = new Moralis.User();
      user1.set("username", email);  
      user1.set("password", pass);
      user1.set("email", email); 
    
      await user1.logIn(email, pass);             
    } else {
      await Moralis.User.signUp(email, pass);
      alert("Your account was Created Successfully!");
      location.replace("home.html");
    }
     
    render1();
  } catch (error) {
    console.log(error);
    alert("Error: " + error.code + " " + error.message);
  }
} 


 

 

function listenForAccountChange() {
  Moralis.onAccountsChanged(async function (accounts) {
    console.log("account changed:", accounts);
    const user = Moralis.User.current();
     alert(`Welcome to GoosePunks.io!`);
      location.replace("home.html");
    if (!user || !accounts.length) {
      // not logged in
      return;
    }

    try {
      const address = accounts[0];
      if (addressAlreadyLinked(user, address)) {
        console.log(`address ${getAddressTxt(address)} already linked`);
        return;
      }

      const confirmed = confirm("Link this address to your account?");
      if (confirmed) {
        await Moralis.link(address);
        alert("Address added!");
        render();
      }
    } catch (error) {
      if (error.message.includes("already used")) {
        alert("That address is already linked to another profile!");
      } else {
        console.error(error);
        alert("Error while linking. See the console.");
      }
    }
  });
}

function addressAlreadyLinked(user, address) {
  return user && address && user.attributes.accounts && user.attributes.accounts.includes(address);
}

async function onUnlinkAddress(event) {
  event.preventDefault();
  try {
    const address = event.target.dataset.addr;
    console.log("onUnlinkAddress:: addr:", address);

    const confirmed = confirm("Are you sure you want to remove this address?");
    if (!confirmed) {
      return;
    }

    await Moralis.unlink(address);
    alert("Address removed from profile!");
    render();
  } catch (error) {
    console.error(error);
    alert("Error unlinking address. See console.");
  }
}

function renderHeader() {
  const user = Moralis.User.current();
  if (!user) {
    return;
  }
  // show the logout, refresh buttons if user logged in
  appHeaderContainer.innerHTML = `
      <button id="btn-logout">Logout</button>
    `;
  document.getElementById("btn-logout").onclick = logOut;
  // location.replace("index.html");
}   






function buildLoginComponent(isSignUp = false) {
  const btnSignUp = isSignUp ? "" : `<input type="hidden" id="btn-login-email-signup" />`;
  const btnSignUpMetamask = isSignUp ? "" : `id="btn-login-metamask"`;
  return `
       <div class="fxt-header">
            <a href="index.html" class="fxt-logo"><img src="img/logo.png" alt="Logo"></a>
            <div class="fxt-page-switcher">
              <a href="index.html" class="switcher-text switcher-text1 active">LogIn</a>
              <a href="register.html" class="switcher-text switcher-text2">Register</a>
            </div>
          </div>  
          <div class="fxt-form">
           
              <div class="form-group fxt-transformY-50 fxt-transition-delay-1">
                <input class="form-control" type="text" id="email" name="email" placeholder="Email Address" required="required">
                <i class="flaticon-envelope"></i>
              </div>
              <div class="form-group fxt-transformY-50 fxt-transition-delay-2">
                <input class="form-control" type="password" id="pass" name="pass" placeholder="Password" required="required">
                <i class="flaticon-padlock"></i>
              </div>
              <div class="form-group fxt-transformY-50 fxt-transition-delay-3">
                <div class="fxt-content-between">
                  <button type="button" id="btn-login-email" type="button" class="fxt-btn-fill">Log in</button>
                  <label for="checkbox1">or</label>
                  <button type="button" ${btnSignUpMetamask} type="button" class="fxt-btn-fill">Connect Metamask</button>
                  ${btnSignUp} 
                  <div class="checkbox">
                    <input id="checkbox1" type="checkbox">
                    <label for="checkbox1">Keep me logged in</label>
                  </div>
                </div>
              </div> 
          
          </div>
          <div class="fxt-footer"> </div>
        `;
}

function renderLogin(isSignUp) {
  contentContainer.innerHTML = buildLoginComponent(isSignUp);
  document.getElementById("btn-login-metamask").onclick = loginWithMetaMask;
  document.getElementById("btn-login-email").onclick = function () {
    loginWithEmail(isSignUp);
  };
  if (!isSignUp) {
    document.getElementById("btn-login-email-signup").onclick = function () {
      loginWithEmail(true);
    };
  }
}






function buildSignupComponent(isSignUpEmail = false) {
  const btnSignUp = isSignUpEmail ? "" : `<input type="hidden" id="btn-login-email" />`;
  const btnSignUpMetamask = isSignUpEmail ? "" : `id="btn-login-metamask"`;
  return `
       <div class="fxt-header">
            <a href="index.html" class="fxt-logo"><img src="img/logo.png" alt="Logo"></a>
            <div class="fxt-page-switcher">
              <a href="index.html" class="switcher-text switcher-text1">LogIn</a>
              <a href="register.html" class="switcher-text switcher-text2 active">Register</a>
            </div>
          </div> 
          
          <div class="fxt-form">
              <div class="form-group fxt-transformY-50 fxt-transition-delay-1">
                <input class="form-control" type="text" id="username" name="username" placeholder="Enter Username" required="required">
                <i class="flaticon-user"></i>
              </div>
              <div class="form-group fxt-transformY-50 fxt-transition-delay-1">
                <input class="form-control" type="text" id="email" name="email" placeholder="Enter Email Address" required="required">
                <i class="flaticon-envelope"></i>
              </div>
              <div class="form-group fxt-transformY-50 fxt-transition-delay-2">
                <input class="form-control" type="password" id="pass" name="pass" placeholder="Enter Password" required="required">
                <i class="flaticon-padlock"></i>
              </div>
              <div class="form-group fxt-transformY-50 fxt-transition-delay-3">
                <div class="fxt-content-between">
                  <button type="button" id="btn-login-email-signup" type="button" class="fxt-btn-fill">Register</button>
                  <label for="checkbox1">or</label>
                  <button type="button" ${btnSignUpMetamask} type="button" class="fxt-btn-fill">Connect Metamask</button>
                  ${btnSignUp}
                  <div class="checkbox">
                    <input id="checkbox1" type="checkbox">
                    <label for="checkbox1">Keep me logged in</label>
                  </div>
                </div>
              </div> 
          
          </div>
          <div class="fxt-footer"> </div>
        `; 
}

function renderSignup(isSignUpEmail) {
  registercontentContainer.innerHTML = buildSignupComponent(isSignUpEmail);
  document.getElementById("btn-login-metamask").onclick = loginWithMetaMask;
  document.getElementById("btn-login-email-signup").onclick = function () {
    registerWithEmail(isSignUpEmail);
  };
  if (!isSignUpEmail) {
    document.getElementById("btn-login-email").onclick = function () {
      registerWithEmail(true);
    };
  }
}





function getAddressTxt(address) {
  return `${address.substr(0, 4)}...${address.substr(address.length - 4, address.length)}`;
}

function buildProfileComponent(user) {
  return `
    <div class="container">
      <div>
        <div class="form-group">
          <label for="name">Username</label>
          <input type="text" id="name" value="${user.attributes.username || ""}"/>
        </div>
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            cols="50"
            maxlength="200" >${user.attributes.bio || ""}</textarea>
        </div>
        <div id="profile-set-pass">
          ${buildSetPassComponent()}
        </div>
        ${buildAddrListComponent(user)}
        <button class="mt" type="button" id="btn-profile-save">Save Profile</button>
      </div>
    </div>
  `;
  
}
function renderProfileComponent(user) {
  homeContainer.innerHTML = buildProfileComponent(user);
  document.getElementById("btn-login-metamask").onclick = loginWithMetaMask;
  document.getElementById("btn-login-email").onclick = function () {
    loginWithEmail(isSignUp);
  };
  if (!isSignUp) {
    document.getElementById("btn-login-email-signup").onclick = function () {
      loginWithEmail(true);
    };
  }

} 




function buildAddrListComponent(user) {
  // add each address to the list
  let addressItems = "";
  if (user.attributes.accounts && user.attributes.accounts.length) {
    addressItems = user.attributes.accounts
      .map(function (account) {
        return `<li>
          <button class="btn-addr btn-remove" type="button" data-addr="${account}">X</button>
          ${getAddressTxt(account)}
        </li>`;
      })
      .join("");
  } else {
    // no linked addreses, add button to link new address
    addressItems = `
    <li>
      <button class="btn-addr" type="button" id="btn-add-addr">+</button>
      Link
    </li>
    `;
  }

  return `
    <div>
      <h3>Linked Addresses</h3>
      <ul>
        ${addressItems}
      </ul>
    </div>
  `;
}

function renderProfile(user) {
  contentContainer1.innerHTML = buildProfileComponent(user);
  document.getElementById("btn-profile-set-pass").onclick = onSetPassword;
  document.getElementById("btn-profile-save").onclick = onSaveProfile;
  document.querySelectorAll(".btn-remove").forEach(function (button) {
    button.onclick = onUnlinkAddress;
  });

  const btnAddAddress = document.getElementById("btn-add-addr");
  if (btnAddAddress) {
    btnAddAddress.onclick = onAddAddress;
  }
}

function renderProfile1(user1) {
  registercontentContainer.innerHTML = buildProfileComponent(user1);

  document.getElementById("btn-profile-set-pass").onclick = onSetPassword;
  document.getElementById("btn-profile-save").onclick = onSaveProfile;
  document.querySelectorAll(".btn-remove").forEach(function (button) {
    button.onclick = onUnlinkAddress;
  });

  const btnAddAddress = document.getElementById("btn-add-addr");
  if (btnAddAddress) {
    btnAddAddress.onclick = onAddAddress;
  }
}

function onSetPassword(event) {
  const containerSetPass = document.getElementById("profile-set-pass");
  containerSetPass.innerHTML = buildSetPassComponent(true);
  document.getElementById("btn-save-pass").onclick = onSaveNewPassword;
  document.getElementById("btn-cancel-pass").onclick = onCancelNewPassword;
}

function buildSetPassComponent(showForm = false) {
  if (!showForm) {
    return `
      <p>Setting a password allows login via username</p>
      <button type="button" id="btn-profile-set-pass">Set Password</button>
    `;
  }

  return `
    <div class="set-password">
      <div class="form-group">
        <label for="pass">New Password</label>
        <input type="password" id="pass" autocomplete="off" />
      </div>
      <div class="form-group">
        <label for="confirm-pass">Confirm</label>
        <input type="password" id="confirm-pass" autocomplete="off" />
      </div>
      <button type="button" id="btn-save-pass">Save Password</button>
      <button type="button" id="btn-cancel-pass">Cancel</button>
    </div>
  `;
}

async function onSaveNewPassword(event) {
  event.preventDefault();
  const user = Moralis.User.current();

  try {
    // make sure new and confirmed password the same
    const newPass = document.getElementById("pass").value;
    const confirmPass = document.getElementById("confirm-pass").value;

    if (newPass !== confirmPass) {
      alert("passwords not equal");
      return;
    }
    user.setPassword(newPass);
    await user.save();
    alert("Password updated successfully!");

    render();
  } catch (error) {
    console.error(error);
    alert("Error while saving new password. See the console");
  }
}

function onCancelNewPassword() {
  const containerSetPass = document.getElementById("profile-set-pass");
  containerSetPass.innerHTML = buildSetPassComponent();
  document.getElementById("btn-profile-set-pass").onclick = onSetPassword;
}

async function onAddAddress() {
  try {
    // enabling web3 will cause an account changed event
    // which is already subscribed to link on change so
    // just connecting Metamask will do what we want
    // (as long as the account is not currently connected)
    await Moralis.enableWeb3();
  } catch (error) {
    console.error(error);
    alert("Error while linking new address. See console");
  }
}

async function onSaveProfile(event) {
  event.preventDefault();
  const user = Moralis.User.current();

  try {
    // get values from the form
    const username = document.getElementById("name").value;
    const bio = document.getElementById("bio").value;
    console.log("username:", username, "bio:", bio);

    // update user object
    user.setUsername(username); // built in
    user.set("bio", bio); // custom attribute

    await user.save();
    alert("saved successfully!");
  } catch (error) {
    console.error(error);
    alert("Error while saving. See the console.");
  }
}

function render() {
  const user = Moralis.User.current();
  const contentContainer = document.getElementById("content");
  const contentContainer1 = document.getElementById("content1");

  renderHeader();
  if (user) {
    renderProfile(user);
  } 
  else
   if (contentContainer) {
    renderLogin(); 
  } else
  if (contentContainer1) {
    renderProfile(user);
 } 
}
function render1() {
  const user1 = Moralis.User.current();
  const registercontentContainer = document.getElementById("registercontent"); 
  renderHeader();
  if (user1) { 
    renderProfile1(user1); 
  } else if (registercontentContainer) {
    renderSignup();
  }   
   
}


function init() {
  listenForAccountChange();
  // render on page load
  render();
  render1(); 
} 
init();
  
