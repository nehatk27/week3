const validationRules = {
  username: [
    { type: "required", message: "Profile username cannot be blank" },
    {
      type: "minLength",
      value: 5,
      message: "Username requires atleast 5 characters.",
    },
  ],

  email: [
    { type: "required", message: "Email cannot be blank" },
    { type: "email", message: "Email format incorrect" },
  ],

  password: [
    { type: "required", message: "Password is required" },
    {
      type: "pattern",
      value: /[A-Z]/,
      message: "Requires an uppercase variable",
    },
  ],

  confirmPassword: [
    { type: "required", message: "Password re-entry needed" },
    { type: "match", value: "password", message: "Passwords doesnt match" },
  ],
  age: [
    { type: "required", message: "Age is required" },
    {
      type: "custom",
      validator: (value) => {
        const numericAge = Number(value);
        return numericAge >= 18;
      },
      message: "You must be at least 18 years old to register.",
    },
  ],
};

class FormValidator {
  constructor(formElement, rules) {
    this.form = formElement;
    this.rules = rules;
    this.errors = {};

    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.form.addEventListener(
      "blur",
      (e) => {
        const fieldName = e.target.name;

        if (fieldName && this.rules[fieldName]) {
          this.validateField(fieldName);
        }
      },
      true,
    );
  }

  validateField(fieldName) {
    const formData = new FormData(this.form);
    const rawValue = formData.get(fieldName);
    const fieldRules = this.rules[fieldName] || [];
    let fieldErrorMsg = "";

    for (const rule of fieldRules) {
      const isPassed = this.validateRule(rawValue, rule, formData);

      if (!isPassed) {
        fieldErrorMsg = rule.message || "field error.";
        break;
      }
    }
    if (fieldErrorMsg) {
      this.errors[fieldName] = fieldErrorMsg;
      this.updateUI(fieldName, false, fieldErrorMsg);
    } else {
      delete this.errors[fieldName];
      this.updateUI(fieldName, true);
    }
  }

  updateUI(fieldName, isValid, message = "") {
    const inputElement = this.form.querySelector(`[name="${fieldName}"]`);
    if (!inputElement) return;

    const container = inputElement.parentElement;
    const errorSpan = container.querySelector(`span.field-error`);

    if (isValid) {
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");
      if (errorSpan) errorSpan.textContent = "";
    } else {
      inputElement.classList.remove("is-valid");
      inputElement.classList.add("is-invalid");
      if (errorSpan) errorSpan.textContent = message;
    }
  }

  validateRule(value, rule, formData) {
    const strValue =
      value !== null && value !== undefined ? String(value).trim() : "";

    switch (rule.type) {
      case "required":
        return strValue !== "";
      case "minLength":
        if (strValue === "") return true;
        return strValue.length >= rule.value;
      case "maxLength":
        return strValue.length <= rule.value;
      case "pattern":
        if (strValue === "") return true;
        const regex =
          rule.value instanceof RegExp ? rule.value : new RegExp(rule.value);
        return regex.test(strValue);
      case "email":
        if (strValue === "") return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue);
      case "match":
        const targetValue = formData.get(rule.value);
        const targetStr =
          targetValue !== null ? String(targetValue).trim() : "";
        return strValue === targetStr;

      case "custom":
        return typeof rule.validator === "function"
          ? rule.validator(value, formData)
          : true;

      default:
        return true;
    }
  }

  handleSubmit(event) {
    this.errors = {};
    for (const fieldName of Object.keys(this.rules)) {
      this.validateField(fieldName);
    }

    if (Object.keys(this.errors).length > 0) {
      event.preventDefault();
      console.warn("Submission blocked due to errors:", this.errors);
    }
  }
}

const targetForm = document.getElementById("registrationForm");
const myValidator = new FormValidator(targetForm, validationRules);
