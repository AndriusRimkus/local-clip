# Agent Rules

Rules and guidelines for AI agents working on this codebase.

## Code Style

1. **Do not add comments** - Code should be self-documenting. Use clear variable names, function names, and structure instead of comments.

2. **Use named exports for components** - Always use named exports instead of default exports for React components.

3. **Use function declarations** - Prefer `function Name() {}` over `const Name = () => {}` for components, event handlers, helpers, and store actions.

    ```typescript
    // ✅ Good
    function MyComponent() {}
    function handleClick() {}

    create((set) => ({
        addItem(item) {},
    }));

    // ❌ Bad
    const MyComponent = () => {};
    const handleClick = () => {};

    create((set) => ({
        addItem: (item) => {},
    }));
    ```

## UI Components

1. **Prioritize shadcn/ui components** - Always use shadcn/ui components from `@/components/ui` when available instead of creating custom components or using raw HTML elements.

## React

1. **Do not use `React.memo`, `useCallback`, or `useMemo`** - The React Compiler will handle memoization automatically.

2. **Do not use `forwardRef`** - In React 19+, pass `ref` as a regular prop instead of using `forwardRef`.

3. **You Might Not Need an Effect** - Follow these principles from https://react.dev/learn/you-might-not-need-an-effect:
    - **Use Effects ONLY for synchronizing with external systems** (DOM APIs, network, third-party libraries, browser APIs)
    - **DO NOT use Effects for**:
        - Transforming data for rendering (calculate directly during render)
        - Handling user events (use event handlers instead)
        - Resetting state when props change (use `key` prop to remount or handle in event handlers)
