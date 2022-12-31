
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch$1(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch$1(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch$1(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch$1(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function p(e,a=!1){return e=e.slice(e.startsWith("/#")?2:0,e.endsWith("/*")?-2:void 0),e.startsWith("/")||(e="/"+e),e==="/"&&(e=""),a&&!e.endsWith("/")&&(e+="/"),e}function d(e,a){e=p(e,!0),a=p(a,!0);let r=[],n={},t=!0,s=e.split("/").map(o=>o.startsWith(":")?(r.push(o.slice(1)),"([^\\/]+)"):o).join("\\/"),c=a.match(new RegExp(`^${s}$`));return c||(t=!1,c=a.match(new RegExp(`^${s}`))),c?(r.forEach((o,h)=>n[o]=c[h+1]),{exact:t,params:n,part:c[0].slice(0,-1)}):null}function x(e,a,r){if(r==="")return e;if(r[0]==="/")return r;let n=c=>c.split("/").filter(o=>o!==""),t=n(e),s=a?n(a):[];return "/"+s.map((c,o)=>t[o]).join("/")+"/"+r}function m(e,a,r,n){let t=[a,"data-"+a].reduce((s,c)=>{let o=e.getAttribute(c);return r&&e.removeAttribute(c),o===null?s:o},!1);return !n&&t===""?!0:t||n||!1}function S(e){let a=e.split("&").map(r=>r.split("=")).reduce((r,n)=>{let t=n[0];if(!t)return r;let s=n.length>1?n[n.length-1]:!0;return typeof s=="string"&&s.includes(",")&&(s=s.split(",")),r[t]===void 0?r[t]=[s]:r[t].push(s),r},{});return Object.entries(a).reduce((r,n)=>(r[n[0]]=n[1].length>1?n[1]:n[1][0],r),{})}function M(e){return Object.entries(e).map(([a,r])=>r?r===!0?a:`${a}=${Array.isArray(r)?r.join(","):r}`:null).filter(a=>a).join("&")}function w(e,a){return e?a+e:""}function k(e){throw new Error("[Tinro] "+e)}var i$1={HISTORY:1,HASH:2,MEMORY:3,OFF:4,run(e,a,r,n){return e===this.HISTORY?a&&a():e===this.HASH?r&&r():n&&n()},getDefault(){return !window||window.location.pathname==="srcdoc"?this.MEMORY:this.HISTORY}};var y,$,H,b="",l=E();function E(){let e=i$1.getDefault(),a,r=c=>window.onhashchange=window.onpopstate=y=null,n=c=>a&&a(R(e)),t=c=>{c&&(e=c),r(),e!==i$1.OFF&&i$1.run(e,o=>window.onpopstate=n,o=>window.onhashchange=n)&&n();},s=c=>{let o=Object.assign(R(e),c);return o.path+w(M(o.query),"?")+w(o.hash,"#")};return {mode:t,get:c=>R(e),go(c,o){_(e,c,o),n();},start(c){a=c,t();},stop(){a=null,t(i$1.OFF);},set(c){this.go(s(c),!c.path);},methods(){return j(this)},base:c=>b=c}}function _(e,a,r){!r&&($=H);let n=t=>history[`${r?"replace":"push"}State`]({},"",t);i$1.run(e,t=>n(b+a),t=>n(`#${a}`),t=>y=a);}function R(e){let a=window.location,r=i$1.run(e,t=>(b?a.pathname.replace(b,""):a.pathname)+a.search+a.hash,t=>String(a.hash.slice(1)||"/"),t=>y||"/"),n=r.match(/^([^?#]+)(?:\?([^#]+))?(?:\#(.+))?$/);return H=r,{url:r,from:$,path:n[1]||"",query:S(n[2]||""),hash:n[3]||""}}function j(e){let a=()=>e.get().query,r=c=>e.set({query:c}),n=c=>r(c(a())),t=()=>e.get().hash,s=c=>e.set({hash:c});return {hash:{get:t,set:s,clear:()=>s("")},query:{replace:r,clear:()=>r(""),get(c){return c?a()[c]:a()},set(c,o){n(h=>(h[c]=o,h));},delete(c){n(o=>(o[c]&&delete o[c],o));}}}}var f=T();function T(){let{subscribe:e}=writable(l.get(),a=>{l.start(a);let r=P(l.go);return ()=>{l.stop(),r();}});return {subscribe:e,goto:l.go,params:Q,meta:O,useHashNavigation:a=>l.mode(a?i$1.HASH:i$1.HISTORY),mode:{hash:()=>l.mode(i$1.HASH),history:()=>l.mode(i$1.HISTORY),memory:()=>l.mode(i$1.MEMORY)},base:l.base,location:l.methods()}}function P(e){let a=r=>{let n=r.target.closest("a[href]"),t=n&&m(n,"target",!1,"_self"),s=n&&m(n,"tinro-ignore"),c=r.ctrlKey||r.metaKey||r.altKey||r.shiftKey;if(t=="_self"&&!s&&!c&&n){let o=n.getAttribute("href").replace(/^\/#/,"");/^\/\/|^#|^[a-zA-Z]+:/.test(o)||(r.preventDefault(),e(o.startsWith("/")?o:n.href.replace(window.location.origin,"")));}};return addEventListener("click",a),()=>removeEventListener("click",a)}function Q(){return getContext("tinro").meta.params}var g="tinro",K=v({pattern:"",matched:!0});function q(e){let a=getContext(g)||K;(a.exact||a.fallback)&&k(`${e.fallback?"<Route fallback>":`<Route path="${e.path}">`}  can't be inside ${a.fallback?"<Route fallback>":`<Route path="${a.path||"/"}"> with exact path`}`);let r=e.fallback?"fallbacks":"childs",n=writable({}),t=v({fallback:e.fallback,parent:a,update(s){t.exact=!s.path.endsWith("/*"),t.pattern=p(`${t.parent.pattern||""}${s.path}`),t.redirect=s.redirect,t.firstmatch=s.firstmatch,t.breadcrumb=s.breadcrumb,t.match();},register:()=>(t.parent[r].add(t),async()=>{t.parent[r].delete(t),t.parent.activeChilds.delete(t),t.router.un&&t.router.un(),t.parent.match();}),show:()=>{e.onShow(),!t.fallback&&t.parent.activeChilds.add(t);},hide:()=>{e.onHide(),t.parent.activeChilds.delete(t);},match:async()=>{t.matched=!1;let{path:s,url:c,from:o,query:h}=t.router.location,u=d(t.pattern,s);if(!t.fallback&&u&&t.redirect&&(!t.exact||t.exact&&u.exact)){let A=x(s,t.parent.pattern,t.redirect);return f.goto(A,!0)}t.meta=u&&{from:o,url:c,query:h,match:u.part,pattern:t.pattern,breadcrumbs:t.parent.meta&&t.parent.meta.breadcrumbs.slice()||[],params:u.params,subscribe:n.subscribe},t.breadcrumb&&t.meta&&t.meta.breadcrumbs.push({name:t.breadcrumb,path:u.part}),n.set(t.meta),u&&!t.fallback&&(!t.exact||t.exact&&u.exact)&&(!t.parent.firstmatch||!t.parent.matched)?(e.onMeta(t.meta),t.parent.matched=!0,t.show()):t.hide(),u&&t.showFallbacks();}});return setContext(g,t),onMount(()=>t.register()),t}function O(){return hasContext(g)?getContext(g).meta:k("meta() function must be run inside any `<Route>` child component only")}function v(e){let a={router:{},exact:!1,pattern:null,meta:null,parent:null,fallback:!1,redirect:!1,firstmatch:!1,breadcrumb:null,matched:!1,childs:new Set,activeChilds:new Set,fallbacks:new Set,async showFallbacks(){if(!this.fallback&&(await tick(),this.childs.size>0&&this.activeChilds.size==0||this.childs.size==0&&this.fallbacks.size>0)){let r=this;for(;r.fallbacks.size==0;)if(r=r.parent,!r)return;r&&r.fallbacks.forEach(n=>{if(n.redirect){let t=x("/",n.parent.pattern,n.redirect);f.goto(t,!0);}else n.show();});}},start(){this.router.un||(this.router.un=f.subscribe(r=>{this.router.location=r,this.pattern!==null&&this.match();}));},match(){this.showFallbacks();}};return Object.assign(a,e),a.start(),a}

    /* node_modules/tinro/cmp/Route.svelte generated by Svelte v3.48.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*params*/ 2,
    	meta: dirty & /*meta*/ 4
    });

    const get_default_slot_context = ctx => ({
    	params: /*params*/ ctx[1],
    	meta: /*meta*/ ctx[2]
    });

    // (33:0) {#if showContent}
    function create_if_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, params, meta*/ 262)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(33:0) {#if showContent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$F(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showContent*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showContent*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showContent*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = '/*' } = $$props;
    	let { fallback = false } = $$props;
    	let { redirect = false } = $$props;
    	let { firstmatch = false } = $$props;
    	let { breadcrumb = null } = $$props;
    	let showContent = false;
    	let params = {}; /* DEPRECATED */
    	let meta = {};

    	const route = q({
    		fallback,
    		onShow() {
    			$$invalidate(0, showContent = true);
    		},
    		onHide() {
    			$$invalidate(0, showContent = false);
    		},
    		onMeta(newmeta) {
    			$$invalidate(2, meta = newmeta);
    			$$invalidate(1, params = meta.params); /* DEPRECATED */
    		}
    	});

    	const writable_props = ['path', 'fallback', 'redirect', 'firstmatch', 'breadcrumb'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createRouteObject: q,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		showContent,
    		params,
    		meta,
    		route
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('showContent' in $$props) $$invalidate(0, showContent = $$props.showContent);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('meta' in $$props) $$invalidate(2, meta = $$props.meta);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, redirect, firstmatch, breadcrumb*/ 232) {
    			route.update({ path, redirect, firstmatch, breadcrumb });
    		}
    	};

    	return [
    		showContent,
    		params,
    		meta,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {
    			path: 3,
    			fallback: 4,
    			redirect: 5,
    			firstmatch: 6,
    			breadcrumb: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$F.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fallback() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fallback(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redirect() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redirect(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get firstmatch() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstmatch(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breadcrumb() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breadcrumb(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const DEFAULT_DELAY = 300;
    const DEFAULT_MIN_SWIPE_DISTANCE = 60; // in pixels

    const DEFAULT_TOUCH_ACTION = 'none';

    function addEventListener$1(node, event, handler) {
      node.addEventListener(event, handler);
      return () => node.removeEventListener(event, handler);
    }

    function removeEvent(event, activeEvents) {
      return activeEvents.filter(activeEvent => {
        return event.pointerId !== activeEvent.pointerId;
      });
    }

    function dispatch(node, gestureName, event, activeEvents, pointerType) {
      node.dispatchEvent(new CustomEvent(`${gestureName}${pointerType}`, {
        detail: {
          event,
          pointersCount: activeEvents.length
        }
      }));
    }

    function setPointerControls(gestureName, node, onMoveCallback, onDownCallback, onUpCallback, touchAction = DEFAULT_TOUCH_ACTION) {
      node.style.touchAction = touchAction;
      let activeEvents = [];

      function handlePointerdown(event) {
        activeEvents.push(event);
        dispatch(node, gestureName, event, activeEvents, 'down');
        onDownCallback?.(activeEvents, event);
        const pointerId = event.pointerId;

        function onup(e) {
          if (pointerId === e.pointerId) {
            activeEvents = removeEvent(e, activeEvents);

            if (!activeEvents.length) {
              removeEventHandlers();
            }

            dispatch(node, gestureName, e, activeEvents, 'up');
            onUpCallback?.(activeEvents, e);
          }
        }

        function removeEventHandlers() {
          removePointermoveHandler();
          removeLostpointercaptureHandler();
          removepointerupHandler();
          removepointerleaveHandler();
        }

        const removePointermoveHandler = addEventListener$1(node, 'pointermove', e => {
          activeEvents = activeEvents.map(activeEvent => {
            return e.pointerId === activeEvent.pointerId ? e : activeEvent;
          });
          dispatch(node, gestureName, e, activeEvents, 'move');
          onMoveCallback?.(activeEvents, e);
        });
        const removeLostpointercaptureHandler = addEventListener$1(node, 'lostpointercapture', e => {
          onup(e);
        });
        const removepointerupHandler = addEventListener$1(node, 'pointerup', e => {
          onup(e);
        });
        const removepointerleaveHandler = addEventListener$1(node, 'pointerleave', e => {
          activeEvents = [];
          removeEventHandlers();
          dispatch(node, gestureName, e, activeEvents, 'up');
          onUpCallback?.(activeEvents, e);
        });
      }

      const removePointerdownHandler = addEventListener$1(node, 'pointerdown', handlePointerdown);
      return {
        destroy: () => {
          removePointerdownHandler();
        }
      };
    }

    function swipe(node, parameters = {
      timeframe: DEFAULT_DELAY,
      minSwipeDistance: DEFAULT_MIN_SWIPE_DISTANCE,
      touchAction: DEFAULT_TOUCH_ACTION
    }) {
      const gestureName = 'swipe';
      let startTime;
      let clientX;
      let clientY;
      let target;

      function onDown(activeEvents, event) {
        clientX = event.clientX;
        clientY = event.clientY;
        startTime = Date.now();

        if (activeEvents.length === 1) {
          target = event.target;
        }
      }

      function onUp(activeEvents, event) {
        if (event.type === 'pointerup' && activeEvents.length === 0 && Date.now() - startTime < parameters.timeframe) {
          const x = event.clientX - clientX;
          const y = event.clientY - clientY;
          const absX = Math.abs(x);
          const absY = Math.abs(y);
          let direction = null;

          if (absX >= 2 * absY && absX > parameters.minSwipeDistance) {
            // horizontal (by *2 we eliminate diagonal movements)
            direction = x > 0 ? 'right' : 'left';
          } else if (absY >= 2 * absX && absY > parameters.minSwipeDistance) {
            // vertical (by *2 we eliminate diagonal movements)
            direction = y > 0 ? 'bottom' : 'top';
          }

          if (direction) {
            node.dispatchEvent(new CustomEvent(gestureName, {
              detail: {
                direction,
                target
              }
            }));
          }
        }
      }

      return setPointerControls(gestureName, node, null, onDown, onUp, parameters.touchAction);
    }

    /* src/components/channels/categories/other.svelte generated by Svelte v3.48.0 */

    const file$E = "src/components/channels/categories/other.svelte";

    function create_fragment$E(ctx) {
    	let main;
    	let div2;
    	let div1;
    	let details;
    	let summary;
    	let t1;
    	let hr;
    	let t2;
    	let div0;
    	let button0;
    	let a0;
    	let t4;
    	let button1;
    	let a1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Other";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# Blogs";
    			t4 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# To-do";
    			attr_dev(summary, "class", "svelte-44le4e");
    			add_location(summary, file$E, 7, 16, 144);
    			attr_dev(hr, "width", "50%");
    			add_location(hr, file$E, 8, 16, 185);
    			attr_dev(a0, "class", "blogs svelte-44le4e");
    			attr_dev(a0, "href", "/blogs");
    			add_location(a0, file$E, 11, 24, 318);
    			attr_dev(button0, "class", "channelbtn svelte-44le4e");
    			add_location(button0, file$E, 10, 20, 266);
    			attr_dev(a1, "class", "to-do svelte-44le4e");
    			attr_dev(a1, "href", "/to-do");
    			add_location(a1, file$E, 14, 24, 463);
    			attr_dev(button1, "class", "channelbtn svelte-44le4e");
    			add_location(button1, file$E, 13, 20, 411);
    			attr_dev(div0, "class", "channels-list svelte-44le4e");
    			add_location(div0, file$E, 9, 16, 218);
    			attr_dev(details, "class", "links svelte-44le4e");
    			details.open = true;
    			add_location(details, file$E, 6, 12, 99);
    			attr_dev(div1, "class", "categories");
    			add_location(div1, file$E, 5, 8, 62);
    			attr_dev(div2, "class", "channels");
    			add_location(div2, file$E, 4, 4, 31);
    			add_location(main, file$E, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, details);
    			append_dev(details, summary);
    			append_dev(details, t1);
    			append_dev(details, hr);
    			append_dev(details, t2);
    			append_dev(details, div0);
    			append_dev(div0, button0);
    			append_dev(button0, a0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(button1, a1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Other', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Other> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Other extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Other",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src/components/channels/categories/projects.svelte generated by Svelte v3.48.0 */

    const file$D = "src/components/channels/categories/projects.svelte";

    function create_fragment$D(ctx) {
    	let main;
    	let div2;
    	let div1;
    	let details;
    	let summary;
    	let t1;
    	let hr;
    	let t2;
    	let div0;
    	let button0;
    	let a0;
    	let t4;
    	let button1;
    	let a1;
    	let t6;
    	let button2;
    	let a2;
    	let t8;
    	let button3;
    	let a3;
    	let t10;
    	let button4;
    	let a4;
    	let t12;
    	let button5;
    	let a5;
    	let t14;
    	let button6;
    	let a6;
    	let t16;
    	let button7;
    	let a7;
    	let t18;
    	let button8;
    	let a8;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t4 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t6 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t8 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t10 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t12 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t14 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t16 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t18 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			attr_dev(summary, "class", "svelte-zxqnss");
    			add_location(summary, file$D, 7, 16, 147);
    			attr_dev(hr, "width", "50%");
    			add_location(hr, file$D, 8, 16, 191);
    			attr_dev(a0, "class", "anyanime-cn svelte-zxqnss");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$D, 11, 24, 324);
    			attr_dev(button0, "class", "channelbtn svelte-zxqnss");
    			add_location(button0, file$D, 10, 20, 272);
    			attr_dev(a1, "class", "image2url-cn svelte-zxqnss");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$D, 14, 24, 481);
    			attr_dev(button1, "class", "channelbtn svelte-zxqnss");
    			add_location(button1, file$D, 13, 20, 429);
    			attr_dev(a2, "class", "elina-cn svelte-zxqnss");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$D, 17, 24, 641);
    			attr_dev(button2, "class", "channelbtn svelte-zxqnss");
    			add_location(button2, file$D, 16, 20, 589);
    			attr_dev(a3, "class", "stream-savers-cn svelte-zxqnss");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$D, 20, 24, 793);
    			attr_dev(button3, "class", "channelbtn svelte-zxqnss");
    			add_location(button3, file$D, 19, 20, 741);
    			attr_dev(a4, "class", "pixit-cn svelte-zxqnss");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$D, 23, 24, 965);
    			attr_dev(button4, "class", "channelbtn svelte-zxqnss");
    			add_location(button4, file$D, 22, 20, 913);
    			attr_dev(a5, "class", "breeze-cn svelte-zxqnss");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$D, 26, 24, 1113);
    			attr_dev(button5, "class", "channelbtn svelte-zxqnss");
    			add_location(button5, file$D, 25, 20, 1061);
    			attr_dev(a6, "class", "minikey-cn svelte-zxqnss");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$D, 29, 24, 1264);
    			attr_dev(button6, "class", "channelbtn svelte-zxqnss");
    			add_location(button6, file$D, 28, 20, 1212);
    			attr_dev(a7, "class", "type3d-cn svelte-zxqnss");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$D, 32, 24, 1418);
    			attr_dev(button7, "class", "channelbtn svelte-zxqnss");
    			add_location(button7, file$D, 31, 20, 1366);
    			attr_dev(a8, "class", "timely-cn svelte-zxqnss");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$D, 35, 24, 1569);
    			attr_dev(button8, "class", "channelbtn svelte-zxqnss");
    			add_location(button8, file$D, 34, 20, 1517);
    			attr_dev(div0, "class", "channels-list svelte-zxqnss");
    			add_location(div0, file$D, 9, 16, 224);
    			attr_dev(details, "class", "projects svelte-zxqnss");
    			details.open = true;
    			add_location(details, file$D, 6, 12, 99);
    			attr_dev(div1, "class", "categories");
    			add_location(div1, file$D, 5, 8, 62);
    			attr_dev(div2, "class", "channels");
    			add_location(div2, file$D, 4, 4, 31);
    			add_location(main, file$D, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, details);
    			append_dev(details, summary);
    			append_dev(details, t1);
    			append_dev(details, hr);
    			append_dev(details, t2);
    			append_dev(details, div0);
    			append_dev(div0, button0);
    			append_dev(button0, a0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(button1, a1);
    			append_dev(div0, t6);
    			append_dev(div0, button2);
    			append_dev(button2, a2);
    			append_dev(div0, t8);
    			append_dev(div0, button3);
    			append_dev(button3, a3);
    			append_dev(div0, t10);
    			append_dev(div0, button4);
    			append_dev(button4, a4);
    			append_dev(div0, t12);
    			append_dev(div0, button5);
    			append_dev(button5, a5);
    			append_dev(div0, t14);
    			append_dev(div0, button6);
    			append_dev(button6, a6);
    			append_dev(div0, t16);
    			append_dev(div0, button7);
    			append_dev(button7, a7);
    			append_dev(div0, t18);
    			append_dev(div0, button8);
    			append_dev(button8, a8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src/components/channels/home/home-cn.svelte generated by Svelte v3.48.0 */
    const file$C = "src/components/channels/home/home-cn.svelte";

    function create_fragment$C(ctx) {
    	let main;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let details;
    	let summary;
    	let t9;
    	let hr1;
    	let t10;
    	let div2;
    	let button0;
    	let a0;
    	let t12;
    	let button1;
    	let a1;
    	let t14;
    	let br0;
    	let t15;
    	let projects;
    	let t16;
    	let br1;
    	let t17;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	projects = new Projects({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Home";
    			t9 = space();
    			hr1 = element("hr");
    			t10 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# Home";
    			t12 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# About me";
    			t14 = space();
    			br0 = element("br");
    			t15 = space();
    			create_component(projects.$$.fragment);
    			t16 = space();
    			br1 = element("br");
    			t17 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-19ccyji");
    			add_location(script, file$C, 34, 4, 1013);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-19ccyji");
    			add_location(meta, file$C, 37, 4, 1123);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-19ccyji");
    			add_location(img, file$C, 41, 16, 1386);
    			attr_dev(h3, "class", "server-name-on-template svelte-19ccyji");
    			add_location(h3, file$C, 47, 16, 1635);
    			attr_dev(span, "class", "close-btn svelte-19ccyji");
    			add_location(span, file$C, 48, 16, 1699);
    			attr_dev(div0, "class", "server-template-icon svelte-19ccyji");
    			add_location(div0, file$C, 40, 12, 1335);
    			attr_dev(hr0, "class", "svelte-19ccyji");
    			add_location(hr0, file$C, 50, 12, 1789);
    			attr_dev(div1, "class", "svelte-19ccyji");
    			add_location(div1, file$C, 39, 8, 1317);
    			attr_dev(summary, "class", "svelte-19ccyji");
    			add_location(summary, file$C, 54, 16, 1900);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-19ccyji");
    			add_location(hr1, file$C, 55, 16, 1940);
    			attr_dev(a0, "class", "home-cn svelte-19ccyji");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$C, 58, 24, 2075);
    			attr_dev(button0, "class", "channelbtn svelte-19ccyji");
    			add_location(button0, file$C, 57, 20, 2023);
    			attr_dev(a1, "class", "about-cn svelte-19ccyji");
    			attr_dev(a1, "href", "/about");
    			add_location(a1, file$C, 61, 24, 2216);
    			attr_dev(button1, "class", "channelbtn svelte-19ccyji");
    			add_location(button1, file$C, 60, 20, 2164);
    			attr_dev(div2, "class", "channels-list svelte-19ccyji");
    			add_location(div2, file$C, 56, 16, 1975);
    			attr_dev(details, "class", "home svelte-19ccyji");
    			details.open = true;
    			add_location(details, file$C, 53, 12, 1856);
    			attr_dev(br0, "class", "svelte-19ccyji");
    			add_location(br0, file$C, 65, 12, 2353);
    			attr_dev(br1, "class", "svelte-19ccyji");
    			add_location(br1, file$C, 67, 12, 2397);
    			attr_dev(div3, "class", "categories svelte-19ccyji");
    			add_location(div3, file$C, 52, 8, 1819);
    			attr_dev(div4, "class", "channels svelte-19ccyji");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$C, 38, 4, 1198);
    			attr_dev(main, "class", "svelte-19ccyji");
    			add_location(main, file$C, 33, 0, 1002);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, script);
    			append_dev(main, t0);
    			append_dev(main, meta);
    			append_dev(main, t1);
    			append_dev(main, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t9);
    			append_dev(details, hr1);
    			append_dev(details, t10);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t12);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div3, t14);
    			append_dev(div3, br0);
    			append_dev(div3, t15);
    			mount_component(projects, div3, null);
    			append_dev(div3, t16);
    			append_dev(div3, br1);
    			append_dev(div3, t17);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$e, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", handler$1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(projects);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$e() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$e() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    let direction$1;

    function handler$1(event) {
    	direction$1 = event.detail.direction;

    	if (window.innerWidth < 1500) {
    		if (direction$1 == "left") {
    			closeNav$e();
    		} else if (direction$1 == "right") {
    			openNav$e();
    		}
    	}
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home_cn', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction: direction$1,
    		handler: handler$1
    	});

    	return [];
    }

    class Home_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home_cn",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    /* src/components/sidebar/servers/top.svelte generated by Svelte v3.48.0 */
    const file$B = "src/components/sidebar/servers/top.svelte";

    function create_fragment$B(ctx) {
    	let main;
    	let div2;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t;
    	let hr;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t = space();
    			hr = element("hr");
    			if (!src_url_equal(img.src, img_src_value = "https://media.discordapp.net/attachments/952764969638834228/969830435444097054/Criz.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", serverWidth$g);
    			attr_dev(img, "class", "svelte-astppl");
    			add_location(img, file$B, 9, 16, 250);
    			attr_dev(div0, "class", "sidebar-header-logo svelte-astppl");
    			add_location(div0, file$B, 8, 12, 200);
    			set_style(hr, "color", "#282a2e");
    			add_location(hr, file$B, 16, 12, 527);
    			attr_dev(div1, "class", "sidebar-header");
    			add_location(div1, file$B, 7, 8, 159);
    			attr_dev(div2, "class", "sidebar");
    			add_location(div2, file$B, 6, 4, 129);
    			add_location(main, file$B, 5, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t);
    			append_dev(div1, hr);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", openNav$e, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$g = "50px";

    function instance$B($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Top', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Top> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ serverWidth: serverWidth$g, openNav: openNav$e });
    	return [];
    }

    class Top extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Top",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src/components/sidebar/servers/list-servers.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$A = "src/components/sidebar/servers/list-servers.svelte";

    function create_fragment$A(ctx) {
    	let main;
    	let div19;
    	let div18;
    	let div17;
    	let div16;
    	let div1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h30;
    	let t2;
    	let div3;
    	let div2;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let h31;
    	let t5;
    	let div5;
    	let div4;
    	let a1;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let h32;
    	let t8;
    	let div7;
    	let div6;
    	let a2;
    	let img3;
    	let img3_src_value;
    	let t9;
    	let h33;
    	let t11;
    	let div9;
    	let div8;
    	let a3;
    	let img4;
    	let img4_src_value;
    	let t12;
    	let h34;
    	let t14;
    	let div11;
    	let div10;
    	let a4;
    	let img5;
    	let img5_src_value;
    	let t15;
    	let h35;
    	let t17;
    	let div13;
    	let div12;
    	let a5;
    	let img6;
    	let img6_src_value;
    	let t18;
    	let h36;
    	let t20;
    	let div15;
    	let div14;
    	let a6;
    	let img7;
    	let img7_src_value;
    	let t21;
    	let h37;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div19 = element("div");
    			div18 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			h30 = element("h3");
    			h30.textContent = "Kurizu";
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			a0 = element("a");
    			img1 = element("img");
    			t3 = space();
    			h31 = element("h3");
    			h31.textContent = "Chat";
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			a1 = element("a");
    			img2 = element("img");
    			t6 = space();
    			h32 = element("h3");
    			h32.textContent = "Github";
    			t8 = space();
    			div7 = element("div");
    			div6 = element("div");
    			a2 = element("a");
    			img3 = element("img");
    			t9 = space();
    			h33 = element("h3");
    			h33.textContent = "Discord";
    			t11 = space();
    			div9 = element("div");
    			div8 = element("div");
    			a3 = element("a");
    			img4 = element("img");
    			t12 = space();
    			h34 = element("h3");
    			h34.textContent = "Instagram";
    			t14 = space();
    			div11 = element("div");
    			div10 = element("div");
    			a4 = element("a");
    			img5 = element("img");
    			t15 = space();
    			h35 = element("h3");
    			h35.textContent = "Twitter";
    			t17 = space();
    			div13 = element("div");
    			div12 = element("div");
    			a5 = element("a");
    			img6 = element("img");
    			t18 = space();
    			h36 = element("h3");
    			h36.textContent = "Hashnode";
    			t20 = space();
    			div15 = element("div");
    			div14 = element("div");
    			a6 = element("a");
    			img7 = element("img");
    			t21 = space();
    			h37 = element("h3");
    			h37.textContent = "Replit";
    			if (!src_url_equal(img0.src, img0_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010592002569682994/criz.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "width", serverWidth$f);
    			attr_dev(img0, "class", "svelte-bsw0wh");
    			add_location(img0, file$A, 37, 28, 1247);
    			attr_dev(h30, "class", "hovertext svelte-bsw0wh");
    			add_location(h30, file$A, 43, 28, 1580);
    			attr_dev(div0, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div0, file$A, 36, 24, 1166);
    			attr_dev(div1, "class", "sidebar-content-servers-list-item");
    			add_location(div1, file$A, 35, 20, 1094);
    			if (!src_url_equal(img1.src, img1_src_value = "https://media.tenor.com/wSBrGHQKQZ4AAAAM/panda-girl.gif")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "width", serverWidth$f);
    			attr_dev(img1, "class", "svelte-bsw0wh");
    			add_location(img1, file$A, 49, 32, 1894);
    			attr_dev(a0, "href", "/chat");
    			add_location(a0, file$A, 48, 28, 1845);
    			attr_dev(h31, "class", "hovertext svelte-bsw0wh");
    			add_location(h31, file$A, 56, 28, 2245);
    			attr_dev(div2, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div2, file$A, 47, 24, 1764);
    			attr_dev(div3, "class", "sidebar-content-servers-list-item");
    			add_location(div3, file$A, 46, 20, 1692);
    			if (!src_url_equal(img2.src, img2_src_value = "https://cdn3.iconfinder.com/data/icons/inficons/512/github.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "width", serverWidth$f);
    			attr_dev(img2, "class", "svelte-bsw0wh");
    			add_location(img2, file$A, 62, 32, 2593);
    			attr_dev(a1, "href", "https://github.com/crizmo");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$A, 61, 28, 2508);
    			attr_dev(h32, "class", "hovertext svelte-bsw0wh");
    			add_location(h32, file$A, 68, 28, 2898);
    			attr_dev(div4, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div4, file$A, 60, 24, 2427);
    			attr_dev(div5, "class", "sidebar-content-servers-list-item");
    			add_location(div5, file$A, 59, 20, 2355);
    			if (!src_url_equal(img3.src, img3_src_value = "https://static.vecteezy.com/system/resources/previews/006/892/625/original/discord-logo-icon-editorial-free-vector.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			attr_dev(img3, "width", serverWidth$f);
    			attr_dev(img3, "class", "svelte-bsw0wh");
    			add_location(img3, file$A, 74, 32, 3252);
    			attr_dev(a2, "href", "https://discord.gg/VcMPV8vc2x");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$A, 73, 28, 3163);
    			attr_dev(h33, "class", "hovertext svelte-bsw0wh");
    			add_location(h33, file$A, 80, 28, 3613);
    			attr_dev(div6, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div6, file$A, 72, 24, 3082);
    			attr_dev(div7, "class", "sidebar-content-servers-list-item");
    			add_location(div7, file$A, 71, 20, 3010);
    			if (!src_url_equal(img4.src, img4_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/999254421416452176/instagram.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "");
    			attr_dev(img4, "width", serverWidth$f);
    			attr_dev(img4, "class", "svelte-bsw0wh");
    			add_location(img4, file$A, 86, 32, 3974);
    			attr_dev(a3, "href", "https://www.instagram.com/criz_595/");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$A, 85, 28, 3879);
    			attr_dev(h34, "class", "hovertext svelte-bsw0wh");
    			add_location(h34, file$A, 92, 28, 4307);
    			attr_dev(div8, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div8, file$A, 84, 24, 3798);
    			attr_dev(div9, "class", "sidebar-content-servers-list-item");
    			add_location(div9, file$A, 83, 20, 3726);
    			if (!src_url_equal(img5.src, img5_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/999254025302200380/unknown.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "");
    			attr_dev(img5, "width", serverWidth$f);
    			attr_dev(img5, "class", "svelte-bsw0wh");
    			add_location(img5, file$A, 98, 32, 4663);
    			attr_dev(a4, "href", "https://twitter.com/Criz_595");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$A, 97, 28, 4575);
    			attr_dev(h35, "class", "hovertext svelte-bsw0wh");
    			add_location(h35, file$A, 104, 28, 4994);
    			attr_dev(div10, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div10, file$A, 96, 24, 4494);
    			attr_dev(div11, "class", "sidebar-content-servers-list-item");
    			add_location(div11, file$A, 95, 20, 4422);
    			if (!src_url_equal(img6.src, img6_src_value = "https://www.finsmes.com/wp-content/uploads/2021/08/hashnode.jpg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "");
    			attr_dev(img6, "width", serverWidth$f);
    			attr_dev(img6, "class", "svelte-bsw0wh");
    			add_location(img6, file$A, 110, 32, 5348);
    			attr_dev(a5, "href", "https://hashnode.com/@Kurizu");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$A, 109, 28, 5260);
    			attr_dev(h36, "class", "hovertext svelte-bsw0wh");
    			add_location(h36, file$A, 116, 28, 5654);
    			attr_dev(div12, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div12, file$A, 108, 24, 5179);
    			attr_dev(div13, "class", "sidebar-content-servers-list-item");
    			add_location(div13, file$A, 107, 20, 5107);
    			if (!src_url_equal(img7.src, img7_src_value = "https://media.discordapp.net/attachments/977949070893125632/999255947564285972/replit.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "");
    			attr_dev(img7, "width", serverWidth$f);
    			attr_dev(img7, "class", "svelte-bsw0wh");
    			add_location(img7, file$A, 122, 32, 6007);
    			attr_dev(a6, "href", "https://replit.com/@kurizu");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$A, 121, 28, 5921);
    			attr_dev(h37, "class", "hovertext svelte-bsw0wh");
    			add_location(h37, file$A, 128, 28, 6339);
    			attr_dev(div14, "class", "sidebar-content-servers-list-item-icon svelte-bsw0wh");
    			add_location(div14, file$A, 120, 24, 5840);
    			attr_dev(div15, "class", "sidebar-content-servers-list-item");
    			add_location(div15, file$A, 119, 20, 5768);
    			attr_dev(div16, "class", "sidebar-content-servers-list");
    			add_location(div16, file$A, 34, 16, 1031);
    			attr_dev(div17, "class", "sidebar-content-servers");
    			add_location(div17, file$A, 33, 12, 977);
    			attr_dev(div18, "class", "sidebar-content svelte-bsw0wh");
    			add_location(div18, file$A, 32, 8, 935);
    			attr_dev(div19, "class", "sidebar");
    			add_location(div19, file$A, 31, 4, 905);
    			add_location(main, file$A, 30, 0, 894);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, h30);
    			append_dev(div16, t2);
    			append_dev(div16, div3);
    			append_dev(div3, div2);
    			append_dev(div2, a0);
    			append_dev(a0, img1);
    			append_dev(div2, t3);
    			append_dev(div2, h31);
    			append_dev(div16, t5);
    			append_dev(div16, div5);
    			append_dev(div5, div4);
    			append_dev(div4, a1);
    			append_dev(a1, img2);
    			append_dev(div4, t6);
    			append_dev(div4, h32);
    			append_dev(div16, t8);
    			append_dev(div16, div7);
    			append_dev(div7, div6);
    			append_dev(div6, a2);
    			append_dev(a2, img3);
    			append_dev(div6, t9);
    			append_dev(div6, h33);
    			append_dev(div16, t11);
    			append_dev(div16, div9);
    			append_dev(div9, div8);
    			append_dev(div8, a3);
    			append_dev(a3, img4);
    			append_dev(div8, t12);
    			append_dev(div8, h34);
    			append_dev(div16, t14);
    			append_dev(div16, div11);
    			append_dev(div11, div10);
    			append_dev(div10, a4);
    			append_dev(a4, img5);
    			append_dev(div10, t15);
    			append_dev(div10, h35);
    			append_dev(div16, t17);
    			append_dev(div16, div13);
    			append_dev(div13, div12);
    			append_dev(div12, a5);
    			append_dev(a5, img6);
    			append_dev(div12, t18);
    			append_dev(div12, h36);
    			append_dev(div16, t20);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, a6);
    			append_dev(a6, img7);
    			append_dev(div14, t21);
    			append_dev(div14, h37);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img0, "click", openNav$d, false, false, false),
    					listen_dev(img1, "click", check$2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$f = "50px";

    function openNav$d() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function closeNav$d() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function check$2() {
    	setTimeout(
    		() => {
    			if (document.getElementById("mySidenav").style.width != "0" && document.getElementById("mySidenav").style.width != "0px") {
    				closeNav$d();
    				console.log("closed");
    			} else {
    				openNav$d();
    			}
    		},
    		10
    	);
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List_servers', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<List_servers> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ serverWidth: serverWidth$f, openNav: openNav$d, closeNav: closeNav$d, check: check$2 });
    	return [openNav$d, closeNav$d];
    }

    class List_servers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { openNav: 0, closeNav: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List_servers",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get openNav() {
    		return openNav$d;
    	}

    	set openNav(value) {
    		throw new Error("<List_servers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeNav() {
    		return closeNav$d;
    	}

    	set closeNav(value) {
    		throw new Error("<List_servers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/sidebar/sidebar.svelte generated by Svelte v3.48.0 */
    const file$z = "src/components/sidebar/sidebar.svelte";

    function create_fragment$z(ctx) {
    	let main;
    	let div;
    	let servertop;
    	let t;
    	let serverlist;
    	let current;
    	servertop = new Top({ $$inline: true });
    	serverlist = new List_servers({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(servertop.$$.fragment);
    			t = space();
    			create_component(serverlist.$$.fragment);
    			attr_dev(div, "class", "sidebar svelte-peje85");
    			add_location(div, file$z, 6, 4, 141);
    			add_location(main, file$z, 5, 0, 130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(servertop, div, null);
    			append_dev(div, t);
    			mount_component(serverlist, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(servertop.$$.fragment, local);
    			transition_in(serverlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(servertop.$$.fragment, local);
    			transition_out(serverlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(servertop);
    			destroy_component(serverlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sidebar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ServerTop: Top, ServerList: List_servers });
    	return [];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src/components/channels/categories/main.svelte generated by Svelte v3.48.0 */

    const file$y = "src/components/channels/categories/main.svelte";

    function create_fragment$y(ctx) {
    	let main;
    	let div2;
    	let div1;
    	let details;
    	let summary;
    	let t1;
    	let hr;
    	let t2;
    	let div0;
    	let button0;
    	let a0;
    	let t4;
    	let button1;
    	let a1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Home";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# Home";
    			t4 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# About me";
    			attr_dev(summary, "class", "svelte-1rhp2as");
    			add_location(summary, file$y, 7, 16, 143);
    			attr_dev(hr, "width", "50%");
    			add_location(hr, file$y, 8, 16, 183);
    			attr_dev(a0, "class", "home-cn svelte-1rhp2as");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$y, 11, 24, 316);
    			attr_dev(button0, "class", "channelbtn svelte-1rhp2as");
    			add_location(button0, file$y, 10, 20, 264);
    			attr_dev(a1, "class", "about-cn svelte-1rhp2as");
    			attr_dev(a1, "href", "/about");
    			add_location(a1, file$y, 14, 24, 457);
    			attr_dev(button1, "class", "channelbtn svelte-1rhp2as");
    			add_location(button1, file$y, 13, 20, 405);
    			attr_dev(div0, "class", "channels-list svelte-1rhp2as");
    			add_location(div0, file$y, 9, 16, 216);
    			attr_dev(details, "class", "home svelte-1rhp2as");
    			details.open = true;
    			add_location(details, file$y, 6, 12, 99);
    			attr_dev(div1, "class", "categories");
    			add_location(div1, file$y, 5, 8, 62);
    			attr_dev(div2, "class", "channels");
    			add_location(div2, file$y, 4, 4, 31);
    			add_location(main, file$y, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, details);
    			append_dev(details, summary);
    			append_dev(details, t1);
    			append_dev(details, hr);
    			append_dev(details, t2);
    			append_dev(details, div0);
    			append_dev(div0, button0);
    			append_dev(button0, a0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(button1, a1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* src/components/channels/projects/elina-cn.svelte generated by Svelte v3.48.0 */
    const file$x = "src/components/channels/projects/elina-cn.svelte";

    function create_fragment$x(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1kkrri8");
    			add_location(script, file$x, 35, 4, 1044);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-1kkrri8");
    			add_location(meta, file$x, 36, 4, 1138);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-1kkrri8");
    			add_location(img, file$x, 40, 16, 1401);
    			attr_dev(h3, "class", "server-name-on-template svelte-1kkrri8");
    			add_location(h3, file$x, 46, 16, 1650);
    			attr_dev(span, "class", "close-btn svelte-1kkrri8");
    			add_location(span, file$x, 47, 16, 1714);
    			attr_dev(div0, "class", "server-template-icon svelte-1kkrri8");
    			add_location(div0, file$x, 39, 12, 1350);
    			attr_dev(hr0, "class", "svelte-1kkrri8");
    			add_location(hr0, file$x, 49, 12, 1806);
    			attr_dev(div1, "class", "svelte-1kkrri8");
    			add_location(div1, file$x, 38, 8, 1332);
    			attr_dev(br0, "class", "svelte-1kkrri8");
    			add_location(br0, file$x, 53, 12, 1894);
    			attr_dev(summary, "class", "svelte-1kkrri8");
    			add_location(summary, file$x, 55, 16, 1961);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-1kkrri8");
    			add_location(hr1, file$x, 56, 16, 2005);
    			attr_dev(a0, "class", "anyanime-cn svelte-1kkrri8");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$x, 59, 24, 2138);
    			attr_dev(button0, "class", "channelbtn svelte-1kkrri8");
    			add_location(button0, file$x, 58, 20, 2086);
    			attr_dev(a1, "class", "image2url-cn svelte-1kkrri8");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$x, 62, 24, 2295);
    			attr_dev(button1, "class", "channelbtn svelte-1kkrri8");
    			add_location(button1, file$x, 61, 20, 2243);
    			attr_dev(a2, "class", "elina-cn svelte-1kkrri8");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$x, 65, 24, 2455);
    			attr_dev(button2, "class", "channelbtn svelte-1kkrri8");
    			add_location(button2, file$x, 64, 20, 2403);
    			attr_dev(a3, "class", "stream-savers-cn svelte-1kkrri8");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$x, 68, 24, 2607);
    			attr_dev(button3, "class", "channelbtn svelte-1kkrri8");
    			add_location(button3, file$x, 67, 20, 2555);
    			attr_dev(a4, "class", "pixit-cn svelte-1kkrri8");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$x, 71, 24, 2779);
    			attr_dev(button4, "class", "channelbtn svelte-1kkrri8");
    			add_location(button4, file$x, 70, 20, 2727);
    			attr_dev(a5, "class", "breeze-cn svelte-1kkrri8");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$x, 74, 24, 2927);
    			attr_dev(button5, "class", "channelbtn svelte-1kkrri8");
    			add_location(button5, file$x, 73, 20, 2875);
    			attr_dev(a6, "class", "minikey-cn svelte-1kkrri8");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$x, 77, 24, 3078);
    			attr_dev(button6, "class", "channelbtn svelte-1kkrri8");
    			add_location(button6, file$x, 76, 20, 3026);
    			attr_dev(a7, "class", "type3d-cn svelte-1kkrri8");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$x, 80, 24, 3232);
    			attr_dev(button7, "class", "channelbtn svelte-1kkrri8");
    			add_location(button7, file$x, 79, 20, 3180);
    			attr_dev(a8, "class", "timely-cn svelte-1kkrri8");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$x, 83, 24, 3383);
    			attr_dev(button8, "class", "channelbtn svelte-1kkrri8");
    			add_location(button8, file$x, 82, 20, 3331);
    			attr_dev(div2, "class", "channels-list svelte-1kkrri8");
    			add_location(div2, file$x, 57, 16, 2038);
    			attr_dev(details, "class", "projects svelte-1kkrri8");
    			details.open = true;
    			add_location(details, file$x, 54, 12, 1913);
    			attr_dev(br1, "class", "svelte-1kkrri8");
    			add_location(br1, file$x, 87, 12, 3520);
    			attr_dev(div3, "class", "categories svelte-1kkrri8");
    			add_location(div3, file$x, 51, 8, 1836);
    			attr_dev(div4, "class", "channels svelte-1kkrri8");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$x, 37, 4, 1213);
    			attr_dev(main1, "class", "svelte-1kkrri8");
    			add_location(main1, file$x, 34, 0, 1033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$c, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$c() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$c() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Elina_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$c();
    			} else if (direction == "right") {
    				openNav$c();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Elina_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$c,
    		openNav: openNav$c,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$c, handler, openNav$c];
    }

    class Elina_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Elina_cn",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get closeNav() {
    		return closeNav$c;
    	}

    	set closeNav(value) {
    		throw new Error("<Elina_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$c;
    	}

    	set openNav(value) {
    		throw new Error("<Elina_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/anyanime-cn.svelte generated by Svelte v3.48.0 */
    const file$w = "src/components/channels/projects/anyanime-cn.svelte";

    function create_fragment$w(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-14bnzpn");
    			add_location(script, file$w, 36, 4, 1049);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-14bnzpn");
    			add_location(meta, file$w, 37, 4, 1143);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-14bnzpn");
    			add_location(img, file$w, 41, 16, 1406);
    			attr_dev(h3, "class", "server-name-on-template svelte-14bnzpn");
    			add_location(h3, file$w, 47, 16, 1655);
    			attr_dev(span, "class", "close-btn svelte-14bnzpn");
    			add_location(span, file$w, 48, 16, 1719);
    			attr_dev(div0, "class", "server-template-icon svelte-14bnzpn");
    			add_location(div0, file$w, 40, 12, 1355);
    			attr_dev(hr0, "class", "svelte-14bnzpn");
    			add_location(hr0, file$w, 50, 12, 1811);
    			attr_dev(div1, "class", "svelte-14bnzpn");
    			add_location(div1, file$w, 39, 8, 1337);
    			attr_dev(br0, "class", "svelte-14bnzpn");
    			add_location(br0, file$w, 54, 12, 1899);
    			attr_dev(summary, "class", "svelte-14bnzpn");
    			add_location(summary, file$w, 56, 16, 1966);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-14bnzpn");
    			add_location(hr1, file$w, 57, 16, 2010);
    			attr_dev(a0, "class", "anyanime-cn svelte-14bnzpn");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$w, 60, 24, 2143);
    			attr_dev(button0, "class", "channelbtn svelte-14bnzpn");
    			add_location(button0, file$w, 59, 20, 2091);
    			attr_dev(a1, "class", "image2url-cn svelte-14bnzpn");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$w, 63, 24, 2300);
    			attr_dev(button1, "class", "channelbtn svelte-14bnzpn");
    			add_location(button1, file$w, 62, 20, 2248);
    			attr_dev(a2, "class", "elina-cn svelte-14bnzpn");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$w, 66, 24, 2460);
    			attr_dev(button2, "class", "channelbtn svelte-14bnzpn");
    			add_location(button2, file$w, 65, 20, 2408);
    			attr_dev(a3, "class", "stream-savers-cn svelte-14bnzpn");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$w, 69, 24, 2612);
    			attr_dev(button3, "class", "channelbtn svelte-14bnzpn");
    			add_location(button3, file$w, 68, 20, 2560);
    			attr_dev(a4, "class", "pixit-cn svelte-14bnzpn");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$w, 72, 24, 2784);
    			attr_dev(button4, "class", "channelbtn svelte-14bnzpn");
    			add_location(button4, file$w, 71, 20, 2732);
    			attr_dev(a5, "class", "breeze-cn svelte-14bnzpn");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$w, 75, 24, 2932);
    			attr_dev(button5, "class", "channelbtn svelte-14bnzpn");
    			add_location(button5, file$w, 74, 20, 2880);
    			attr_dev(a6, "class", "minikey-cn svelte-14bnzpn");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$w, 78, 24, 3083);
    			attr_dev(button6, "class", "channelbtn svelte-14bnzpn");
    			add_location(button6, file$w, 77, 20, 3031);
    			attr_dev(a7, "class", "type3d-cn svelte-14bnzpn");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$w, 81, 24, 3237);
    			attr_dev(button7, "class", "channelbtn svelte-14bnzpn");
    			add_location(button7, file$w, 80, 20, 3185);
    			attr_dev(a8, "class", "timely-cn svelte-14bnzpn");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$w, 84, 24, 3388);
    			attr_dev(button8, "class", "channelbtn svelte-14bnzpn");
    			add_location(button8, file$w, 83, 20, 3336);
    			attr_dev(div2, "class", "channels-list svelte-14bnzpn");
    			add_location(div2, file$w, 58, 16, 2043);
    			attr_dev(details, "class", "projects svelte-14bnzpn");
    			details.open = true;
    			add_location(details, file$w, 55, 12, 1918);
    			attr_dev(br1, "class", "svelte-14bnzpn");
    			add_location(br1, file$w, 88, 12, 3525);
    			attr_dev(div3, "class", "categories svelte-14bnzpn");
    			add_location(div3, file$w, 52, 8, 1841);
    			attr_dev(div4, "class", "channels svelte-14bnzpn");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$w, 38, 4, 1218);
    			attr_dev(main1, "class", "svelte-14bnzpn");
    			add_location(main1, file$w, 35, 0, 1038);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$b, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$b() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$b() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Anyanime_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$b();
    			} else if (direction == "right") {
    				openNav$b();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Anyanime_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$b,
    		openNav: openNav$b,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$b, handler, openNav$b];
    }

    class Anyanime_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Anyanime_cn",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get closeNav() {
    		return closeNav$b;
    	}

    	set closeNav(value) {
    		throw new Error("<Anyanime_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$b;
    	}

    	set openNav(value) {
    		throw new Error("<Anyanime_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/image2url-cn.svelte generated by Svelte v3.48.0 */
    const file$v = "src/components/channels/projects/image2url-cn.svelte";

    function create_fragment$v(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-19trxyx");
    			add_location(script, file$v, 36, 4, 1049);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-19trxyx");
    			add_location(meta, file$v, 37, 4, 1143);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-19trxyx");
    			add_location(img, file$v, 41, 16, 1406);
    			attr_dev(h3, "class", "server-name-on-template svelte-19trxyx");
    			add_location(h3, file$v, 47, 16, 1655);
    			attr_dev(span, "class", "close-btn svelte-19trxyx");
    			add_location(span, file$v, 48, 16, 1719);
    			attr_dev(div0, "class", "server-template-icon svelte-19trxyx");
    			add_location(div0, file$v, 40, 12, 1355);
    			attr_dev(hr0, "class", "svelte-19trxyx");
    			add_location(hr0, file$v, 50, 12, 1811);
    			attr_dev(div1, "class", "svelte-19trxyx");
    			add_location(div1, file$v, 39, 8, 1337);
    			attr_dev(br0, "class", "svelte-19trxyx");
    			add_location(br0, file$v, 54, 12, 1899);
    			attr_dev(summary, "class", "svelte-19trxyx");
    			add_location(summary, file$v, 56, 16, 1966);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-19trxyx");
    			add_location(hr1, file$v, 57, 16, 2010);
    			attr_dev(a0, "class", "anyanime-cn svelte-19trxyx");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$v, 60, 24, 2143);
    			attr_dev(button0, "class", "channelbtn svelte-19trxyx");
    			add_location(button0, file$v, 59, 20, 2091);
    			attr_dev(a1, "class", "image2url-cn svelte-19trxyx");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$v, 63, 24, 2300);
    			attr_dev(button1, "class", "channelbtn svelte-19trxyx");
    			add_location(button1, file$v, 62, 20, 2248);
    			attr_dev(a2, "class", "elina-cn svelte-19trxyx");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$v, 66, 24, 2460);
    			attr_dev(button2, "class", "channelbtn svelte-19trxyx");
    			add_location(button2, file$v, 65, 20, 2408);
    			attr_dev(a3, "class", "stream-savers-cn svelte-19trxyx");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$v, 69, 24, 2612);
    			attr_dev(button3, "class", "channelbtn svelte-19trxyx");
    			add_location(button3, file$v, 68, 20, 2560);
    			attr_dev(a4, "class", "pixit-cn svelte-19trxyx");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$v, 72, 24, 2784);
    			attr_dev(button4, "class", "channelbtn svelte-19trxyx");
    			add_location(button4, file$v, 71, 20, 2732);
    			attr_dev(a5, "class", "breeze-cn svelte-19trxyx");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$v, 75, 24, 2932);
    			attr_dev(button5, "class", "channelbtn svelte-19trxyx");
    			add_location(button5, file$v, 74, 20, 2880);
    			attr_dev(a6, "class", "minikey-cn svelte-19trxyx");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$v, 78, 24, 3083);
    			attr_dev(button6, "class", "channelbtn svelte-19trxyx");
    			add_location(button6, file$v, 77, 20, 3031);
    			attr_dev(a7, "class", "type3d-cn svelte-19trxyx");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$v, 81, 24, 3237);
    			attr_dev(button7, "class", "channelbtn svelte-19trxyx");
    			add_location(button7, file$v, 80, 20, 3185);
    			attr_dev(a8, "class", "timely-cn svelte-19trxyx");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$v, 84, 24, 3388);
    			attr_dev(button8, "class", "channelbtn svelte-19trxyx");
    			add_location(button8, file$v, 83, 20, 3336);
    			attr_dev(div2, "class", "channels-list svelte-19trxyx");
    			add_location(div2, file$v, 58, 16, 2043);
    			attr_dev(details, "class", "projects svelte-19trxyx");
    			details.open = true;
    			add_location(details, file$v, 55, 12, 1918);
    			attr_dev(br1, "class", "svelte-19trxyx");
    			add_location(br1, file$v, 88, 12, 3525);
    			attr_dev(div3, "class", "categories svelte-19trxyx");
    			add_location(div3, file$v, 52, 8, 1841);
    			attr_dev(div4, "class", "channels svelte-19trxyx");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$v, 38, 4, 1218);
    			attr_dev(main1, "class", "svelte-19trxyx");
    			add_location(main1, file$v, 35, 0, 1038);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$a, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$a() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$a() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image2url_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$a();
    			} else if (direction == "right") {
    				openNav$a();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image2url_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$a,
    		openNav: openNav$a,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$a, handler, openNav$a];
    }

    class Image2url_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image2url_cn",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get closeNav() {
    		return closeNav$a;
    	}

    	set closeNav(value) {
    		throw new Error("<Image2url_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$a;
    	}

    	set openNav(value) {
    		throw new Error("<Image2url_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/streamsavers-cn.svelte generated by Svelte v3.48.0 */
    const file$u = "src/components/channels/projects/streamsavers-cn.svelte";

    function create_fragment$u(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-7pq2zm");
    			add_location(script, file$u, 35, 4, 1044);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-7pq2zm");
    			add_location(meta, file$u, 36, 4, 1138);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-7pq2zm");
    			add_location(img, file$u, 40, 16, 1401);
    			attr_dev(h3, "class", "server-name-on-template svelte-7pq2zm");
    			add_location(h3, file$u, 46, 16, 1650);
    			attr_dev(span, "class", "close-btn svelte-7pq2zm");
    			add_location(span, file$u, 47, 16, 1714);
    			attr_dev(div0, "class", "server-template-icon svelte-7pq2zm");
    			add_location(div0, file$u, 39, 12, 1350);
    			attr_dev(hr0, "class", "svelte-7pq2zm");
    			add_location(hr0, file$u, 49, 12, 1806);
    			attr_dev(div1, "class", "svelte-7pq2zm");
    			add_location(div1, file$u, 38, 8, 1332);
    			attr_dev(br0, "class", "svelte-7pq2zm");
    			add_location(br0, file$u, 53, 12, 1894);
    			attr_dev(summary, "class", "svelte-7pq2zm");
    			add_location(summary, file$u, 55, 16, 1961);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-7pq2zm");
    			add_location(hr1, file$u, 56, 16, 2005);
    			attr_dev(a0, "class", "anyanime-cn svelte-7pq2zm");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$u, 59, 24, 2138);
    			attr_dev(button0, "class", "channelbtn svelte-7pq2zm");
    			add_location(button0, file$u, 58, 20, 2086);
    			attr_dev(a1, "class", "image2url-cn svelte-7pq2zm");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$u, 62, 24, 2295);
    			attr_dev(button1, "class", "channelbtn svelte-7pq2zm");
    			add_location(button1, file$u, 61, 20, 2243);
    			attr_dev(a2, "class", "elina-cn svelte-7pq2zm");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$u, 65, 24, 2455);
    			attr_dev(button2, "class", "channelbtn svelte-7pq2zm");
    			add_location(button2, file$u, 64, 20, 2403);
    			attr_dev(a3, "class", "stream-savers-cn svelte-7pq2zm");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$u, 68, 24, 2607);
    			attr_dev(button3, "class", "channelbtn svelte-7pq2zm");
    			add_location(button3, file$u, 67, 20, 2555);
    			attr_dev(a4, "class", "pixit-cn svelte-7pq2zm");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$u, 71, 24, 2779);
    			attr_dev(button4, "class", "channelbtn svelte-7pq2zm");
    			add_location(button4, file$u, 70, 20, 2727);
    			attr_dev(a5, "class", "breeze-cn svelte-7pq2zm");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$u, 74, 24, 2927);
    			attr_dev(button5, "class", "channelbtn svelte-7pq2zm");
    			add_location(button5, file$u, 73, 20, 2875);
    			attr_dev(a6, "class", "minikey-cn svelte-7pq2zm");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$u, 77, 24, 3078);
    			attr_dev(button6, "class", "channelbtn svelte-7pq2zm");
    			add_location(button6, file$u, 76, 20, 3026);
    			attr_dev(a7, "class", "type3d-cn svelte-7pq2zm");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$u, 80, 24, 3232);
    			attr_dev(button7, "class", "channelbtn svelte-7pq2zm");
    			add_location(button7, file$u, 79, 20, 3180);
    			attr_dev(a8, "class", "timely-cn svelte-7pq2zm");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$u, 83, 24, 3383);
    			attr_dev(button8, "class", "channelbtn svelte-7pq2zm");
    			add_location(button8, file$u, 82, 20, 3331);
    			attr_dev(div2, "class", "channels-list svelte-7pq2zm");
    			add_location(div2, file$u, 57, 16, 2038);
    			attr_dev(details, "class", "projects svelte-7pq2zm");
    			details.open = true;
    			add_location(details, file$u, 54, 12, 1913);
    			attr_dev(br1, "class", "svelte-7pq2zm");
    			add_location(br1, file$u, 87, 12, 3520);
    			attr_dev(div3, "class", "categories svelte-7pq2zm");
    			add_location(div3, file$u, 51, 8, 1836);
    			attr_dev(div4, "class", "channels svelte-7pq2zm");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$u, 37, 4, 1213);
    			attr_dev(main1, "class", "svelte-7pq2zm");
    			add_location(main1, file$u, 34, 0, 1033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$9, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$9() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$9() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Streamsavers_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$9();
    			} else if (direction == "right") {
    				openNav$9();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Streamsavers_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$9,
    		openNav: openNav$9,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$9, handler, openNav$9];
    }

    class Streamsavers_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Streamsavers_cn",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get closeNav() {
    		return closeNav$9;
    	}

    	set closeNav(value) {
    		throw new Error("<Streamsavers_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$9;
    	}

    	set openNav(value) {
    		throw new Error("<Streamsavers_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/pixit-cn.svelte generated by Svelte v3.48.0 */
    const file$t = "src/components/channels/projects/pixit-cn.svelte";

    function create_fragment$t(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1gyrrzn");
    			add_location(script, file$t, 35, 4, 1044);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-1gyrrzn");
    			add_location(meta, file$t, 36, 4, 1138);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-1gyrrzn");
    			add_location(img, file$t, 40, 16, 1401);
    			attr_dev(h3, "class", "server-name-on-template svelte-1gyrrzn");
    			add_location(h3, file$t, 46, 16, 1650);
    			attr_dev(span, "class", "close-btn svelte-1gyrrzn");
    			add_location(span, file$t, 47, 16, 1714);
    			attr_dev(div0, "class", "server-template-icon svelte-1gyrrzn");
    			add_location(div0, file$t, 39, 12, 1350);
    			attr_dev(hr0, "class", "svelte-1gyrrzn");
    			add_location(hr0, file$t, 49, 12, 1806);
    			attr_dev(div1, "class", "svelte-1gyrrzn");
    			add_location(div1, file$t, 38, 8, 1332);
    			attr_dev(br0, "class", "svelte-1gyrrzn");
    			add_location(br0, file$t, 53, 12, 1894);
    			attr_dev(summary, "class", "svelte-1gyrrzn");
    			add_location(summary, file$t, 55, 16, 1961);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-1gyrrzn");
    			add_location(hr1, file$t, 56, 16, 2005);
    			attr_dev(a0, "class", "anyanime-cn svelte-1gyrrzn");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$t, 59, 24, 2138);
    			attr_dev(button0, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button0, file$t, 58, 20, 2086);
    			attr_dev(a1, "class", "image2url-cn svelte-1gyrrzn");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$t, 62, 24, 2295);
    			attr_dev(button1, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button1, file$t, 61, 20, 2243);
    			attr_dev(a2, "class", "elina-cn svelte-1gyrrzn");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$t, 65, 24, 2455);
    			attr_dev(button2, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button2, file$t, 64, 20, 2403);
    			attr_dev(a3, "class", "stream-savers-cn svelte-1gyrrzn");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$t, 68, 24, 2607);
    			attr_dev(button3, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button3, file$t, 67, 20, 2555);
    			attr_dev(a4, "class", "pixit-cn svelte-1gyrrzn");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$t, 71, 24, 2779);
    			attr_dev(button4, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button4, file$t, 70, 20, 2727);
    			attr_dev(a5, "class", "breeze-cn svelte-1gyrrzn");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$t, 74, 24, 2927);
    			attr_dev(button5, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button5, file$t, 73, 20, 2875);
    			attr_dev(a6, "class", "minikey-cn svelte-1gyrrzn");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$t, 77, 24, 3078);
    			attr_dev(button6, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button6, file$t, 76, 20, 3026);
    			attr_dev(a7, "class", "type3d-cn svelte-1gyrrzn");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$t, 80, 24, 3232);
    			attr_dev(button7, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button7, file$t, 79, 20, 3180);
    			attr_dev(a8, "class", "timely-cn svelte-1gyrrzn");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$t, 83, 24, 3383);
    			attr_dev(button8, "class", "channelbtn svelte-1gyrrzn");
    			add_location(button8, file$t, 82, 20, 3331);
    			attr_dev(div2, "class", "channels-list svelte-1gyrrzn");
    			add_location(div2, file$t, 57, 16, 2038);
    			attr_dev(details, "class", "projects svelte-1gyrrzn");
    			details.open = true;
    			add_location(details, file$t, 54, 12, 1913);
    			attr_dev(br1, "class", "svelte-1gyrrzn");
    			add_location(br1, file$t, 87, 12, 3520);
    			attr_dev(div3, "class", "categories svelte-1gyrrzn");
    			add_location(div3, file$t, 51, 8, 1836);
    			attr_dev(div4, "class", "channels svelte-1gyrrzn");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$t, 37, 4, 1213);
    			attr_dev(main1, "class", "svelte-1gyrrzn");
    			add_location(main1, file$t, 34, 0, 1033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$8, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$8() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$8() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pixit_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$8();
    			} else if (direction == "right") {
    				openNav$8();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pixit_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$8,
    		openNav: openNav$8,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$8, handler, openNav$8];
    }

    class Pixit_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pixit_cn",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get closeNav() {
    		return closeNav$8;
    	}

    	set closeNav(value) {
    		throw new Error("<Pixit_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$8;
    	}

    	set openNav(value) {
    		throw new Error("<Pixit_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/breeze-cn.svelte generated by Svelte v3.48.0 */
    const file$s = "src/components/channels/projects/breeze-cn.svelte";

    function create_fragment$s(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1li2uxw");
    			add_location(script, file$s, 35, 4, 1044);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-1li2uxw");
    			add_location(meta, file$s, 36, 4, 1138);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-1li2uxw");
    			add_location(img, file$s, 40, 16, 1401);
    			attr_dev(h3, "class", "server-name-on-template svelte-1li2uxw");
    			add_location(h3, file$s, 46, 16, 1650);
    			attr_dev(span, "class", "close-btn svelte-1li2uxw");
    			add_location(span, file$s, 47, 16, 1714);
    			attr_dev(div0, "class", "server-template-icon svelte-1li2uxw");
    			add_location(div0, file$s, 39, 12, 1350);
    			attr_dev(hr0, "class", "svelte-1li2uxw");
    			add_location(hr0, file$s, 49, 12, 1806);
    			attr_dev(div1, "class", "svelte-1li2uxw");
    			add_location(div1, file$s, 38, 8, 1332);
    			attr_dev(br0, "class", "svelte-1li2uxw");
    			add_location(br0, file$s, 53, 12, 1894);
    			attr_dev(summary, "class", "svelte-1li2uxw");
    			add_location(summary, file$s, 55, 16, 1961);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-1li2uxw");
    			add_location(hr1, file$s, 56, 16, 2005);
    			attr_dev(a0, "class", "anyanime-cn svelte-1li2uxw");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$s, 59, 24, 2138);
    			attr_dev(button0, "class", "channelbtn svelte-1li2uxw");
    			add_location(button0, file$s, 58, 20, 2086);
    			attr_dev(a1, "class", "image2url-cn svelte-1li2uxw");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$s, 62, 24, 2295);
    			attr_dev(button1, "class", "channelbtn svelte-1li2uxw");
    			add_location(button1, file$s, 61, 20, 2243);
    			attr_dev(a2, "class", "elina-cn svelte-1li2uxw");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$s, 65, 24, 2455);
    			attr_dev(button2, "class", "channelbtn svelte-1li2uxw");
    			add_location(button2, file$s, 64, 20, 2403);
    			attr_dev(a3, "class", "stream-savers-cn svelte-1li2uxw");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$s, 68, 24, 2607);
    			attr_dev(button3, "class", "channelbtn svelte-1li2uxw");
    			add_location(button3, file$s, 67, 20, 2555);
    			attr_dev(a4, "class", "pixit-cn svelte-1li2uxw");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$s, 71, 24, 2779);
    			attr_dev(button4, "class", "channelbtn svelte-1li2uxw");
    			add_location(button4, file$s, 70, 20, 2727);
    			attr_dev(a5, "class", "breeze-cn svelte-1li2uxw");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$s, 74, 24, 2927);
    			attr_dev(button5, "class", "channelbtn svelte-1li2uxw");
    			add_location(button5, file$s, 73, 20, 2875);
    			attr_dev(a6, "class", "minikey-cn svelte-1li2uxw");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$s, 77, 24, 3078);
    			attr_dev(button6, "class", "channelbtn svelte-1li2uxw");
    			add_location(button6, file$s, 76, 20, 3026);
    			attr_dev(a7, "class", "type3d-cn svelte-1li2uxw");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$s, 80, 24, 3232);
    			attr_dev(button7, "class", "channelbtn svelte-1li2uxw");
    			add_location(button7, file$s, 79, 20, 3180);
    			attr_dev(a8, "class", "timely-cn svelte-1li2uxw");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$s, 83, 24, 3383);
    			attr_dev(button8, "class", "channelbtn svelte-1li2uxw");
    			add_location(button8, file$s, 82, 20, 3331);
    			attr_dev(div2, "class", "channels-list svelte-1li2uxw");
    			add_location(div2, file$s, 57, 16, 2038);
    			attr_dev(details, "class", "projects svelte-1li2uxw");
    			details.open = true;
    			add_location(details, file$s, 54, 12, 1913);
    			attr_dev(br1, "class", "svelte-1li2uxw");
    			add_location(br1, file$s, 87, 12, 3520);
    			attr_dev(div3, "class", "categories svelte-1li2uxw");
    			add_location(div3, file$s, 51, 8, 1836);
    			attr_dev(div4, "class", "channels svelte-1li2uxw");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$s, 37, 4, 1213);
    			attr_dev(main1, "class", "svelte-1li2uxw");
    			add_location(main1, file$s, 34, 0, 1033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$7, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$7() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$7() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Breeze_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$7();
    			} else if (direction == "right") {
    				openNav$7();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Breeze_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$7,
    		openNav: openNav$7,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$7, handler, openNav$7];
    }

    class Breeze_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breeze_cn",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get closeNav() {
    		return closeNav$7;
    	}

    	set closeNav(value) {
    		throw new Error("<Breeze_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$7;
    	}

    	set openNav(value) {
    		throw new Error("<Breeze_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/minikey-cn.svelte generated by Svelte v3.48.0 */
    const file$r = "src/components/channels/projects/minikey-cn.svelte";

    function create_fragment$r(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-rzty1o");
    			add_location(script, file$r, 35, 4, 1044);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-rzty1o");
    			add_location(meta, file$r, 36, 4, 1138);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-rzty1o");
    			add_location(img, file$r, 40, 16, 1401);
    			attr_dev(h3, "class", "server-name-on-template svelte-rzty1o");
    			add_location(h3, file$r, 46, 16, 1650);
    			attr_dev(span, "class", "close-btn svelte-rzty1o");
    			add_location(span, file$r, 47, 16, 1714);
    			attr_dev(div0, "class", "server-template-icon svelte-rzty1o");
    			add_location(div0, file$r, 39, 12, 1350);
    			attr_dev(hr0, "class", "svelte-rzty1o");
    			add_location(hr0, file$r, 49, 12, 1806);
    			attr_dev(div1, "class", "svelte-rzty1o");
    			add_location(div1, file$r, 38, 8, 1332);
    			attr_dev(br0, "class", "svelte-rzty1o");
    			add_location(br0, file$r, 53, 12, 1894);
    			attr_dev(summary, "class", "svelte-rzty1o");
    			add_location(summary, file$r, 55, 16, 1961);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-rzty1o");
    			add_location(hr1, file$r, 56, 16, 2005);
    			attr_dev(a0, "class", "anyanime-cn svelte-rzty1o");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$r, 59, 24, 2138);
    			attr_dev(button0, "class", "channelbtn svelte-rzty1o");
    			add_location(button0, file$r, 58, 20, 2086);
    			attr_dev(a1, "class", "image2url-cn svelte-rzty1o");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$r, 62, 24, 2295);
    			attr_dev(button1, "class", "channelbtn svelte-rzty1o");
    			add_location(button1, file$r, 61, 20, 2243);
    			attr_dev(a2, "class", "elina-cn svelte-rzty1o");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$r, 65, 24, 2455);
    			attr_dev(button2, "class", "channelbtn svelte-rzty1o");
    			add_location(button2, file$r, 64, 20, 2403);
    			attr_dev(a3, "class", "stream-savers-cn svelte-rzty1o");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$r, 68, 24, 2607);
    			attr_dev(button3, "class", "channelbtn svelte-rzty1o");
    			add_location(button3, file$r, 67, 20, 2555);
    			attr_dev(a4, "class", "pixit-cn svelte-rzty1o");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$r, 71, 24, 2779);
    			attr_dev(button4, "class", "channelbtn svelte-rzty1o");
    			add_location(button4, file$r, 70, 20, 2727);
    			attr_dev(a5, "class", "breeze-cn svelte-rzty1o");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$r, 74, 24, 2927);
    			attr_dev(button5, "class", "channelbtn svelte-rzty1o");
    			add_location(button5, file$r, 73, 20, 2875);
    			attr_dev(a6, "class", "minikey-cn svelte-rzty1o");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$r, 77, 24, 3078);
    			attr_dev(button6, "class", "channelbtn svelte-rzty1o");
    			add_location(button6, file$r, 76, 20, 3026);
    			attr_dev(a7, "class", "type3d-cn svelte-rzty1o");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$r, 80, 24, 3232);
    			attr_dev(button7, "class", "channelbtn svelte-rzty1o");
    			add_location(button7, file$r, 79, 20, 3180);
    			attr_dev(a8, "class", "timely-cn svelte-rzty1o");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$r, 83, 24, 3383);
    			attr_dev(button8, "class", "channelbtn svelte-rzty1o");
    			add_location(button8, file$r, 82, 20, 3331);
    			attr_dev(div2, "class", "channels-list svelte-rzty1o");
    			add_location(div2, file$r, 57, 16, 2038);
    			attr_dev(details, "class", "projects svelte-rzty1o");
    			details.open = true;
    			add_location(details, file$r, 54, 12, 1913);
    			attr_dev(br1, "class", "svelte-rzty1o");
    			add_location(br1, file$r, 87, 12, 3520);
    			attr_dev(div3, "class", "categories svelte-rzty1o");
    			add_location(div3, file$r, 51, 8, 1836);
    			attr_dev(div4, "class", "channels svelte-rzty1o");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$r, 37, 4, 1213);
    			attr_dev(main1, "class", "svelte-rzty1o");
    			add_location(main1, file$r, 34, 0, 1033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$6, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$6() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$6() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Minikey_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$6();
    			} else if (direction == "right") {
    				openNav$6();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Minikey_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$6,
    		openNav: openNav$6,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$6, handler, openNav$6];
    }

    class Minikey_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Minikey_cn",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get closeNav() {
    		return closeNav$6;
    	}

    	set closeNav(value) {
    		throw new Error("<Minikey_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$6;
    	}

    	set openNav(value) {
    		throw new Error("<Minikey_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/type3d-cn.svelte generated by Svelte v3.48.0 */
    const file$q = "src/components/channels/projects/type3d-cn.svelte";

    function create_fragment$q(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1fbotz6");
    			add_location(script, file$q, 35, 4, 1044);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-1fbotz6");
    			add_location(meta, file$q, 36, 4, 1138);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-1fbotz6");
    			add_location(img, file$q, 40, 16, 1401);
    			attr_dev(h3, "class", "server-name-on-template svelte-1fbotz6");
    			add_location(h3, file$q, 46, 16, 1650);
    			attr_dev(span, "class", "close-btn svelte-1fbotz6");
    			add_location(span, file$q, 47, 16, 1714);
    			attr_dev(div0, "class", "server-template-icon svelte-1fbotz6");
    			add_location(div0, file$q, 39, 12, 1350);
    			attr_dev(hr0, "class", "svelte-1fbotz6");
    			add_location(hr0, file$q, 49, 12, 1806);
    			attr_dev(div1, "class", "svelte-1fbotz6");
    			add_location(div1, file$q, 38, 8, 1332);
    			attr_dev(br0, "class", "svelte-1fbotz6");
    			add_location(br0, file$q, 53, 12, 1894);
    			attr_dev(summary, "class", "svelte-1fbotz6");
    			add_location(summary, file$q, 55, 16, 1961);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-1fbotz6");
    			add_location(hr1, file$q, 56, 16, 2005);
    			attr_dev(a0, "class", "anyanime-cn svelte-1fbotz6");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$q, 59, 24, 2138);
    			attr_dev(button0, "class", "channelbtn svelte-1fbotz6");
    			add_location(button0, file$q, 58, 20, 2086);
    			attr_dev(a1, "class", "image2url-cn svelte-1fbotz6");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$q, 62, 24, 2295);
    			attr_dev(button1, "class", "channelbtn svelte-1fbotz6");
    			add_location(button1, file$q, 61, 20, 2243);
    			attr_dev(a2, "class", "elina-cn svelte-1fbotz6");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$q, 65, 24, 2455);
    			attr_dev(button2, "class", "channelbtn svelte-1fbotz6");
    			add_location(button2, file$q, 64, 20, 2403);
    			attr_dev(a3, "class", "stream-savers-cn svelte-1fbotz6");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$q, 68, 24, 2607);
    			attr_dev(button3, "class", "channelbtn svelte-1fbotz6");
    			add_location(button3, file$q, 67, 20, 2555);
    			attr_dev(a4, "class", "pixit-cn svelte-1fbotz6");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$q, 71, 24, 2779);
    			attr_dev(button4, "class", "channelbtn svelte-1fbotz6");
    			add_location(button4, file$q, 70, 20, 2727);
    			attr_dev(a5, "class", "breeze-cn svelte-1fbotz6");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$q, 74, 24, 2927);
    			attr_dev(button5, "class", "channelbtn svelte-1fbotz6");
    			add_location(button5, file$q, 73, 20, 2875);
    			attr_dev(a6, "class", "minikey-cn svelte-1fbotz6");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$q, 77, 24, 3078);
    			attr_dev(button6, "class", "channelbtn svelte-1fbotz6");
    			add_location(button6, file$q, 76, 20, 3026);
    			attr_dev(a7, "class", "type3d-cn svelte-1fbotz6");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$q, 80, 24, 3232);
    			attr_dev(button7, "class", "channelbtn svelte-1fbotz6");
    			add_location(button7, file$q, 79, 20, 3180);
    			attr_dev(a8, "class", "timely-cn svelte-1fbotz6");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$q, 83, 24, 3383);
    			attr_dev(button8, "class", "channelbtn svelte-1fbotz6");
    			add_location(button8, file$q, 82, 20, 3331);
    			attr_dev(div2, "class", "channels-list svelte-1fbotz6");
    			add_location(div2, file$q, 57, 16, 2038);
    			attr_dev(details, "class", "projects svelte-1fbotz6");
    			details.open = true;
    			add_location(details, file$q, 54, 12, 1913);
    			attr_dev(br1, "class", "svelte-1fbotz6");
    			add_location(br1, file$q, 87, 12, 3520);
    			attr_dev(div3, "class", "categories svelte-1fbotz6");
    			add_location(div3, file$q, 51, 8, 1836);
    			attr_dev(div4, "class", "channels svelte-1fbotz6");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$q, 37, 4, 1213);
    			attr_dev(main1, "class", "svelte-1fbotz6");
    			add_location(main1, file$q, 34, 0, 1033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$5, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$5() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$5() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Type3d_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$5();
    			} else if (direction == "right") {
    				openNav$5();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Type3d_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		Main,
    		closeNav: closeNav$5,
    		openNav: openNav$5,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$5, handler, openNav$5];
    }

    class Type3d_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Type3d_cn",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get closeNav() {
    		return closeNav$5;
    	}

    	set closeNav(value) {
    		throw new Error("<Type3d_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$5;
    	}

    	set openNav(value) {
    		throw new Error("<Type3d_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/projects/timely-cn.svelte generated by Svelte v3.48.0 */
    const file$p = "src/components/channels/projects/timely-cn.svelte";

    function create_fragment$p(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let details;
    	let summary;
    	let t11;
    	let hr1;
    	let t12;
    	let div2;
    	let button0;
    	let a0;
    	let t14;
    	let button1;
    	let a1;
    	let t16;
    	let button2;
    	let a2;
    	let t18;
    	let button3;
    	let a3;
    	let t20;
    	let button4;
    	let a4;
    	let t22;
    	let button5;
    	let a5;
    	let t24;
    	let button6;
    	let a6;
    	let t26;
    	let button7;
    	let a7;
    	let t28;
    	let button8;
    	let a8;
    	let t30;
    	let br1;
    	let t31;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Projects";
    			t11 = space();
    			hr1 = element("hr");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# AnyAnime";
    			t14 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# Image2url";
    			t16 = space();
    			button2 = element("button");
    			a2 = element("a");
    			a2.textContent = "# Elina-dev";
    			t18 = space();
    			button3 = element("button");
    			a3 = element("a");
    			a3.textContent = "# Stream-Savers";
    			t20 = space();
    			button4 = element("button");
    			a4 = element("a");
    			a4.textContent = "# Pixit";
    			t22 = space();
    			button5 = element("button");
    			a5 = element("a");
    			a5.textContent = "# Breeze";
    			t24 = space();
    			button6 = element("button");
    			a6 = element("a");
    			a6.textContent = "# Minikey";
    			t26 = space();
    			button7 = element("button");
    			a7 = element("a");
    			a7.textContent = "# Type3D";
    			t28 = space();
    			button8 = element("button");
    			a8 = element("a");
    			a8.textContent = "# Timely";
    			t30 = space();
    			br1 = element("br");
    			t31 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1dshyq3");
    			add_location(script, file$p, 35, 4, 1047);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-1dshyq3");
    			add_location(meta, file$p, 36, 4, 1141);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-1dshyq3");
    			add_location(img, file$p, 40, 16, 1404);
    			attr_dev(h3, "class", "server-name-on-template svelte-1dshyq3");
    			add_location(h3, file$p, 46, 16, 1653);
    			attr_dev(span, "class", "close-btn svelte-1dshyq3");
    			add_location(span, file$p, 47, 16, 1717);
    			attr_dev(div0, "class", "server-template-icon svelte-1dshyq3");
    			add_location(div0, file$p, 39, 12, 1353);
    			attr_dev(hr0, "class", "svelte-1dshyq3");
    			add_location(hr0, file$p, 49, 12, 1809);
    			attr_dev(div1, "class", "svelte-1dshyq3");
    			add_location(div1, file$p, 38, 8, 1335);
    			attr_dev(br0, "class", "svelte-1dshyq3");
    			add_location(br0, file$p, 53, 12, 1897);
    			attr_dev(summary, "class", "svelte-1dshyq3");
    			add_location(summary, file$p, 55, 16, 1964);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-1dshyq3");
    			add_location(hr1, file$p, 56, 16, 2008);
    			attr_dev(a0, "class", "anyanime-cn svelte-1dshyq3");
    			attr_dev(a0, "href", "/anyanime");
    			add_location(a0, file$p, 59, 24, 2141);
    			attr_dev(button0, "class", "channelbtn svelte-1dshyq3");
    			add_location(button0, file$p, 58, 20, 2089);
    			attr_dev(a1, "class", "image2url-cn svelte-1dshyq3");
    			attr_dev(a1, "href", "/image2url");
    			add_location(a1, file$p, 62, 24, 2298);
    			attr_dev(button1, "class", "channelbtn svelte-1dshyq3");
    			add_location(button1, file$p, 61, 20, 2246);
    			attr_dev(a2, "class", "elina-cn svelte-1dshyq3");
    			attr_dev(a2, "href", "/elina");
    			add_location(a2, file$p, 65, 24, 2458);
    			attr_dev(button2, "class", "channelbtn svelte-1dshyq3");
    			add_location(button2, file$p, 64, 20, 2406);
    			attr_dev(a3, "class", "stream-savers-cn svelte-1dshyq3");
    			attr_dev(a3, "href", "/stream-savers");
    			add_location(a3, file$p, 68, 24, 2610);
    			attr_dev(button3, "class", "channelbtn svelte-1dshyq3");
    			add_location(button3, file$p, 67, 20, 2558);
    			attr_dev(a4, "class", "pixit-cn svelte-1dshyq3");
    			attr_dev(a4, "href", "/pixit");
    			add_location(a4, file$p, 71, 24, 2782);
    			attr_dev(button4, "class", "channelbtn svelte-1dshyq3");
    			add_location(button4, file$p, 70, 20, 2730);
    			attr_dev(a5, "class", "breeze-cn svelte-1dshyq3");
    			attr_dev(a5, "href", "/breeze");
    			add_location(a5, file$p, 74, 24, 2930);
    			attr_dev(button5, "class", "channelbtn svelte-1dshyq3");
    			add_location(button5, file$p, 73, 20, 2878);
    			attr_dev(a6, "class", "minikey-cn svelte-1dshyq3");
    			attr_dev(a6, "href", "/minikey");
    			add_location(a6, file$p, 77, 24, 3081);
    			attr_dev(button6, "class", "channelbtn svelte-1dshyq3");
    			add_location(button6, file$p, 76, 20, 3029);
    			attr_dev(a7, "class", "type3d-cn svelte-1dshyq3");
    			attr_dev(a7, "href", "/type3d");
    			add_location(a7, file$p, 80, 24, 3235);
    			attr_dev(button7, "class", "channelbtn svelte-1dshyq3");
    			add_location(button7, file$p, 79, 20, 3183);
    			attr_dev(a8, "class", "timely-cn svelte-1dshyq3");
    			attr_dev(a8, "href", "/timely");
    			add_location(a8, file$p, 83, 24, 3386);
    			attr_dev(button8, "class", "channelbtn svelte-1dshyq3");
    			add_location(button8, file$p, 82, 20, 3334);
    			attr_dev(div2, "class", "channels-list svelte-1dshyq3");
    			add_location(div2, file$p, 57, 16, 2041);
    			attr_dev(details, "class", "projects svelte-1dshyq3");
    			details.open = true;
    			add_location(details, file$p, 54, 12, 1916);
    			attr_dev(br1, "class", "svelte-1dshyq3");
    			add_location(br1, file$p, 87, 12, 3523);
    			attr_dev(div3, "class", "categories svelte-1dshyq3");
    			add_location(div3, file$p, 51, 8, 1839);
    			attr_dev(div4, "class", "channels svelte-1dshyq3");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$p, 37, 4, 1216);
    			attr_dev(main1, "class", "svelte-1dshyq3");
    			add_location(main1, file$p, 34, 0, 1036);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t11);
    			append_dev(details, hr1);
    			append_dev(details, t12);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div2, t16);
    			append_dev(div2, button2);
    			append_dev(button2, a2);
    			append_dev(div2, t18);
    			append_dev(div2, button3);
    			append_dev(button3, a3);
    			append_dev(div2, t20);
    			append_dev(div2, button4);
    			append_dev(button4, a4);
    			append_dev(div2, t22);
    			append_dev(div2, button5);
    			append_dev(button5, a5);
    			append_dev(div2, t24);
    			append_dev(div2, button6);
    			append_dev(button6, a6);
    			append_dev(div2, t26);
    			append_dev(div2, button7);
    			append_dev(button7, a7);
    			append_dev(div2, t28);
    			append_dev(div2, button8);
    			append_dev(button8, a8);
    			append_dev(div3, t30);
    			append_dev(div3, br1);
    			append_dev(div3, t31);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$4, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$4() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$4() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Timely_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$4();
    			} else if (direction == "right") {
    				openNav$4();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Timely_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Links: Other,
    		Main,
    		closeNav: closeNav$4,
    		openNav: openNav$4,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$4, handler, openNav$4];
    }

    class Timely_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Timely_cn",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get closeNav() {
    		return closeNav$4;
    	}

    	set closeNav(value) {
    		throw new Error("<Timely_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$4;
    	}

    	set openNav(value) {
    		throw new Error("<Timely_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/-comp/user.svelte generated by Svelte v3.48.0 */

    const file$o = "src/components/-comp/user.svelte";

    function create_fragment$o(ctx) {
    	let main;
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*pfp*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			attr_dev(img, "width", serverWidth$e);
    			attr_dev(img, "class", "svelte-yqukbh");
    			add_location(img, file$o, 8, 8, 259);
    			attr_dev(div, "class", "chat-body-messages-item-avatar svelte-yqukbh");
    			add_location(div, file$o, 7, 4, 206);
    			add_location(main, file$o, 6, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pfp*/ 1 && !src_url_equal(img.src, img_src_value = /*pfp*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 2) {
    				attr_dev(img, "alt", /*alt*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$e = "50px";

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('User', slots, []);
    	let { pfp = "https://cdn.discordapp.com/attachments/977949070893125632/1010592002569682994/criz.jpg" } = $$props;
    	let { alt = "userpfp" } = $$props;
    	const writable_props = ['pfp', 'alt'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<User> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pfp' in $$props) $$invalidate(0, pfp = $$props.pfp);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    	};

    	$$self.$capture_state = () => ({ serverWidth: serverWidth$e, pfp, alt });

    	$$self.$inject_state = $$props => {
    		if ('pfp' in $$props) $$invalidate(0, pfp = $$props.pfp);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pfp, alt];
    }

    class User extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { pfp: 0, alt: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "User",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get pfp() {
    		throw new Error("<User>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pfp(value) {
    		throw new Error("<User>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<User>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<User>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/content/projects/anyanime.svelte generated by Svelte v3.48.0 */
    const file$n = "src/components/content/projects/anyanime.svelte";

    function create_fragment$n(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let br0;
    	let t10;
    	let br1;
    	let t11;
    	let br2;
    	let t12;
    	let br3;
    	let t13;
    	let br4;
    	let t14;
    	let br5;
    	let t15;
    	let br6;
    	let t16;
    	let br7;
    	let t17;
    	let a0;
    	let t19;
    	let a1;
    	let t21;
    	let br8;
    	let t22;
    	let br9;
    	let t23;
    	let br10;
    	let t24;
    	let a2;
    	let t26;
    	let a3;
    	let t28;
    	let br11;
    	let t29;
    	let br12;
    	let t30;
    	let a4;
    	let t32;
    	let br13;
    	let t33;
    	let br14;
    	let t34;
    	let a5;
    	let img0;
    	let img0_src_value;
    	let t35;
    	let br15;
    	let t36;
    	let a6;
    	let img1;
    	let img1_src_value;
    	let t37;
    	let div9;
    	let user1;
    	let t38;
    	let div8;
    	let div6;
    	let h32;
    	let t40;
    	let div7;
    	let p2;
    	let t41;
    	let br16;
    	let t42;
    	let br17;
    	let t43;
    	let img2;
    	let img2_src_value;
    	let t44;
    	let br18;
    	let t45;
    	let br19;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# AnyAnime";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Anyanime Npm & API";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("AnyAnime is a NPM package that helps you get random anime pfp / images on use . ");
    			br0 = element("br");
    			t10 = text("\n                                It can be used in a discord bot or on a website or anywhere else.  ");
    			br1 = element("br");
    			t11 = text("\n                                Currently AnyAnime pkg and api has a database of over 600 unique anime pfps. ");
    			br2 = element("br");
    			t12 = space();
    			br3 = element("br");
    			t13 = text("\n                                To add more flexibility to the package i later made a API similar to the NPM package ");
    			br4 = element("br");
    			t14 = text("\n                                I would appreciate contributions to the API or the Npm package ");
    			br5 = element("br");
    			t15 = space();
    			br6 = element("br");
    			t16 = text("\n                                Here's a link to the Npm package : ");
    			br7 = element("br");
    			t17 = space();
    			a0 = element("a");
    			a0.textContent = "NPM";
    			t19 = text(" |\n                                ");
    			a1 = element("a");
    			a1.textContent = "Github";
    			t21 = space();
    			br8 = element("br");
    			t22 = space();
    			br9 = element("br");
    			t23 = text("\n                                Here's a link to the API : ");
    			br10 = element("br");
    			t24 = space();
    			a2 = element("a");
    			a2.textContent = "API";
    			t26 = text(" |\n                                ");
    			a3 = element("a");
    			a3.textContent = "Github";
    			t28 = space();
    			br11 = element("br");
    			t29 = space();
    			br12 = element("br");
    			t30 = text("\n                                Website explaning the pkg + api :- ");
    			a4 = element("a");
    			a4.textContent = "AnyAnime Docs";
    			t32 = space();
    			br13 = element("br");
    			t33 = space();
    			br14 = element("br");
    			t34 = space();
    			a5 = element("a");
    			img0 = element("img");
    			t35 = space();
    			br15 = element("br");
    			t36 = space();
    			a6 = element("a");
    			img1 = element("img");
    			t37 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t38 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t40 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t41 = text("Basic functions of the package : ");
    			br16 = element("br");
    			t42 = space();
    			br17 = element("br");
    			t43 = space();
    			img2 = element("img");
    			t44 = space();
    			br18 = element("br");
    			t45 = text("\n                                Thanks for reading! If you have any questions or suggestions feel free to contact me on discord / instagram ");
    			br19 = element("br");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$n, 27, 12, 688);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$n, 28, 12, 741);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$n, 29, 12, 772);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$n, 26, 8, 654);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$n, 32, 8, 922);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$n, 39, 28, 1285);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$n, 38, 24, 1204);
    			add_location(br0, file$n, 43, 112, 1603);
    			add_location(br1, file$n, 44, 99, 1707);
    			add_location(br2, file$n, 45, 109, 1821);
    			add_location(br3, file$n, 46, 32, 1858);
    			add_location(br4, file$n, 47, 117, 1980);
    			add_location(br5, file$n, 48, 95, 2080);
    			add_location(br6, file$n, 48, 100, 2085);
    			add_location(br7, file$n, 49, 67, 2157);
    			attr_dev(a0, "href", "https://www.npmjs.com/package/anyanime");
    			attr_dev(a0, "class", "svelte-173fec4");
    			add_location(a0, file$n, 50, 32, 2194);
    			attr_dev(a1, "href", "https://github.com/crizmo/AnyAnime");
    			attr_dev(a1, "class", "svelte-173fec4");
    			add_location(a1, file$n, 51, 32, 2285);
    			add_location(br8, file$n, 52, 32, 2373);
    			add_location(br9, file$n, 52, 37, 2378);
    			add_location(br10, file$n, 53, 59, 2442);
    			attr_dev(a2, "href", "https://rapidapi.com/Kurizu/api/any-anime/");
    			attr_dev(a2, "class", "svelte-173fec4");
    			add_location(a2, file$n, 54, 32, 2479);
    			attr_dev(a3, "href", "https://github.com/crizmo/AnyAnime_api");
    			attr_dev(a3, "class", "svelte-173fec4");
    			add_location(a3, file$n, 55, 32, 2574);
    			add_location(br11, file$n, 56, 32, 2666);
    			add_location(br12, file$n, 56, 37, 2671);
    			attr_dev(a4, "href", "https://anyanime-npm.netlify.app/");
    			attr_dev(a4, "class", "svelte-173fec4");
    			add_location(a4, file$n, 57, 67, 2743);
    			add_location(br13, file$n, 58, 32, 2838);
    			add_location(br14, file$n, 58, 37, 2843);
    			attr_dev(img0, "alt", "npm");
    			if (!src_url_equal(img0.src, img0_src_value = "https://img.shields.io/npm/dt/anyanime")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$n, 60, 36, 2966);
    			attr_dev(a5, "href", "https://www.npmjs.com/package/anyanime");
    			attr_dev(a5, "class", "svelte-173fec4");
    			add_location(a5, file$n, 59, 32, 2880);
    			add_location(br15, file$n, 61, 37, 3064);
    			attr_dev(img1, "alt", "GitHub Repo");
    			if (!src_url_equal(img1.src, img1_src_value = "https://img.shields.io/github/stars/crizmo/AnyAnime?style=social")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$n, 63, 36, 3183);
    			attr_dev(a6, "href", "https://github.com/crizmo/AnyAnime");
    			attr_dev(a6, "class", "svelte-173fec4");
    			add_location(a6, file$n, 62, 32, 3101);
    			add_location(p1, file$n, 42, 28, 1487);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$n, 41, 24, 1408);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$n, 37, 20, 1134);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$n, 35, 16, 1047);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$n, 73, 28, 3683);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$n, 72, 24, 3602);
    			add_location(br16, file$n, 77, 65, 3954);
    			add_location(br17, file$n, 77, 70, 3959);
    			attr_dev(img2, "class", "msg-img");
    			if (!src_url_equal(img2.src, img2_src_value = "https://cdn.discordapp.com/attachments/970974362184343582/977082767978430544/Anyanime.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "homepgimg");
    			attr_dev(img2, "height", "300px");
    			attr_dev(img2, "width", "auto");
    			set_style(img2, "border-radius", "10px");
    			add_location(img2, file$n, 78, 32, 3996);
    			add_location(br18, file$n, 79, 32, 4219);
    			add_location(br19, file$n, 80, 140, 4364);
    			add_location(p2, file$n, 76, 28, 3885);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$n, 75, 24, 3806);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$n, 71, 20, 3532);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$n, 69, 16, 3445);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$n, 34, 12, 998);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$n, 33, 8, 962);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$n, 25, 4, 550);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$n, 24, 0, 539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, br0);
    			append_dev(p1, t10);
    			append_dev(p1, br1);
    			append_dev(p1, t11);
    			append_dev(p1, br2);
    			append_dev(p1, t12);
    			append_dev(p1, br3);
    			append_dev(p1, t13);
    			append_dev(p1, br4);
    			append_dev(p1, t14);
    			append_dev(p1, br5);
    			append_dev(p1, t15);
    			append_dev(p1, br6);
    			append_dev(p1, t16);
    			append_dev(p1, br7);
    			append_dev(p1, t17);
    			append_dev(p1, a0);
    			append_dev(p1, t19);
    			append_dev(p1, a1);
    			append_dev(p1, t21);
    			append_dev(p1, br8);
    			append_dev(p1, t22);
    			append_dev(p1, br9);
    			append_dev(p1, t23);
    			append_dev(p1, br10);
    			append_dev(p1, t24);
    			append_dev(p1, a2);
    			append_dev(p1, t26);
    			append_dev(p1, a3);
    			append_dev(p1, t28);
    			append_dev(p1, br11);
    			append_dev(p1, t29);
    			append_dev(p1, br12);
    			append_dev(p1, t30);
    			append_dev(p1, a4);
    			append_dev(p1, t32);
    			append_dev(p1, br13);
    			append_dev(p1, t33);
    			append_dev(p1, br14);
    			append_dev(p1, t34);
    			append_dev(p1, a5);
    			append_dev(a5, img0);
    			append_dev(p1, t35);
    			append_dev(p1, br15);
    			append_dev(p1, t36);
    			append_dev(p1, a6);
    			append_dev(a6, img1);
    			append_dev(div10, t37);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t38);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t40);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t41);
    			append_dev(p2, br16);
    			append_dev(p2, t42);
    			append_dev(p2, br17);
    			append_dev(p2, t43);
    			append_dev(p2, img2);
    			append_dev(p2, t44);
    			append_dev(p2, br18);
    			append_dev(p2, t45);
    			append_dev(p2, br19);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$d = "50px";

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Anyanime', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Anyanime> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$d,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Anyanime extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Anyanime",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/components/content/projects/image2url.svelte generated by Svelte v3.48.0 */
    const file$m = "src/components/content/projects/image2url.svelte";

    function create_fragment$m(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let a0;
    	let t11;
    	let br0;
    	let t12;
    	let br1;
    	let t13;
    	let br2;
    	let t14;
    	let br3;
    	let t15;
    	let br4;
    	let t16;
    	let br5;
    	let t17;
    	let br6;
    	let t18;
    	let a1;
    	let t20;
    	let a2;
    	let t22;
    	let br7;
    	let t23;
    	let br8;
    	let t24;
    	let a3;
    	let img0;
    	let img0_src_value;
    	let t25;
    	let br9;
    	let t26;
    	let a4;
    	let img1;
    	let img1_src_value;
    	let t27;
    	let div9;
    	let user1;
    	let t28;
    	let div8;
    	let div6;
    	let h32;
    	let t30;
    	let div7;
    	let p2;
    	let t31;
    	let br10;
    	let t32;
    	let br11;
    	let t33;
    	let img2;
    	let img2_src_value;
    	let t34;
    	let br12;
    	let t35;
    	let br13;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Image2url";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Image to url npm package";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("With the help of the ");
    			a0 = element("a");
    			a0.textContent = "image2url";
    			t11 = text(" npm package ");
    			br0 = element("br");
    			t12 = text("\n                                You can easily convert images to urls ");
    			br1 = element("br");
    			t13 = space();
    			br2 = element("br");
    			t14 = text("\n                                Post images to a discord channel and get the proxy url ");
    			br3 = element("br");
    			t15 = text(" \n                                I would appreciate contributions to the project ");
    			br4 = element("br");
    			t16 = space();
    			br5 = element("br");
    			t17 = text("\n\n                                Links : ");
    			br6 = element("br");
    			t18 = space();
    			a1 = element("a");
    			a1.textContent = "NPM";
    			t20 = text(" |\n                                ");
    			a2 = element("a");
    			a2.textContent = "Github";
    			t22 = space();
    			br7 = element("br");
    			t23 = space();
    			br8 = element("br");
    			t24 = space();
    			a3 = element("a");
    			img0 = element("img");
    			t25 = space();
    			br9 = element("br");
    			t26 = space();
    			a4 = element("a");
    			img1 = element("img");
    			t27 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t28 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t30 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t31 = text("Usage : ");
    			br10 = element("br");
    			t32 = space();
    			br11 = element("br");
    			t33 = space();
    			img2 = element("img");
    			t34 = space();
    			br12 = element("br");
    			t35 = text("\n                                Thanks for reading! If you have any questions or suggestions feel free to contact me on discord / instagram ");
    			br13 = element("br");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$m, 24, 12, 646);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$m, 25, 12, 700);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$m, 26, 12, 731);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$m, 23, 8, 612);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$m, 28, 8, 807);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$m, 35, 28, 1170);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$m, 34, 24, 1089);
    			attr_dev(a0, "href", "https://www.npmjs.com/package/image2url");
    			attr_dev(a0, "class", "svelte-173fec4");
    			add_location(a0, file$m, 39, 53, 1429);
    			add_location(br0, file$m, 39, 129, 1505);
    			add_location(br1, file$m, 40, 70, 1580);
    			add_location(br2, file$m, 41, 32, 1617);
    			add_location(br3, file$m, 42, 87, 1709);
    			add_location(br4, file$m, 43, 80, 1795);
    			add_location(br5, file$m, 44, 32, 1832);
    			add_location(br6, file$m, 46, 40, 1878);
    			attr_dev(a1, "href", "https://www.npmjs.com/package/image2url");
    			attr_dev(a1, "class", "svelte-173fec4");
    			add_location(a1, file$m, 47, 32, 1915);
    			attr_dev(a2, "href", "https://github.com/crizmo/image2url");
    			attr_dev(a2, "class", "svelte-173fec4");
    			add_location(a2, file$m, 48, 32, 2007);
    			add_location(br7, file$m, 49, 32, 2096);
    			add_location(br8, file$m, 49, 37, 2101);
    			attr_dev(img0, "alt", "npm");
    			if (!src_url_equal(img0.src, img0_src_value = "https://img.shields.io/npm/dt/image2url")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$m, 51, 36, 2225);
    			attr_dev(a3, "href", "https://www.npmjs.com/package/image2url");
    			attr_dev(a3, "class", "svelte-173fec4");
    			add_location(a3, file$m, 50, 32, 2138);
    			add_location(br9, file$m, 52, 37, 2324);
    			attr_dev(img1, "alt", "GitHub Repo");
    			if (!src_url_equal(img1.src, img1_src_value = "https://img.shields.io/github/stars/crizmo/image2url?style=social")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$m, 54, 36, 2444);
    			attr_dev(a4, "href", "https://github.com/crizmo/image2url");
    			attr_dev(a4, "class", "svelte-173fec4");
    			add_location(a4, file$m, 53, 32, 2361);
    			add_location(p1, file$m, 38, 28, 1372);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$m, 37, 24, 1293);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$m, 33, 20, 1019);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$m, 31, 16, 932);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$m, 64, 28, 2945);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$m, 63, 24, 2864);
    			add_location(br10, file$m, 68, 40, 3191);
    			add_location(br11, file$m, 68, 45, 3196);
    			attr_dev(img2, "class", "msg-img");
    			if (!src_url_equal(img2.src, img2_src_value = "https://cdn.discordapp.com/attachments/1057946322721849436/1058673207424585738/image.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "homepgimg");
    			attr_dev(img2, "height", "350px");
    			attr_dev(img2, "width", "auto");
    			set_style(img2, "border-radius", "10px");
    			add_location(img2, file$m, 69, 32, 3233);
    			add_location(br12, file$m, 70, 32, 3455);
    			add_location(br13, file$m, 71, 140, 3600);
    			add_location(p2, file$m, 67, 28, 3147);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$m, 66, 24, 3068);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$m, 62, 20, 2794);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$m, 60, 16, 2707);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$m, 30, 12, 883);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$m, 29, 8, 847);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$m, 22, 4, 508);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$m, 21, 0, 497);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, a0);
    			append_dev(p1, t11);
    			append_dev(p1, br0);
    			append_dev(p1, t12);
    			append_dev(p1, br1);
    			append_dev(p1, t13);
    			append_dev(p1, br2);
    			append_dev(p1, t14);
    			append_dev(p1, br3);
    			append_dev(p1, t15);
    			append_dev(p1, br4);
    			append_dev(p1, t16);
    			append_dev(p1, br5);
    			append_dev(p1, t17);
    			append_dev(p1, br6);
    			append_dev(p1, t18);
    			append_dev(p1, a1);
    			append_dev(p1, t20);
    			append_dev(p1, a2);
    			append_dev(p1, t22);
    			append_dev(p1, br7);
    			append_dev(p1, t23);
    			append_dev(p1, br8);
    			append_dev(p1, t24);
    			append_dev(p1, a3);
    			append_dev(a3, img0);
    			append_dev(p1, t25);
    			append_dev(p1, br9);
    			append_dev(p1, t26);
    			append_dev(p1, a4);
    			append_dev(a4, img1);
    			append_dev(div10, t27);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t28);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t30);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t31);
    			append_dev(p2, br10);
    			append_dev(p2, t32);
    			append_dev(p2, br11);
    			append_dev(p2, t33);
    			append_dev(p2, img2);
    			append_dev(p2, t34);
    			append_dev(p2, br12);
    			append_dev(p2, t35);
    			append_dev(p2, br13);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image2url', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image2url> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Image2url extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image2url",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/components/content/projects/elina-dev.svelte generated by Svelte v3.48.0 */
    const file$l = "src/components/content/projects/elina-dev.svelte";

    function create_fragment$l(ctx) {
    	let main;
    	let div16;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div15;
    	let div14;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let br0;
    	let t10;
    	let br1;
    	let t11;
    	let br2;
    	let t12;
    	let a0;
    	let t14;
    	let br3;
    	let t15;
    	let br4;
    	let t16;
    	let br5;
    	let t17;
    	let div9;
    	let user1;
    	let t18;
    	let div8;
    	let div6;
    	let h32;
    	let t20;
    	let div7;
    	let p2;
    	let t21;
    	let br6;
    	let t22;
    	let br7;
    	let t23;
    	let br8;
    	let t24;
    	let br9;
    	let t25;
    	let img0;
    	let img0_src_value;
    	let t26;
    	let div13;
    	let user2;
    	let t27;
    	let div12;
    	let div10;
    	let h33;
    	let t29;
    	let div11;
    	let p3;
    	let t30;
    	let br10;
    	let t31;
    	let br11;
    	let t32;
    	let a1;
    	let t34;
    	let br12;
    	let t35;
    	let a2;
    	let t37;
    	let br13;
    	let t38;
    	let a3;
    	let img1;
    	let img1_src_value;
    	let t39;
    	let br14;
    	let t40;
    	let br15;
    	let t41;
    	let br16;
    	let t42;
    	let br17;
    	let t43;
    	let br18;
    	let t44;
    	let img2;
    	let img2_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });

    	user1 = new User({
    			props: {
    				pfp: "https://cdn.discordapp.com/avatars/842397001954230303/557d99168d42b845750241d8d7cd0f5b.webp"
    			},
    			$$inline: true
    		});

    	user2 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div16 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Elina";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Yet another discord bot";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Elina is a multipurpose discord bot made using discord.js ! ");
    			br0 = element("br");
    			t10 = space();
    			br1 = element("br");
    			t11 = text("\n                                Elina offers a lot of features, mainly games , genshin stats , chatbot and many more commands. ");
    			br2 = element("br");
    			t12 = text("\n                                You can find more about it on ");
    			a0 = element("a");
    			a0.textContent = "Elina's website";
    			t14 = space();
    			br3 = element("br");
    			t15 = space();
    			br4 = element("br");
    			t16 = text("\n                                Oh here she is ...  ");
    			br5 = element("br");
    			t17 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t18 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Elina";
    			t20 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t21 = text("Hi i am Elina ! ");
    			br6 = element("br");
    			t22 = text("\n                                One more to the millions of multipurpose discord bots on discord. ");
    			br7 = element("br");
    			t23 = text("\n                                There's nothing too different that i do compared to all the major discord bots out there lol ");
    			br8 = element("br");
    			t24 = space();
    			br9 = element("br");
    			t25 = space();
    			img0 = element("img");
    			t26 = space();
    			div13 = element("div");
    			create_component(user2.$$.fragment);
    			t27 = space();
    			div12 = element("div");
    			div10 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Kurizu";
    			t29 = space();
    			div11 = element("div");
    			p3 = element("p");
    			t30 = text("Oh and elina is open source too ! ");
    			br10 = element("br");
    			t31 = text("\n                                You can find the source code from links below : ");
    			br11 = element("br");
    			t32 = space();
    			a1 = element("a");
    			a1.textContent = "Github";
    			t34 = space();
    			br12 = element("br");
    			t35 = space();
    			a2 = element("a");
    			a2.textContent = "Website";
    			t37 = space();
    			br13 = element("br");
    			t38 = space();
    			a3 = element("a");
    			img1 = element("img");
    			t39 = space();
    			br14 = element("br");
    			t40 = space();
    			br15 = element("br");
    			t41 = text("\n                                The website has all the commands and info you need to know about Elina. ");
    			br16 = element("br");
    			t42 = text("\n                                Enjoy ! ");
    			br17 = element("br");
    			t43 = space();
    			br18 = element("br");
    			t44 = space();
    			img2 = element("img");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$l, 27, 12, 684);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$l, 28, 12, 734);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$l, 29, 12, 765);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$l, 26, 8, 650);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$l, 32, 8, 920);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$l, 39, 28, 1283);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$l, 38, 24, 1202);
    			add_location(br0, file$l, 43, 92, 1581);
    			add_location(br1, file$l, 43, 97, 1586);
    			add_location(br2, file$l, 44, 127, 1718);
    			attr_dev(a0, "href", "https://elina-bot.netlify.app/commands.html");
    			attr_dev(a0, "class", "svelte-173fec4");
    			add_location(a0, file$l, 45, 62, 1785);
    			add_location(br3, file$l, 45, 136, 1859);
    			add_location(br4, file$l, 46, 32, 1896);
    			add_location(br5, file$l, 47, 52, 1953);
    			add_location(p1, file$l, 42, 28, 1485);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$l, 41, 24, 1406);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$l, 37, 20, 1132);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$l, 35, 16, 1045);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$l, 56, 28, 2424);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$l, 55, 24, 2343);
    			add_location(br6, file$l, 60, 48, 2677);
    			add_location(br7, file$l, 61, 98, 2780);
    			add_location(br8, file$l, 62, 125, 2910);
    			add_location(br9, file$l, 62, 130, 2915);
    			attr_dev(img0, "class", "msg-img");
    			if (!src_url_equal(img0.src, img0_src_value = "https://cdn.discordapp.com/attachments/939799133177384993/978893594125561916/commands.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "homepgimg");
    			attr_dev(img0, "height", "300px");
    			attr_dev(img0, "width", "auto");
    			set_style(img0, "border-radius", "8px");
    			add_location(img0, file$l, 63, 32, 2952);
    			add_location(p2, file$l, 59, 28, 2625);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$l, 58, 24, 2546);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$l, 54, 20, 2273);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$l, 52, 16, 2088);
    			attr_dev(h33, "class", "chat-body-messages-item-content-header-name");
    			add_location(h33, file$l, 72, 28, 3510);
    			attr_dev(div10, "class", "chat-body-messages-item-content-header");
    			add_location(div10, file$l, 71, 24, 3429);
    			add_location(br10, file$l, 76, 66, 3782);
    			add_location(br11, file$l, 77, 80, 3867);
    			attr_dev(a1, "href", "https://github.com/crizmo/Elina-dev");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-173fec4");
    			add_location(a1, file$l, 78, 32, 3904);
    			add_location(br12, file$l, 78, 105, 3977);
    			attr_dev(a2, "href", "https://elina-bot.netlify.app/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-173fec4");
    			add_location(a2, file$l, 79, 32, 4014);
    			add_location(br13, file$l, 79, 101, 4083);
    			attr_dev(img1, "alt", "GitHub Repo stars");
    			if (!src_url_equal(img1.src, img1_src_value = "https://img.shields.io/github/stars/crizmo/elina-dev?style=social")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$l, 81, 36, 4203);
    			attr_dev(a3, "href", "https://github.com/crizmo/Elina-dev");
    			attr_dev(a3, "class", "svelte-173fec4");
    			add_location(a3, file$l, 80, 32, 4120);
    			add_location(br14, file$l, 84, 32, 4375);
    			add_location(br15, file$l, 84, 37, 4380);
    			add_location(br16, file$l, 85, 104, 4489);
    			add_location(br17, file$l, 86, 40, 4534);
    			add_location(br18, file$l, 86, 45, 4539);
    			attr_dev(img2, "class", "msg-img");
    			if (!src_url_equal(img2.src, img2_src_value = "https://cdn.discordapp.com/attachments/912537423160942593/912537520150020156/elina_info.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "homepgimg");
    			attr_dev(img2, "height", "150px");
    			attr_dev(img2, "width", "auto");
    			set_style(img2, "border-radius", "8px");
    			add_location(img2, file$l, 87, 32, 4576);
    			add_location(p3, file$l, 75, 28, 3712);
    			attr_dev(div11, "class", "chat-body-messages-item-content-body");
    			add_location(div11, file$l, 74, 24, 3633);
    			attr_dev(div12, "class", "chat-body-messages-item-content");
    			add_location(div12, file$l, 70, 20, 3359);
    			attr_dev(div13, "class", "chat-body-messages-item");
    			add_location(div13, file$l, 68, 16, 3272);
    			attr_dev(div14, "class", "chat-body-messages");
    			add_location(div14, file$l, 34, 12, 996);
    			attr_dev(div15, "class", "chat-body");
    			add_location(div15, file$l, 33, 8, 960);
    			attr_dev(div16, "class", "mainarea");
    			add_location(div16, file$l, 25, 4, 546);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$l, 24, 0, 535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div16);
    			append_dev(div16, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div16, t4);
    			append_dev(div16, hr);
    			append_dev(div16, t5);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, br0);
    			append_dev(p1, t10);
    			append_dev(p1, br1);
    			append_dev(p1, t11);
    			append_dev(p1, br2);
    			append_dev(p1, t12);
    			append_dev(p1, a0);
    			append_dev(p1, t14);
    			append_dev(p1, br3);
    			append_dev(p1, t15);
    			append_dev(p1, br4);
    			append_dev(p1, t16);
    			append_dev(p1, br5);
    			append_dev(div14, t17);
    			append_dev(div14, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t18);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t20);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t21);
    			append_dev(p2, br6);
    			append_dev(p2, t22);
    			append_dev(p2, br7);
    			append_dev(p2, t23);
    			append_dev(p2, br8);
    			append_dev(p2, t24);
    			append_dev(p2, br9);
    			append_dev(p2, t25);
    			append_dev(p2, img0);
    			append_dev(div14, t26);
    			append_dev(div14, div13);
    			mount_component(user2, div13, null);
    			append_dev(div13, t27);
    			append_dev(div13, div12);
    			append_dev(div12, div10);
    			append_dev(div10, h33);
    			append_dev(div12, t29);
    			append_dev(div12, div11);
    			append_dev(div11, p3);
    			append_dev(p3, t30);
    			append_dev(p3, br10);
    			append_dev(p3, t31);
    			append_dev(p3, br11);
    			append_dev(p3, t32);
    			append_dev(p3, a1);
    			append_dev(p3, t34);
    			append_dev(p3, br12);
    			append_dev(p3, t35);
    			append_dev(p3, a2);
    			append_dev(p3, t37);
    			append_dev(p3, br13);
    			append_dev(p3, t38);
    			append_dev(p3, a3);
    			append_dev(a3, img1);
    			append_dev(p3, t39);
    			append_dev(p3, br14);
    			append_dev(p3, t40);
    			append_dev(p3, br15);
    			append_dev(p3, t41);
    			append_dev(p3, br16);
    			append_dev(p3, t42);
    			append_dev(p3, br17);
    			append_dev(p3, t43);
    			append_dev(p3, br18);
    			append_dev(p3, t44);
    			append_dev(p3, img2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div16, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div16, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			transition_in(user2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			transition_out(user2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			destroy_component(user2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$c = "50px";

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Elina_dev', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Elina_dev> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$c,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Elina_dev extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Elina_dev",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/components/content/projects/streamsavers.svelte generated by Svelte v3.48.0 */
    const file$k = "src/components/content/projects/streamsavers.svelte";

    function create_fragment$k(ctx) {
    	let main;
    	let div16;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div15;
    	let div14;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let br0;
    	let t10;
    	let a0;
    	let t12;
    	let br1;
    	let t13;
    	let br2;
    	let t14;
    	let br3;
    	let t15;
    	let div9;
    	let user1;
    	let t16;
    	let div8;
    	let div6;
    	let h32;
    	let t18;
    	let div7;
    	let p2;
    	let t19;
    	let br4;
    	let t20;
    	let t21;
    	let div13;
    	let user2;
    	let t22;
    	let div12;
    	let div10;
    	let h33;
    	let t24;
    	let div11;
    	let p3;
    	let t25;
    	let br5;
    	let t26;
    	let br6;
    	let t27;
    	let br7;
    	let t28;
    	let br8;
    	let t29;
    	let br9;
    	let t30;
    	let br10;
    	let br11;
    	let t31;
    	let br12;
    	let t32;
    	let a1;
    	let t34;
    	let br13;
    	let t35;
    	let a2;
    	let t37;
    	let br14;
    	let t38;
    	let br15;
    	let t39;
    	let br16;
    	let t40;
    	let img;
    	let img_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });

    	user1 = new User({
    			props: {
    				pfp: "https://cdn.discordapp.com/attachments/977949070893125632/1038727869221843024/coding.jpg"
    			},
    			$$inline: true
    		});

    	user2 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div16 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# StreamSavers";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Yt loop service";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Stream Savers is a free, open-source and easy-to-use service to loop stream 24/7 to YouTube ");
    			br0 = element("br");
    			t10 = text("\n                                Me and my friend ");
    			a0 = element("a");
    			a0.textContent = "coding398";
    			t12 = text(" made the service. ");
    			br1 = element("br");
    			t13 = space();
    			br2 = element("br");
    			t14 = text("\n\n                                Some words from coding398 : ");
    			br3 = element("br");
    			t15 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t16 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Coding398";
    			t18 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t19 = text("Ohbubble and other services can go to hell, charging people for things that you can do with a simple FFMPEG command. ");
    			br4 = element("br");
    			t20 = text("\n                                That's why I loved making stream savers and watching people use it.");
    			t21 = space();
    			div13 = element("div");
    			create_component(user2.$$.fragment);
    			t22 = space();
    			div12 = element("div");
    			div10 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Kurizu";
    			t24 = space();
    			div11 = element("div");
    			p3 = element("p");
    			t25 = text("Thanks coding ");
    			br5 = element("br");
    			t26 = text("\n\n                                Back to me ! ");
    			br6 = element("br");
    			t27 = text(" \n                                Working on streamsavers was and will be fun cause delivering free service makes us hapi !. ");
    			br7 = element("br");
    			t28 = space();
    			br8 = element("br");
    			t29 = text("\n                                Major thanks to replit for the help with the server setup and the hosting. ");
    			br9 = element("br");
    			t30 = text("\n                                I hope you will enjoy it ! ");
    			br10 = element("br");
    			br11 = element("br");
    			t31 = text("\n\n                                Stream Savers Links :- ");
    			br12 = element("br");
    			t32 = space();
    			a1 = element("a");
    			a1.textContent = "Website";
    			t34 = space();
    			br13 = element("br");
    			t35 = space();
    			a2 = element("a");
    			a2.textContent = "Github";
    			t37 = space();
    			br14 = element("br");
    			t38 = space();
    			br15 = element("br");
    			t39 = text("\n\n                                Stream Savers : ");
    			br16 = element("br");
    			t40 = space();
    			img = element("img");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$k, 27, 12, 684);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$k, 28, 12, 741);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$k, 29, 12, 772);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$k, 26, 8, 650);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$k, 32, 8, 919);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$k, 39, 28, 1282);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$k, 38, 24, 1201);
    			add_location(br0, file$k, 43, 124, 1612);
    			attr_dev(a0, "href", "https://coding398.dev/");
    			attr_dev(a0, "class", "svelte-173fec4");
    			add_location(a0, file$k, 44, 49, 1666);
    			add_location(br1, file$k, 44, 114, 1731);
    			add_location(br2, file$k, 44, 119, 1736);
    			add_location(br3, file$k, 46, 60, 1802);
    			add_location(p1, file$k, 42, 28, 1484);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$k, 41, 24, 1405);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$k, 37, 20, 1131);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$k, 35, 16, 1044);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$k, 55, 28, 2271);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$k, 54, 24, 2190);
    			add_location(br4, file$k, 59, 149, 2629);
    			add_location(p2, file$k, 58, 28, 2476);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$k, 57, 24, 2397);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$k, 53, 20, 2120);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$k, 51, 16, 1937);
    			attr_dev(h33, "class", "chat-body-messages-item-content-header-name");
    			add_location(h33, file$k, 69, 28, 3106);
    			attr_dev(div10, "class", "chat-body-messages-item-content-header");
    			add_location(div10, file$k, 68, 24, 3025);
    			add_location(br5, file$k, 73, 46, 3358);
    			add_location(br6, file$k, 75, 45, 3409);
    			add_location(br7, file$k, 76, 123, 3538);
    			add_location(br8, file$k, 76, 128, 3543);
    			add_location(br9, file$k, 77, 107, 3655);
    			add_location(br10, file$k, 78, 59, 3719);
    			add_location(br11, file$k, 78, 63, 3723);
    			add_location(br12, file$k, 80, 55, 3784);
    			attr_dev(a1, "href", "https://streamsavers.live/");
    			attr_dev(a1, "class", "svelte-173fec4");
    			add_location(a1, file$k, 81, 32, 3821);
    			add_location(br13, file$k, 81, 81, 3870);
    			attr_dev(a2, "href", "https://github.com/crizmo/Stream-Savers");
    			attr_dev(a2, "class", "svelte-173fec4");
    			add_location(a2, file$k, 82, 32, 3907);
    			add_location(br14, file$k, 82, 93, 3968);
    			add_location(br15, file$k, 82, 98, 3973);
    			add_location(br16, file$k, 84, 48, 4027);
    			attr_dev(img, "class", "msg-img");
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/970974581944885268/980031303967703040/stream-savers.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "homepgimg");
    			attr_dev(img, "height", "300px");
    			attr_dev(img, "width", "auto");
    			set_style(img, "border-radius", "10px");
    			add_location(img, file$k, 85, 32, 4064);
    			add_location(p3, file$k, 72, 28, 3308);
    			attr_dev(div11, "class", "chat-body-messages-item-content-body");
    			add_location(div11, file$k, 71, 24, 3229);
    			attr_dev(div12, "class", "chat-body-messages-item-content");
    			add_location(div12, file$k, 67, 20, 2955);
    			attr_dev(div13, "class", "chat-body-messages-item");
    			add_location(div13, file$k, 65, 16, 2864);
    			attr_dev(div14, "class", "chat-body-messages");
    			add_location(div14, file$k, 34, 12, 995);
    			attr_dev(div15, "class", "chat-body");
    			add_location(div15, file$k, 33, 8, 959);
    			attr_dev(div16, "class", "mainarea");
    			add_location(div16, file$k, 25, 4, 546);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$k, 24, 0, 535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div16);
    			append_dev(div16, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div16, t4);
    			append_dev(div16, hr);
    			append_dev(div16, t5);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, br0);
    			append_dev(p1, t10);
    			append_dev(p1, a0);
    			append_dev(p1, t12);
    			append_dev(p1, br1);
    			append_dev(p1, t13);
    			append_dev(p1, br2);
    			append_dev(p1, t14);
    			append_dev(p1, br3);
    			append_dev(div14, t15);
    			append_dev(div14, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t16);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t18);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t19);
    			append_dev(p2, br4);
    			append_dev(p2, t20);
    			append_dev(div14, t21);
    			append_dev(div14, div13);
    			mount_component(user2, div13, null);
    			append_dev(div13, t22);
    			append_dev(div13, div12);
    			append_dev(div12, div10);
    			append_dev(div10, h33);
    			append_dev(div12, t24);
    			append_dev(div12, div11);
    			append_dev(div11, p3);
    			append_dev(p3, t25);
    			append_dev(p3, br5);
    			append_dev(p3, t26);
    			append_dev(p3, br6);
    			append_dev(p3, t27);
    			append_dev(p3, br7);
    			append_dev(p3, t28);
    			append_dev(p3, br8);
    			append_dev(p3, t29);
    			append_dev(p3, br9);
    			append_dev(p3, t30);
    			append_dev(p3, br10);
    			append_dev(p3, br11);
    			append_dev(p3, t31);
    			append_dev(p3, br12);
    			append_dev(p3, t32);
    			append_dev(p3, a1);
    			append_dev(p3, t34);
    			append_dev(p3, br13);
    			append_dev(p3, t35);
    			append_dev(p3, a2);
    			append_dev(p3, t37);
    			append_dev(p3, br14);
    			append_dev(p3, t38);
    			append_dev(p3, br15);
    			append_dev(p3, t39);
    			append_dev(p3, br16);
    			append_dev(p3, t40);
    			append_dev(p3, img);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div16, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div16, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			transition_in(user2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			transition_out(user2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			destroy_component(user2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$b = "50px";

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Streamsavers', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Streamsavers> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$b,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Streamsavers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Streamsavers",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/components/content/projects/pixit.svelte generated by Svelte v3.48.0 */
    const file$j = "src/components/content/projects/pixit.svelte";

    function create_fragment$j(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let br0;
    	let t10;
    	let br1;
    	let t11;
    	let a0;
    	let t13;
    	let br2;
    	let br3;
    	let t14;
    	let img;
    	let img_src_value;
    	let t15;
    	let div9;
    	let user1;
    	let t16;
    	let div8;
    	let div6;
    	let h32;
    	let t18;
    	let div7;
    	let p2;
    	let t19;
    	let br4;
    	let t20;
    	let a1;
    	let t22;
    	let br5;
    	let t23;
    	let a2;
    	let t25;
    	let br6;
    	let t26;
    	let a3;
    	let t28;
    	let br7;
    	let t29;
    	let br8;
    	let t30;
    	let br9;
    	let t31;
    	let a4;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Pixit";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Pixel art website";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Pixit is a simple pixel art website made using ejs and nodejs. ");
    			br0 = element("br");
    			t10 = text("\n                                Made it as a side project cause i was bored ");
    			br1 = element("br");
    			t11 = text("\n                                Check it out if u want : ");
    			a0 = element("a");
    			a0.textContent = "https://pixit.kurizu.repl.co/";
    			t13 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t14 = space();
    			img = element("img");
    			t15 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t16 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t18 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t19 = text("Pixet project links : ");
    			br4 = element("br");
    			t20 = space();
    			a1 = element("a");
    			a1.textContent = "Github";
    			t22 = space();
    			br5 = element("br");
    			t23 = space();
    			a2 = element("a");
    			a2.textContent = "Replit";
    			t25 = space();
    			br6 = element("br");
    			t26 = space();
    			a3 = element("a");
    			a3.textContent = "Website";
    			t28 = space();
    			br7 = element("br");
    			t29 = space();
    			br8 = element("br");
    			t30 = space();
    			br9 = element("br");
    			t31 = text("\n                                If you want to see some of my other projects, check out my github page : ");
    			a4 = element("a");
    			a4.textContent = "Github";
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$j, 27, 12, 685);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$j, 28, 12, 735);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$j, 29, 12, 766);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$j, 26, 8, 651);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$j, 32, 8, 915);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$j, 39, 28, 1278);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$j, 38, 24, 1197);
    			add_location(br0, file$j, 43, 95, 1579);
    			add_location(br1, file$j, 44, 76, 1660);
    			attr_dev(a0, "href", "https://pixit.kurizu.repl.co/");
    			attr_dev(a0, "class", "svelte-1oi5bdk");
    			add_location(a0, file$j, 45, 57, 1722);
    			add_location(br2, file$j, 46, 32, 1828);
    			add_location(br3, file$j, 46, 36, 1832);
    			attr_dev(img, "class", "msg-img");
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/970974497941368873/977193997267271690/unknown.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "homepgimg");
    			attr_dev(img, "height", "300px");
    			attr_dev(img, "width", "auto");
    			set_style(img, "border-radius", "10px");
    			add_location(img, file$j, 47, 32, 1869);
    			add_location(p1, file$j, 42, 28, 1480);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$j, 41, 24, 1401);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$j, 37, 20, 1127);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$j, 35, 16, 1040);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$j, 56, 28, 2427);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$j, 55, 24, 2346);
    			add_location(br4, file$j, 60, 54, 2687);
    			attr_dev(a1, "href", "https://github.com/crizmo/Pixit");
    			attr_dev(a1, "class", "svelte-1oi5bdk");
    			add_location(a1, file$j, 61, 32, 2724);
    			add_location(br5, file$j, 61, 85, 2777);
    			attr_dev(a2, "href", "https://replit.com/@kurizu/pixit#index.js");
    			attr_dev(a2, "class", "svelte-1oi5bdk");
    			add_location(a2, file$j, 62, 32, 2814);
    			add_location(br6, file$j, 62, 95, 2877);
    			attr_dev(a3, "href", "https://pixit.kurizu.repl.co/");
    			attr_dev(a3, "class", "svelte-1oi5bdk");
    			add_location(a3, file$j, 63, 32, 2914);
    			add_location(br7, file$j, 63, 84, 2966);
    			add_location(br8, file$j, 64, 32, 3003);
    			add_location(br9, file$j, 64, 37, 3008);
    			attr_dev(a4, "href", "https://github.com/crizmo");
    			attr_dev(a4, "class", "svelte-1oi5bdk");
    			add_location(a4, file$j, 65, 105, 3118);
    			add_location(p2, file$j, 59, 28, 2629);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$j, 58, 24, 2550);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$j, 54, 20, 2276);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$j, 52, 16, 2189);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$j, 34, 12, 991);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$j, 33, 8, 955);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$j, 25, 4, 547);
    			attr_dev(main, "class", "svelte-1oi5bdk");
    			add_location(main, file$j, 24, 0, 536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, br0);
    			append_dev(p1, t10);
    			append_dev(p1, br1);
    			append_dev(p1, t11);
    			append_dev(p1, a0);
    			append_dev(p1, t13);
    			append_dev(p1, br2);
    			append_dev(p1, br3);
    			append_dev(p1, t14);
    			append_dev(p1, img);
    			append_dev(div10, t15);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t16);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t18);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t19);
    			append_dev(p2, br4);
    			append_dev(p2, t20);
    			append_dev(p2, a1);
    			append_dev(p2, t22);
    			append_dev(p2, br5);
    			append_dev(p2, t23);
    			append_dev(p2, a2);
    			append_dev(p2, t25);
    			append_dev(p2, br6);
    			append_dev(p2, t26);
    			append_dev(p2, a3);
    			append_dev(p2, t28);
    			append_dev(p2, br7);
    			append_dev(p2, t29);
    			append_dev(p2, br8);
    			append_dev(p2, t30);
    			append_dev(p2, br9);
    			append_dev(p2, t31);
    			append_dev(p2, a4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$a = "50px";

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pixit', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pixit> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$a,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Pixit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pixit",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/content/projects/breeze.svelte generated by Svelte v3.48.0 */
    const file$i = "src/components/content/projects/breeze.svelte";

    function create_fragment$i(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let br0;
    	let br1;
    	let t10;
    	let img0;
    	let img0_src_value;
    	let t11;
    	let br2;
    	let t12;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let br3;
    	let t14;
    	let br4;
    	let t15;
    	let br5;
    	let t16;
    	let div9;
    	let user1;
    	let t17;
    	let div8;
    	let div6;
    	let h32;
    	let t19;
    	let div7;
    	let p2;
    	let t20;
    	let span0;
    	let t22;
    	let span1;
    	let t24;
    	let br6;
    	let t25;
    	let br7;
    	let t26;
    	let br8;
    	let t27;
    	let br9;
    	let t28;
    	let br10;
    	let t29;
    	let br11;
    	let t30;
    	let br12;
    	let t31;
    	let a0;
    	let t33;
    	let br13;
    	let t34;
    	let a1;
    	let t36;
    	let br14;
    	let t37;
    	let a2;
    	let t39;
    	let br15;
    	let t40;
    	let br16;
    	let t41;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Breeze";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Breeze api + website";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Breeze helps you display your discord activity as a epik card which you can use anywhere you want.\n                                ");
    			br0 = element("br");
    			br1 = element("br");
    			t10 = space();
    			img0 = element("img");
    			t11 = space();
    			br2 = element("br");
    			t12 = space();
    			img1 = element("img");
    			t13 = space();
    			br3 = element("br");
    			t14 = text("\n                                Breeze also offers and api for you to use ");
    			br4 = element("br");
    			t15 = text("\n                                So you can use the cards in your github repo or anywhere you want.\n                                ");
    			br5 = element("br");
    			t16 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t17 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t19 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t20 = text("Breeze was made in roughly 2 weeks ");
    			span0 = element("span");
    			span0.textContent = "[";
    			t22 = text(" would have taken less time if i didn't have college lol ");
    			span1 = element("span");
    			span1.textContent = "]";
    			t24 = space();
    			br6 = element("br");
    			t25 = text("\n                                Backend of breeze is made using node.js and express while the frontend is made using react ");
    			br7 = element("br");
    			t26 = text("\n                                I used socket io for the realtime updates on the website ");
    			br8 = element("br");
    			t27 = space();
    			br9 = element("br");
    			t28 = text("\n                                I would appreciate any feedback on the website or the api ");
    			br10 = element("br");
    			t29 = text("\n                                Also feel free to contribute to the project if u got any better code / idea in mind ! ");
    			br11 = element("br");
    			t30 = space();
    			br12 = element("br");
    			t31 = text("\n\n                                GitHub: ");
    			a0 = element("a");
    			a0.textContent = "Breeze";
    			t33 = space();
    			br13 = element("br");
    			t34 = text("\n                                Website: ");
    			a1 = element("a");
    			a1.textContent = "Breeze";
    			t36 = space();
    			br14 = element("br");
    			t37 = text("\n                                API: ");
    			a2 = element("a");
    			a2.textContent = "Breeze API";
    			t39 = space();
    			br15 = element("br");
    			t40 = space();
    			br16 = element("br");
    			t41 = text("\n                                Thanks for reading !");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$i, 27, 12, 685);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$i, 28, 12, 736);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$i, 29, 12, 767);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$i, 26, 8, 651);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$i, 32, 8, 919);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$i, 39, 28, 1282);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$i, 38, 24, 1201);
    			add_location(br0, file$i, 44, 32, 1651);
    			add_location(br1, file$i, 44, 36, 1655);
    			attr_dev(img0, "class", "msg-img");
    			if (!src_url_equal(img0.src, img0_src_value = "https://cdn.discordapp.com/attachments/988140784807202886/992759894627340298/breeze-stats.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "homepgimg");
    			attr_dev(img0, "height", "300px");
    			attr_dev(img0, "width", "auto");
    			set_style(img0, "border-radius", "10px");
    			add_location(img0, file$i, 45, 32, 1692);
    			add_location(br2, file$i, 45, 227, 1887);
    			attr_dev(img1, "class", "msg-img");
    			if (!src_url_equal(img1.src, img1_src_value = "https://breeze-api.kurizu.repl.co/api/card/784141856426033233?about=Exploring&banner=https://staticg.sportskeeda.com/editor/2022/10/72d24-16655552144135-1920.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "api");
    			add_location(img1, file$i, 46, 32, 1924);
    			add_location(br3, file$i, 47, 32, 2157);
    			add_location(br4, file$i, 48, 74, 2236);
    			add_location(br5, file$i, 50, 32, 2372);
    			add_location(p1, file$i, 42, 28, 1484);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$i, 41, 24, 1405);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$i, 37, 20, 1131);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$i, 35, 16, 1044);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$i, 59, 28, 2745);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$i, 58, 24, 2664);
    			set_style(span0, "color", "yellow");
    			add_location(span0, file$i, 63, 67, 3018);
    			set_style(span1, "color", "yellow");
    			add_location(span1, file$i, 63, 159, 3110);
    			add_location(br6, file$i, 63, 195, 3146);
    			add_location(br7, file$i, 64, 123, 3274);
    			add_location(br8, file$i, 65, 89, 3368);
    			add_location(br9, file$i, 65, 94, 3373);
    			add_location(br10, file$i, 66, 90, 3468);
    			add_location(br11, file$i, 67, 118, 3591);
    			add_location(br12, file$i, 67, 123, 3596);
    			attr_dev(a0, "href", "https://github.com/crizmo/breeze");
    			attr_dev(a0, "alt", "breeze github");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-173fec4");
    			add_location(a0, file$i, 69, 40, 3642);
    			add_location(br13, file$i, 69, 130, 3732);
    			attr_dev(a1, "href", "https://breeze-stats.netlify.app");
    			attr_dev(a1, "alt", "breeze website");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-173fec4");
    			add_location(a1, file$i, 70, 41, 3778);
    			add_location(br14, file$i, 70, 132, 3869);
    			attr_dev(a2, "href", "https://breeze-api.kurizu.repl.co/");
    			attr_dev(a2, "alt", "breeze api");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-173fec4");
    			add_location(a2, file$i, 71, 37, 3911);
    			add_location(br15, file$i, 71, 130, 4004);
    			add_location(br16, file$i, 72, 32, 4041);
    			add_location(p2, file$i, 62, 28, 2947);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$i, 61, 24, 2868);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$i, 57, 20, 2594);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$i, 55, 16, 2507);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$i, 34, 12, 995);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$i, 33, 8, 959);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$i, 25, 4, 547);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$i, 24, 0, 536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, br0);
    			append_dev(p1, br1);
    			append_dev(p1, t10);
    			append_dev(p1, img0);
    			append_dev(p1, t11);
    			append_dev(p1, br2);
    			append_dev(p1, t12);
    			append_dev(p1, img1);
    			append_dev(p1, t13);
    			append_dev(p1, br3);
    			append_dev(p1, t14);
    			append_dev(p1, br4);
    			append_dev(p1, t15);
    			append_dev(p1, br5);
    			append_dev(div10, t16);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t17);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t20);
    			append_dev(p2, span0);
    			append_dev(p2, t22);
    			append_dev(p2, span1);
    			append_dev(p2, t24);
    			append_dev(p2, br6);
    			append_dev(p2, t25);
    			append_dev(p2, br7);
    			append_dev(p2, t26);
    			append_dev(p2, br8);
    			append_dev(p2, t27);
    			append_dev(p2, br9);
    			append_dev(p2, t28);
    			append_dev(p2, br10);
    			append_dev(p2, t29);
    			append_dev(p2, br11);
    			append_dev(p2, t30);
    			append_dev(p2, br12);
    			append_dev(p2, t31);
    			append_dev(p2, a0);
    			append_dev(p2, t33);
    			append_dev(p2, br13);
    			append_dev(p2, t34);
    			append_dev(p2, a1);
    			append_dev(p2, t36);
    			append_dev(p2, br14);
    			append_dev(p2, t37);
    			append_dev(p2, a2);
    			append_dev(p2, t39);
    			append_dev(p2, br15);
    			append_dev(p2, t40);
    			append_dev(p2, br16);
    			append_dev(p2, t41);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$9 = "50px";

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Breeze', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Breeze> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$9,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Breeze extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breeze",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/components/content/projects/minikey.svelte generated by Svelte v3.48.0 */
    const file$h = "src/components/content/projects/minikey.svelte";

    function create_fragment$h(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let a0;
    	let t11;
    	let br0;
    	let br1;
    	let t12;
    	let img;
    	let img_src_value;
    	let t13;
    	let br2;
    	let t14;
    	let br3;
    	let t15;
    	let br4;
    	let t16;
    	let br5;
    	let t17;
    	let a1;
    	let t19;
    	let br6;
    	let t20;
    	let div9;
    	let user1;
    	let t21;
    	let div8;
    	let div6;
    	let h32;
    	let t23;
    	let div7;
    	let p2;
    	let t24;
    	let br7;
    	let t25;
    	let a2;
    	let t27;
    	let br8;
    	let t28;
    	let a3;
    	let t30;
    	let br9;
    	let t31;
    	let a4;
    	let t33;
    	let br10;
    	let t34;
    	let br11;
    	let t35;
    	let br12;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Minikey";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Compact Keryboard Design";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Minikey is a Compact Keyboard design with live user input made using svelte.\n                                Check it out if u want : ");
    			a0 = element("a");
    			a0.textContent = "https://mini-key.kurizu.repl.co/";
    			t11 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t12 = space();
    			img = element("img");
    			t13 = space();
    			br2 = element("br");
    			t14 = space();
    			br3 = element("br");
    			t15 = text("\n                                This is the base design of Minikey. ");
    			br4 = element("br");
    			t16 = text("\n                                I plan on adding a 3d key look to the keyboard in the near future as well as a rgb effect ");
    			br5 = element("br");
    			t17 = text("\n                                If you want to help me do it feel free to join me on the ");
    			a1 = element("a");
    			a1.textContent = "repo";
    			t19 = space();
    			br6 = element("br");
    			t20 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t21 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t23 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t24 = text("Minikey project links : ");
    			br7 = element("br");
    			t25 = space();
    			a2 = element("a");
    			a2.textContent = "Github";
    			t27 = space();
    			br8 = element("br");
    			t28 = space();
    			a3 = element("a");
    			a3.textContent = "Replit";
    			t30 = space();
    			br9 = element("br");
    			t31 = space();
    			a4 = element("a");
    			a4.textContent = "Website";
    			t33 = space();
    			br10 = element("br");
    			t34 = space();
    			br11 = element("br");
    			t35 = text("\n                                Thank you for checking out Minikey! ");
    			br12 = element("br");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$h, 27, 12, 685);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$h, 28, 12, 737);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$h, 29, 12, 768);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$h, 26, 8, 651);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$h, 32, 8, 924);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$h, 39, 28, 1287);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$h, 38, 24, 1206);
    			attr_dev(a0, "href", "https://mini-key.kurizu.repl.co/");
    			attr_dev(a0, "class", "svelte-173fec4");
    			add_location(a0, file$h, 44, 57, 1659);
    			add_location(br0, file$h, 45, 32, 1771);
    			add_location(br1, file$h, 45, 36, 1775);
    			attr_dev(img, "class", "msg-img");
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/1003176063666491452/1003238076950249523/minikey.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "homepgimg");
    			attr_dev(img, "height", "300px");
    			attr_dev(img, "width", "auto");
    			set_style(img, "border-radius", "10px");
    			add_location(img, file$h, 46, 32, 1812);
    			add_location(br2, file$h, 46, 224, 2004);
    			add_location(br3, file$h, 47, 32, 2041);
    			add_location(br4, file$h, 48, 68, 2114);
    			add_location(br5, file$h, 49, 122, 2241);
    			attr_dev(a1, "href", "https://github.com/crizmo/Mini-Key");
    			attr_dev(a1, "class", "svelte-173fec4");
    			add_location(a1, file$h, 50, 89, 2335);
    			add_location(br6, file$h, 50, 143, 2389);
    			add_location(p1, file$h, 42, 28, 1489);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$h, 41, 24, 1410);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$h, 37, 20, 1136);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$h, 35, 16, 1049);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$h, 59, 28, 2762);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$h, 58, 24, 2681);
    			add_location(br7, file$h, 63, 56, 3024);
    			attr_dev(a2, "href", "https://github.com/crizmo/Mini-Key");
    			attr_dev(a2, "class", "svelte-173fec4");
    			add_location(a2, file$h, 64, 32, 3061);
    			add_location(br8, file$h, 64, 88, 3117);
    			attr_dev(a3, "href", "https://replit.com/@kurizu/Mini-Key?v=1");
    			attr_dev(a3, "class", "svelte-173fec4");
    			add_location(a3, file$h, 65, 32, 3154);
    			add_location(br9, file$h, 65, 93, 3215);
    			attr_dev(a4, "href", "https://mini-key.kurizu.repl.co/");
    			attr_dev(a4, "class", "svelte-173fec4");
    			add_location(a4, file$h, 66, 32, 3252);
    			add_location(br10, file$h, 66, 87, 3307);
    			add_location(br11, file$h, 67, 32, 3344);
    			add_location(br12, file$h, 68, 68, 3417);
    			add_location(p2, file$h, 62, 28, 2964);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$h, 61, 24, 2885);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$h, 57, 20, 2611);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$h, 55, 16, 2524);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$h, 34, 12, 1000);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$h, 33, 8, 964);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$h, 25, 4, 547);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$h, 24, 0, 536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, a0);
    			append_dev(p1, t11);
    			append_dev(p1, br0);
    			append_dev(p1, br1);
    			append_dev(p1, t12);
    			append_dev(p1, img);
    			append_dev(p1, t13);
    			append_dev(p1, br2);
    			append_dev(p1, t14);
    			append_dev(p1, br3);
    			append_dev(p1, t15);
    			append_dev(p1, br4);
    			append_dev(p1, t16);
    			append_dev(p1, br5);
    			append_dev(p1, t17);
    			append_dev(p1, a1);
    			append_dev(p1, t19);
    			append_dev(p1, br6);
    			append_dev(div10, t20);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t21);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t23);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t24);
    			append_dev(p2, br7);
    			append_dev(p2, t25);
    			append_dev(p2, a2);
    			append_dev(p2, t27);
    			append_dev(p2, br8);
    			append_dev(p2, t28);
    			append_dev(p2, a3);
    			append_dev(p2, t30);
    			append_dev(p2, br9);
    			append_dev(p2, t31);
    			append_dev(p2, a4);
    			append_dev(p2, t33);
    			append_dev(p2, br10);
    			append_dev(p2, t34);
    			append_dev(p2, br11);
    			append_dev(p2, t35);
    			append_dev(p2, br12);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$8 = "50px";

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Minikey', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Minikey> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$8,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Minikey extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Minikey",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/components/content/projects/type3d.svelte generated by Svelte v3.48.0 */
    const file$g = "src/components/content/projects/type3d.svelte";

    function create_fragment$g(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let a0;
    	let t11;
    	let br0;
    	let t12;
    	let br1;
    	let t13;
    	let br2;
    	let t14;
    	let img;
    	let img_src_value;
    	let t15;
    	let br3;
    	let t16;
    	let br4;
    	let t17;
    	let a1;
    	let t19;
    	let br5;
    	let t20;
    	let br6;
    	let t21;
    	let br7;
    	let t22;
    	let br8;
    	let t23;
    	let div9;
    	let user1;
    	let t24;
    	let div8;
    	let div6;
    	let h32;
    	let t26;
    	let div7;
    	let p2;
    	let t27;
    	let br9;
    	let t28;
    	let a2;
    	let t30;
    	let br10;
    	let t31;
    	let a3;
    	let t33;
    	let br11;
    	let t34;
    	let a4;
    	let t36;
    	let br12;
    	let t37;
    	let br13;
    	let t38;
    	let br14;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Type3D";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "3D Live input Keyboard";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Type3D is project where i used the 60% keyboard design made by schwiiiii - link to his code -> ");
    			a0 = element("a");
    			a0.textContent = "https://codepen.io/schwiiiii/pen/BarVMxq";
    			t11 = space();
    			br0 = element("br");
    			t12 = text("\n                                I then added live keyboard input and movements to the keys and the overall keyboard");
    			br1 = element("br");
    			t13 = space();
    			br2 = element("br");
    			t14 = space();
    			img = element("img");
    			t15 = space();
    			br3 = element("br");
    			t16 = space();
    			br4 = element("br");
    			t17 = text("\n                                You can find the code here -> ");
    			a1 = element("a");
    			a1.textContent = "https://github.com/crizmo/Type-3d";
    			t19 = space();
    			br5 = element("br");
    			t20 = text("\n                                Feel free to use the code for your own projects ");
    			br6 = element("br");
    			t21 = space();
    			br7 = element("br");
    			t22 = text("\n                                If you want to contribute to the project, feel free to make a pull request ");
    			br8 = element("br");
    			t23 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t24 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t26 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t27 = text("Type3D project links : ");
    			br9 = element("br");
    			t28 = space();
    			a2 = element("a");
    			a2.textContent = "Github";
    			t30 = space();
    			br10 = element("br");
    			t31 = space();
    			a3 = element("a");
    			a3.textContent = "Website";
    			t33 = space();
    			br11 = element("br");
    			t34 = space();
    			a4 = element("a");
    			a4.textContent = "Replit";
    			t36 = space();
    			br12 = element("br");
    			t37 = space();
    			br13 = element("br");
    			t38 = text("\n                                Thank you for checking out ! ");
    			br14 = element("br");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$g, 27, 12, 685);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$g, 28, 12, 736);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$g, 29, 12, 767);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$g, 26, 8, 651);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$g, 32, 8, 921);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$g, 39, 28, 1284);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$g, 38, 24, 1203);
    			attr_dev(a0, "href", "https://codepen.io/schwiiiii/pen/BarVMxq");
    			attr_dev(a0, "class", "svelte-173fec4");
    			add_location(a0, file$g, 43, 127, 1617);
    			add_location(br0, file$g, 43, 223, 1713);
    			add_location(br1, file$g, 44, 115, 1833);
    			add_location(br2, file$g, 45, 32, 1870);
    			attr_dev(img, "class", "msg-img");
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/1014118117493985350/1014118195679993937/type-3d.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "homepgimg");
    			attr_dev(img, "height", "300px");
    			attr_dev(img, "width", "auto");
    			set_style(img, "border-radius", "10px");
    			add_location(img, file$g, 46, 32, 1907);
    			add_location(br3, file$g, 46, 224, 2099);
    			add_location(br4, file$g, 47, 32, 2136);
    			attr_dev(a1, "href", "https://github.com/crizmo/Type-3d");
    			attr_dev(a1, "class", "svelte-173fec4");
    			add_location(a1, file$g, 48, 62, 2203);
    			add_location(br5, file$g, 48, 144, 2285);
    			add_location(br6, file$g, 49, 80, 2370);
    			add_location(br7, file$g, 50, 32, 2407);
    			add_location(br8, file$g, 51, 107, 2519);
    			add_location(p1, file$g, 42, 28, 1486);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$g, 41, 24, 1407);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$g, 37, 20, 1133);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$g, 35, 16, 1046);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$g, 60, 28, 2892);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$g, 59, 24, 2811);
    			add_location(br9, file$g, 64, 55, 3153);
    			attr_dev(a2, "href", "https://github.com/crizmo/Type-3d");
    			attr_dev(a2, "class", "svelte-173fec4");
    			add_location(a2, file$g, 65, 32, 3190);
    			add_location(br10, file$g, 65, 87, 3245);
    			attr_dev(a3, "href", "https://crizmo.github.io/Type-3d/key.html");
    			attr_dev(a3, "class", "svelte-173fec4");
    			add_location(a3, file$g, 66, 32, 3282);
    			add_location(br11, file$g, 66, 96, 3346);
    			attr_dev(a4, "href", "https://type-3d.kurizu.repl.co/");
    			attr_dev(a4, "class", "svelte-173fec4");
    			add_location(a4, file$g, 67, 32, 3383);
    			add_location(br12, file$g, 67, 85, 3436);
    			add_location(br13, file$g, 68, 32, 3473);
    			add_location(br14, file$g, 69, 61, 3539);
    			add_location(p2, file$g, 63, 28, 3094);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$g, 62, 24, 3015);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$g, 58, 20, 2741);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$g, 56, 16, 2654);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$g, 34, 12, 997);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$g, 33, 8, 961);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$g, 25, 4, 547);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$g, 24, 0, 536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, a0);
    			append_dev(p1, t11);
    			append_dev(p1, br0);
    			append_dev(p1, t12);
    			append_dev(p1, br1);
    			append_dev(p1, t13);
    			append_dev(p1, br2);
    			append_dev(p1, t14);
    			append_dev(p1, img);
    			append_dev(p1, t15);
    			append_dev(p1, br3);
    			append_dev(p1, t16);
    			append_dev(p1, br4);
    			append_dev(p1, t17);
    			append_dev(p1, a1);
    			append_dev(p1, t19);
    			append_dev(p1, br5);
    			append_dev(p1, t20);
    			append_dev(p1, br6);
    			append_dev(p1, t21);
    			append_dev(p1, br7);
    			append_dev(p1, t22);
    			append_dev(p1, br8);
    			append_dev(div10, t23);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t24);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t26);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t27);
    			append_dev(p2, br9);
    			append_dev(p2, t28);
    			append_dev(p2, a2);
    			append_dev(p2, t30);
    			append_dev(p2, br10);
    			append_dev(p2, t31);
    			append_dev(p2, a3);
    			append_dev(p2, t33);
    			append_dev(p2, br11);
    			append_dev(p2, t34);
    			append_dev(p2, a4);
    			append_dev(p2, t36);
    			append_dev(p2, br12);
    			append_dev(p2, t37);
    			append_dev(p2, br13);
    			append_dev(p2, t38);
    			append_dev(p2, br14);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$7 = "50px";

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Type3d', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Type3d> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$7,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Type3d extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Type3d",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/content/projects/timely.svelte generated by Svelte v3.48.0 */
    const file$f = "src/components/content/projects/timely.svelte";

    function create_fragment$f(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let h32;
    	let t10;
    	let p1;
    	let t11;
    	let br0;
    	let t12;
    	let t13;
    	let img;
    	let img_src_value;
    	let t14;
    	let h4;
    	let t16;
    	let p2;
    	let t17;
    	let br1;
    	let t18;
    	let t19;
    	let div9;
    	let user1;
    	let t20;
    	let div8;
    	let div6;
    	let h33;
    	let t22;
    	let div7;
    	let p3;
    	let t23;
    	let br2;
    	let t24;
    	let a0;
    	let t26;
    	let br3;
    	let t27;
    	let a1;
    	let t29;
    	let br4;
    	let t30;
    	let br5;
    	let t31;
    	let br6;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Timely";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Timer + Todo";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Timely-Note";
    			t10 = space();
    			p1 = element("p");
    			t11 = text("Check how much time is left for your precious day to end + a small todo list. ");
    			br0 = element("br");
    			t12 = text("\n                                I personally think knowing how much time is left will increase productivity. That all !");
    			t13 = space();
    			img = element("img");
    			t14 = space();
    			h4 = element("h4");
    			h4.textContent = "Contributing";
    			t16 = space();
    			p2 = element("p");
    			t17 = text("Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. ");
    			br1 = element("br");
    			t18 = text("\n                                Idk if you want to make the site / code better you can do so by opening an issue or a pull request.");
    			t19 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t20 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Kurizu";
    			t22 = space();
    			div7 = element("div");
    			p3 = element("p");
    			t23 = text("Timely project links : ");
    			br2 = element("br");
    			t24 = space();
    			a0 = element("a");
    			a0.textContent = "Github";
    			t26 = space();
    			br3 = element("br");
    			t27 = space();
    			a1 = element("a");
    			a1.textContent = "Website";
    			t29 = space();
    			br4 = element("br");
    			t30 = space();
    			br5 = element("br");
    			t31 = text("\n                                Thank you for checking out ! ");
    			br6 = element("br");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$f, 27, 12, 685);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$f, 28, 12, 736);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$f, 29, 12, 767);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$f, 26, 8, 651);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$f, 32, 8, 911);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$f, 39, 28, 1274);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$f, 38, 24, 1193);
    			set_style(h32, "color", "#6596ff");
    			add_location(h32, file$f, 42, 28, 1476);
    			add_location(br0, file$f, 44, 110, 1663);
    			add_location(p1, file$f, 43, 28, 1549);
    			attr_dev(img, "class", "msg-img svelte-r2sft9");
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/1019262228953829496/1019262284461252648/timely.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "timely");
    			add_location(img, file$f, 47, 28, 1849);
    			set_style(h4, "color", "#6596ff");
    			add_location(h4, file$f, 48, 28, 2008);
    			add_location(br1, file$f, 49, 146, 2200);
    			add_location(p2, file$f, 49, 28, 2082);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$f, 41, 24, 1397);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$f, 37, 20, 1123);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$f, 35, 16, 1036);
    			attr_dev(h33, "class", "chat-body-messages-item-content-header-name");
    			add_location(h33, file$f, 58, 28, 2676);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$f, 57, 24, 2595);
    			add_location(br2, file$f, 62, 55, 2937);
    			attr_dev(a0, "href", "https://github.com/crizmo/Timely");
    			attr_dev(a0, "class", "svelte-r2sft9");
    			add_location(a0, file$f, 63, 32, 2974);
    			add_location(br3, file$f, 63, 86, 3028);
    			attr_dev(a1, "href", "https://timely-note.vercel.app/");
    			attr_dev(a1, "class", "svelte-r2sft9");
    			add_location(a1, file$f, 64, 32, 3065);
    			add_location(br4, file$f, 64, 86, 3119);
    			add_location(br5, file$f, 65, 32, 3156);
    			add_location(br6, file$f, 66, 61, 3222);
    			add_location(p3, file$f, 61, 28, 2878);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$f, 60, 24, 2799);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$f, 56, 20, 2525);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$f, 54, 16, 2438);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$f, 34, 12, 987);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$f, 33, 8, 951);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$f, 25, 4, 547);
    			attr_dev(main, "class", "svelte-r2sft9");
    			add_location(main, file$f, 24, 0, 536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, h32);
    			append_dev(div3, t10);
    			append_dev(div3, p1);
    			append_dev(p1, t11);
    			append_dev(p1, br0);
    			append_dev(p1, t12);
    			append_dev(div3, t13);
    			append_dev(div3, img);
    			append_dev(div3, t14);
    			append_dev(div3, h4);
    			append_dev(div3, t16);
    			append_dev(div3, p2);
    			append_dev(p2, t17);
    			append_dev(p2, br1);
    			append_dev(p2, t18);
    			append_dev(div10, t19);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t20);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h33);
    			append_dev(div8, t22);
    			append_dev(div8, div7);
    			append_dev(div7, p3);
    			append_dev(p3, t23);
    			append_dev(p3, br2);
    			append_dev(p3, t24);
    			append_dev(p3, a0);
    			append_dev(p3, t26);
    			append_dev(p3, br3);
    			append_dev(p3, t27);
    			append_dev(p3, a1);
    			append_dev(p3, t29);
    			append_dev(p3, br4);
    			append_dev(p3, t30);
    			append_dev(p3, br5);
    			append_dev(p3, t31);
    			append_dev(p3, br6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$6 = "50px";

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Timely', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Timely> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$6,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Timely extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Timely",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/content/projects/all-pro.svelte generated by Svelte v3.48.0 */
    const file$e = "src/components/content/projects/all-pro.svelte";

    // (25:1) <Route path="/anyanime">
    function create_default_slot_8(ctx) {
    	let anyanimecn;
    	let t;
    	let anyanime;
    	let current;
    	anyanimecn = new Anyanime_cn({ $$inline: true });
    	anyanime = new Anyanime({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(anyanimecn.$$.fragment);
    			t = space();
    			create_component(anyanime.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(anyanimecn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(anyanime, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(anyanimecn.$$.fragment, local);
    			transition_in(anyanime.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(anyanimecn.$$.fragment, local);
    			transition_out(anyanime.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(anyanimecn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(anyanime, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(25:1) <Route path=\\\"/anyanime\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:1) <Route path="/image2url">
    function create_default_slot_7(ctx) {
    	let image2urlcn;
    	let t;
    	let image2url;
    	let current;
    	image2urlcn = new Image2url_cn({ $$inline: true });
    	image2url = new Image2url({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(image2urlcn.$$.fragment);
    			t = space();
    			create_component(image2url.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(image2urlcn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(image2url, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image2urlcn.$$.fragment, local);
    			transition_in(image2url.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image2urlcn.$$.fragment, local);
    			transition_out(image2url.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(image2urlcn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(image2url, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(30:1) <Route path=\\\"/image2url\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Route path="/elina">
    function create_default_slot_6(ctx) {
    	let elinacn;
    	let t;
    	let elinadev;
    	let current;
    	elinacn = new Elina_cn({ $$inline: true });
    	elinadev = new Elina_dev({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(elinacn.$$.fragment);
    			t = space();
    			create_component(elinadev.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(elinacn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(elinadev, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(elinacn.$$.fragment, local);
    			transition_in(elinadev.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(elinacn.$$.fragment, local);
    			transition_out(elinadev.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(elinacn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(elinadev, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(35:1) <Route path=\\\"/elina\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:1) <Route path="/stream-savers">
    function create_default_slot_5(ctx) {
    	let streamsaverscn;
    	let t;
    	let streamsavers;
    	let current;
    	streamsaverscn = new Streamsavers_cn({ $$inline: true });
    	streamsavers = new Streamsavers({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(streamsaverscn.$$.fragment);
    			t = space();
    			create_component(streamsavers.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(streamsaverscn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(streamsavers, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(streamsaverscn.$$.fragment, local);
    			transition_in(streamsavers.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(streamsaverscn.$$.fragment, local);
    			transition_out(streamsavers.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(streamsaverscn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(streamsavers, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(40:1) <Route path=\\\"/stream-savers\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:1) <Route path="/pixit">
    function create_default_slot_4(ctx) {
    	let pixitcn;
    	let t;
    	let pixit;
    	let current;
    	pixitcn = new Pixit_cn({ $$inline: true });
    	pixit = new Pixit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pixitcn.$$.fragment);
    			t = space();
    			create_component(pixit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pixitcn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(pixit, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pixitcn.$$.fragment, local);
    			transition_in(pixit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pixitcn.$$.fragment, local);
    			transition_out(pixit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pixitcn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(pixit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(45:1) <Route path=\\\"/pixit\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:1) <Route path="/breeze">
    function create_default_slot_3(ctx) {
    	let breezecn;
    	let t;
    	let breeze;
    	let current;
    	breezecn = new Breeze_cn({ $$inline: true });
    	breeze = new Breeze({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(breezecn.$$.fragment);
    			t = space();
    			create_component(breeze.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(breezecn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(breeze, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breezecn.$$.fragment, local);
    			transition_in(breeze.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breezecn.$$.fragment, local);
    			transition_out(breeze.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breezecn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(breeze, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(50:1) <Route path=\\\"/breeze\\\">",
    		ctx
    	});

    	return block;
    }

    // (55:1) <Route path="/minikey">
    function create_default_slot_2(ctx) {
    	let minikeycn;
    	let t;
    	let minikey;
    	let current;
    	minikeycn = new Minikey_cn({ $$inline: true });
    	minikey = new Minikey({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(minikeycn.$$.fragment);
    			t = space();
    			create_component(minikey.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(minikeycn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(minikey, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(minikeycn.$$.fragment, local);
    			transition_in(minikey.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(minikeycn.$$.fragment, local);
    			transition_out(minikey.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(minikeycn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(minikey, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(55:1) <Route path=\\\"/minikey\\\">",
    		ctx
    	});

    	return block;
    }

    // (60:1) <Route path="/type3d">
    function create_default_slot_1$2(ctx) {
    	let type3dcn;
    	let t;
    	let type3d;
    	let current;
    	type3dcn = new Type3d_cn({ $$inline: true });
    	type3d = new Type3d({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(type3dcn.$$.fragment);
    			t = space();
    			create_component(type3d.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(type3dcn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(type3d, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(type3dcn.$$.fragment, local);
    			transition_in(type3d.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(type3dcn.$$.fragment, local);
    			transition_out(type3d.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(type3dcn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(type3d, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(60:1) <Route path=\\\"/type3d\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:1) <Route path="/timely">
    function create_default_slot$4(ctx) {
    	let timelycn;
    	let t;
    	let timely;
    	let current;
    	timelycn = new Timely_cn({ $$inline: true });
    	timely = new Timely({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(timelycn.$$.fragment);
    			t = space();
    			create_component(timely.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(timelycn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(timely, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timelycn.$$.fragment, local);
    			transition_in(timely.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timelycn.$$.fragment, local);
    			transition_out(timely.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(timelycn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(timely, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(65:1) <Route path=\\\"/timely\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let t4;
    	let route5;
    	let t5;
    	let route6;
    	let t6;
    	let route7;
    	let t7;
    	let route8;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/anyanime",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/image2url",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/elina",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "/stream-savers",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/pixit",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route({
    			props: {
    				path: "/breeze",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route({
    			props: {
    				path: "/minikey",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route({
    			props: {
    				path: "/type3d",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route8 = new Route({
    			props: {
    				path: "/timely",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			t4 = space();
    			create_component(route5.$$.fragment);
    			t5 = space();
    			create_component(route6.$$.fragment);
    			t6 = space();
    			create_component(route7.$$.fragment);
    			t7 = space();
    			create_component(route8.$$.fragment);
    			add_location(main, file$e, 23, 0, 1134);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t0);
    			mount_component(route1, main, null);
    			append_dev(main, t1);
    			mount_component(route2, main, null);
    			append_dev(main, t2);
    			mount_component(route3, main, null);
    			append_dev(main, t3);
    			mount_component(route4, main, null);
    			append_dev(main, t4);
    			mount_component(route5, main, null);
    			append_dev(main, t5);
    			mount_component(route6, main, null);
    			append_dev(main, t6);
    			mount_component(route7, main, null);
    			append_dev(main, t7);
    			mount_component(route8, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    			destroy_component(route8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('All_pro', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<All_pro> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Route,
    		ElinaCn: Elina_cn,
    		AnyanimeCn: Anyanime_cn,
    		Image2urlCn: Image2url_cn,
    		StreamSaversCn: Streamsavers_cn,
    		PixitCn: Pixit_cn,
    		BreezeCn: Breeze_cn,
    		MinikeyCn: Minikey_cn,
    		Type3dCn: Type3d_cn,
    		TimelyCn: Timely_cn,
    		Anyanime,
    		Image2url,
    		ElinaDev: Elina_dev,
    		StreamSavers: Streamsavers,
    		Pixit,
    		Breeze,
    		Minikey,
    		Type3d,
    		Timely
    	});

    	return [];
    }

    class All_pro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "All_pro",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/channels/other/blogs-cn.svelte generated by Svelte v3.48.0 */
    const file$d = "src/components/channels/other/blogs-cn.svelte";

    function create_fragment$d(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let projects;
    	let t10;
    	let br1;
    	let t11;
    	let details;
    	let summary;
    	let t13;
    	let hr1;
    	let t14;
    	let div2;
    	let button0;
    	let a0;
    	let t16;
    	let button1;
    	let a1;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	projects = new Projects({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			create_component(projects.$$.fragment);
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Other";
    			t13 = space();
    			hr1 = element("hr");
    			t14 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# Blogs";
    			t16 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# To-do";
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-cc0uno");
    			add_location(script, file$d, 34, 4, 994);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-cc0uno");
    			add_location(meta, file$d, 35, 4, 1088);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-cc0uno");
    			add_location(img, file$d, 39, 16, 1351);
    			attr_dev(h3, "class", "server-name-on-template svelte-cc0uno");
    			add_location(h3, file$d, 45, 16, 1600);
    			attr_dev(span, "class", "close-btn svelte-cc0uno");
    			add_location(span, file$d, 46, 16, 1664);
    			attr_dev(div0, "class", "server-template-icon svelte-cc0uno");
    			add_location(div0, file$d, 38, 12, 1300);
    			attr_dev(hr0, "class", "svelte-cc0uno");
    			add_location(hr0, file$d, 48, 12, 1756);
    			attr_dev(div1, "class", "svelte-cc0uno");
    			add_location(div1, file$d, 37, 8, 1282);
    			attr_dev(br0, "class", "svelte-cc0uno");
    			add_location(br0, file$d, 52, 12, 1844);
    			attr_dev(br1, "class", "svelte-cc0uno");
    			add_location(br1, file$d, 54, 12, 1886);
    			attr_dev(summary, "class", "svelte-cc0uno");
    			add_location(summary, file$d, 56, 16, 1948);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-cc0uno");
    			add_location(hr1, file$d, 57, 16, 1989);
    			attr_dev(a0, "class", "blogs svelte-cc0uno");
    			attr_dev(a0, "href", "/blogs");
    			add_location(a0, file$d, 60, 24, 2122);
    			attr_dev(button0, "class", "channelbtn svelte-cc0uno");
    			add_location(button0, file$d, 59, 20, 2070);
    			attr_dev(a1, "class", "to-do svelte-cc0uno");
    			attr_dev(a1, "href", "/to-do");
    			add_location(a1, file$d, 63, 24, 2267);
    			attr_dev(button1, "class", "channelbtn svelte-cc0uno");
    			add_location(button1, file$d, 62, 20, 2215);
    			attr_dev(div2, "class", "channels-list svelte-cc0uno");
    			add_location(div2, file$d, 58, 16, 2022);
    			attr_dev(details, "class", "links svelte-cc0uno");
    			details.open = true;
    			add_location(details, file$d, 55, 12, 1903);
    			attr_dev(div3, "class", "categories svelte-cc0uno");
    			add_location(div3, file$d, 50, 8, 1786);
    			attr_dev(div4, "class", "channels svelte-cc0uno");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$d, 36, 4, 1163);
    			attr_dev(main1, "class", "svelte-cc0uno");
    			add_location(main1, file$d, 33, 0, 983);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			mount_component(projects, div3, null);
    			append_dev(div3, t10);
    			append_dev(div3, br1);
    			append_dev(div3, t11);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t13);
    			append_dev(details, hr1);
    			append_dev(details, t14);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t16);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$3, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(projects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(projects);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$3() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$3() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blogs_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$3();
    			} else if (direction == "right") {
    				openNav$3();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blogs_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Main,
    		Projects,
    		closeNav: closeNav$3,
    		openNav: openNav$3,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$3, handler, openNav$3];
    }

    class Blogs_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blogs_cn",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get closeNav() {
    		return closeNav$3;
    	}

    	set closeNav(value) {
    		throw new Error("<Blogs_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$3;
    	}

    	set openNav(value) {
    		throw new Error("<Blogs_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/channels/other/todo-cn.svelte generated by Svelte v3.48.0 */
    const file$c = "src/components/channels/other/todo-cn.svelte";

    function create_fragment$c(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let projects;
    	let t10;
    	let br1;
    	let t11;
    	let details;
    	let summary;
    	let t13;
    	let hr1;
    	let t14;
    	let div2;
    	let button0;
    	let a0;
    	let t16;
    	let button1;
    	let a1;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	projects = new Projects({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			create_component(projects.$$.fragment);
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Other";
    			t13 = space();
    			hr1 = element("hr");
    			t14 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# Blogs";
    			t16 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# To-do";
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-1eztnpy");
    			add_location(script, file$c, 34, 4, 994);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-1eztnpy");
    			add_location(meta, file$c, 35, 4, 1088);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-1eztnpy");
    			add_location(img, file$c, 39, 16, 1351);
    			attr_dev(h3, "class", "server-name-on-template svelte-1eztnpy");
    			add_location(h3, file$c, 45, 16, 1600);
    			attr_dev(span, "class", "close-btn svelte-1eztnpy");
    			add_location(span, file$c, 46, 16, 1664);
    			attr_dev(div0, "class", "server-template-icon svelte-1eztnpy");
    			add_location(div0, file$c, 38, 12, 1300);
    			attr_dev(hr0, "class", "svelte-1eztnpy");
    			add_location(hr0, file$c, 48, 12, 1756);
    			attr_dev(div1, "class", "svelte-1eztnpy");
    			add_location(div1, file$c, 37, 8, 1282);
    			attr_dev(br0, "class", "svelte-1eztnpy");
    			add_location(br0, file$c, 52, 12, 1844);
    			attr_dev(br1, "class", "svelte-1eztnpy");
    			add_location(br1, file$c, 54, 12, 1886);
    			attr_dev(summary, "class", "svelte-1eztnpy");
    			add_location(summary, file$c, 56, 16, 1948);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-1eztnpy");
    			add_location(hr1, file$c, 57, 16, 1989);
    			attr_dev(a0, "class", "blogs svelte-1eztnpy");
    			attr_dev(a0, "href", "/blogs");
    			add_location(a0, file$c, 60, 24, 2122);
    			attr_dev(button0, "class", "channelbtn svelte-1eztnpy");
    			add_location(button0, file$c, 59, 20, 2070);
    			attr_dev(a1, "class", "to-do svelte-1eztnpy");
    			attr_dev(a1, "href", "/to-do");
    			add_location(a1, file$c, 63, 24, 2267);
    			attr_dev(button1, "class", "channelbtn svelte-1eztnpy");
    			add_location(button1, file$c, 62, 20, 2215);
    			attr_dev(div2, "class", "channels-list svelte-1eztnpy");
    			add_location(div2, file$c, 58, 16, 2022);
    			attr_dev(details, "class", "links svelte-1eztnpy");
    			details.open = true;
    			add_location(details, file$c, 55, 12, 1903);
    			attr_dev(div3, "class", "categories svelte-1eztnpy");
    			add_location(div3, file$c, 50, 8, 1786);
    			attr_dev(div4, "class", "channels svelte-1eztnpy");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$c, 36, 4, 1163);
    			attr_dev(main1, "class", "svelte-1eztnpy");
    			add_location(main1, file$c, 33, 0, 983);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			mount_component(main0, div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, br0);
    			append_dev(div3, t9);
    			mount_component(projects, div3, null);
    			append_dev(div3, t10);
    			append_dev(div3, br1);
    			append_dev(div3, t11);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t13);
    			append_dev(details, hr1);
    			append_dev(details, t14);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t16);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$2, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(projects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(projects);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$2() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$2() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Todo_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$2();
    			} else if (direction == "right") {
    				openNav$2();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Todo_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Main,
    		Projects,
    		closeNav: closeNav$2,
    		openNav: openNav$2,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav$2, handler, openNav$2];
    }

    class Todo_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Todo_cn",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get closeNav() {
    		return closeNav$2;
    	}

    	set closeNav(value) {
    		throw new Error("<Todo_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav$2;
    	}

    	set openNav(value) {
    		throw new Error("<Todo_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/content/other/blogs.svelte generated by Svelte v3.48.0 */
    const file$b = "src/components/content/other/blogs.svelte";

    function create_fragment$b(ctx) {
    	let main;
    	let div9;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div8;
    	let div7;
    	let div6;
    	let user;
    	let t6;
    	let div5;
    	let div2;
    	let h31;
    	let t8;
    	let div4;
    	let div3;
    	let h32;
    	let t10;
    	let p1;
    	let i0;
    	let t11;
    	let t12;
    	let p2;
    	let i1;
    	let t13;
    	let i2;
    	let t14;
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	user = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div9 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Kurizu's Blog";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Kurizu Blog";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			create_component(user.$$.fragment);
    			t6 = space();
    			div5 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Celebrate Tough Times";
    			t10 = space();
    			p1 = element("p");
    			i0 = element("i");
    			t11 = text(" 2022-09-06");
    			t12 = space();
    			p2 = element("p");
    			i1 = element("i");
    			t13 = text(" \n                                      It's not the load that breaks you down, it's the way you carry it.\n                                    ");
    			i2 = element("i");
    			t14 = space();
    			a = element("a");
    			a.textContent = "Read more";
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$b, 26, 12, 683);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$b, 27, 12, 741);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$b, 28, 12, 772);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$b, 25, 8, 649);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$b, 31, 8, 915);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$b, 38, 28, 1278);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$b, 37, 24, 1197);
    			add_location(h32, file$b, 46, 32, 1658);
    			attr_dev(i0, "class", "fas fa-calendar-alt");
    			add_location(i0, file$b, 48, 36, 1761);
    			add_location(p1, file$b, 47, 32, 1721);
    			attr_dev(i1, "class", "fas fa-quote-left");
    			add_location(i1, file$b, 51, 36, 1917);
    			attr_dev(i2, "class", "fas fa-quote-right");
    			add_location(i2, file$b, 53, 36, 2093);
    			add_location(p2, file$b, 50, 32, 1877);
    			attr_dev(a, "href", "/blogs/celebrate-tough-times");
    			attr_dev(a, "class", "svelte-173fec4");
    			add_location(a, file$b, 56, 32, 2254);
    			attr_dev(div3, "class", "blog-box");
    			add_location(div3, file$b, 45, 28, 1603);
    			attr_dev(div4, "class", "chat-body-messages-item-content-body");
    			add_location(div4, file$b, 44, 24, 1524);
    			attr_dev(div5, "class", "chat-body-messages-item-content");
    			add_location(div5, file$b, 36, 20, 1127);
    			attr_dev(div6, "class", "chat-body-messages-item");
    			add_location(div6, file$b, 34, 16, 1040);
    			attr_dev(div7, "class", "chat-body-messages");
    			add_location(div7, file$b, 33, 12, 991);
    			attr_dev(div8, "class", "chat-body");
    			add_location(div8, file$b, 32, 8, 955);
    			attr_dev(div9, "class", "mainarea");
    			add_location(div9, file$b, 24, 4, 545);
    			attr_dev(main, "class", "svelte-173fec4");
    			add_location(main, file$b, 23, 0, 534);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div9);
    			append_dev(div9, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div9, t4);
    			append_dev(div9, hr);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			mount_component(user, div6, null);
    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, h31);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, h32);
    			append_dev(div3, t10);
    			append_dev(div3, p1);
    			append_dev(p1, i0);
    			append_dev(p1, t11);
    			append_dev(div3, t12);
    			append_dev(div3, p2);
    			append_dev(p2, i1);
    			append_dev(p2, t13);
    			append_dev(p2, i2);
    			append_dev(div3, t14);
    			append_dev(div3, a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div9, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div9, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$5 = "50px";

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blogs', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blogs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$5,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Blogs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blogs",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/content/other/todo.svelte generated by Svelte v3.48.0 */
    const file$a = "src/components/content/other/todo.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let script;
    	let script_src_value;
    	let t0;
    	let div8;
    	let div1;
    	let h30;
    	let t2;
    	let div0;
    	let t3;
    	let p0;
    	let t5;
    	let hr;
    	let t6;
    	let div7;
    	let div6;
    	let div5;
    	let user;
    	let t7;
    	let div4;
    	let div2;
    	let h31;
    	let t9;
    	let div3;
    	let h32;
    	let t11;
    	let p1;
    	let i0;
    	let t12;
    	let br0;
    	let t13;
    	let i1;
    	let t14;
    	let br1;
    	let t15;
    	let i2;
    	let t16;
    	let br2;
    	let t17;
    	let i3;
    	let t18;
    	let br3;
    	let t19;
    	let i4;
    	let t20;
    	let br4;
    	let t21;
    	let i5;
    	let t22;
    	let current;
    	let mounted;
    	let dispose;
    	user = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			script = element("script");
    			t0 = space();
    			div8 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# ToDo";
    			t2 = space();
    			div0 = element("div");
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Stuff i plan on doing someday lol";
    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			create_component(user.$$.fragment);
    			t7 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t9 = space();
    			div3 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Plans / To-do regarding this site";
    			t11 = space();
    			p1 = element("p");
    			i0 = element("i");
    			t12 = text(" | More better view for mobile devices\n                                ");
    			br0 = element("br");
    			t13 = space();
    			i1 = element("i");
    			t14 = text(" | Add more channels\n                                ");
    			br1 = element("br");
    			t15 = space();
    			i2 = element("i");
    			t16 = text(" | Git posts \n                                ");
    			br2 = element("br");
    			t17 = space();
    			i3 = element("i");
    			t18 = text(" | Change color to original app color \n                                ");
    			br3 = element("br");
    			t19 = space();
    			i4 = element("i");
    			t20 = text(" | Add elina user in /elina-bot\n                                ");
    			br4 = element("br");
    			t21 = space();
    			i5 = element("i");
    			t22 = text(" | Change to a better image host");
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			add_location(script, file$a, 27, 4, 635);
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$a, 30, 12, 867);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$a, 31, 12, 916);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$a, 32, 12, 947);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$a, 29, 8, 833);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$a, 35, 8, 1112);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$a, 42, 28, 1475);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$a, 41, 24, 1394);
    			set_style(h32, "color", "yellow");
    			add_location(h32, file$a, 49, 28, 1800);
    			attr_dev(i0, "class", check$1);
    			add_location(i0, file$a, 51, 32, 1930);
    			add_location(br0, file$a, 52, 32, 2024);
    			attr_dev(i1, "class", uncheck$1);
    			add_location(i1, file$a, 53, 32, 2063);
    			add_location(br1, file$a, 54, 32, 2141);
    			attr_dev(i2, "class", check$1);
    			add_location(i2, file$a, 55, 32, 2180);
    			add_location(br2, file$a, 56, 32, 2249);
    			attr_dev(i3, "class", check$1);
    			add_location(i3, file$a, 57, 32, 2286);
    			add_location(br3, file$a, 58, 32, 2380);
    			attr_dev(i4, "class", check$1);
    			add_location(i4, file$a, 59, 32, 2417);
    			add_location(br4, file$a, 60, 32, 2504);
    			attr_dev(i5, "class", uncheck$1);
    			add_location(i5, file$a, 61, 32, 2541);
    			add_location(p1, file$a, 50, 28, 1894);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$a, 48, 24, 1721);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$a, 40, 20, 1324);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$a, 38, 16, 1237);
    			attr_dev(div6, "class", "chat-body-messages");
    			add_location(div6, file$a, 37, 12, 1188);
    			attr_dev(div7, "class", "chat-body");
    			add_location(div7, file$a, 36, 8, 1152);
    			attr_dev(div8, "class", "mainarea");
    			add_location(div8, file$a, 28, 4, 729);
    			add_location(main, file$a, 26, 0, 624);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, script);
    			append_dev(main, t0);
    			append_dev(main, div8);
    			append_dev(div8, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(div8, t5);
    			append_dev(div8, hr);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			mount_component(user, div5, null);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, h32);
    			append_dev(div3, t11);
    			append_dev(div3, p1);
    			append_dev(p1, i0);
    			append_dev(p1, t12);
    			append_dev(p1, br0);
    			append_dev(p1, t13);
    			append_dev(p1, i1);
    			append_dev(p1, t14);
    			append_dev(p1, br1);
    			append_dev(p1, t15);
    			append_dev(p1, i2);
    			append_dev(p1, t16);
    			append_dev(p1, br2);
    			append_dev(p1, t17);
    			append_dev(p1, i3);
    			append_dev(p1, t18);
    			append_dev(p1, br3);
    			append_dev(p1, t19);
    			append_dev(p1, i4);
    			append_dev(p1, t20);
    			append_dev(p1, br4);
    			append_dev(p1, t21);
    			append_dev(p1, i5);
    			append_dev(p1, t22);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div8, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div8, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$4 = "50px";
    const uncheck$1 = "fas fa-solid fa-square";
    const check$1 = "fas fa-solid fa-check";

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Todo', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Todo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$4,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler,
    		uncheck: uncheck$1,
    		check: check$1
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Todo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Todo",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/content/other/all-oth.svelte generated by Svelte v3.48.0 */
    const file$9 = "src/components/content/other/all-oth.svelte";

    // (12:1) <Route path="/blogs">
    function create_default_slot_1$1(ctx) {
    	let blogscn;
    	let t;
    	let blogs;
    	let current;
    	blogscn = new Blogs_cn({ $$inline: true });
    	blogs = new Blogs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blogscn.$$.fragment);
    			t = space();
    			create_component(blogs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blogscn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(blogs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blogscn.$$.fragment, local);
    			transition_in(blogs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blogscn.$$.fragment, local);
    			transition_out(blogs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blogscn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(blogs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(12:1) <Route path=\\\"/blogs\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:1) <Route path="/to-do">
    function create_default_slot$3(ctx) {
    	let todocn;
    	let t;
    	let todo;
    	let current;
    	todocn = new Todo_cn({ $$inline: true });
    	todo = new Todo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(todocn.$$.fragment);
    			t = space();
    			create_component(todo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(todocn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(todo, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todocn.$$.fragment, local);
    			transition_in(todo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todocn.$$.fragment, local);
    			transition_out(todo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(todocn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(todo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(17:1) <Route path=\\\"/to-do\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/blogs",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/to-do",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    			add_location(main, file$9, 10, 0, 259);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t);
    			mount_component(route1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('All_oth', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<All_oth> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Route, BlogsCn: Blogs_cn, TodoCn: Todo_cn, Blogs, Todo });
    	return [];
    }

    class All_oth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "All_oth",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/content/other/blogs/celebrate-tough-times.svelte generated by Svelte v3.48.0 */
    const file$8 = "src/components/content/other/blogs/celebrate-tough-times.svelte";

    function create_fragment$8(ctx) {
    	let main;
    	let script;
    	let script_src_value;
    	let t0;
    	let div8;
    	let div1;
    	let h30;
    	let t2;
    	let div0;
    	let t3;
    	let p0;
    	let t5;
    	let hr;
    	let t6;
    	let div7;
    	let div6;
    	let div5;
    	let user;
    	let t7;
    	let div4;
    	let div2;
    	let h31;
    	let t9;
    	let div3;
    	let h4;
    	let t11;
    	let p1;
    	let t12;
    	let br0;
    	let t13;
    	let br1;
    	let t14;
    	let br2;
    	let t15;
    	let br3;
    	let t16;
    	let br4;
    	let t17;
    	let br5;
    	let t18;
    	let br6;
    	let t19;
    	let br7;
    	let t20;
    	let img;
    	let img_src_value;
    	let t21;
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	user = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			script = element("script");
    			t0 = space();
    			div8 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Yeet";
    			t2 = space();
    			div0 = element("div");
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Celebrate though times";
    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			create_component(user.$$.fragment);
    			t7 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t9 = space();
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Oi matey";
    			t11 = space();
    			p1 = element("p");
    			t12 = text("Remember to enjoy those small irritating things ");
    			br0 = element("br");
    			t13 = text("\n                                It's the little things that make life worth living ");
    			br1 = element("br");
    			t14 = text("\n                                It do be fun do give it a try ");
    			br2 = element("br");
    			t15 = text("\n                                Gonna keep it short :D ");
    			br3 = element("br");
    			t16 = space();
    			br4 = element("br");
    			t17 = text("\n                                Just that tbh ");
    			br5 = element("br");
    			t18 = text("\n                                Enjoy ! ");
    			br6 = element("br");
    			t19 = space();
    			br7 = element("br");
    			t20 = space();
    			img = element("img");
    			t21 = space();
    			a = element("a");
    			a.textContent = "Back";
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-er40n9");
    			add_location(script, file$8, 27, 4, 641);
    			attr_dev(h30, "class", "channel-name svelte-er40n9");
    			add_location(h30, file$8, 30, 12, 873);
    			attr_dev(div0, "class", "vl svelte-er40n9");
    			add_location(div0, file$8, 31, 12, 922);
    			attr_dev(p0, "class", "channel-info svelte-er40n9");
    			add_location(p0, file$8, 32, 12, 953);
    			attr_dev(div1, "class", "top-nav svelte-er40n9");
    			add_location(div1, file$8, 29, 8, 839);
    			attr_dev(hr, "class", "svelte-er40n9");
    			add_location(hr, file$8, 35, 8, 1107);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name svelte-er40n9");
    			add_location(h31, file$8, 42, 28, 1445);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header svelte-er40n9");
    			add_location(div2, file$8, 41, 24, 1364);
    			attr_dev(h4, "class", "svelte-er40n9");
    			add_location(h4, file$8, 49, 28, 1770);
    			attr_dev(br0, "class", "svelte-er40n9");
    			add_location(br0, file$8, 51, 80, 1900);
    			attr_dev(br1, "class", "svelte-er40n9");
    			add_location(br1, file$8, 52, 83, 1988);
    			attr_dev(br2, "class", "svelte-er40n9");
    			add_location(br2, file$8, 53, 62, 2055);
    			attr_dev(br3, "class", "svelte-er40n9");
    			add_location(br3, file$8, 54, 55, 2115);
    			attr_dev(br4, "class", "svelte-er40n9");
    			add_location(br4, file$8, 55, 32, 2152);
    			attr_dev(br5, "class", "svelte-er40n9");
    			add_location(br5, file$8, 56, 46, 2203);
    			attr_dev(br6, "class", "svelte-er40n9");
    			add_location(br6, file$8, 57, 40, 2248);
    			attr_dev(br7, "class", "svelte-er40n9");
    			add_location(br7, file$8, 57, 45, 2253);
    			attr_dev(img, "class", "msg-img svelte-er40n9");
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1016670948507783208/cel.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "cel");
    			add_location(img, file$8, 58, 32, 2290);
    			attr_dev(a, "href", "/blogs");
    			attr_dev(a, "class", "back-btn svelte-er40n9");
    			add_location(a, file$8, 60, 32, 2447);
    			attr_dev(p1, "class", "svelte-er40n9");
    			add_location(p1, file$8, 50, 28, 1816);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body svelte-er40n9");
    			add_location(div3, file$8, 48, 24, 1691);
    			attr_dev(div4, "class", "chat-body-messages-item-content svelte-er40n9");
    			add_location(div4, file$8, 40, 20, 1294);
    			attr_dev(div5, "class", "chat-body-messages-item svelte-er40n9");
    			add_location(div5, file$8, 38, 16, 1207);
    			attr_dev(div6, "class", "chat-body-messages svelte-er40n9");
    			add_location(div6, file$8, 37, 12, 1158);
    			attr_dev(div7, "class", "chat-body svelte-er40n9");
    			add_location(div7, file$8, 36, 8, 1122);
    			attr_dev(div8, "class", "mainarea svelte-er40n9");
    			add_location(div8, file$8, 28, 4, 735);
    			attr_dev(main, "class", "svelte-er40n9");
    			add_location(main, file$8, 26, 0, 630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, script);
    			append_dev(main, t0);
    			append_dev(main, div8);
    			append_dev(div8, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(div8, t5);
    			append_dev(div8, hr);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			mount_component(user, div5, null);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t11);
    			append_dev(div3, p1);
    			append_dev(p1, t12);
    			append_dev(p1, br0);
    			append_dev(p1, t13);
    			append_dev(p1, br1);
    			append_dev(p1, t14);
    			append_dev(p1, br2);
    			append_dev(p1, t15);
    			append_dev(p1, br3);
    			append_dev(p1, t16);
    			append_dev(p1, br4);
    			append_dev(p1, t17);
    			append_dev(p1, br5);
    			append_dev(p1, t18);
    			append_dev(p1, br6);
    			append_dev(p1, t19);
    			append_dev(p1, br7);
    			append_dev(p1, t20);
    			append_dev(p1, img);
    			append_dev(p1, t21);
    			append_dev(p1, a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div8, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div8, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$3 = "50px";
    const uncheck = "fas fa-solid fa-square";
    const check = "fas fa-solid fa-check";

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Celebrate_tough_times', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Celebrate_tough_times> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$3,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler,
    		uncheck,
    		check
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Celebrate_tough_times extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Celebrate_tough_times",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/content/other/blogs/all-blogs.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/components/content/other/blogs/all-blogs.svelte";

    // (8:1) <Route path="/blogs/celebrate-tough-times">
    function create_default_slot$2(ctx) {
    	let blogscn;
    	let t;
    	let celebratetoughtimes;
    	let current;
    	blogscn = new Blogs_cn({ $$inline: true });
    	celebratetoughtimes = new Celebrate_tough_times({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blogscn.$$.fragment);
    			t = space();
    			create_component(celebratetoughtimes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blogscn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(celebratetoughtimes, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blogscn.$$.fragment, local);
    			transition_in(celebratetoughtimes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blogscn.$$.fragment, local);
    			transition_out(celebratetoughtimes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blogscn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(celebratetoughtimes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(8:1) <Route path=\\\"/blogs/celebrate-tough-times\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: "/blogs/celebrate-tough-times",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route.$$.fragment);
    			add_location(main, file$7, 6, 0, 185);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('All_blogs', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<All_blogs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Route, BlogsCn: Blogs_cn, CelebrateToughTimes: Celebrate_tough_times });
    	return [];
    }

    class All_blogs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "All_blogs",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/channels/chat/chat-cn.svelte generated by Svelte v3.48.0 */
    const file$6 = "src/components/channels/chat/chat-cn.svelte";

    function create_fragment$6(ctx) {
    	let main1;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div3;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr;
    	let t7;
    	let div2;
    	let main0;
    	let t8;
    	let br0;
    	let t9;
    	let projects;
    	let t10;
    	let br1;
    	let t11;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	main0 = new Main({ $$inline: true });
    	projects = new Projects({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr = element("hr");
    			t7 = space();
    			div2 = element("div");
    			create_component(main0.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			create_component(projects.$$.fragment);
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-zm8py7");
    			add_location(script, file$6, 37, 4, 1058);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-zm8py7");
    			add_location(meta, file$6, 40, 4, 1168);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-zm8py7");
    			add_location(img, file$6, 44, 16, 1431);
    			attr_dev(h3, "class", "server-name-on-template svelte-zm8py7");
    			add_location(h3, file$6, 50, 16, 1680);
    			attr_dev(span, "class", "close-btn svelte-zm8py7");
    			add_location(span, file$6, 51, 16, 1744);
    			attr_dev(div0, "class", "server-template-icon svelte-zm8py7");
    			add_location(div0, file$6, 43, 12, 1380);
    			attr_dev(hr, "class", "svelte-zm8py7");
    			add_location(hr, file$6, 53, 12, 1834);
    			attr_dev(div1, "class", "svelte-zm8py7");
    			add_location(div1, file$6, 42, 8, 1362);
    			attr_dev(br0, "class", "svelte-zm8py7");
    			add_location(br0, file$6, 57, 12, 1922);
    			attr_dev(br1, "class", "svelte-zm8py7");
    			add_location(br1, file$6, 59, 12, 1966);
    			attr_dev(div2, "class", "categories svelte-zm8py7");
    			add_location(div2, file$6, 55, 8, 1864);
    			attr_dev(div3, "class", "channels svelte-zm8py7");
    			attr_dev(div3, "id", "mySidenav");
    			add_location(div3, file$6, 41, 4, 1243);
    			attr_dev(main1, "class", "svelte-zm8py7");
    			add_location(main1, file$6, 36, 0, 1047);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			append_dev(main1, script);
    			append_dev(main1, t0);
    			append_dev(main1, meta);
    			append_dev(main1, t1);
    			append_dev(main1, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			mount_component(main0, div2, null);
    			append_dev(div2, t8);
    			append_dev(div2, br0);
    			append_dev(div2, t9);
    			mount_component(projects, div2, null);
    			append_dev(div2, t10);
    			append_dev(div2, br1);
    			append_dev(div2, t11);
    			mount_component(links, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav$1, false, false, false),
    					action_destroyer(swipe.call(null, div3, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div3, "swipe", handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main0.$$.fragment, local);
    			transition_in(projects.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main0.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(main0);
    			destroy_component(projects);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav$1() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav$1() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    let direction;

    function handler(event) {
    	direction = event.detail.direction;

    	if (window.innerWidth) {
    		if (direction == "left") {
    			closeNav$1();
    		} else if (direction == "right") {
    			openNav$1();
    		}
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chat_cn', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chat_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Main,
    		Projects,
    		Links: Other,
    		closeNav: closeNav$1,
    		openNav: openNav$1,
    		swipe,
    		direction,
    		handler
    	});

    	return [];
    }

    class Chat_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat_cn",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const PACKET_TYPES = Object.create(null); // no Map = no polyfill
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    const PACKET_TYPES_REVERSE = Object.create(null);
    Object.keys(PACKET_TYPES).forEach(key => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    const ERROR_PACKET = { type: "error", data: "parser error" };

    const withNativeBlob$1 = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
    const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
    // ArrayBuffer.isView method is not defined in IE10
    const isView$1 = obj => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj && obj.buffer instanceof ArrayBuffer;
    };
    const encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob$1 && data instanceof Blob) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(data, callback);
            }
        }
        else if (withNativeArrayBuffer$2 &&
            (data instanceof ArrayBuffer || isView$1(data))) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(new Blob([data]), callback);
            }
        }
        // plain string
        return callback(PACKET_TYPES[type] + (data || ""));
    };
    const encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const content = fileReader.result.split(",")[1];
            callback("b" + content);
        };
        return fileReader.readAsDataURL(data);
    };

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    const lookup$1 = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
        lookup$1[chars.charCodeAt(i)] = i;
    }
    const decode$1 = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup$1[base64.charCodeAt(i)];
            encoded2 = lookup$1[base64.charCodeAt(i + 1)];
            encoded3 = lookup$1[base64.charCodeAt(i + 2)];
            encoded4 = lookup$1[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
    const decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
            return {
                type: "message",
                data: mapBinary(encodedPacket, binaryType)
            };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
            return {
                type: "message",
                data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
            return ERROR_PACKET;
        }
        return encodedPacket.length > 1
            ? {
                type: PACKET_TYPES_REVERSE[type],
                data: encodedPacket.substring(1)
            }
            : {
                type: PACKET_TYPES_REVERSE[type]
            };
    };
    const decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer$1) {
            const decoded = decode$1(data);
            return mapBinary(decoded, binaryType);
        }
        else {
            return { base64: true, data }; // fallback for old browsers
        }
    };
    const mapBinary = (data, binaryType) => {
        switch (binaryType) {
            case "blob":
                return data instanceof ArrayBuffer ? new Blob([data]) : data;
            case "arraybuffer":
            default:
                return data; // assuming the data is already an ArrayBuffer
        }
    };

    const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
    const encodePayload = (packets, callback) => {
        // some packets may be added to the array while encoding, so the initial length must be saved
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
            // force base64 encoding for binary packets
            encodePacket(packet, false, encodedPacket => {
                encodedPackets[i] = encodedPacket;
                if (++count === length) {
                    callback(encodedPackets.join(SEPARATOR));
                }
            });
        });
    };
    const decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
            const decodedPacket = decodePacket(encodedPackets[i], binaryType);
            packets.push(decodedPacket);
            if (decodedPacket.type === "error") {
                break;
            }
        }
        return packets;
    };
    const protocol$1 = 4;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    // alias used for reserved events (protected method)
    Emitter.prototype.emitReserved = Emitter.prototype.emit;

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };

    const globalThisShim = (() => {
        if (typeof self !== "undefined") {
            return self;
        }
        else if (typeof window !== "undefined") {
            return window;
        }
        else {
            return Function("return this")();
        }
    })();

    function pick(obj, ...attr) {
        return attr.reduce((acc, k) => {
            if (obj.hasOwnProperty(k)) {
                acc[k] = obj[k];
            }
            return acc;
        }, {});
    }
    // Keep a reference to the real timeout functions so they can be used when overridden
    const NATIVE_SET_TIMEOUT = setTimeout;
    const NATIVE_CLEAR_TIMEOUT = clearTimeout;
    function installTimerFunctions(obj, opts) {
        if (opts.useNativeTimers) {
            obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
            obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
        }
        else {
            obj.setTimeoutFn = setTimeout.bind(globalThisShim);
            obj.clearTimeoutFn = clearTimeout.bind(globalThisShim);
        }
    }
    // base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)
    const BASE64_OVERHEAD = 1.33;
    // we could also have used `new Blob([obj]).size`, but it isn't supported in IE9
    function byteLength(obj) {
        if (typeof obj === "string") {
            return utf8Length(obj);
        }
        // arraybuffer or blob
        return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
    }
    function utf8Length(str) {
        let c = 0, length = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            c = str.charCodeAt(i);
            if (c < 0x80) {
                length += 1;
            }
            else if (c < 0x800) {
                length += 2;
            }
            else if (c < 0xd800 || c >= 0xe000) {
                length += 3;
            }
            else {
                i++;
                length += 4;
            }
        }
        return length;
    }

    class TransportError extends Error {
        constructor(reason, description, context) {
            super(reason);
            this.description = description;
            this.context = context;
            this.type = "TransportError";
        }
    }
    class Transport extends Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} options.
         * @api private
         */
        constructor(opts) {
            super();
            this.writable = false;
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.query = opts.query;
            this.readyState = "";
            this.socket = opts.socket;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @api protected
         */
        onError(reason, description, context) {
            super.emitReserved("error", new TransportError(reason, description, context));
            return this;
        }
        /**
         * Opens the transport.
         *
         * @api public
         */
        open() {
            if ("closed" === this.readyState || "" === this.readyState) {
                this.readyState = "opening";
                this.doOpen();
            }
            return this;
        }
        /**
         * Closes the transport.
         *
         * @api public
         */
        close() {
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.doClose();
                this.onClose();
            }
            return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         * @api public
         */
        send(packets) {
            if ("open" === this.readyState) {
                this.write(packets);
            }
        }
        /**
         * Called upon open
         *
         * @api protected
         */
        onOpen() {
            this.readyState = "open";
            this.writable = true;
            super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @api protected
         */
        onData(data) {
            const packet = decodePacket(data, this.socket.binaryType);
            this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @api protected
         */
        onPacket(packet) {
            super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @api protected
         */
        onClose(details) {
            this.readyState = "closed";
            super.emitReserved("close", details);
        }
    }

    // imported from https://github.com/unshiftio/yeast
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {};
    let seed = 0, i = 0, prev;
    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode$1(num) {
        let encoded = '';
        do {
            encoded = alphabet[num % length] + encoded;
            num = Math.floor(num / length);
        } while (num > 0);
        return encoded;
    }
    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
        const now = encode$1(+new Date());
        if (now !== prev)
            return seed = 0, prev = now;
        return now + '.' + encode$1(seed++);
    }
    //
    // Map each character to its index.
    //
    for (; i < length; i++)
        map[alphabet[i]] = i;

    // imported from https://github.com/galkn/querystring
    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */
    function encode(obj) {
        let str = '';
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (str.length)
                    str += '&';
                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
            }
        }
        return str;
    }
    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */
    function decode(qs) {
        let qry = {};
        let pairs = qs.split('&');
        for (let i = 0, l = pairs.length; i < l; i++) {
            let pair = pairs[i].split('=');
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return qry;
    }

    // imported from https://github.com/component/has-cors
    let value = false;
    try {
        value = typeof XMLHttpRequest !== 'undefined' &&
            'withCredentials' in new XMLHttpRequest();
    }
    catch (err) {
        // if XMLHttp support is disabled in IE then it will throw
        // when trying to create
    }
    const hasCORS = value;

    // browser shim for xmlhttprequest module
    function XHR(opts) {
        const xdomain = opts.xdomain;
        // XMLHttpRequest can be disabled on IE
        try {
            if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                return new XMLHttpRequest();
            }
        }
        catch (e) { }
        if (!xdomain) {
            try {
                return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
    }

    function empty() { }
    const hasXHR2 = (function () {
        const xhr = new XHR({
            xdomain: false
        });
        return null != xhr.responseType;
    })();
    class Polling extends Transport {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.polling = false;
            if (typeof location !== "undefined") {
                const isSSL = "https:" === location.protocol;
                let port = location.port;
                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? "443" : "80";
                }
                this.xd =
                    (typeof location !== "undefined" &&
                        opts.hostname !== location.hostname) ||
                        port !== opts.port;
                this.xs = opts.secure !== isSSL;
            }
            /**
             * XHR supports binary
             */
            const forceBase64 = opts && opts.forceBase64;
            this.supportsBinary = hasXHR2 && !forceBase64;
        }
        /**
         * Transport name.
         */
        get name() {
            return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @api private
         */
        doOpen() {
            this.poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} callback upon buffers are flushed and transport is paused
         * @api private
         */
        pause(onPause) {
            this.readyState = "pausing";
            const pause = () => {
                this.readyState = "paused";
                onPause();
            };
            if (this.polling || !this.writable) {
                let total = 0;
                if (this.polling) {
                    total++;
                    this.once("pollComplete", function () {
                        --total || pause();
                    });
                }
                if (!this.writable) {
                    total++;
                    this.once("drain", function () {
                        --total || pause();
                    });
                }
            }
            else {
                pause();
            }
        }
        /**
         * Starts polling cycle.
         *
         * @api public
         */
        poll() {
            this.polling = true;
            this.doPoll();
            this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @api private
         */
        onData(data) {
            const callback = packet => {
                // if its the first message we consider the transport open
                if ("opening" === this.readyState && packet.type === "open") {
                    this.onOpen();
                }
                // if its a close packet, we close the ongoing requests
                if ("close" === packet.type) {
                    this.onClose({ description: "transport closed by the server" });
                    return false;
                }
                // otherwise bypass onData and handle the message
                this.onPacket(packet);
            };
            // decode payload
            decodePayload(data, this.socket.binaryType).forEach(callback);
            // if an event did not trigger closing
            if ("closed" !== this.readyState) {
                // if we got data we're not polling
                this.polling = false;
                this.emitReserved("pollComplete");
                if ("open" === this.readyState) {
                    this.poll();
                }
            }
        }
        /**
         * For polling, send a close packet.
         *
         * @api private
         */
        doClose() {
            const close = () => {
                this.write([{ type: "close" }]);
            };
            if ("open" === this.readyState) {
                close();
            }
            else {
                // in case we're trying to close while
                // handshaking is in progress (GH-164)
                this.once("open", close);
            }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} data packets
         * @param {Function} drain callback
         * @api private
         */
        write(packets) {
            this.writable = false;
            encodePayload(packets, data => {
                this.doWrite(data, () => {
                    this.writable = true;
                    this.emitReserved("drain");
                });
            });
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "https" : "http";
            let port = "";
            // cache busting is forced
            if (false !== this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            if (!this.supportsBinary && !query.sid) {
                query.b64 = 1;
            }
            // avoid port if default for schema
            if (this.opts.port &&
                (("https" === schema && Number(this.opts.port) !== 443) ||
                    ("http" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Creates a request.
         *
         * @param {String} method
         * @api private
         */
        request(opts = {}) {
            Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
            return new Request(this.uri(), opts);
        }
        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @api private
         */
        doWrite(data, fn) {
            const req = this.request({
                method: "POST",
                data: data
            });
            req.on("success", fn);
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr post error", xhrStatus, context);
            });
        }
        /**
         * Starts a poll cycle.
         *
         * @api private
         */
        doPoll() {
            const req = this.request();
            req.on("data", this.onData.bind(this));
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr poll error", xhrStatus, context);
            });
            this.pollXhr = req;
        }
    }
    class Request extends Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @api public
         */
        constructor(uri, opts) {
            super();
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.method = opts.method || "GET";
            this.uri = uri;
            this.async = false !== opts.async;
            this.data = undefined !== opts.data ? opts.data : null;
            this.create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @api private
         */
        create() {
            const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
            opts.xdomain = !!this.opts.xd;
            opts.xscheme = !!this.opts.xs;
            const xhr = (this.xhr = new XHR(opts));
            try {
                xhr.open(this.method, this.uri, this.async);
                try {
                    if (this.opts.extraHeaders) {
                        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                        for (let i in this.opts.extraHeaders) {
                            if (this.opts.extraHeaders.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                            }
                        }
                    }
                }
                catch (e) { }
                if ("POST" === this.method) {
                    try {
                        xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    }
                    catch (e) { }
                }
                try {
                    xhr.setRequestHeader("Accept", "*/*");
                }
                catch (e) { }
                // ie6 check
                if ("withCredentials" in xhr) {
                    xhr.withCredentials = this.opts.withCredentials;
                }
                if (this.opts.requestTimeout) {
                    xhr.timeout = this.opts.requestTimeout;
                }
                xhr.onreadystatechange = () => {
                    if (4 !== xhr.readyState)
                        return;
                    if (200 === xhr.status || 1223 === xhr.status) {
                        this.onLoad();
                    }
                    else {
                        // make sure the `error` event handler that's user-set
                        // does not throw in the same tick and gets caught here
                        this.setTimeoutFn(() => {
                            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                        }, 0);
                    }
                };
                xhr.send(this.data);
            }
            catch (e) {
                // Need to defer since .create() is called directly from the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                this.setTimeoutFn(() => {
                    this.onError(e);
                }, 0);
                return;
            }
            if (typeof document !== "undefined") {
                this.index = Request.requestsCount++;
                Request.requests[this.index] = this;
            }
        }
        /**
         * Called upon error.
         *
         * @api private
         */
        onError(err) {
            this.emitReserved("error", err, this.xhr);
            this.cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @api private
         */
        cleanup(fromError) {
            if ("undefined" === typeof this.xhr || null === this.xhr) {
                return;
            }
            this.xhr.onreadystatechange = empty;
            if (fromError) {
                try {
                    this.xhr.abort();
                }
                catch (e) { }
            }
            if (typeof document !== "undefined") {
                delete Request.requests[this.index];
            }
            this.xhr = null;
        }
        /**
         * Called upon load.
         *
         * @api private
         */
        onLoad() {
            const data = this.xhr.responseText;
            if (data !== null) {
                this.emitReserved("data", data);
                this.emitReserved("success");
                this.cleanup();
            }
        }
        /**
         * Aborts the request.
         *
         * @api public
         */
        abort() {
            this.cleanup();
        }
    }
    Request.requestsCount = 0;
    Request.requests = {};
    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */
    if (typeof document !== "undefined") {
        // @ts-ignore
        if (typeof attachEvent === "function") {
            // @ts-ignore
            attachEvent("onunload", unloadHandler);
        }
        else if (typeof addEventListener === "function") {
            const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
            addEventListener(terminationEvent, unloadHandler, false);
        }
    }
    function unloadHandler() {
        for (let i in Request.requests) {
            if (Request.requests.hasOwnProperty(i)) {
                Request.requests[i].abort();
            }
        }
    }

    const nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
            return cb => Promise.resolve().then(cb);
        }
        else {
            return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
    })();
    const WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
    const usingBrowserWebSocket = true;
    const defaultBinaryType = "arraybuffer";

    // detect ReactNative environment
    const isReactNative = typeof navigator !== "undefined" &&
        typeof navigator.product === "string" &&
        navigator.product.toLowerCase() === "reactnative";
    class WS extends Transport {
        /**
         * WebSocket transport constructor.
         *
         * @api {Object} connection options
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Transport name.
         *
         * @api public
         */
        get name() {
            return "websocket";
        }
        /**
         * Opens socket.
         *
         * @api private
         */
        doOpen() {
            if (!this.check()) {
                // let probe timeout
                return;
            }
            const uri = this.uri();
            const protocols = this.opts.protocols;
            // React Native only supports the 'headers' option, and will print a warning if anything else is passed
            const opts = isReactNative
                ? {}
                : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
            if (this.opts.extraHeaders) {
                opts.headers = this.opts.extraHeaders;
            }
            try {
                this.ws =
                    usingBrowserWebSocket && !isReactNative
                        ? protocols
                            ? new WebSocket(uri, protocols)
                            : new WebSocket(uri)
                        : new WebSocket(uri, protocols, opts);
            }
            catch (err) {
                return this.emitReserved("error", err);
            }
            this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
            this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @api private
         */
        addEventListeners() {
            this.ws.onopen = () => {
                if (this.opts.autoUnref) {
                    this.ws._socket.unref();
                }
                this.onOpen();
            };
            this.ws.onclose = closeEvent => this.onClose({
                description: "websocket connection closed",
                context: closeEvent
            });
            this.ws.onmessage = ev => this.onData(ev.data);
            this.ws.onerror = e => this.onError("websocket error", e);
        }
        /**
         * Writes data to socket.
         *
         * @param {Array} array of packets.
         * @api private
         */
        write(packets) {
            this.writable = false;
            // encodePacket efficient as it uses WS framing
            // no need for encodePayload
            for (let i = 0; i < packets.length; i++) {
                const packet = packets[i];
                const lastPacket = i === packets.length - 1;
                encodePacket(packet, this.supportsBinary, data => {
                    // always create a new object (GH-437)
                    const opts = {};
                    // Sometimes the websocket has already been closed but the browser didn't
                    // have a chance of informing us about it yet, in that case send will
                    // throw an error
                    try {
                        if (usingBrowserWebSocket) {
                            // TypeError is thrown when passing the second argument on Safari
                            this.ws.send(data);
                        }
                    }
                    catch (e) {
                    }
                    if (lastPacket) {
                        // fake drain
                        // defer to next tick to allow Socket to clear writeBuffer
                        nextTick(() => {
                            this.writable = true;
                            this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    }
                });
            }
        }
        /**
         * Closes socket.
         *
         * @api private
         */
        doClose() {
            if (typeof this.ws !== "undefined") {
                this.ws.close();
                this.ws = null;
            }
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "wss" : "ws";
            let port = "";
            // avoid port if default for schema
            if (this.opts.port &&
                (("wss" === schema && Number(this.opts.port) !== 443) ||
                    ("ws" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            // append timestamp to URI
            if (this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            // communicate binary support capabilities
            if (!this.supportsBinary) {
                query.b64 = 1;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Feature detection for WebSocket.
         *
         * @return {Boolean} whether this transport is available.
         * @api public
         */
        check() {
            return !!WebSocket;
        }
    }

    const transports = {
        websocket: WS,
        polling: Polling
    };

    // imported from https://github.com/galkn/parseuri
    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */
    const re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    const parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];
    function parse(str) {
        const src = str, b = str.indexOf('['), e = str.indexOf(']');
        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }
        let m = re.exec(str || ''), uri = {}, i = 14;
        while (i--) {
            uri[parts[i]] = m[i] || '';
        }
        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }
        uri.pathNames = pathNames(uri, uri['path']);
        uri.queryKey = queryKey(uri, uri['query']);
        return uri;
    }
    function pathNames(obj, path) {
        const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
        if (path.slice(0, 1) == '/' || path.length === 0) {
            names.splice(0, 1);
        }
        if (path.slice(-1) == '/') {
            names.splice(names.length - 1, 1);
        }
        return names;
    }
    function queryKey(uri, query) {
        const data = {};
        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            if ($1) {
                data[$1] = $2;
            }
        });
        return data;
    }

    class Socket$1 extends Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri or options
         * @param {Object} opts - options
         * @api public
         */
        constructor(uri, opts = {}) {
            super();
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = null;
            }
            if (uri) {
                uri = parse(uri);
                opts.hostname = uri.host;
                opts.secure = uri.protocol === "https" || uri.protocol === "wss";
                opts.port = uri.port;
                if (uri.query)
                    opts.query = uri.query;
            }
            else if (opts.host) {
                opts.hostname = parse(opts.host).host;
            }
            installTimerFunctions(this, opts);
            this.secure =
                null != opts.secure
                    ? opts.secure
                    : typeof location !== "undefined" && "https:" === location.protocol;
            if (opts.hostname && !opts.port) {
                // if no port is specified manually, use the protocol default
                opts.port = this.secure ? "443" : "80";
            }
            this.hostname =
                opts.hostname ||
                    (typeof location !== "undefined" ? location.hostname : "localhost");
            this.port =
                opts.port ||
                    (typeof location !== "undefined" && location.port
                        ? location.port
                        : this.secure
                            ? "443"
                            : "80");
            this.transports = opts.transports || ["polling", "websocket"];
            this.readyState = "";
            this.writeBuffer = [];
            this.prevBufferLen = 0;
            this.opts = Object.assign({
                path: "/engine.io",
                agent: false,
                withCredentials: false,
                upgrade: true,
                timestampParam: "t",
                rememberUpgrade: false,
                rejectUnauthorized: true,
                perMessageDeflate: {
                    threshold: 1024
                },
                transportOptions: {},
                closeOnBeforeunload: true
            }, opts);
            this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
            if (typeof this.opts.query === "string") {
                this.opts.query = decode(this.opts.query);
            }
            // set on handshake
            this.id = null;
            this.upgrades = null;
            this.pingInterval = null;
            this.pingTimeout = null;
            // set on heartbeat
            this.pingTimeoutTimer = null;
            if (typeof addEventListener === "function") {
                if (this.opts.closeOnBeforeunload) {
                    // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                    // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                    // closed/reloaded)
                    this.beforeunloadEventListener = () => {
                        if (this.transport) {
                            // silently close the transport
                            this.transport.removeAllListeners();
                            this.transport.close();
                        }
                    };
                    addEventListener("beforeunload", this.beforeunloadEventListener, false);
                }
                if (this.hostname !== "localhost") {
                    this.offlineEventListener = () => {
                        this.onClose("transport close", {
                            description: "network connection lost"
                        });
                    };
                    addEventListener("offline", this.offlineEventListener, false);
                }
            }
            this.open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} transport name
         * @return {Transport}
         * @api private
         */
        createTransport(name) {
            const query = Object.assign({}, this.opts.query);
            // append engine.io protocol identifier
            query.EIO = protocol$1;
            // transport name
            query.transport = name;
            // session id if we already have one
            if (this.id)
                query.sid = this.id;
            const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
                query,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port
            });
            return new transports[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @api private
         */
        open() {
            let transport;
            if (this.opts.rememberUpgrade &&
                Socket$1.priorWebsocketSuccess &&
                this.transports.indexOf("websocket") !== -1) {
                transport = "websocket";
            }
            else if (0 === this.transports.length) {
                // Emit error on next tick so it can be listened to
                this.setTimeoutFn(() => {
                    this.emitReserved("error", "No transports available");
                }, 0);
                return;
            }
            else {
                transport = this.transports[0];
            }
            this.readyState = "opening";
            // Retry with the next transport if the transport is disabled (jsonp: false)
            try {
                transport = this.createTransport(transport);
            }
            catch (e) {
                this.transports.shift();
                this.open();
                return;
            }
            transport.open();
            this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @api private
         */
        setTransport(transport) {
            if (this.transport) {
                this.transport.removeAllListeners();
            }
            // set up transport
            this.transport = transport;
            // set up transport listeners
            transport
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", reason => this.onClose("transport close", reason));
        }
        /**
         * Probes a transport.
         *
         * @param {String} transport name
         * @api private
         */
        probe(name) {
            let transport = this.createTransport(name);
            let failed = false;
            Socket$1.priorWebsocketSuccess = false;
            const onTransportOpen = () => {
                if (failed)
                    return;
                transport.send([{ type: "ping", data: "probe" }]);
                transport.once("packet", msg => {
                    if (failed)
                        return;
                    if ("pong" === msg.type && "probe" === msg.data) {
                        this.upgrading = true;
                        this.emitReserved("upgrading", transport);
                        if (!transport)
                            return;
                        Socket$1.priorWebsocketSuccess = "websocket" === transport.name;
                        this.transport.pause(() => {
                            if (failed)
                                return;
                            if ("closed" === this.readyState)
                                return;
                            cleanup();
                            this.setTransport(transport);
                            transport.send([{ type: "upgrade" }]);
                            this.emitReserved("upgrade", transport);
                            transport = null;
                            this.upgrading = false;
                            this.flush();
                        });
                    }
                    else {
                        const err = new Error("probe error");
                        // @ts-ignore
                        err.transport = transport.name;
                        this.emitReserved("upgradeError", err);
                    }
                });
            };
            function freezeTransport() {
                if (failed)
                    return;
                // Any callback called by transport should be ignored since now
                failed = true;
                cleanup();
                transport.close();
                transport = null;
            }
            // Handle any error that happens while probing
            const onerror = err => {
                const error = new Error("probe error: " + err);
                // @ts-ignore
                error.transport = transport.name;
                freezeTransport();
                this.emitReserved("upgradeError", error);
            };
            function onTransportClose() {
                onerror("transport closed");
            }
            // When the socket is closed while we're probing
            function onclose() {
                onerror("socket closed");
            }
            // When the socket is upgraded while we're probing
            function onupgrade(to) {
                if (transport && to.name !== transport.name) {
                    freezeTransport();
                }
            }
            // Remove all listeners on the transport and on self
            const cleanup = () => {
                transport.removeListener("open", onTransportOpen);
                transport.removeListener("error", onerror);
                transport.removeListener("close", onTransportClose);
                this.off("close", onclose);
                this.off("upgrading", onupgrade);
            };
            transport.once("open", onTransportOpen);
            transport.once("error", onerror);
            transport.once("close", onTransportClose);
            this.once("close", onclose);
            this.once("upgrading", onupgrade);
            transport.open();
        }
        /**
         * Called when connection is deemed open.
         *
         * @api private
         */
        onOpen() {
            this.readyState = "open";
            Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name;
            this.emitReserved("open");
            this.flush();
            // we check for `readyState` in case an `open`
            // listener already closed the socket
            if ("open" === this.readyState &&
                this.opts.upgrade &&
                this.transport.pause) {
                let i = 0;
                const l = this.upgrades.length;
                for (; i < l; i++) {
                    this.probe(this.upgrades[i]);
                }
            }
        }
        /**
         * Handles a packet.
         *
         * @api private
         */
        onPacket(packet) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                this.emitReserved("packet", packet);
                // Socket is live - any packet counts
                this.emitReserved("heartbeat");
                switch (packet.type) {
                    case "open":
                        this.onHandshake(JSON.parse(packet.data));
                        break;
                    case "ping":
                        this.resetPingTimeout();
                        this.sendPacket("pong");
                        this.emitReserved("ping");
                        this.emitReserved("pong");
                        break;
                    case "error":
                        const err = new Error("server error");
                        // @ts-ignore
                        err.code = packet.data;
                        this.onError(err);
                        break;
                    case "message":
                        this.emitReserved("data", packet.data);
                        this.emitReserved("message", packet.data);
                        break;
                }
            }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @api private
         */
        onHandshake(data) {
            this.emitReserved("handshake", data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.maxPayload = data.maxPayload;
            this.onOpen();
            // In case open handler closes socket
            if ("closed" === this.readyState)
                return;
            this.resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @api private
         */
        resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer);
            this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
            }, this.pingInterval + this.pingTimeout);
            if (this.opts.autoUnref) {
                this.pingTimeoutTimer.unref();
            }
        }
        /**
         * Called on `drain` event
         *
         * @api private
         */
        onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen);
            // setting prevBufferLen = 0 is very important
            // for example, when upgrading, upgrade packet is sent over,
            // and a nonzero prevBufferLen could cause problems on `drain`
            this.prevBufferLen = 0;
            if (0 === this.writeBuffer.length) {
                this.emitReserved("drain");
            }
            else {
                this.flush();
            }
        }
        /**
         * Flush write buffers.
         *
         * @api private
         */
        flush() {
            if ("closed" !== this.readyState &&
                this.transport.writable &&
                !this.upgrading &&
                this.writeBuffer.length) {
                const packets = this.getWritablePackets();
                this.transport.send(packets);
                // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`
                this.prevBufferLen = packets.length;
                this.emitReserved("flush");
            }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        getWritablePackets() {
            const shouldCheckPayloadSize = this.maxPayload &&
                this.transport.name === "polling" &&
                this.writeBuffer.length > 1;
            if (!shouldCheckPayloadSize) {
                return this.writeBuffer;
            }
            let payloadSize = 1; // first packet type
            for (let i = 0; i < this.writeBuffer.length; i++) {
                const data = this.writeBuffer[i].data;
                if (data) {
                    payloadSize += byteLength(data);
                }
                if (i > 0 && payloadSize > this.maxPayload) {
                    return this.writeBuffer.slice(0, i);
                }
                payloadSize += 2; // separator + packet type
            }
            return this.writeBuffer;
        }
        /**
         * Sends a message.
         *
         * @param {String} message.
         * @param {Function} callback function.
         * @param {Object} options.
         * @return {Socket} for chaining.
         * @api public
         */
        write(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        send(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} callback function.
         * @api private
         */
        sendPacket(type, data, options, fn) {
            if ("function" === typeof data) {
                fn = data;
                data = undefined;
            }
            if ("function" === typeof options) {
                fn = options;
                options = null;
            }
            if ("closing" === this.readyState || "closed" === this.readyState) {
                return;
            }
            options = options || {};
            options.compress = false !== options.compress;
            const packet = {
                type: type,
                data: data,
                options: options
            };
            this.emitReserved("packetCreate", packet);
            this.writeBuffer.push(packet);
            if (fn)
                this.once("flush", fn);
            this.flush();
        }
        /**
         * Closes the connection.
         *
         * @api public
         */
        close() {
            const close = () => {
                this.onClose("forced close");
                this.transport.close();
            };
            const cleanupAndClose = () => {
                this.off("upgrade", cleanupAndClose);
                this.off("upgradeError", cleanupAndClose);
                close();
            };
            const waitForUpgrade = () => {
                // wait for upgrade to finish since we can't send packets while pausing a transport
                this.once("upgrade", cleanupAndClose);
                this.once("upgradeError", cleanupAndClose);
            };
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";
                if (this.writeBuffer.length) {
                    this.once("drain", () => {
                        if (this.upgrading) {
                            waitForUpgrade();
                        }
                        else {
                            close();
                        }
                    });
                }
                else if (this.upgrading) {
                    waitForUpgrade();
                }
                else {
                    close();
                }
            }
            return this;
        }
        /**
         * Called upon transport error
         *
         * @api private
         */
        onError(err) {
            Socket$1.priorWebsocketSuccess = false;
            this.emitReserved("error", err);
            this.onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @api private
         */
        onClose(reason, description) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                // clear timers
                this.clearTimeoutFn(this.pingTimeoutTimer);
                // stop event from firing again for transport
                this.transport.removeAllListeners("close");
                // ensure transport won't stay open
                this.transport.close();
                // ignore further transport communication
                this.transport.removeAllListeners();
                if (typeof removeEventListener === "function") {
                    removeEventListener("beforeunload", this.beforeunloadEventListener, false);
                    removeEventListener("offline", this.offlineEventListener, false);
                }
                // set ready state
                this.readyState = "closed";
                // clear session id
                this.id = null;
                // emit close event
                this.emitReserved("close", reason, description);
                // clean buffers after, so users can still
                // grab the buffers on `close` event
                this.writeBuffer = [];
                this.prevBufferLen = 0;
            }
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} server upgrades
         * @api private
         *
         */
        filterUpgrades(upgrades) {
            const filteredUpgrades = [];
            let i = 0;
            const j = upgrades.length;
            for (; i < j; i++) {
                if (~this.transports.indexOf(upgrades[i]))
                    filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
        }
    }
    Socket$1.protocol = protocol$1;

    /**
     * URL parser.
     *
     * @param uri - url
     * @param path - the request path of the connection
     * @param loc - An object meant to mimic window.location.
     *        Defaults to window.location.
     * @public
     */
    function url(uri, path = "", loc) {
        let obj = uri;
        // default to window.location
        loc = loc || (typeof location !== "undefined" && location);
        if (null == uri)
            uri = loc.protocol + "//" + loc.host;
        // relative path support
        if (typeof uri === "string") {
            if ("/" === uri.charAt(0)) {
                if ("/" === uri.charAt(1)) {
                    uri = loc.protocol + uri;
                }
                else {
                    uri = loc.host + uri;
                }
            }
            if (!/^(https?|wss?):\/\//.test(uri)) {
                if ("undefined" !== typeof loc) {
                    uri = loc.protocol + "//" + uri;
                }
                else {
                    uri = "https://" + uri;
                }
            }
            // parse
            obj = parse(uri);
        }
        // make sure we treat `localhost:80` and `localhost` equally
        if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
                obj.port = "80";
            }
            else if (/^(http|ws)s$/.test(obj.protocol)) {
                obj.port = "443";
            }
        }
        obj.path = obj.path || "/";
        const ipv6 = obj.host.indexOf(":") !== -1;
        const host = ipv6 ? "[" + obj.host + "]" : obj.host;
        // define unique id
        obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
        // define href
        obj.href =
            obj.protocol +
                "://" +
                host +
                (loc && loc.port === obj.port ? "" : ":" + obj.port);
        return obj;
    }

    const withNativeArrayBuffer = typeof ArrayBuffer === "function";
    const isView = (obj) => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj.buffer instanceof ArrayBuffer;
    };
    const toString = Object.prototype.toString;
    const withNativeBlob = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            toString.call(Blob) === "[object BlobConstructor]");
    const withNativeFile = typeof File === "function" ||
        (typeof File !== "undefined" &&
            toString.call(File) === "[object FileConstructor]");
    /**
     * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
     *
     * @private
     */
    function isBinary(obj) {
        return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
            (withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File));
    }
    function hasBinary(obj, toJSON) {
        if (!obj || typeof obj !== "object") {
            return false;
        }
        if (Array.isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                if (hasBinary(obj[i])) {
                    return true;
                }
            }
            return false;
        }
        if (isBinary(obj)) {
            return true;
        }
        if (obj.toJSON &&
            typeof obj.toJSON === "function" &&
            arguments.length === 1) {
            return hasBinary(obj.toJSON(), true);
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @public
     */
    function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length; // number of binary 'attachments'
        return { packet: pack, buffers: buffers };
    }
    function _deconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (isBinary(data)) {
            const placeholder = { _placeholder: true, num: buffers.length };
            buffers.push(data);
            return placeholder;
        }
        else if (Array.isArray(data)) {
            const newData = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i], buffers);
            }
            return newData;
        }
        else if (typeof data === "object" && !(data instanceof Date)) {
            const newData = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    newData[key] = _deconstructPacket(data[key], buffers);
                }
            }
            return newData;
        }
        return data;
    }
    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @public
     */
    function reconstructPacket(packet, buffers) {
        packet.data = _reconstructPacket(packet.data, buffers);
        packet.attachments = undefined; // no longer useful
        return packet;
    }
    function _reconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (data && data._placeholder === true) {
            const isIndexValid = typeof data.num === "number" &&
                data.num >= 0 &&
                data.num < buffers.length;
            if (isIndexValid) {
                return buffers[data.num]; // appropriate buffer (should be natural order anyway)
            }
            else {
                throw new Error("illegal attachments");
            }
        }
        else if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i], buffers);
            }
        }
        else if (typeof data === "object") {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    data[key] = _reconstructPacket(data[key], buffers);
                }
            }
        }
        return data;
    }

    /**
     * Protocol version.
     *
     * @public
     */
    const protocol = 5;
    var PacketType;
    (function (PacketType) {
        PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
        PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType[PacketType["EVENT"] = 2] = "EVENT";
        PacketType[PacketType["ACK"] = 3] = "ACK";
        PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
    })(PacketType || (PacketType = {}));
    /**
     * A socket.io Encoder instance
     */
    class Encoder {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
            this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
            if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
                if (hasBinary(obj)) {
                    obj.type =
                        obj.type === PacketType.EVENT
                            ? PacketType.BINARY_EVENT
                            : PacketType.BINARY_ACK;
                    return this.encodeAsBinary(obj);
                }
            }
            return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
            // first is type
            let str = "" + obj.type;
            // attachments if we have them
            if (obj.type === PacketType.BINARY_EVENT ||
                obj.type === PacketType.BINARY_ACK) {
                str += obj.attachments + "-";
            }
            // if we have a namespace other than `/`
            // we append it followed by a comma `,`
            if (obj.nsp && "/" !== obj.nsp) {
                str += obj.nsp + ",";
            }
            // immediately followed by the id
            if (null != obj.id) {
                str += obj.id;
            }
            // json data
            if (null != obj.data) {
                str += JSON.stringify(obj.data, this.replacer);
            }
            return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
            const deconstruction = deconstructPacket(obj);
            const pack = this.encodeAsString(deconstruction.packet);
            const buffers = deconstruction.buffers;
            buffers.unshift(pack); // add packet info to beginning of data list
            return buffers; // write all the buffers
        }
    }
    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     */
    class Decoder extends Emitter {
        /**
         * Decoder constructor
         *
         * @param {function} reviver - custom reviver to pass down to JSON.stringify
         */
        constructor(reviver) {
            super();
            this.reviver = reviver;
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
            let packet;
            if (typeof obj === "string") {
                if (this.reconstructor) {
                    throw new Error("got plaintext data when reconstructing a packet");
                }
                packet = this.decodeString(obj);
                if (packet.type === PacketType.BINARY_EVENT ||
                    packet.type === PacketType.BINARY_ACK) {
                    // binary packet's json
                    this.reconstructor = new BinaryReconstructor(packet);
                    // no attachments, labeled binary but no binary data to follow
                    if (packet.attachments === 0) {
                        super.emitReserved("decoded", packet);
                    }
                }
                else {
                    // non-binary full packet
                    super.emitReserved("decoded", packet);
                }
            }
            else if (isBinary(obj) || obj.base64) {
                // raw binary data
                if (!this.reconstructor) {
                    throw new Error("got binary data when not reconstructing a packet");
                }
                else {
                    packet = this.reconstructor.takeBinaryData(obj);
                    if (packet) {
                        // received final buffer
                        this.reconstructor = null;
                        super.emitReserved("decoded", packet);
                    }
                }
            }
            else {
                throw new Error("Unknown type: " + obj);
            }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
            let i = 0;
            // look up type
            const p = {
                type: Number(str.charAt(0)),
            };
            if (PacketType[p.type] === undefined) {
                throw new Error("unknown packet type " + p.type);
            }
            // look up attachments if type binary
            if (p.type === PacketType.BINARY_EVENT ||
                p.type === PacketType.BINARY_ACK) {
                const start = i + 1;
                while (str.charAt(++i) !== "-" && i != str.length) { }
                const buf = str.substring(start, i);
                if (buf != Number(buf) || str.charAt(i) !== "-") {
                    throw new Error("Illegal attachments");
                }
                p.attachments = Number(buf);
            }
            // look up namespace (if any)
            if ("/" === str.charAt(i + 1)) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if ("," === c)
                        break;
                    if (i === str.length)
                        break;
                }
                p.nsp = str.substring(start, i);
            }
            else {
                p.nsp = "/";
            }
            // look up id
            const next = str.charAt(i + 1);
            if ("" !== next && Number(next) == next) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if (null == c || Number(c) != c) {
                        --i;
                        break;
                    }
                    if (i === str.length)
                        break;
                }
                p.id = Number(str.substring(start, i + 1));
            }
            // look up json data
            if (str.charAt(++i)) {
                const payload = this.tryParse(str.substr(i));
                if (Decoder.isPayloadValid(p.type, payload)) {
                    p.data = payload;
                }
                else {
                    throw new Error("invalid payload");
                }
            }
            return p;
        }
        tryParse(str) {
            try {
                return JSON.parse(str, this.reviver);
            }
            catch (e) {
                return false;
            }
        }
        static isPayloadValid(type, payload) {
            switch (type) {
                case PacketType.CONNECT:
                    return typeof payload === "object";
                case PacketType.DISCONNECT:
                    return payload === undefined;
                case PacketType.CONNECT_ERROR:
                    return typeof payload === "string" || typeof payload === "object";
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    return Array.isArray(payload) && payload.length > 0;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    return Array.isArray(payload);
            }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
            if (this.reconstructor) {
                this.reconstructor.finishedReconstruction();
            }
        }
    }
    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     */
    class BinaryReconstructor {
        constructor(packet) {
            this.packet = packet;
            this.buffers = [];
            this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
            this.buffers.push(binData);
            if (this.buffers.length === this.reconPack.attachments) {
                // done with buffer list
                const packet = reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
            }
            return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
            this.reconPack = null;
            this.buffers = [];
        }
    }

    var parser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        protocol: protocol,
        get PacketType () { return PacketType; },
        Encoder: Encoder,
        Decoder: Decoder
    });

    function on(obj, ev, fn) {
        obj.on(ev, fn);
        return function subDestroy() {
            obj.off(ev, fn);
        };
    }

    /**
     * Internal events.
     * These events can't be emitted by the user.
     */
    const RESERVED_EVENTS = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1,
    });
    /**
     * A Socket is the fundamental class for interacting with the server.
     *
     * A Socket belongs to a certain Namespace (by default /) and uses an underlying {@link Manager} to communicate.
     *
     * @example
     * const socket = io();
     *
     * socket.on("connect", () => {
     *   console.log("connected");
     * });
     *
     * // send an event to the server
     * socket.emit("foo", "bar");
     *
     * socket.on("foobar", () => {
     *   // an event was received from the server
     * });
     *
     * // upon disconnection
     * socket.on("disconnect", (reason) => {
     *   console.log(`disconnected due to ${reason}`);
     * });
     */
    class Socket extends Emitter {
        /**
         * `Socket` constructor.
         */
        constructor(io, nsp, opts) {
            super();
            /**
             * Whether the socket is currently connected to the server.
             *
             * @example
             * const socket = io();
             *
             * socket.on("connect", () => {
             *   console.log(socket.connected); // true
             * });
             *
             * socket.on("disconnect", () => {
             *   console.log(socket.connected); // false
             * });
             */
            this.connected = false;
            /**
             * Buffer for packets received before the CONNECT packet
             */
            this.receiveBuffer = [];
            /**
             * Buffer for packets that will be sent once the socket is connected
             */
            this.sendBuffer = [];
            this.ids = 0;
            this.acks = {};
            this.flags = {};
            this.io = io;
            this.nsp = nsp;
            if (opts && opts.auth) {
                this.auth = opts.auth;
            }
            if (this.io._autoConnect)
                this.open();
        }
        /**
         * Whether the socket is currently disconnected
         *
         * @example
         * const socket = io();
         *
         * socket.on("connect", () => {
         *   console.log(socket.disconnected); // false
         * });
         *
         * socket.on("disconnect", () => {
         *   console.log(socket.disconnected); // true
         * });
         */
        get disconnected() {
            return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
            if (this.subs)
                return;
            const io = this.io;
            this.subs = [
                on(io, "open", this.onopen.bind(this)),
                on(io, "packet", this.onpacket.bind(this)),
                on(io, "error", this.onerror.bind(this)),
                on(io, "close", this.onclose.bind(this)),
            ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects.
         *
         * @example
         * const socket = io();
         *
         * console.log(socket.active); // true
         *
         * socket.on("disconnect", (reason) => {
         *   if (reason === "io server disconnect") {
         *     // the disconnection was initiated by the server, you need to manually reconnect
         *     console.log(socket.active); // false
         *   }
         *   // else the socket will automatically try to reconnect
         *   console.log(socket.active); // true
         * });
         */
        get active() {
            return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @example
         * const socket = io({
         *   autoConnect: false
         * });
         *
         * socket.connect();
         */
        connect() {
            if (this.connected)
                return this;
            this.subEvents();
            if (!this.io["_reconnecting"])
                this.io.open(); // ensure open
            if ("open" === this.io._readyState)
                this.onopen();
            return this;
        }
        /**
         * Alias for {@link connect()}.
         */
        open() {
            return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * This method mimics the WebSocket.send() method.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
         *
         * @example
         * socket.send("hello");
         *
         * // this is equivalent to
         * socket.emit("message", "hello");
         *
         * @return self
         */
        send(...args) {
            args.unshift("message");
            this.emit.apply(this, args);
            return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @example
         * socket.emit("hello", "world");
         *
         * // all serializable datastructures are supported (no need to call JSON.stringify)
         * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
         *
         * // with an acknowledgement from the server
         * socket.emit("hello", "world", (val) => {
         *   // ...
         * });
         *
         * @return self
         */
        emit(ev, ...args) {
            if (RESERVED_EVENTS.hasOwnProperty(ev)) {
                throw new Error('"' + ev.toString() + '" is a reserved event name');
            }
            args.unshift(ev);
            const packet = {
                type: PacketType.EVENT,
                data: args,
            };
            packet.options = {};
            packet.options.compress = this.flags.compress !== false;
            // event ack callback
            if ("function" === typeof args[args.length - 1]) {
                const id = this.ids++;
                const ack = args.pop();
                this._registerAckCallback(id, ack);
                packet.id = id;
            }
            const isTransportWritable = this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable;
            const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
            if (discardPacket) ;
            else if (this.connected) {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            }
            else {
                this.sendBuffer.push(packet);
            }
            this.flags = {};
            return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
            const timeout = this.flags.timeout;
            if (timeout === undefined) {
                this.acks[id] = ack;
                return;
            }
            // @ts-ignore
            const timer = this.io.setTimeoutFn(() => {
                delete this.acks[id];
                for (let i = 0; i < this.sendBuffer.length; i++) {
                    if (this.sendBuffer[i].id === id) {
                        this.sendBuffer.splice(i, 1);
                    }
                }
                ack.call(this, new Error("operation has timed out"));
            }, timeout);
            this.acks[id] = (...args) => {
                // @ts-ignore
                this.io.clearTimeoutFn(timer);
                ack.apply(this, [null, ...args]);
            };
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
            packet.nsp = this.nsp;
            this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
            if (typeof this.auth == "function") {
                this.auth((data) => {
                    this.packet({ type: PacketType.CONNECT, data });
                });
            }
            else {
                this.packet({ type: PacketType.CONNECT, data: this.auth });
            }
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
            if (!this.connected) {
                this.emitReserved("connect_error", err);
            }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
            this.connected = false;
            delete this.id;
            this.emitReserved("disconnect", reason, description);
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
            const sameNamespace = packet.nsp === this.nsp;
            if (!sameNamespace)
                return;
            switch (packet.type) {
                case PacketType.CONNECT:
                    if (packet.data && packet.data.sid) {
                        const id = packet.data.sid;
                        this.onconnect(id);
                    }
                    else {
                        this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    }
                    break;
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    this.onevent(packet);
                    break;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    this.onack(packet);
                    break;
                case PacketType.DISCONNECT:
                    this.ondisconnect();
                    break;
                case PacketType.CONNECT_ERROR:
                    this.destroy();
                    const err = new Error(packet.data.message);
                    // @ts-ignore
                    err.data = packet.data.data;
                    this.emitReserved("connect_error", err);
                    break;
            }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
            const args = packet.data || [];
            if (null != packet.id) {
                args.push(this.ack(packet.id));
            }
            if (this.connected) {
                this.emitEvent(args);
            }
            else {
                this.receiveBuffer.push(Object.freeze(args));
            }
        }
        emitEvent(args) {
            if (this._anyListeners && this._anyListeners.length) {
                const listeners = this._anyListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, args);
                }
            }
            super.emit.apply(this, args);
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
            const self = this;
            let sent = false;
            return function (...args) {
                // prevent double callbacks
                if (sent)
                    return;
                sent = true;
                self.packet({
                    type: PacketType.ACK,
                    id: id,
                    data: args,
                });
            };
        }
        /**
         * Called upon a server acknowlegement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
            const ack = this.acks[packet.id];
            if ("function" === typeof ack) {
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
            }
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id) {
            this.id = id;
            this.connected = true;
            this.emitBuffered();
            this.emitReserved("connect");
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
            this.receiveBuffer.forEach((args) => this.emitEvent(args));
            this.receiveBuffer = [];
            this.sendBuffer.forEach((packet) => {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            });
            this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
            this.destroy();
            this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
            if (this.subs) {
                // clean subscriptions to avoid reconnections
                this.subs.forEach((subDestroy) => subDestroy());
                this.subs = undefined;
            }
            this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually. In that case, the socket will not try to reconnect.
         *
         * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
         *
         * @example
         * const socket = io();
         *
         * socket.on("disconnect", (reason) => {
         *   // console.log(reason); prints "io client disconnect"
         * });
         *
         * socket.disconnect();
         *
         * @return self
         */
        disconnect() {
            if (this.connected) {
                this.packet({ type: PacketType.DISCONNECT });
            }
            // remove socket from pool
            this.destroy();
            if (this.connected) {
                // fire events
                this.onclose("io client disconnect");
            }
            return this;
        }
        /**
         * Alias for {@link disconnect()}.
         *
         * @return self
         */
        close() {
            return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @example
         * socket.compress(false).emit("hello");
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         */
        compress(compress) {
            this.flags.compress = compress;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @example
         * socket.volatile.emit("hello"); // the server may or may not receive it
         *
         * @returns self
         */
        get volatile() {
            this.flags.volatile = true;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * @example
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         *
         * @returns self
         */
        timeout(timeout) {
            this.flags.timeout = timeout;
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @example
         * socket.onAny((event, ...args) => {
         *   console.log(`got ${event}`);
         * });
         *
         * @param listener
         */
        onAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @example
         * socket.prependAny((event, ...args) => {
         *   console.log(`got event ${event}`);
         * });
         *
         * @param listener
         */
        prependAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`got event ${event}`);
         * }
         *
         * socket.onAny(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAny(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAny();
         *
         * @param listener
         */
        offAny(listener) {
            if (!this._anyListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAny() {
            return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        onAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        prependAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`sent event ${event}`);
         * }
         *
         * socket.onAnyOutgoing(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAnyOutgoing(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAnyOutgoing();
         *
         * @param [listener] - the catch-all listener (optional)
         */
        offAnyOutgoing(listener) {
            if (!this._anyOutgoingListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyOutgoingListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyOutgoingListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAnyOutgoing() {
            return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
            if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
                const listeners = this._anyOutgoingListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, packet.data);
                }
            }
        }
    }

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */
    function Backoff(opts) {
        opts = opts || {};
        this.ms = opts.min || 100;
        this.max = opts.max || 10000;
        this.factor = opts.factor || 2;
        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
        this.attempts = 0;
    }
    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */
    Backoff.prototype.duration = function () {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
            var rand = Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
    };
    /**
     * Reset the number of attempts.
     *
     * @api public
     */
    Backoff.prototype.reset = function () {
        this.attempts = 0;
    };
    /**
     * Set the minimum duration
     *
     * @api public
     */
    Backoff.prototype.setMin = function (min) {
        this.ms = min;
    };
    /**
     * Set the maximum duration
     *
     * @api public
     */
    Backoff.prototype.setMax = function (max) {
        this.max = max;
    };
    /**
     * Set the jitter
     *
     * @api public
     */
    Backoff.prototype.setJitter = function (jitter) {
        this.jitter = jitter;
    };

    class Manager extends Emitter {
        constructor(uri, opts) {
            var _a;
            super();
            this.nsps = {};
            this.subs = [];
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = undefined;
            }
            opts = opts || {};
            opts.path = opts.path || "/socket.io";
            this.opts = opts;
            installTimerFunctions(this, opts);
            this.reconnection(opts.reconnection !== false);
            this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
            this.reconnectionDelay(opts.reconnectionDelay || 1000);
            this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
            this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
            this.backoff = new Backoff({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor(),
            });
            this.timeout(null == opts.timeout ? 20000 : opts.timeout);
            this._readyState = "closed";
            this.uri = uri;
            const _parser = opts.parser || parser;
            this.encoder = new _parser.Encoder();
            this.decoder = new _parser.Decoder();
            this._autoConnect = opts.autoConnect !== false;
            if (this._autoConnect)
                this.open();
        }
        reconnection(v) {
            if (!arguments.length)
                return this._reconnection;
            this._reconnection = !!v;
            return this;
        }
        reconnectionAttempts(v) {
            if (v === undefined)
                return this._reconnectionAttempts;
            this._reconnectionAttempts = v;
            return this;
        }
        reconnectionDelay(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelay;
            this._reconnectionDelay = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
            return this;
        }
        randomizationFactor(v) {
            var _a;
            if (v === undefined)
                return this._randomizationFactor;
            this._randomizationFactor = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
            return this;
        }
        reconnectionDelayMax(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelayMax;
            this._reconnectionDelayMax = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
            return this;
        }
        timeout(v) {
            if (!arguments.length)
                return this._timeout;
            this._timeout = v;
            return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
            // Only try to reconnect if it's the first time we're connecting
            if (!this._reconnecting &&
                this._reconnection &&
                this.backoff.attempts === 0) {
                // keeps reconnection from firing twice for the same reconnection loop
                this.reconnect();
            }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
            if (~this._readyState.indexOf("open"))
                return this;
            this.engine = new Socket$1(this.uri, this.opts);
            const socket = this.engine;
            const self = this;
            this._readyState = "opening";
            this.skipReconnect = false;
            // emit `open`
            const openSubDestroy = on(socket, "open", function () {
                self.onopen();
                fn && fn();
            });
            // emit `error`
            const errorSub = on(socket, "error", (err) => {
                self.cleanup();
                self._readyState = "closed";
                this.emitReserved("error", err);
                if (fn) {
                    fn(err);
                }
                else {
                    // Only do this if there is no fn to handle the error
                    self.maybeReconnectOnOpen();
                }
            });
            if (false !== this._timeout) {
                const timeout = this._timeout;
                if (timeout === 0) {
                    openSubDestroy(); // prevents a race condition with the 'open' event
                }
                // set timer
                const timer = this.setTimeoutFn(() => {
                    openSubDestroy();
                    socket.close();
                    // @ts-ignore
                    socket.emit("error", new Error("timeout"));
                }, timeout);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
            this.subs.push(openSubDestroy);
            this.subs.push(errorSub);
            return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
            return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
            // clear old subs
            this.cleanup();
            // mark as open
            this._readyState = "open";
            this.emitReserved("open");
            // add new subs
            const socket = this.engine;
            this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
            this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
            try {
                this.decoder.add(data);
            }
            catch (e) {
                this.onclose("parse error", e);
            }
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
            // the nextTick call prevents an exception in a user-provided event listener from triggering a disconnection due to a "parse error"
            nextTick(() => {
                this.emitReserved("packet", packet);
            }, this.setTimeoutFn);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
            this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
            let socket = this.nsps[nsp];
            if (!socket) {
                socket = new Socket(this, nsp, opts);
                this.nsps[nsp] = socket;
            }
            return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
            const nsps = Object.keys(this.nsps);
            for (const nsp of nsps) {
                const socket = this.nsps[nsp];
                if (socket.active) {
                    return;
                }
            }
            this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
            const encodedPackets = this.encoder.encode(packet);
            for (let i = 0; i < encodedPackets.length; i++) {
                this.engine.write(encodedPackets[i], packet.options);
            }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs.length = 0;
            this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
            this.skipReconnect = true;
            this._reconnecting = false;
            this.onclose("forced close");
            if (this.engine)
                this.engine.close();
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
            return this._close();
        }
        /**
         * Called upon engine close.
         *
         * @private
         */
        onclose(reason, description) {
            this.cleanup();
            this.backoff.reset();
            this._readyState = "closed";
            this.emitReserved("close", reason, description);
            if (this._reconnection && !this.skipReconnect) {
                this.reconnect();
            }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
            if (this._reconnecting || this.skipReconnect)
                return this;
            const self = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) {
                this.backoff.reset();
                this.emitReserved("reconnect_failed");
                this._reconnecting = false;
            }
            else {
                const delay = this.backoff.duration();
                this._reconnecting = true;
                const timer = this.setTimeoutFn(() => {
                    if (self.skipReconnect)
                        return;
                    this.emitReserved("reconnect_attempt", self.backoff.attempts);
                    // check again for the case socket closed in above events
                    if (self.skipReconnect)
                        return;
                    self.open((err) => {
                        if (err) {
                            self._reconnecting = false;
                            self.reconnect();
                            this.emitReserved("reconnect_error", err);
                        }
                        else {
                            self.onreconnect();
                        }
                    });
                }, delay);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
            const attempt = this.backoff.attempts;
            this._reconnecting = false;
            this.backoff.reset();
            this.emitReserved("reconnect", attempt);
        }
    }

    /**
     * Managers cache.
     */
    const cache = {};
    function lookup(uri, opts) {
        if (typeof uri === "object") {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        const parsed = url(uri, opts.path || "/socket.io");
        const source = parsed.source;
        const id = parsed.id;
        const path = parsed.path;
        const sameNamespace = cache[id] && path in cache[id]["nsps"];
        const newConnection = opts.forceNew ||
            opts["force new connection"] ||
            false === opts.multiplex ||
            sameNamespace;
        let io;
        if (newConnection) {
            io = new Manager(source, opts);
        }
        else {
            if (!cache[id]) {
                cache[id] = new Manager(source, opts);
            }
            io = cache[id];
        }
        if (parsed.query && !opts.query) {
            opts.query = parsed.queryKey;
        }
        return io.socket(parsed.path, opts);
    }
    // so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
    // namespace (e.g. `io.connect(...)`), for backward compatibility
    Object.assign(lookup, {
        Manager,
        Socket,
        io: lookup,
        connect: lookup,
    });

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/components/content/chat/chat.svelte generated by Svelte v3.48.0 */
    const file$5 = "src/components/content/chat/chat.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	child_ctx[33] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    // (160:16) {#each messages as msgObject}
    function create_each_block_2(ctx) {
    	let div3;
    	let user;
    	let t0;
    	let div2;
    	let div0;
    	let h3;
    	let p0;
    	let t1_value = /*msgObject*/ ctx[34][0] + "";
    	let t1;
    	let t2;
    	let div1;
    	let p1;
    	let t3_value = /*msgObject*/ ctx[34][2] + "";
    	let t3;
    	let t4;
    	let current;

    	user = new User({
    			props: {
    				pfp: /*msgObject*/ ctx[34][1],
    				alt: "userpfp"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(user.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(p0, "class", "svelte-ar8tbf");
    			add_location(p0, file$5, 167, 36, 4838);
    			attr_dev(h3, "class", "chat-body-messages-item-content-header-name svelte-ar8tbf");
    			add_location(h3, file$5, 164, 32, 4676);
    			attr_dev(div0, "class", "chat-body-messages-item-content-header svelte-ar8tbf");
    			add_location(div0, file$5, 163, 28, 4591);
    			attr_dev(p1, "class", "svelte-ar8tbf");
    			add_location(p1, file$5, 171, 32, 5044);
    			attr_dev(div1, "class", "chat-body-messages-item-content-body svelte-ar8tbf");
    			add_location(div1, file$5, 170, 28, 4961);
    			attr_dev(div2, "class", "chat-body-messages-item-content svelte-ar8tbf");
    			add_location(div2, file$5, 162, 24, 4517);
    			attr_dev(div3, "class", "chat-body-messages-item svelte-ar8tbf");
    			add_location(div3, file$5, 160, 20, 4389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(user, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(h3, p0);
    			append_dev(p0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t3);
    			append_dev(div3, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const user_changes = {};
    			if (dirty[0] & /*messages*/ 2) user_changes.pfp = /*msgObject*/ ctx[34][1];
    			user.$set(user_changes);
    			if ((!current || dirty[0] & /*messages*/ 2) && t1_value !== (t1_value = /*msgObject*/ ctx[34][0] + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*messages*/ 2) && t3_value !== (t3_value = /*msgObject*/ ctx[34][2] + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(user);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(160:16) {#each messages as msgObject}",
    		ctx
    	});

    	return block;
    }

    // (215:12) {#if isSet}
    function create_if_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*modalOpen*/ ctx[6] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*modalOpen*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*modalOpen*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(215:12) {#if isSet}",
    		ctx
    	});

    	return block;
    }

    // (216:16) {#if modalOpen}
    function create_if_block_1(ctx) {
    	let div1;
    	let header;
    	let t0;
    	let div0;
    	let t2;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*setIcons*/ ctx[10];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*emojis*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			header = element("header");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "X";
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "id", "closer-icon");
    			attr_dev(div0, "class", "svelte-ar8tbf");
    			add_location(div0, file$5, 221, 32, 7028);
    			attr_dev(header, "class", "svelte-ar8tbf");
    			add_location(header, file$5, 217, 24, 6783);
    			attr_dev(div1, "id", "emoji-cont");
    			attr_dev(div1, "class", "svelte-ar8tbf");
    			add_location(div1, file$5, 216, 20, 6709);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(header, null);
    			}

    			append_dev(header, t0);
    			append_dev(header, div0);
    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chooseEmojiSet, setIcons*/ 1536) {
    				each_value_1 = /*setIcons*/ ctx[10];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(header, t0);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*addEmoji, emojis*/ 4097) {
    				each_value = /*emojis*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -30 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -30 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(216:16) {#if modalOpen}",
    		ctx
    	});

    	return block;
    }

    // (219:28) {#each setIcons as icon, i}
    function create_each_block_1(ctx) {
    	let div;
    	let t_value = String.fromCodePoint(/*icon*/ ctx[31]) + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "data-id", /*i*/ ctx[33]);
    			attr_dev(div, "class", "svelte-ar8tbf");
    			add_location(div, file$5, 219, 32, 6880);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*chooseEmojiSet*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(219:28) {#each setIcons as icon, i}",
    		ctx
    	});

    	return block;
    }

    // (225:24) {#each emojis as emoji}
    function create_each_block(ctx) {
    	let span;
    	let t_value = /*emoji*/ ctx[28] + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-ar8tbf");
    			add_location(span, file$5, 225, 28, 7204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*addEmoji*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*emojis*/ 1 && t_value !== (t_value = /*emoji*/ ctx[28] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(225:24) {#each emojis as emoji}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div7;
    	let div1;
    	let h3;
    	let t3;
    	let div0;
    	let t4;
    	let p;
    	let t6;
    	let hr;
    	let t7;
    	let div6;
    	let div2;
    	let t8;
    	let div3;
    	let input0;
    	let t9;
    	let input1;
    	let t10;
    	let button0;
    	let t11;
    	let div5;
    	let input2;
    	let t12;
    	let div4;
    	let t14;
    	let button1;
    	let t15;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*messages*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*isSet*/ ctx[5] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div7 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "# Chatting";
    			t3 = space();
    			div0 = element("div");
    			t4 = space();
    			p = element("p");
    			p.textContent = "Poggies";
    			t6 = space();
    			hr = element("hr");
    			t7 = space();
    			div6 = element("div");
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			button0 = element("button");
    			t11 = space();
    			div5 = element("div");
    			input2 = element("input");
    			t12 = space();
    			div4 = element("div");
    			div4.textContent = `${/*emojiIcon*/ ctx[11]}`;
    			t14 = space();
    			button1 = element("button");
    			t15 = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-ar8tbf");
    			add_location(script, file$5, 141, 4, 3738);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-ar8tbf");
    			add_location(meta, file$5, 145, 4, 3853);
    			attr_dev(h3, "class", "channel-name  svelte-ar8tbf");
    			add_location(h3, file$5, 152, 12, 4095);
    			attr_dev(div0, "class", "vl svelte-ar8tbf");
    			add_location(div0, file$5, 153, 12, 4149);
    			attr_dev(p, "class", "channel-info svelte-ar8tbf");
    			add_location(p, file$5, 154, 12, 4180);
    			attr_dev(div1, "class", "top-nav svelte-ar8tbf");
    			add_location(div1, file$5, 151, 8, 4061);
    			attr_dev(hr, "class", "svelte-ar8tbf");
    			add_location(hr, file$5, 156, 8, 4239);
    			attr_dev(div2, "class", "chat-body-messages svelte-ar8tbf");
    			add_location(div2, file$5, 158, 12, 4290);
    			attr_dev(input0, "class", "userinfo-input-username svelte-ar8tbf");
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Username");
    			attr_dev(input0, "maxlength", "15");
    			add_location(input0, file$5, 178, 16, 5259);
    			attr_dev(input1, "class", "userinfo-input-pfp svelte-ar8tbf");
    			attr_dev(input1, "id", "userpfp");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "User PFP");
    			add_location(input1, file$5, 186, 16, 5539);
    			attr_dev(button0, "class", "userinfo-input-button fa fa-check svelte-ar8tbf");
    			add_location(button0, file$5, 193, 16, 5777);
    			attr_dev(div3, "class", "userinfo-input svelte-ar8tbf");
    			add_location(div3, file$5, 177, 12, 5214);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "chat-input-text svelte-ar8tbf");
    			attr_dev(input2, "placeholder", "Type a message");
    			attr_dev(input2, "maxlength", "50");
    			add_location(input2, file$5, 199, 16, 6002);
    			attr_dev(div4, "class", "chat-input-emotes svelte-ar8tbf");
    			attr_dev(div4, "id", "emoji-opener-icon");
    			add_location(div4, file$5, 208, 16, 6359);
    			attr_dev(button1, "class", "chat-input-send fas fa-paper-plane svelte-ar8tbf");
    			add_location(button1, file$5, 209, 16, 6481);
    			attr_dev(div5, "class", "chat-input svelte-ar8tbf");
    			attr_dev(div5, "id", "btn-emoji-icon-cont");
    			add_location(div5, file$5, 198, 12, 5936);
    			attr_dev(div6, "class", "chat-body svelte-ar8tbf");
    			add_location(div6, file$5, 157, 8, 4254);
    			attr_dev(div7, "class", "mainarea svelte-ar8tbf");
    			add_location(div7, file$5, 146, 4, 3928);
    			attr_dev(main, "class", "svelte-ar8tbf");
    			add_location(main, file$5, 140, 0, 3727);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, script);
    			append_dev(main, t0);
    			append_dev(main, meta);
    			append_dev(main, t1);
    			append_dev(main, div7);
    			append_dev(div7, div1);
    			append_dev(div1, h3);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(div7, t6);
    			append_dev(div7, hr);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div6, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div6, t8);
    			append_dev(div6, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*username*/ ctx[3]);
    			append_dev(div3, t9);
    			append_dev(div3, input1);
    			set_input_value(input1, /*userpfp*/ ctx[4]);
    			append_dev(div3, t10);
    			append_dev(div3, button0);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, input2);
    			/*input2_binding*/ ctx[20](input2);
    			set_input_value(input2, /*message*/ ctx[2]);
    			append_dev(div5, t12);
    			append_dev(div5, div4);
    			append_dev(div5, t14);
    			append_dev(div5, button1);
    			append_dev(div6, t15);
    			if (if_block) if_block.m(div6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[18]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[19]),
    					listen_dev(button0, "click", /*setInfo*/ ctx[14], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(div4, "click", /*click_handler*/ ctx[22], false, false, false),
    					listen_dev(button1, "click", /*sendMessage*/ ctx[13], false, false, false),
    					action_destroyer(swipe.call(null, div7, { timeframe: 500, minSwipeDistance: 0.5 })),
    					listen_dev(div7, "swipe", /*handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*messages*/ 2) {
    				each_value_2 = /*messages*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*username*/ 8 && input0.value !== /*username*/ ctx[3]) {
    				set_input_value(input0, /*username*/ ctx[3]);
    			}

    			if (dirty[0] & /*userpfp*/ 16 && input1.value !== /*userpfp*/ ctx[4]) {
    				set_input_value(input1, /*userpfp*/ ctx[4]);
    			}

    			if (dirty[0] & /*message*/ 4 && input2.value !== /*message*/ ctx[2]) {
    				set_input_value(input2, /*message*/ ctx[2]);
    			}

    			if (/*isSet*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isSet*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div6, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			/*input2_binding*/ ctx[20](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$2 = "50px";

    function scrollToBottom() {
    	const el = document.querySelector(".chat-body");
    	el.scrollTop = el.scrollHeight;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let min;
    	let max;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chat', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 2000) {
    			if (direction == "left" && document.querySelector(".categories").style.opacity != "0") {
    				closeNav$e();
    			}
    		}
    	}

    	const socket = lookup("https://kurchat.kurizu.repl.co");
    	let messages = [];
    	let message = "";
    	let username = "";
    	let userpfp = "";
    	let isSet = false;

    	socket.on("chat message", (user, userpfp, msg) => {
    		let info = [user, userpfp, msg];
    		$$invalidate(1, messages = [...messages, info]);

    		// console.log(messages);
    		setTimeout(
    			() => {
    				scrollToBottom();
    			},
    			10
    		);
    	});

    	socket.on('previous messages', msgs => {
    		$$invalidate(1, messages = msgs);

    		setTimeout(
    			() => {
    				scrollToBottom();
    			},
    			10
    		);
    	});

    	let emojiSets = [
    		{
    			type: "faces",
    			minVal: 128512,
    			maxVal: 128580
    		},
    		{
    			type: "faces2",
    			minVal: 129296,
    			maxVal: 129327
    		},
    		{
    			type: "body",
    			minVal: 128066,
    			maxVal: 128080
    		},
    		{
    			type: "animals",
    			minVal: 129408,
    			maxVal: 129442
    		},
    		{
    			type: "transport",
    			minVal: 128640,
    			maxVal: 128676
    		},
    		{
    			type: "misc",
    			minVal: 129494,
    			maxVal: 129535
    		}
    	];

    	let selectedSet = 0;
    	let emojis = [];
    	const clearEmojiMenu = () => $$invalidate(0, emojis = []);

    	const chooseEmojiSet = e => {
    		$$invalidate(15, selectedSet = Number(e.target.dataset.id));
    		clearEmojiMenu();
    	};

    	let setIcons = [128512, 129313, 128074, 129417, 128664, 129504];
    	let emojiIcon = String.fromCodePoint(128571);
    	let modalOpen = false;
    	let textBox; // for bind:this

    	const addEmoji = e => {
    		$$invalidate(2, message += e.target.textContent);
    	};

    	function sendMessage() {
    		if (!isSet) {
    			alert("Please set a username");
    			$$invalidate(2, message = "");
    			return;
    		}

    		let user = document.getElementById("username").value;
    		let userpfp = document.getElementById("userpfp").value;

    		if (userpfp == "") {
    			userpfp = "https://theserialbinger.com/wp-content/uploads/2022/06/Anya-1024x1024.jpg";
    		}

    		if (message == "") {
    			alert("Please enter a message");
    		} else if (message.match(/^[ ]/)) {
    			alert("Please enter a valid message");
    			$$invalidate(2, message = "");
    		} else {
    			socket.emit("chat message", user, userpfp, message);

    			// console.log(`The message: (${message}) has been sent.`);	
    			$$invalidate(7, textBox.value = "", textBox);

    			$$invalidate(2, message = "");
    			$$invalidate(6, modalOpen = false);
    		}
    	}

    	function setInfo() {
    		if (username != "") {
    			let userdiv = document.querySelector(".userinfo-input");
    			userdiv.style.opacity = 0;
    			userdiv.style.display = "none";
    			$$invalidate(5, isSet = true);
    		} else {
    			alert("Please enter a username");
    		}
    	}

    	setTimeout(
    		() => {
    			document.querySelector(".chat-input-text").addEventListener("keydown", e => {
    				if (e.key == "Enter") {
    					sendMessage();
    				}
    			});
    		},
    		1000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chat> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(3, username);
    	}

    	function input1_input_handler() {
    		userpfp = this.value;
    		$$invalidate(4, userpfp);
    	}

    	function input2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textBox = $$value;
    			$$invalidate(7, textBox);
    		});
    	}

    	function input2_input_handler() {
    		message = this.value;
    		$$invalidate(2, message);
    	}

    	const click_handler = () => $$invalidate(6, modalOpen = true);
    	const click_handler_1 = () => $$invalidate(6, modalOpen = false);

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$2,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler,
    		io: lookup,
    		socket,
    		messages,
    		message,
    		username,
    		userpfp,
    		isSet,
    		scrollToBottom,
    		fly,
    		emojiSets,
    		selectedSet,
    		emojis,
    		clearEmojiMenu,
    		chooseEmojiSet,
    		setIcons,
    		emojiIcon,
    		modalOpen,
    		textBox,
    		addEmoji,
    		sendMessage,
    		setInfo,
    		max,
    		min
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    		if ('messages' in $$props) $$invalidate(1, messages = $$props.messages);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    		if ('username' in $$props) $$invalidate(3, username = $$props.username);
    		if ('userpfp' in $$props) $$invalidate(4, userpfp = $$props.userpfp);
    		if ('isSet' in $$props) $$invalidate(5, isSet = $$props.isSet);
    		if ('emojiSets' in $$props) $$invalidate(26, emojiSets = $$props.emojiSets);
    		if ('selectedSet' in $$props) $$invalidate(15, selectedSet = $$props.selectedSet);
    		if ('emojis' in $$props) $$invalidate(0, emojis = $$props.emojis);
    		if ('setIcons' in $$props) $$invalidate(10, setIcons = $$props.setIcons);
    		if ('emojiIcon' in $$props) $$invalidate(11, emojiIcon = $$props.emojiIcon);
    		if ('modalOpen' in $$props) $$invalidate(6, modalOpen = $$props.modalOpen);
    		if ('textBox' in $$props) $$invalidate(7, textBox = $$props.textBox);
    		if ('max' in $$props) $$invalidate(16, max = $$props.max);
    		if ('min' in $$props) $$invalidate(17, min = $$props.min);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*selectedSet*/ 32768) {
    			$$invalidate(17, min = emojiSets[selectedSet].minVal);
    		}

    		if ($$self.$$.dirty[0] & /*selectedSet*/ 32768) {
    			$$invalidate(16, max = emojiSets[selectedSet].maxVal);
    		}

    		if ($$self.$$.dirty[0] & /*min, max, emojis*/ 196609) {
    			for (let i = min; i <= max; i++) {
    				$$invalidate(0, emojis = [...emojis, String.fromCodePoint(i)]);
    			}
    		}
    	};

    	return [
    		emojis,
    		messages,
    		message,
    		username,
    		userpfp,
    		isSet,
    		modalOpen,
    		textBox,
    		handler,
    		chooseEmojiSet,
    		setIcons,
    		emojiIcon,
    		addEmoji,
    		sendMessage,
    		setInfo,
    		selectedSet,
    		max,
    		min,
    		input0_input_handler,
    		input1_input_handler,
    		input2_binding,
    		input2_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Chat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/content/chat/chatRoute.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/components/content/chat/chatRoute.svelte";

    // (10:4) <Route path="/chat">
    function create_default_slot$1(ctx) {
    	let chatcn;
    	let t;
    	let chat;
    	let current;
    	chatcn = new Chat_cn({ $$inline: true });
    	chat = new Chat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(chatcn.$$.fragment);
    			t = space();
    			create_component(chat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chatcn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(chat, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chatcn.$$.fragment, local);
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chatcn.$$.fragment, local);
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chatcn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(chat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(10:4) <Route path=\\\"/chat\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: "/chat",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route.$$.fragment);
    			add_location(main, file$4, 8, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChatRoute', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChatRoute> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Route, ChatCn: Chat_cn, Chat });
    	return [];
    }

    class ChatRoute extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChatRoute",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/channels/home/about-cn.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/components/channels/home/about-cn.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let script;
    	let script_src_value;
    	let t0;
    	let meta;
    	let t1;
    	let div4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let h3;
    	let t4;
    	let span;
    	let t6;
    	let hr0;
    	let t7;
    	let div3;
    	let details;
    	let summary;
    	let t9;
    	let hr1;
    	let t10;
    	let div2;
    	let button0;
    	let a0;
    	let t12;
    	let button1;
    	let a1;
    	let t14;
    	let br0;
    	let t15;
    	let projects;
    	let t16;
    	let br1;
    	let t17;
    	let links;
    	let current;
    	let mounted;
    	let dispose;
    	projects = new Projects({ $$inline: true });
    	links = new Other({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			script = element("script");
    			t0 = space();
    			meta = element("meta");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Kurizu";
    			t4 = space();
    			span = element("span");
    			span.textContent = "×";
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Home";
    			t9 = space();
    			hr1 = element("hr");
    			t10 = space();
    			div2 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "# Home";
    			t12 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "# About me";
    			t14 = space();
    			br0 = element("br");
    			t15 = space();
    			create_component(projects.$$.fragment);
    			t16 = space();
    			br1 = element("br");
    			t17 = space();
    			create_component(links.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://kit.fontawesome.com/8dc570c5d4.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "crossorigin", "anonymous");
    			attr_dev(script, "class", "svelte-133izo4");
    			add_location(script, file$3, 34, 4, 996);
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			attr_dev(meta, "class", "svelte-133izo4");
    			add_location(meta, file$3, 35, 4, 1090);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/977949070893125632/1010593053410599064/banner.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-133izo4");
    			add_location(img, file$3, 39, 16, 1353);
    			attr_dev(h3, "class", "server-name-on-template svelte-133izo4");
    			add_location(h3, file$3, 45, 16, 1602);
    			attr_dev(span, "class", "close-btn svelte-133izo4");
    			add_location(span, file$3, 46, 16, 1666);
    			attr_dev(div0, "class", "server-template-icon svelte-133izo4");
    			add_location(div0, file$3, 38, 12, 1302);
    			attr_dev(hr0, "class", "svelte-133izo4");
    			add_location(hr0, file$3, 48, 12, 1758);
    			attr_dev(div1, "class", "svelte-133izo4");
    			add_location(div1, file$3, 37, 8, 1284);
    			attr_dev(summary, "class", "svelte-133izo4");
    			add_location(summary, file$3, 52, 16, 1869);
    			attr_dev(hr1, "width", "50%");
    			attr_dev(hr1, "class", "svelte-133izo4");
    			add_location(hr1, file$3, 53, 16, 1909);
    			attr_dev(a0, "class", "home-cn svelte-133izo4");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$3, 56, 24, 2044);
    			attr_dev(button0, "class", "channelbtn svelte-133izo4");
    			add_location(button0, file$3, 55, 20, 1992);
    			attr_dev(a1, "class", "about-cn svelte-133izo4");
    			attr_dev(a1, "href", "/about");
    			add_location(a1, file$3, 59, 24, 2185);
    			attr_dev(button1, "class", "channelbtn svelte-133izo4");
    			add_location(button1, file$3, 58, 20, 2133);
    			attr_dev(div2, "class", "channels-list svelte-133izo4");
    			add_location(div2, file$3, 54, 16, 1944);
    			attr_dev(details, "class", "home svelte-133izo4");
    			details.open = true;
    			add_location(details, file$3, 51, 12, 1825);
    			attr_dev(br0, "class", "svelte-133izo4");
    			add_location(br0, file$3, 63, 12, 2322);
    			attr_dev(br1, "class", "svelte-133izo4");
    			add_location(br1, file$3, 65, 12, 2366);
    			attr_dev(div3, "class", "categories svelte-133izo4");
    			add_location(div3, file$3, 50, 8, 1788);
    			attr_dev(div4, "class", "channels svelte-133izo4");
    			attr_dev(div4, "id", "mySidenav");
    			add_location(div4, file$3, 36, 4, 1165);
    			attr_dev(main, "class", "svelte-133izo4");
    			add_location(main, file$3, 33, 0, 985);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, script);
    			append_dev(main, t0);
    			append_dev(main, meta);
    			append_dev(main, t1);
    			append_dev(main, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t2);
    			append_dev(div0, h3);
    			append_dev(div0, t4);
    			append_dev(div0, span);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, details);
    			append_dev(details, summary);
    			append_dev(details, t9);
    			append_dev(details, hr1);
    			append_dev(details, t10);
    			append_dev(details, div2);
    			append_dev(div2, button0);
    			append_dev(button0, a0);
    			append_dev(div2, t12);
    			append_dev(div2, button1);
    			append_dev(button1, a1);
    			append_dev(div3, t14);
    			append_dev(div3, br0);
    			append_dev(div3, t15);
    			mount_component(projects, div3, null);
    			append_dev(div3, t16);
    			append_dev(div3, br1);
    			append_dev(div3, t17);
    			mount_component(links, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", closeNav, false, false, false),
    					action_destroyer(swipe.call(null, div4, { timeframe: 300, minSwipeDistance: 0.1 })),
    					listen_dev(div4, "swipe", /*handler*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(projects);
    			destroy_component(links);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function closeNav() {
    	document.getElementById("mySidenav").style.width = "0";
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "0";
    }

    function openNav() {
    	document.getElementById("mySidenav").style.width = null;
    	document.getElementById("mySidenav").style.transition = "width 0.5s";
    	document.querySelector(".categories").style.opacity = "1";
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About_cn', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav();
    			} else if (direction == "right") {
    				openNav();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About_cn> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		Links: Other,
    		closeNav,
    		openNav,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [closeNav, handler, openNav];
    }

    class About_cn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { closeNav: 0, openNav: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About_cn",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get closeNav() {
    		return closeNav;
    	}

    	set closeNav(value) {
    		throw new Error("<About_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openNav() {
    		return openNav;
    	}

    	set openNav(value) {
    		throw new Error("<About_cn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/content/home/home.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/components/content/home/home.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let span;
    	let t11;
    	let br0;
    	let t12;
    	let br1;
    	let t13;
    	let br2;
    	let t14;
    	let a0;
    	let t16;
    	let br3;
    	let t17;
    	let br4;
    	let t18;
    	let div9;
    	let user1;
    	let t19;
    	let div8;
    	let div6;
    	let h32;
    	let t21;
    	let div7;
    	let p2;
    	let t22;
    	let br5;
    	let t23;
    	let br6;
    	let t24;
    	let br7;
    	let t25;
    	let a1;
    	let t27;
    	let br8;
    	let t28;
    	let br9;
    	let t29;
    	let br10;
    	let t30;
    	let br11;
    	let t31;
    	let br12;
    	let t32;
    	let img;
    	let img_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# Kurizu's Page";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Kurizu Home page";
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Oi mate ! I'm ");
    			span = element("span");
    			span.textContent = "Kurizu";
    			t11 = text("\n                                and this is my website showcasing my projects and\n                                links to my social media accounts ! ");
    			br0 = element("br");
    			t12 = text("\n                                As you might have already noticed this website looks\n                                similar to the discord application and thats what\n                                i was aiming for. ");
    			br1 = element("br");
    			t13 = space();
    			br2 = element("br");
    			t14 = text("\n                                It is completely made using\n                                ");
    			a0 = element("a");
    			a0.textContent = "Svelte";
    			t16 = text("\n                                ! ");
    			br3 = element("br");
    			t17 = text("\n                                The site has a lot of unfinished features but we\n                                will get there soon ! ");
    			br4 = element("br");
    			t18 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t19 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t21 = space();
    			div7 = element("div");
    			p2 = element("p");
    			t22 = text("Oh btw ! ");
    			br5 = element("br");
    			t23 = text("\n                                Click on the respective channels if u want to see\n                                some of my projects or just random blogs !\n                                ");
    			br6 = element("br");
    			t24 = space();
    			br7 = element("br");
    			t25 = text("\n\n                                If you want the code for this website here's the\n                                link :-\n                                ");
    			a1 = element("a");
    			a1.textContent = "https://github.com/crizmo/kurizu-dev";
    			t27 = space();
    			br8 = element("br");
    			t28 = space();
    			br9 = element("br");
    			t29 = text("\n                                I hope you like it and if you have any suggestions\n                                or feedback feel free to contact me on discord /\n                                instagram / github ");
    			br10 = element("br");
    			t30 = text("\n                                Thank you for checking out my website ! ");
    			br11 = element("br");
    			t31 = space();
    			br12 = element("br");
    			t32 = space();
    			img = element("img");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$2, 29, 12, 707);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$2, 30, 12, 765);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$2, 31, 12, 796);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$2, 28, 8, 673);
    			attr_dev(hr, "class", "channel-division");
    			add_location(hr, file$2, 34, 8, 944);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$2, 41, 28, 1307);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$2, 40, 24, 1226);
    			set_style(span, "color", "aqua");
    			add_location(span, file$2, 49, 46, 1682);
    			add_location(br0, file$2, 53, 68, 1943);
    			add_location(br1, file$2, 56, 50, 2167);
    			add_location(br2, file$2, 56, 57, 2174);
    			attr_dev(a0, "href", "https://svelte.dev/");
    			attr_dev(a0, "class", "svelte-gvg60e");
    			add_location(a0, file$2, 58, 32, 2273);
    			add_location(br3, file$2, 59, 34, 2348);
    			add_location(br4, file$2, 61, 54, 2490);
    			add_location(p1, file$2, 48, 28, 1632);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$2, 47, 24, 1553);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$2, 39, 20, 1156);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$2, 37, 16, 1069);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$2, 70, 28, 2865);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$2, 69, 24, 2784);
    			add_location(br5, file$2, 78, 41, 3235);
    			add_location(br6, file$2, 81, 32, 3431);
    			add_location(br7, file$2, 81, 39, 3438);
    			attr_dev(a1, "href", "https://github.com/crizmo/kurizu-dev");
    			attr_dev(a1, "class", "svelte-gvg60e");
    			add_location(a1, file$2, 85, 32, 3599);
    			add_location(br8, file$2, 87, 34, 3757);
    			add_location(br9, file$2, 87, 41, 3764);
    			add_location(br10, file$2, 90, 51, 3986);
    			add_location(br11, file$2, 91, 72, 4065);
    			add_location(br12, file$2, 92, 32, 4104);
    			attr_dev(img, "class", "msg-img");
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.discordapp.com/attachments/970974282681307187/980030164719263754/green-grass.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "hi");
    			attr_dev(img, "width", "60%");
    			attr_dev(img, "height", "auto");
    			add_location(img, file$2, 93, 32, 4143);
    			add_location(p2, file$2, 77, 28, 3190);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$2, 76, 24, 3111);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$2, 68, 20, 2714);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$2, 66, 16, 2627);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$2, 36, 12, 1020);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$2, 35, 8, 984);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$2, 23, 4, 540);
    			attr_dev(main, "class", "svelte-gvg60e");
    			add_location(main, file$2, 22, 0, 529);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, span);
    			append_dev(p1, t11);
    			append_dev(p1, br0);
    			append_dev(p1, t12);
    			append_dev(p1, br1);
    			append_dev(p1, t13);
    			append_dev(p1, br2);
    			append_dev(p1, t14);
    			append_dev(p1, a0);
    			append_dev(p1, t16);
    			append_dev(p1, br3);
    			append_dev(p1, t17);
    			append_dev(p1, br4);
    			append_dev(div10, t18);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t19);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t21);
    			append_dev(div8, div7);
    			append_dev(div7, p2);
    			append_dev(p2, t22);
    			append_dev(p2, br5);
    			append_dev(p2, t23);
    			append_dev(p2, br6);
    			append_dev(p2, t24);
    			append_dev(p2, br7);
    			append_dev(p2, t25);
    			append_dev(p2, a1);
    			append_dev(p2, t27);
    			append_dev(p2, br8);
    			append_dev(p2, t28);
    			append_dev(p2, br9);
    			append_dev(p2, t29);
    			append_dev(p2, br10);
    			append_dev(p2, t30);
    			append_dev(p2, br11);
    			append_dev(p2, t31);
    			append_dev(p2, br12);
    			append_dev(p2, t32);
    			append_dev(p2, img);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth$1 = "50px";

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth: serverWidth$1,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/content/home/about.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/components/content/home/about.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div12;
    	let div1;
    	let h30;
    	let t1;
    	let div0;
    	let t2;
    	let p0;
    	let t4;
    	let hr0;
    	let t5;
    	let div11;
    	let div10;
    	let div5;
    	let user0;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t8;
    	let div3;
    	let p1;
    	let t9;
    	let br0;
    	let t10;
    	let br1;
    	let t11;
    	let br2;
    	let t12;
    	let br3;
    	let t13;
    	let br4;
    	let t14;
    	let br5;
    	let t15;
    	let br6;
    	let t16;
    	let br7;
    	let t17;
    	let a;
    	let t19;
    	let hr1;
    	let t20;
    	let p2;
    	let t21;
    	let br8;
    	let t22;
    	let t23;
    	let div9;
    	let user1;
    	let t24;
    	let div8;
    	let div6;
    	let h32;
    	let t26;
    	let div7;
    	let p3;
    	let t27;
    	let br9;
    	let t28;
    	let br10;
    	let t29;
    	let br11;
    	let t30;
    	let br12;
    	let t31;
    	let br13;
    	let t32;
    	let img;
    	let img_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	user0 = new User({ $$inline: true });
    	user1 = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div12 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "# About Me";
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Little about criz";
    			t4 = space();
    			hr0 = element("hr");
    			t5 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div5 = element("div");
    			create_component(user0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Kurizu";
    			t8 = space();
    			div3 = element("div");
    			p1 = element("p");
    			t9 = text("Yo ! I'm Kurizu , A curious boi who likes to\n                                code ! ");
    			br0 = element("br");
    			t10 = text("\n                                Im not very good at social interactions , but I'm\n                                always up for a chat ! ");
    			br1 = element("br");
    			t11 = text("\n                                I like drawing, even tho i suck at it. ");
    			br2 = element("br");
    			t12 = space();
    			br3 = element("br");
    			t13 = text("\n                                I like to play retro games and watch anime [ Not\n                                really ] ");
    			br4 = element("br");
    			t14 = text("\n                                Been playing around with ascii and pixel art for\n                                a while ");
    			br5 = element("br");
    			t15 = space();
    			br6 = element("br");
    			t16 = text("\n\n                                I enjoy listening to lofi and chill music ");
    			br7 = element("br");
    			t17 = text("\n                                Heres a playlist of some of my favourites :-\n                                ");
    			a = element("a");
    			a.textContent = "Spotify";
    			t19 = space();
    			hr1 = element("hr");
    			t20 = space();
    			p2 = element("p");
    			t21 = text("I am proficient with a lot of programming\n                                languages such as HTML/CSS , Javascript , Java ,\n                                C , Python, etc ");
    			br8 = element("br");
    			t22 = text("\n                                Primarily, I use JS as my main language and I am\n                                familiar with technologies such as Node.js, React,\n                                Svelte and also with database technologies such as\n                                MongoDB, etc.");
    			t23 = space();
    			div9 = element("div");
    			create_component(user1.$$.fragment);
    			t24 = space();
    			div8 = element("div");
    			div6 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Kurizu";
    			t26 = space();
    			div7 = element("div");
    			p3 = element("p");
    			t27 = text("Hi again ! ");
    			br9 = element("br");
    			t28 = text("\n                                If you want to check out some of my projects click\n                                on the channels respectively ");
    			br10 = element("br");
    			t29 = space();
    			br11 = element("br");
    			t30 = text("\n                                Thanks for checking out my page ! ");
    			br12 = element("br");
    			t31 = space();
    			br13 = element("br");
    			t32 = space();
    			img = element("img");
    			attr_dev(h30, "class", "channel-name");
    			add_location(h30, file$1, 29, 12, 707);
    			attr_dev(div0, "class", "vl");
    			add_location(div0, file$1, 30, 12, 760);
    			attr_dev(p0, "class", "channel-info");
    			add_location(p0, file$1, 31, 12, 791);
    			attr_dev(div1, "class", "top-nav");
    			add_location(div1, file$1, 28, 8, 673);
    			attr_dev(hr0, "class", "channel-division");
    			add_location(hr0, file$1, 34, 8, 940);
    			attr_dev(h31, "class", "chat-body-messages-item-content-header-name");
    			add_location(h31, file$1, 41, 28, 1303);
    			attr_dev(div2, "class", "chat-body-messages-item-content-header");
    			add_location(div2, file$1, 40, 24, 1222);
    			add_location(br0, file$1, 50, 39, 1748);
    			add_location(br1, file$1, 52, 55, 1892);
    			add_location(br2, file$1, 53, 71, 1970);
    			add_location(br3, file$1, 54, 32, 2009);
    			add_location(br4, file$1, 56, 41, 2138);
    			add_location(br5, file$1, 58, 40, 2266);
    			add_location(br6, file$1, 58, 47, 2273);
    			add_location(br7, file$1, 60, 74, 2355);
    			attr_dev(a, "href", "https://open.spotify.com/playlist/4rO0JccYMK0Y8KqwJXpzHd?si=46f1a2af6bea4cdc");
    			attr_dev(a, "class", "svelte-gvg60e");
    			add_location(a, file$1, 62, 32, 2471);
    			add_location(p1, file$1, 48, 28, 1628);
    			add_location(hr1, file$1, 67, 28, 2737);
    			add_location(br8, file$1, 71, 48, 2979);
    			add_location(p2, file$1, 68, 28, 2772);
    			attr_dev(div3, "class", "chat-body-messages-item-content-body");
    			add_location(div3, file$1, 47, 24, 1549);
    			attr_dev(div4, "class", "chat-body-messages-item-content");
    			add_location(div4, file$1, 39, 20, 1152);
    			attr_dev(div5, "class", "chat-body-messages-item");
    			add_location(div5, file$1, 37, 16, 1065);
    			attr_dev(h32, "class", "chat-body-messages-item-content-header-name");
    			add_location(h32, file$1, 84, 28, 3647);
    			attr_dev(div6, "class", "chat-body-messages-item-content-header");
    			add_location(div6, file$1, 83, 24, 3566);
    			add_location(br9, file$1, 92, 43, 4019);
    			add_location(br10, file$1, 94, 61, 4170);
    			add_location(br11, file$1, 94, 68, 4177);
    			add_location(br12, file$1, 95, 66, 4250);
    			add_location(br13, file$1, 95, 73, 4257);
    			attr_dev(img, "class", "msg-img");
    			if (!src_url_equal(img.src, img_src_value = "https://images.hdqwalls.com/download/child-of-earth-on-journey-5t-2560x1440.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "homepgimg");
    			attr_dev(img, "height", "300px");
    			attr_dev(img, "width", "auto");
    			add_location(img, file$1, 96, 32, 4296);
    			add_location(p3, file$1, 91, 28, 3972);
    			attr_dev(div7, "class", "chat-body-messages-item-content-body");
    			add_location(div7, file$1, 90, 24, 3893);
    			attr_dev(div8, "class", "chat-body-messages-item-content");
    			add_location(div8, file$1, 82, 20, 3496);
    			attr_dev(div9, "class", "chat-body-messages-item");
    			add_location(div9, file$1, 80, 16, 3409);
    			attr_dev(div10, "class", "chat-body-messages");
    			add_location(div10, file$1, 36, 12, 1016);
    			attr_dev(div11, "class", "chat-body");
    			add_location(div11, file$1, 35, 8, 980);
    			attr_dev(div12, "class", "mainarea");
    			add_location(div12, file$1, 23, 4, 540);
    			attr_dev(main, "class", "svelte-gvg60e");
    			add_location(main, file$1, 22, 0, 529);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div12);
    			append_dev(div12, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div12, t4);
    			append_dev(div12, hr0);
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			mount_component(user0, div5, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    			append_dev(p1, t9);
    			append_dev(p1, br0);
    			append_dev(p1, t10);
    			append_dev(p1, br1);
    			append_dev(p1, t11);
    			append_dev(p1, br2);
    			append_dev(p1, t12);
    			append_dev(p1, br3);
    			append_dev(p1, t13);
    			append_dev(p1, br4);
    			append_dev(p1, t14);
    			append_dev(p1, br5);
    			append_dev(p1, t15);
    			append_dev(p1, br6);
    			append_dev(p1, t16);
    			append_dev(p1, br7);
    			append_dev(p1, t17);
    			append_dev(p1, a);
    			append_dev(div3, t19);
    			append_dev(div3, hr1);
    			append_dev(div3, t20);
    			append_dev(div3, p2);
    			append_dev(p2, t21);
    			append_dev(p2, br8);
    			append_dev(p2, t22);
    			append_dev(div10, t23);
    			append_dev(div10, div9);
    			mount_component(user1, div9, null);
    			append_dev(div9, t24);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h32);
    			append_dev(div8, t26);
    			append_dev(div8, div7);
    			append_dev(div7, p3);
    			append_dev(p3, t27);
    			append_dev(p3, br9);
    			append_dev(p3, t28);
    			append_dev(p3, br10);
    			append_dev(p3, t29);
    			append_dev(p3, br11);
    			append_dev(p3, t30);
    			append_dev(p3, br12);
    			append_dev(p3, t31);
    			append_dev(p3, br13);
    			append_dev(p3, t32);
    			append_dev(p3, img);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(swipe.call(null, div12, { timeframe: 500, minSwipeDistance: 0.1 })),
    					listen_dev(div12, "swipe", /*handler*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user0);
    			destroy_component(user1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const serverWidth = "50px";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let direction;

    	function handler(event) {
    		direction = event.detail.direction;

    		if (window.innerWidth < 1500) {
    			if (direction == "left") {
    				closeNav$e();
    			} else if (direction == "right") {
    				openNav$e();
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		serverWidth,
    		User,
    		closeNav: closeNav$e,
    		openNav: openNav$e,
    		swipe,
    		direction,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) direction = $$props.direction;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    // (25:2) <Route path="/">
    function create_default_slot_1(ctx) {
    	let homecn;
    	let t;
    	let home;
    	let current;
    	homecn = new Home_cn({ $$inline: true });
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(homecn.$$.fragment);
    			t = space();
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(homecn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homecn.$$.fragment, local);
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homecn.$$.fragment, local);
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(homecn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(25:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:2) <Route path="/about">
    function create_default_slot(ctx) {
    	let aboutcn;
    	let t;
    	let about;
    	let current;
    	aboutcn = new About_cn({ $$inline: true });
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(aboutcn.$$.fragment);
    			t = space();
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(aboutcn, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aboutcn.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aboutcn.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(aboutcn, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(30:2) <Route path=\\\"/about\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let sidebar;
    	let t0;
    	let route0;
    	let t1;
    	let route1;
    	let t2;
    	let allpro;
    	let t3;
    	let alloth;
    	let t4;
    	let allblogs;
    	let t5;
    	let allchat;
    	let current;
    	sidebar = new Sidebar({ $$inline: true });

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/about",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	allpro = new All_pro({ $$inline: true });
    	alloth = new All_oth({ $$inline: true });
    	allblogs = new All_blogs({ $$inline: true });
    	allchat = new ChatRoute({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(sidebar.$$.fragment);
    			t0 = space();
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    			t2 = space();
    			create_component(allpro.$$.fragment);
    			t3 = space();
    			create_component(alloth.$$.fragment);
    			t4 = space();
    			create_component(allblogs.$$.fragment);
    			t5 = space();
    			create_component(allchat.$$.fragment);
    			add_location(main, file, 20, 0, 686);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(sidebar, main, null);
    			append_dev(main, t0);
    			mount_component(route0, main, null);
    			append_dev(main, t1);
    			mount_component(route1, main, null);
    			append_dev(main, t2);
    			mount_component(allpro, main, null);
    			append_dev(main, t3);
    			mount_component(alloth, main, null);
    			append_dev(main, t4);
    			mount_component(allblogs, main, null);
    			append_dev(main, t5);
    			mount_component(allchat, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(allpro.$$.fragment, local);
    			transition_in(alloth.$$.fragment, local);
    			transition_in(allblogs.$$.fragment, local);
    			transition_in(allchat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(allpro.$$.fragment, local);
    			transition_out(alloth.$$.fragment, local);
    			transition_out(allblogs.$$.fragment, local);
    			transition_out(allchat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(sidebar);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(allpro);
    			destroy_component(alloth);
    			destroy_component(allblogs);
    			destroy_component(allchat);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Route,
    		Sidebar,
    		AllPro: All_pro,
    		AllOth: All_oth,
    		AllBlogs: All_blogs,
    		AllChat: ChatRoute,
    		HomeCn: Home_cn,
    		AboutCn: About_cn,
    		Home,
    		About
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'kurizu'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
