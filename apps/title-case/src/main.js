import './style.css';

//have global type; set in select(), used in update()
var type;

//this function is called when a new value in the dropdown <select> is selected
//it then sets var type accordingly
function select() {
    type = document.getElementById("convertType").value;
    var out = "Will convert to: ";

    out += convert("text like this", type);

    document.getElementById("txtOut").placeholder = out;
}

//this function updates the text in the output <input> as the input is typed
function update() {
    var input = document.getElementById("txtIn").value;
    var output = convert(input, type);
    document.getElementById("txtOut").value = output;
}

//this function converts a string into the desired case type
function convert(sentence, type) {
    var newSentence = "";

    for (var i = 0; i < sentence.length; i++) {
        var charCode = sentence.charAt(i).charCodeAt();
        var char;

        switch (type) {
        case "title":
            charCode = charCode;
            break;

        case "sentence":
            if (i == 0) { //first letter in the sentence
                //TODO: subsequent sentences
                if (charCode >= 97 && charCode <= 122) { //if charCode is lowercase alphabet
                    charCode -= 32; //convert to uppercase
                }
            }
            break;

        case "upper":
            if (charCode >= 97 && charCode <= 122) { //if charCode is lowercase alphabet
                charCode -= 32; //convert to uppercase
            }
            break;

        case "lower":
            if (charCode >= 65 && charCode <= 90) { //if charCode is uppercase alphabet
                charCode += 32; //convert to lowercase
            }
            break;

        default: //title case
            charCode = charCode;
            break;
        }

        char = String.fromCharCode(charCode);
        newSentence += char;
    }

    return newSentence;
}

// Initialize the app
function init() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <h1 class="center">TitleCase</h1>
        <div id="userIn" class="center">
          <input type="text" id="txtIn" class="center input" placeholder="text like this" size="10" oninput="update()">

          <select id="convertType" class="input" onchange="select()">
            <option value="title">Title Case</option>
            <option value="sentence">Sentence case</option>
            <option value="upper">UPPER CASE</option>
            <option value="lower">lower case</option>
          </select>

          <input type="text" id="txtOut" class="center input" placeholder="Will Convert to Text Like This" size="10" readonly>
        </div>
    `;

    // Initialize
    type = "title";
    select();
}

// Make functions global so they can be called from HTML
window.select = select;
window.update = update;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);