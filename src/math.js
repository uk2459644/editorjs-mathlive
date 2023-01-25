/**
 * MathfieldElement from mathlive package
 *
 */
import { MathfieldElement } from "mathlive";

/**
 * MathField Class for working and customization of Math Field Element
 *
 */

export default class MathField {

  /**
   * Render plugin's main Element and fill it with saved data
   *
   * @param {MathEditorData} data - previously saved data
   * @param {MathEditorConfig} config - user config for Tool
   * @param {Object} api - Editor.js API
   * @param {boolean} readOnly - read only mode flag
   *
   */

  constructor(data, api, config, readOnly) {
    this.api = api;
    this.data = data;
    this.config = config;
    this.readOnly = readOnly;
    this.mfe = this._createMathfield();
  }

  /**
   * Create instance of MathfieldElement
   *
   * @returns {MathfieldElement}
   */

  _createMathfield() {
    // Creating new instance of MathfieldElement

    const mfe = new MathfieldElement();

    /**
     * Setting previous data and type to new instance
     * 
     */
    mfe.setValue(this.data.latex);
    mfe.classList.add(this.data.type);

    /**
     * If plugin is in readOnly mode then return it 
     * , inreadOnly mode with virtualkeyboardmode off.
     * 
     */
    if (this.readOnly) {
      mfe.setOptions({
        virtualKeyboardMode: "off",
        defaultMode: "inline-math",
        readOnly: true,
      });

      return mfe;
    }

    /**
     * If not in readonly mode ,
     * return instance with user's defined config or default config.
     * 
     */
    mfe.setOptions({
      virtualKeyboardMode: this.config.virtualKeyboardMode,
      defaultMode: this.config.defaultMode,
      smartMode: this.config.smartMode,
      readOnly: this.readOnly,
      virtualKeyboardTheme: this.config.virtualKeyboardTheme,
    });

    /**
     * Add input eventlistener
     * after every keystrokes update it with data.
     * 
     *      */
    mfe.addEventListener("input", (ev) => {
      ev.preventDefault();
      this.data.latex = ev.target.value;
      console.log(ev.target.value);
    });

    /**
     * Move out listener, after move out blur the written math.
     */

    mfe.addEventListener("move-out", (ev) => {
      ev.preventDefault();
      mfe.blur();
    });

    mfe.addEventListener("focus-out", (ev) => {
      ev.preventDefault();
      if (ev.detail.direction == "forward") {
        mfe.executeCommand("moveToMathfieldEnd");
      } else if (ev.detail.direction == "backward") {
        mfe.executeCommand("moveToMathfieldStart");
      }
    });

    return mfe;
  }
}
