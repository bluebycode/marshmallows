import Configuration from "./configuration"

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
 * Channel. The secure/non-secure option. When receives a message will write to writer.
 * ch = new Channel(new Writer(writer))
 * ch.open({
 *    encryption: true,
 *    sharedKey: KEY
 * }, () => { Connected! })
 *    ch.write("ls -la")
 */
class Channel {
    constructor(writer){
        this.writer = writer;
        this.sharedKey = {}
    }
    onMessage = (message) => {
        const msg = (this.opts.encryption) ? this.decrypt(this.sharedKey, message) : message; 
        this.writer.write(typeof msg == 'string' ? msg : msg.data)
    }
    write = (message) => {
        const msg = (this.opts.encryption) ? this.encrypt(this.sharedKey, message) : message; 
        this.socket.send(JSON.stringify({
            type: "data",
            data: msg
        }))
    }

    encrypt = (key, message)  => "ENC("+ key + "," + message  + ")"
    decrypt = (key, ciphered) => "DEC("+ key + "," + ciphered + ")"

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
