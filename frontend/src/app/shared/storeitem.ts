import { signal,Signal } from "@angular/core";  
//Signal is Type interface which represent the signal iinstance
//signal is a function used for creating reactive signal.

export class StoreItem<T>{
    private readonly _state=signal<T>(null as unknown as T); //if we set null or undefined value directly the typescript wi;; throw an error
    // only child class can initialise thats why contructor is protedted
    protected constructor(initialState:T){
        this._state.set(initialState); //initialise 
    }

    //we want to update the value in the store 
    protected setValue(newValue:T){
     this._state.set(newValue)
    }

    //we want to read the new Value ,Till now return state as writtable.
    protected get value():T{
      return this._state();
    }

    protected get value$():Signal<T>{
        return this._state.asReadonly()  //instead of giving te current value it gives the  readonly version  of the signal itself
        
    }

}