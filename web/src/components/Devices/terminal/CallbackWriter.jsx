
import React from 'react';

class CallbackWriter {
    constructor(callbackOnMessage){
        if (callbackOnMessage){
            this.callbackOnMessage = callbackOnMessage
        }
    }
    onWrite(callbackOnMessage) {
        this.callbackOnMessage = callbackOnMessage
    }
    write(data){
        this.callbackOnMessage(data)
    }
}
export default CallbackWriter;