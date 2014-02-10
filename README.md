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
      options: {
        // Target-specific file options go here.
      },
      files: {
        // Target-specific file lists go here.
        'schema.json': ['file1.json', 'file2.json']  // the schema will validate file1 and file2
      }
    },
  },
})
```

### Options

Options for [strict validation](https://github.com/zaggino/z-schema#strict-validation). Any option defined here will be passed over to ZSchema instance.

Example:

```js
zschema: {
  options: {
    noTypeless: true
  }
}
```

### Usage Examples

In this example, `post1.json` and `post2.json` are two JSON files that will be validated against the `post-schema.json` schema. All JSON files in the `comments` will be validated against the comment schema. All validations will also report unknown keywords.

```js
grunt.initConfig({
  zschema: {
    options: {
      noExtraKeywords: true
    },
    build: {
      files: {
        'post-schema.json': ['posts/post1.json', 'posts/post2.json'],
        'comment-schema.json': ['comments/*.json']
      }
    }
  }
})
```

If you don't have any actual JSON files but still need to validate the schema itself for syntactic and other errors:

```js
grunt.initConfig({
  zschema: {
    build: {
      files: {
        'schema.json': []
      }
    }
  }
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
