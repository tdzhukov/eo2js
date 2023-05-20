You can play with EOLANG here, in a few simple steps:

First, clone this repo to your local machine and go
to the `sandbox` directory (you will need
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed):

```bash
$ git clone https://github.com/polystat/eo2js.git
```

After that, you can compile and run the code (you will need
[Maven 3.3+](https://maven.apache.org/), 
[Java SDK 8+](https://www.java.com/en/download/) 
and [NPM 8.1.2+](https://www.npmjs.com/package/npm) installed) by running:

```bash
$ npm run build -- sandbox
```

This script will run `eo2js-maven-plugin` configured in the `pom.xml` of this repository.

Intermediary `*.xml` files will be generated in the `target` directory (it will
be created). Also, there will be `.js` files in `sandbox/target/generated-sources` folder. Feel free to analyze
them: EO is parsed into XML by [eo-parser v0.29.3](https://mvnrepository.com/artifact/org.eolang/eo-parser), then translated to JavaScript.