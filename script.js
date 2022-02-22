//"use strict";
const account1 = {
  owner: "Ergashev Maruf",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Alisher Usmonov",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const logout = function () {
  const tick = function () {
    const minut = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minut}:${second}`;
    if (time === 0) {
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
const accounts = [account1, account2];
const usernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
usernames(accounts);
const displayTime = function (date, locale) {
  const calcDate = (date1, date2) =>
    Math.round((date1 - date2) / (1000 * 60 * 60 * 24));

  const pastDate = calcDate(new Date(), date);
  if (pastDate === 0) return `Today`;
  if (pastDate === 1) return `Yesterday`;
  if (pastDate <= 7) return `${pastDate} ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};
const printNumber = function (mov, loc, curr) {
  return `${Intl.NumberFormat(loc, {
    style: "currency",
    currency: `${curr}`,
  }).format(mov)}`;
};
/////////////////////////////////////////////////////
//Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
/////////////////////////////////////////////////////////////////
////Display money

const displayMoney = function (acc, sorted = false) {
  containerMovements.innerHTML = "";
  const mov = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mov.forEach(function (money, i) {
    const transferDate = new Date(acc.movementsDates[i]);
    const display_date = displayTime(transferDate, acc.locale);

    const type = money > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${display_date}</div>
        <div class="movements__value">${printNumber(
          money,
          acc.locale,
          acc.currency
        )}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

///////
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mon) => mon > 0)
    .reduce((acc, mon) => acc + mon);
  const out = acc.movements
    .filter((mon) => mon < 0)
    .reduce((acc, mon) => acc + mon);
  //Display interest
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = printNumber(incomes, acc.locale, acc.currency);
  labelSumOut.textContent = printNumber(out, acc.locale, acc.currency);
  labelSumInterest.textContent = printNumber(
    interest,
    acc.locale,
    acc.currency
  );
};
//////
const displayBalance = function (currentA) {
  currentA.balance = currentA.movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = printNumber(
    currentA.balance,
    currentA.locale,
    currentA.currency
  );
};
/////
function updateUI(currentAccount) {
  displayMoney(currentAccount);

  displayBalance(currentAccount);

  calcDisplaySummary(currentAccount);
}
let currentAccount, timer;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome our bos ${
      currentAccount.owner.split(" ")[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputClosePin.blur();
    containerApp.style.opacity = 100;
    labelDate.textContent = `${new Intl.DateTimeFormat(
      currentAccount.locale
    ).format(new Date())}`;
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = logout();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);

  const receiver = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiver &&
    receiver?.username !== currentAccount.username &&
    amount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = logout();
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const deleteAccount = accounts.findIndex(
    (acc) => acc.username == inputCloseUsername.value
  );
  const deletePin = accounts.findIndex(
    (acc) => acc.pin == Number(inputClosePin.value)
  );
  inputClosePin.value = inputCloseUsername.value = "";
  if (deleteAccount == deletePin) {
    accounts.splice(deleteAccount, 1);
    console.log(accounts);
  }
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mon) => mon >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    inputLoanAmount.value = "";
    if (timer) clearInterval(timer);
    timer = logout();
  }
});
let sorting = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMoney(currentAccount.movements, !sorting);
  sorting = !sorting;
});
labelBalance.addEventListener("click", function (e) {
  const movementUi = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent)
  );
});
