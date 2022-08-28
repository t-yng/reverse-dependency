# reverse-dependency

![reverse-dependency screenshot](https://github.com/t-yng/reverse-dependency/blob/main/docs/reverse-dependency.png)

## Installation
```sh
$ yarn global add @t-yng/reverse-dependency
```

or

```sh
$ npm install -g @t-yng/reverse-dependency
```

## Usage
```
$ cd <project to show dependency>
$ reverse-dependency -s ./src
```

### Options

|option|required|default|description|
|--|--|--|--|
|-s,--source|✅|path of root directory to show dependency|
|-p,--port||3000|server port number|
|--include-only|||included files expression in result|
|--exclude||node_modules test spec|excluded files expression from result|
|--max-depth||10|the maximum depth to scan dependency|
|--ts-config||tsconfig.json|TypeScript configuration file|

### Example

```
$ reverse-dependency -s ./src -p 4000 --exclude node_modules types --max-depth 5
```