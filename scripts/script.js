const button = document.querySelector('.btn');
const labels = document.querySelectorAll('.form__label');
const inputs = document.querySelectorAll('.form__input');
const errorMsg = document.querySelectorAll('.error-message');
const ageValues = document.querySelectorAll('.value');

const inputData = { day: false, month: false, year: false };

const date = new Date();

const handleData = (id, value) => {
  inputData[id] = value;
};

const styleError = () => {
  labels.forEach((label) => label.classList.add('error-label'));
  inputs.forEach((input) => input.classList.add('error-input'));
};

const printError = (invalidID, message = 'This field is required') => {
  errorMsg.forEach((error) => {
    invalidID.forEach((id) => {
      if (error.dataset.id === id) {
        error.style.display = 'block';
        error.innerHTML = message;
      }
    });
  });
  if (invalidID.length === 0) {
    return true;
  } else {
    return false;
  }
};

const clearError = () => {
  errorMsg.forEach((error) => {
    error.style.display = 'none';
  });
  labels.forEach((label) => label.classList.remove('error-label'));
  inputs.forEach((input) => input.classList.remove('error-input'));
};

const clearInputs = () => {
  inputs.forEach((input) => (input.value = ''));
};

const invalidInputHandler = () => {
  const invalidID = Object.entries(inputData)
    .filter((input) => !input[1])
    .map((input) => input[0]);

  return invalidID;
};

const inputValidation = (id, value) => {
  if (id === 'day' && (value > 31 || value < 1)) {
    printError([id], 'Must be a valid day');
    styleError();
    button.disabled = true;
  } else if (id === 'month' && (value > 12 || value < 1)) {
    printError([id], 'Must be a valid month');
    styleError();
    button.disabled = true;
  } else if (id === 'year' && value > date.getFullYear()) {
    printError([id], 'Must be in the past');
    styleError();
    button.disabled = true;
  } else {
    clearError();
    button.disabled = false;
  }
};

const isValidDate = (data) => {
  const [day, month, year] = Object.values(data);
  const date = new Date(year, month - 1, day);

  return (
    !isNaN(date) &&
    date.getFullYear() === +year &&
    date.getMonth() === +month - 1 &&
    date.getDate() === +day
  );
};

const calculateAge = (data) => {
  const [day, month, year] = Object.values(data);
  const birthdateObj = new Date(year, month - 1, day);

  let years = date.getFullYear() - birthdateObj.getFullYear();
  if (
    date.getMonth() < birthdateObj.getMonth() ||
    (date.getMonth() === birthdateObj.getMonth() &&
      date.getDate() < birthdateObj.getDate())
  ) {
    years--;
  }

  let months = 0;
  if (date.getMonth() >= birthdateObj.getMonth()) {
    months = date.getMonth() - birthdateObj.getMonth();
  } else {
    years--;
    months = 12 - birthdateObj.getMonth() + date.getMonth();
  }

  let days = date.getDate() - birthdateObj.getDate();
  if (days < 0) {
    months--;
    days += 30;
  }

  return { years, months, days };
};

const displayData = (ageData) => {
  ageValues.forEach((value) => {
    Object.keys(ageData).map((data) => {
      if (value.id === data) value.innerHTML = ageData[data];
    });
  });
};

inputs.forEach((input) =>
  input.addEventListener('change', (event) => {
    handleData(input.id, event.target.value);
    inputValidation(input.id, event.target.value);
  })
);

button.addEventListener('click', (event) => {
  event.preventDefault();
  clearError();
  if (!isValidDate(inputData)) {
    printError(['day', 'month', 'year'], 'Enter a valid data');
    styleError();
  } else {
    displayData(calculateAge(inputData));
  }
  printError(invalidInputHandler());
  clearInputs();
  if (invalidInputHandler().length === 0) return;
  styleError();
});
