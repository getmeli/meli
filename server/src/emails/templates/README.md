# Email templates

Place in this folder Handlebar email templates.

For example, create a `my-template.hbs` file:

```hbs
Hello {{name}}
```

Then in the code, use it as:

```ts
sendEmail(['test@test.com'], 'Hey !', 'my-template', {
  name: 'Steeve',
});
```
