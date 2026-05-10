// jsdom does not implement scrollIntoView — stub with a plain function
// (jest.fn() is not available in setupFiles, which runs before the framework)
window.HTMLElement.prototype.scrollIntoView = function () {};
