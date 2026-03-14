function debounce(fn, delay) {
let timer;                          // 1. one timer, shared across all calls

return function (...args) {         // 2. this is what you actually call
clearTimeout(timer);              // 3. cancel any previous pending call
timer = setTimeout(() => {        // 4. schedule a new one
fn.apply(this, args);           // 5. finally call the real function
}, delay);
};
}
```

**Line 1 — `let timer`:**
This lives in the closure. 
It's shared across every call to the returned function. 
This is the key — there's only ONE timer, so each new call can cancel the previous one.

**Line 2 — `return function(...args)`:**
`debounce()` doesn't call `fn` directly. 
It returns a *new wrapper function*. That wrapper is what you assign to `handleSearch` etc.

**Line 3 — `clearTimeout(timer)`:**
Every time the wrapper is called, it immediately cancels the previous scheduled call. 
If the user typed a letter 200ms ago and types another now, the previous timer is killed before it fires.

**Line 4 — `timer = setTimeout(..., delay)`:**
A fresh timer is started. 
If nobody calls the wrapper again within `delay` ms, this one will actually fire.

**Line 5 — `fn.apply(this, args)`:**
Finally calls your real function with the correct `this` context and all the original arguments.

---

**Visualising the timer cancelling**
```
keystroke:  h        e        l        l        o        [pause 300ms]
|        |        |        |        |              |
timer:    start    cancel   cancel   cancel   cancel         FIRES!
+start   +start   +start   +start     fetchResults("hello")