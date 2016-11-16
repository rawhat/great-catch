import React from 'react';
import { render } from 'react-dom';

const App = () => {
    return (
        <h2>This is a test.</h2>
    );
}

render(<App />, document.querySelector('#app'));
