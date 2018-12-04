import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'react-leaflet';
import LayerOpacityControl from '../';
import { noop } from 'underscore';

it('renders without crashing', () => {
    const div = document.createElement('div');
    div.style.height = 100;
    ReactDOM.render(
        <Map>
            <LayerOpacityControl
              opacity={{
                foo: 0.5,
              }}
              onChange={noop}
            />
        </Map>,
        div);
});
