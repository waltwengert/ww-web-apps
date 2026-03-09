import './style.css';

function decrypt() {
  var nameKey = document.getElementById("input").value.toLowerCase();
  var nameKeyNumberStripped = nameKey.slice(4);
  var decryptedParticipant = "";
  var cipherKey = 13;

  for (var i = 0; i < nameKeyNumberStripped.length; i++) {
    var charCode = nameKeyNumberStripped.charAt(i).charCodeAt();

    //lower case ASCII alphabet is 97(a) to 122(z)
    if (charCode - cipherKey < 97) { //start at beginning of alphabet
      charCode -= cipherKey - 26;
    } else {
      charCode -= cipherKey;
    }

    var char = String.fromCharCode(charCode);
    decryptedParticipant += char;
  }

  document.getElementById("recipient").textContent = decryptedParticipant;
}

// Initialize the app
function init() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <h1 class="heading">Secret Santa</h1>
        <input id="input" type="text" placeholder="The code goes here" autofocus>

        <div class="inputBtns">
          <button onclick="decrypt()" id="hide">Who do I have?</button>
        </div>

        <div id="result" class="pContainer">
          <p class="whiteTxt">You have:</p>
          <p id="recipient"></p>
        </div>
    `;

    //add an event listener (for the enter key) when input is focused
    document.getElementById("input").addEventListener("keyup", function (e) {
      //enter has a keycode of 13
      if (e.keyCode == 13) {
        //call the same function that clicking add calls
        decrypt();
      }
    });
}

// Make functions global so they can be called from HTML
window.decrypt = decrypt;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
