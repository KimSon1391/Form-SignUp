function Validator(options) {
  var selectorRules = {};

  function validate(inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );
    var errorMessage;

    // get rule of each selector
    var rules = selectorRules[rule.selector];

    // loop for each rules and check
    // If there is an error then break the rule so that the rule is not over
    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  }

  //form
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      //loop rules
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        validate(inputElement, rule);
      });
    };

    // loop rules
    options.rules.forEach(function (rule) {
      // check Array
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      //input
      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        //onblur input event
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //have value in input event
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.errorSelector
          );
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}


// Check
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "This input is required";
    },
  };
};
Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value) ? undefined : "Email is not valid";
    },
  };
};
Validator.checkLength = function (selector, min, max) {
  return {
    selector: selector,
    test: function (value) {
      if (value.length < min) {
        return `Password must be more than ${min} character`;
      } else if (value.length > max) {
        return `Password must be less than ${max} character`;
      } else {
        return undefined;
      }
    },
  };
};
