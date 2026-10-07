import '@testing-library/jest-dom'

// jsdom does not implement scrolling; App scrolls to top when switching screens.
window.scrollTo = () => {}
