import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const MOSAIC_UUID = 'mosaicwm@cleomenezesjr.github.io';

export default class HideMosaicIndicator extends Extension {
    enable() {
        const mosaic = Extension.lookupByUUID(MOSAIC_UUID);

        if (!mosaic) {
            console.error('Hide Mosaic Indicator: Mosaic WM is not loaded');
            return;
        }

        const indicator = mosaic._mosaicIndicator;

        if (!indicator?._updateIcon || !indicator._indicator) {
            console.error('Hide Mosaic Indicator: Mosaic indicator not found');
            return;
        }

        this._indicator = indicator;
        this._originalUpdateIcon = indicator._updateIcon;

        indicator._updateIcon = (...args) => {
            this._originalUpdateIcon.apply(indicator, args);
            indicator._indicator.visible = false;
        };

        // Hide it immediately.
        indicator._indicator.visible = false;
    }

    disable() {
        if (!this._indicator)
            return;

        this._indicator._updateIcon = this._originalUpdateIcon;
        this._indicator._updateIcon();

        this._indicator = null;
        this._originalUpdateIcon = null;
    }
}