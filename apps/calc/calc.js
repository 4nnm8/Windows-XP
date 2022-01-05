var storage,
  operator,
  result = false,
  lastop,
  old,
  memory;

function showVariables() {
  console.log(
    'store : ' + storage + '\n' +
    'operator : ' + operator + '\n' +
    'result : ' + result + '\n' +
    'lastop : ' + lastop + '\n' +
    'old : ' + old + '\n' +
    'memory : ' + memory + '\n'
  )
}

const
  $id = (a) => {
    return document.getElementById(a)
  },
  screen = $id('calc-screen'),
  clearScreen = () => {
    screen.value = '';
    screen.placeholder = '0.';
  },
  store = () => {
    if (screen.value !== '') {
      storage = screen.value;
    }
  }
firstChar = () => {
  console.log(screen.value.substring(0, 1))
  return screen.value.substring(0, 1)
}
fnNumber = (n) => {
    if (result) screen.value = '';
    if (0 === firstChar()) {
      return false
    }
    screen.value += n;
    result = false;
    lastop = void 0;
  },
  fnC = () => {
    lastop = operator = old = void 0;
    clearScreen()
  },
  fnCE = () => {

  },
  fnMC = () => {
    //OK // MC = Memory Clear sets the memory to 0 
    memory = void 0;
    $id('calc-control').value = '';
  },
  fnMS = () => {
    // MS = Memory Store puts the number on the display into the memory 
    screen.value !== '' && (memory = screen.value, $id('calc-control').value = 'M')
  },
  fnMP = () => {
    // M+ = Memory Add takes the number on the display, adds it to the memory, and puts the result into memory
    if (screen.value == '' && !memory) {
      memory = 0;
    } else if (!memory) {
      memory = +screen.value
    } else {
      memory = eval(+screen.value + +memory)
    }
    $id('calc-control').value = 'M';

  },
  fnMR = () => {
    // MR = Memory Recall uses the number in memory, acts as if you had keyed in that number yourself
    memory && (screen.value = memory)
  },
  fnBackspace = () => {
    lastop = void 0;
    if (screen.value !== '') {
      screen.value = screen.value.slice(0, -1)
    }
  },
  fnSqrt = () => {
    lastop = void 0;
    if (screen.value !== '') {
      screen.value = Math.sqrt(screen.value);
    }
  },
  fnInvert = () => {
    lastop = void 0;
    screen.value = -1 * screen.value
  },
  fnDivide = (e) => {
    e.preventDefault();
    lastop = void 0
    store()
    clearScreen()
    operator = "/"
  },
  fnMinus = () => {
    lastop = void 0
    store()
    clearScreen()
    operator = "-"
  },
  fnPlus = () => {
    lastop = void 0
    store()
    clearScreen()
    operator = "+"
  },
  fnTimes = () => {
    lastop = void 0
    store()
    clearScreen()
    operator = "*"
  },
  fnOneOver = () => {
    lastop = void 0;
    let ev = eval(1 / screen.value);
    if (ev === Infinity) {
      screen.value = '';
      screen.placeholder = 'ERROR';
    } else {
      screen.value = ev;
    }
  },
  fnPercent = () => {
    lastop = void 0
    screen.value = screen.value * 0.01
  },
  fnDot = () => {
    if (screen.value.indexOf('.') == -1) {
      screen.value += "."
    }
  },
  fnEqual = () => {
    if (lastop) {
      screen.value = eval(screen.value + lastop);
    } else {
      old = screen.value;
      console.log('result : ' + storage + operator + screen.value)
      screen.value = eval(storage + operator + screen.value).toString().replace('Infinity', '');
      screen.placeholder = 'ERROR';
      result = true;
      lastop = operator + old;
      operator = void 0;
    }
  }

document.querySelectorAll('.nb').forEach(function(a) {
  a.addEventListener('click', function(e) {
    fnNumber(this.innerHTML)
  }, !1);
})

$id('C').addEventListener('click', fnC);
$id('calc-mp').addEventListener('click', fnMP);
$id('calc-mc').addEventListener('click', fnMC);
$id('calc-ms').addEventListener('click', fnMS);
$id('calc-mr').addEventListener('click', fnMR);
$id('backspace').addEventListener('click', fnBackspace)
$id('sqrt').addEventListener('click', fnSqrt);
$id('invert').addEventListener('click', fnInvert);
$id('divide').addEventListener('click', fnDivide);
$id('minus').addEventListener('click', fnMinus);
$id('plus').addEventListener('click', fnPlus);
$id('times').addEventListener('click', fnTimes);
$id('oneover').addEventListener('click', fnOneOver);
$id('percent').addEventListener('click', fnPercent);
$id('equal').addEventListener('click', fnEqual);
$id('dot').addEventListener('click', fnDot);



document.addEventListener('click', showVariables)
document.addEventListener('keydown', function(e) {
  //console.log(e.code)
  switch (e.code) {
    case "Numpad0":
    case "Digit0":
      fnNumber('0');
      break;
    case "Numpad1":
    case "Digit1":
      fnNumber('1');
      break;
    case "Numpad2":
    case "Digit2":
      fnNumber('2');
      break;
    case "Numpad3":
    case "Digit3":
      fnNumber('3');
      break;
    case "Numpad4":
    case "Digit4":
      fnNumber('4');
      break;
    case "Numpad5":
    case "Digit5":
      fnNumber('5');
      break;
    case "Numpad6":
    case "Digit6":
      fnNumber('6');
      break;
    case "Numpad7":
    case "Digit7":
      fnNumber('7');
      break;
    case "Numpad8":
    case "Digit8":
      fnNumber('8');
      break;
    case "Numpad9":
    case "Digit9":
      fnNumber('9');
      break;
    case "NumpadEnter":
    case "Enter":
      fnEqual();
      break;
    case "KeyR":
      fnOneOver();
      break;
    case "NumpadDecimal":
    case "Semicolon":
      fnDot();
      break;
    case "NumpadAdd":
      fnPlus();
      break;
    case "NumpadSubtract":
      fnMinus();
      break;
    case "NumpadMultiply":
      fnTimes();
      break;
    case "NumpadDivide":
      fnDivide(e);
      break;
    case "Backspace":
      fnBackspace();
      break;
    case "Delete":
      fnCE();
      break;
    case "Escape":
      fnC();
      break;
    case "F9":
      fnInvert();
      break;
    default:
      return false;

  }
  showVariables();

  /*
  M+ CTRL+P
   MC CTRL+L
    MR CTRL+R
     MS CTRL+M
      pi p
       sqrt (std) @
*/

});

window.addEventListener('load', function() {
  clearScreen();
  $id('calc-control').value = ''
});