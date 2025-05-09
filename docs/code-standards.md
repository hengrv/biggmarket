# Code Style Documentation

Consistent code style is very important to ensure the maintainability of a large scale application - the category of which our application falls into, being almost 10,000 lines of code long.

## Eslint

[eslint](https://eslint.org/) is the code linter and static type checker that we are using for this application. The configuration file is located in `.eslintrc.cjs`, containing many plugins for the tech stack we are using. This includes rules such as how to correctly use `React` hooks, and ensuring that conditional rendering rules are followed, amongst others.

It not only checks for valid JavaScript/TypeScript code, but many forms of code smell that can contribute to a lack of maintainability, such as potential `null`/`undefined` variable access.

Any build of the application in our CI/CD must pass all Eslint checks with no errors, otherwise the build fails. This is to minimise the amount of simple bugs that enter the application, and ensure that if an build is successful, it should function correctly

## Prettier

[prettier](https://prettier.io/) is an opinionated code formatter used on all local development machines. The configuration file is located at `prettier.config.js`, and contains a plugin for `tailwindcss`. Whenever code is saved, prettier is run to format the code into a standard format. This ensures that tab size, indentation and variable names are correct and consistent between all developers. The `tailwindcss` plugin also ensures that any `tailwindcss` classes are applied in the correct order to prevent any specificity rules.
