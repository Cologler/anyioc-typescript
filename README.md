# anyioc

[![Build Status](https://travis-ci.com/Cologler/anyioc-typescript.svg?branch=master)](https://travis-ci.com/Cologler/anyioc-typescript)
[![npm](https://img.shields.io/npm/v/anyioc.svg)](https://www.npmjs.com/package/anyioc)
[![](https://data.jsdelivr.com/v1/package/gh/Cologler/anyioc-typescript/badge)](https://www.jsdelivr.com/package/gh/Cologler/anyioc-typescript)

Another simple ioc framework for javascript/typescript.

## Install

### for Node

``` cmd
npm install anyioc
```

### for Browser

Use packed file `dist.browser/anyioc.js`.

## Usage

``` typescript
import { ServiceProvider } from "anyioc";
const provider = new ServiceProvider();
provider.registerSingleton('the key', ioc => 102); // ioc will be scoped ServiceProvider
value = provider.get('the key'); // 102
```

There are some predefined key you can use direct, but you still can overwrite it:

* `ioc` - get current scoped ServiceProvider instance.
* `provider` - alias of `ioc`
