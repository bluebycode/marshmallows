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
    onMessage = (evt) => {
        const msg = evt.data
        if (msg.data) {
            this.writer.write(JSON.parse(msg).data)
        }else{
            this.writer.write(msg)
        }
        
    }
    write = (message) => {
        this.socket.send(JSON.stringify({
            type: "data",
            data: message
        }))
    }

    open = (options, callbackOnOpen) => {
        this.opts = options
        this.socket = new WebSocket(options.address)
        this.socket.onmessage = this.onMessage
        this.socket.onopen = callbackOnOpen
    }
}

export {
    Writer,
    Channel
}
