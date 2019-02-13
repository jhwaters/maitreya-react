const execa = require('execa')

class RemoteProcess {
  constructor({file, args=[], opts={}}) {
    
    this.child = execa(file, args, opts);
    this.child.on('close', this.procClosed.bind(this));

    this.stdout().setEncoding('utf8');
    this.stderr().setEncoding('utf8');

    this.stdout().on('data', (data) => this.eventFromProc(data));
    this.stderr().on('data', (data) => this.errorFromProc(data));

    console.log(`REMOTE PROCESS STARTED: ${JSON.stringify({file: file, args: args, opts: opts})}`)
  }

  stdin() { return this.child.stdin; }
  stdout() { return this.child.stdout; }
  stderr() { return this.child.stderr; }


  send(data) {
    console.log(`SENT: ${data}\n`);
    try {
      this.stdin().write(`${data}\n`);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  kill() {
    this.child.kill();
  }

  procClosed(code, signal) {
    this.log(`REMOTE PROCESS CLOSED: ${code} ${signal}`);
  }

  eventFromProc(data) {
    console.log(`RECEIVED: ${data}`);
  }

  errorFromProc(data) {
    console.error(data);
  }
}

export default RemoteProcess