# grunt-z-schema

Grunt plugin for [z-schema](https://github.com/zaggino/z-schema), a JSON Schema validator.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-z-schema --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-z-schema');
```

## The "zschema" task

### Overview
In your project's Gruntfile, add a section named `zschema` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  zschema: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.schema
Type: `String`

Path to schema file.

#### options.validation
Type: `Object`
Default value: `{}`

Specify options for [strict validation](https://github.com/zaggino/z-schema#strict-validation). Any option defined here will be passed over to ZSchema instance.

Example:

```js
zschema: {
  options: {
    validation: {
      noTypeless: true
    }
  }
}
```

### Usage Examples

```js
grunt.initConfig({
  zschema: {
    options: {
      schema: 'schema.json',
      validation: {
        noExtraKeywords: true
      }
    },
    build: {
      files: {
        src: ['src/config.json']
      }
    }
  },
})
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

### Tests

    npm test

The test will print out validation errors for the tasks designed to fail. That is expected behaviour. Unfortunately, Grunt does not really provide a good way to test that a task failed. If you come across a better solution please let me know.

## Release History

See CHANGELOG.md

## License
Copyright (c) 2014 Petr Bela. Licensed under the MIT license.
