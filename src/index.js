/**
 * Math block for the Editor.js
 * 
 * @author Upendra Kumar
 * @license MIT 
 * 
 */

/**
 * Build Styles
 * 
 */

import "./index.css";
/**
 * Icons from boxicons
 * 
 */

import 'boxicons';
/**
 * Class for MathFieldElement
 * 
 */
import MathField from "./math";


/**
 * @class MathEditor 
 * @classdesc MathEditor Tool for Editor.js 
 * @property {MathEditorData} data - MathEditor Tool's input and output data
 * @property {Object} api - Editor.js API instance
 * 
 * @typedef {object} MathEditorData 
 * @description MathEditor Tool's input and output data 
 * @property {string} type - MathEditor style type
 * @property {string} latex - Math latex in string format
 * 
 * @typedef {object} MathEditorConfig 
 * @description MathEditor Tool's initial configuration
 * @property {string} virtualKeyboardMode - Keyboard mode for math-editor --> manual || auto || onfocus
 * @property {string} defaultMode - default mode for input --> math || text || inline-math
 * @property {boolean} smartMode - mode in which editor work
 * @property {string} virtualKeyboardTheme - Keyboard layout theme --> material || apple
 * 
 */

export default class MathEditor {
  /**
   *
   * Notify core that read-only supported
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Allow to press Enter inside the MathEditor testarea
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Get Toolbox settinigs
   * 
   * @public 
   * @returns {string}
   */
  static get toolbox() {
    return {
      title: "Math Editor",
      icon: "<box-icon name='math'></box-icon>",
    };
  }
  
  /**
   * MathEditor's styles
   * 
   * @returns {Object}
   */
  get CSS(){
    return {
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: 'cdx-math',
      wrapperForType:(type)=>`cdx-math-${type}`
    };
  }
 
  /**
   * Default placeholder for MathEditor
   * @public
   * @returns {string}
   */

  static get DEFAULT_PLACEHOLDER(){
    return 'e=mc^2'
  }

  static get DEFAULT_TYPE(){
    return 'cdx-math-success'
  }

/**
 * Render plugin's main Element and fill it with saved data
 * 
 * @param {MathEditorData} data - previously saved data
 * @param {MathEditorConfig} config - user config for Tool
 * @param {Object} api - Editor.js API 
 * @param {boolean} readOnly - read only mode flag
 *   
 */

  constructor({data,config,api,readOnly}){
    this.api=api;
    this.data= {
      type:data.type || MathEditor.DEFAULT_TYPE,
      latex: data.latex || MathEditor.DEFAULT_PLACEHOLDER
    };
    this.config={
      virtualKeyboardMode: config.virtualKeyboardMode || 'manual',
      defaultMode: config.defaultMode || 'math',
      smartMode : config.smartMode || false,
      virtualKeyboardTheme: config.virtualKeyboardTheme || 'material',
    };
    this.readOnly=readOnly;
    this.mathfield=this.createMfe();
  }

  /**
   * Create instance of MathfieldElement
   * @returns {MathfieldElement}
   */

  createMfe(){
    return new MathField(this.data,this.api,this.config,this.readOnly);
  }

  /**
   * Create MathEditor Tool container
   * @returns {Element}
   */
  render(){
    return this.mathfield.mfe;
  }

  /**
   * Helper for making Elements with attributes
   * @param {string} tagName - new Element tag name
   * @param {array|string} classNames - list or name of CSS classname(s)
   * @param {Object} attributes - any attributes
   * @returns {Element}
   */

  make(tagName,classNames=null,attributes={}){
    let el=document.createElement(tagName);
    if (Array.isArray(classNames)){
      el.classList.add(...classNames);
    } else if(classNames){
      el.classList.add(classNames);
    }

    for (let attrName in attributes){
      el[attrName]=attributes[attrName];
    }

    return el;
  }

  /**
   * MathEditor's style list
   * @returns {Array}
   */
  static get MATH_TYPES(){
    return [
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'danger',
      'light',
      'dark',
      'pink',
      'choco'
    ];
  }

  /**
   * Create Block's setting block
   * 
   * @returns {HTMLElement}
   */

  renderSettings(){
    const settingsContainer = this.make('div');
    MathEditor.MATH_TYPES.forEach((type)=>{
      const settingsButton = this.make('div',
      [this.CSS.wrapper,this.CSS.settingsButton,this.CSS.wrapperForType(type)],
      {
        innerHTML:'M',
      });

      if (this.data.type === type){
        // highlight current type button
        settingsButton.classList.add(this.CSS.settingsButtonActive);
      }
      // set up click handler
      settingsButton.addEventListener('click',()=>{
        /**
         * Add current style , remove previous style and updata it 
         * to data type.
         */
        this.mathfield.mfe.classList.remove(this.data.type);
        this.mathfield.mfe.classList.add(this.CSS.wrapperForType(type));
        this.data.type=this.CSS.wrapperForType(type);

        // un-highlight previous type button
        
        settingsContainer.querySelectorAll(`.${this.CSS.settingsButton}`)
        .forEach((button)=> button.classList.remove(this.CSS.settingsButtonActive));

        // and highlight the clicked type button
        settingsButton.classList.add(this.CSS.settingsButtonActive);

      });

      settingsContainer.appendChild(settingsButton);
    });
    return settingsContainer;
  }

  /**
   * Extract MathEditor data from Tool
   * 
   * @param {HTMLElement} blockContent mathElement - element to save
   * @returns {MathEditorData}
   */

  save(blockContent){
    return {
      type:this.data.type,
        latex:this.mathfield.data.latex,
    }
  }

  /**
   * Fill MathEditor's latex with the pasted content
   * 
   * @param {PasteEvent} event - event with pasted content
   */

  onPaste(event){
    const {data}=event.detail;
    this.data={
      type:this.data.type,
      latex:data.innerHTML || '',
    };
  }

  /**
   * Allow MathEditor to be converted to/from other blocks
   * 
   */

  static get conversionConfig(){
    return {
      // export MAthEditor'latex for other blocks
      export:(data)=>data.latex,
      // fill MathEditor's latex from other block's export string
      import:(string)=>{
        return {
          latex:string,
          type:this.DEFAULT_TYPE,
        }
      }
    }
  }

  /**
   * Sanitizer connfig for MAthEditor Tool saved data
   * @returns {Object}
   */

  static get sanitize(){
    return {
      type:false,
      latex:true,
    }
  }
}
