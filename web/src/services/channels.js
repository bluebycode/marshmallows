/**
 * Writer adapter class.
 */
class Writer {
    writable = null
    constructor(writable){
        this.writable = writable
    }
    write(data){
        this.writable.write(data)
    }
}

/**
 * Channel. A secure/non-secure option. When receives a message will write to writer.
 * ch = new Channel(new Writer(writer))
 * ch.open({
 *    sharedKey: KEY
 * }, () => { Connected! })
 *    ch.write("ls -la")
 */
class Channel {
    constructor(writer){
        this.writer = writer;
    }
    onMessage = (cb) => (evt) => {
        const msg = evt.data
        if (cb) {
            cb(msg)
            return
        }
        if (msg.data) {
            this.writer.write(JSON.parse(msg).data)
        }else{
            this.writer.write(msg)
        }
    }
    write = (type, message) => {
        if (!message){
            this.socket.send(type)
            return
        }
        this.socket.send(JSON.stringify({
            type: type,
            data: message
        }))
    }

    open = (options, callbackOnOpen, callbackOnMessage) => {
        this.opts = options
        this.socket = new WebSocket(options.address)
        this.socket.onmessage = this.onMessage(callbackOnMessage)
        this.socket.onopen = callbackOnOpen
    }
}

export {
    Writer,
    Channel
}
