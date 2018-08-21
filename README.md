# anyioc

Another simple ioc framework for javascript/typescript.

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
