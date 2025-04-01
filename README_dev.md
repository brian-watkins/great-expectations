# Great Expectations - Development

### Running Tests

```
$ npm run test
```

### Publishing

1. `npm version <new version>`
- This will update package.json, package-lock.json, create a tag for the new version and make a commit.
2. `git push --follow-tags`
4. `npm publish`
- Make sure you are logged into npm; you'll need to provide an OTP token
