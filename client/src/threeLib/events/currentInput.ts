import { Events } from './events';
import * as _ from 'lodash';
  
export class InputCombination {
  public keys: Events.KeyboardKey[];
  public keyModifiers: Events.KeyboardModifier[];
  public buttons: Events.MouseButton[];
  constructor(
    keys: Events.KeyboardKey[],
    keyModifiers: Events.KeyboardModifier[],
    buttons: Events.MouseButton[]
  ) {
    this.keys = keys || [];
    this.keyModifiers = keyModifiers || [];
    this.buttons = buttons || [];
  }
}

export class CurrentInput {
  private static _instance: CurrentInput;

  private _lastKeyboardEvent: KeyboardEvent;
  private _lastMouseEvent: MouseEvent;

  private _inputCombo: InputCombination;

  private constructor() {
    this._inputCombo = new InputCombination([], [], []);
    this._lastKeyboardEvent = null;
    this._lastMouseEvent = null;
  }

  pushKeys(...keys: Events.KeyboardKey[]) {
    this._inputCombo.keys = _.union(this._inputCombo.keys, keys);
  }

  pushKeyModifiers(...keyModifiers: Events.KeyboardModifier[]) {
    this._inputCombo.keyModifiers = _.union(this._inputCombo.keyModifiers, keyModifiers);
  }

  pushButtons(...buttons: Events.MouseButton[]) {
    this._inputCombo.buttons = _.union(this._inputCombo.buttons, buttons);
  }

  popKeys(...keys: Events.KeyboardKey[]) {
    this._inputCombo.keys = _.difference(this._inputCombo.keys, keys);
  }

  popKeyModifiers(...keyModifiers: Events.KeyboardModifier[]) {
    this._inputCombo.keyModifiers = _.difference(this._inputCombo.keyModifiers, keyModifiers);
  }

  popButtons(...buttons: Events.MouseButton[]) {
    this._inputCombo.buttons = _.difference(this._inputCombo.buttons, buttons);
  }

  get lastMouseEvent() { return this._lastMouseEvent; }
  set lastMouseEvent(ev: MouseEvent) { this._lastMouseEvent = ev; }

  get lastKeyboardEvent() { return this._lastKeyboardEvent; }
  set lastKeyboardEvent(ev: KeyboardEvent) { this._lastKeyboardEvent = ev; }

  get keys() { return this._inputCombo.keys; }
  get keyModifiers() { return this._inputCombo.keyModifiers; }
  get buttons() { return this._inputCombo.buttons; }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}