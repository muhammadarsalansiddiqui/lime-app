import { WebSocketService } from '../utils/webSockets.observable';

const jsSHA = require("jssha");

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';



class WebsocketAPI {
  responses = [];
  sec = 0;
  socket;
  constructor(_wss) {
    this._wss = _wss;
    this.jsonrpc = '2.0';
  }

  register(x) {
    
    if (x.type === 'message'){
      let data = JSON.parse(x.data);
      this.responses[data.id](data);
      delete this.responses[data.id];
    }
    else if (x.type === 'open') {
      this.responses['conect'](true);
    }
  }

  conect(url) {
    this.socket = this._wss.connect(url);
    this.socket.subscribe(this.register.bind(this));
    let observable = Observable.create((obs)=>{
      this.responses['conect'] = obs.next.bind(obs);
    });
    return observable;
  }

  addId(){
    this.sec += 1;
    return Number(this.sec);
  }

  send(mensaje) {
    const newMensaje = Object.assign({}, mensaje, {id:this.addId(), jsonrpc: this.jsonrpc});
    this.socket.next(newMensaje);
    return newMensaje.id;
  }

  call(sid, action, data, method) {
    let id;
    let observable = Observable.create((obs)=>{
      if (typeof method === 'undefined') { method = 'call'; }
      if (method !== 'login')  {
        id = this.send({ method, 'params': [
          sid, '/lime/api', action, data
        ]});
      } else {
        id = this.send({ method, 'params': data });
      }

      let filter = (x) => x.id === id;
      this.responses[id] = obs.next.bind(obs);
    });
    return observable
        .filter((x) => x.id === id)
        .map(x => x.result)
        .take(1);
  }

  login(auth) {
    return this.getChallenge()
      .map(x => x.token)
      .switchMap((token) => {
        let shaPassword = this.shaToken(auth.password, token);
        return this.call('','', [auth.user, shaPassword],'login').map(data => data.success);
      });
  }
  
  getChallenge() {
    return this.call('','',[],'challenge');
    /*return this.socket.map(x => JSON.parse(x.data))
        .filter(x => x.id === id)
        .map(x => x.result);*/
  }

  shaToken(password, token) {
    let shaPassword = new jsSHA("SHA-1", "TEXT");
    let shaToken = new jsSHA("SHA-1", "TEXT");
    shaPassword.update(password);
    shaToken.update(token);
    shaToken.update(shaPassword.getHash('HEX'));
    return shaToken.getHash('HEX');
  }
  changeUrl(url) {
    this._wss.url = url;
    return this.call('','',[],'reconect');
  }
  getInterfaces(sid) {
    return this.call(sid, 'get_interfaces', {})
      .map(res => res.interfaces)
      .map(iface => iface.map((x) => { return { name: x }; }));
  }
  getNeighbors(sid) {
    return this.call(sid, 'get_cloud_nodes', {})
            .map(x => x.nodes)
            .map(data => Object.keys(data).map((key, index)=>data[key]).reduce((x,y) => x.concat(y), []));
  }

  getStations(sid) {
    let a = new Promise((res,rej) => {
      this.call(sid, 'get_stations', {})
        .map(x => x.stations)
        .map(data => Object.keys(data).map((key, index)=>data[key]).reduce((x,y) => x.concat(y), []))
        .map((y) => {
          return y.reduce((a, b) => a.concat(b), []);
        })
        .map((nodes) => nodes.map(node => {
          node.signal = Number(node.signal);
          return node;
        }))
        .subscribe( x => {
          if (x.length > 0) { res(x); }
          rej(x);
        });
    });
    return a;
  }
  getIfaceStation(sid, iface) {
    let a = new Promise((res,rej) => {
      this.call(sid, 'get_iface_stations', { iface })
        .map(data => Object.keys(data).map((key, index)=>data[key]).reduce((x,y) => x.concat(y), []))
        .map((nodes) => nodes.map(node => {
          if (node.signal) {
            node.signal = Number(node.signal);
          }
          return node;
        }))
        .map((nodes) => { return { iface, nodes }; })
        .subscribe( x => {
          if (x.nodes.length > 0) { res(x); }
          rej(x);
        });
    });
    return a;
  }
  getStationSignal(sid, node) {
    return this.call(sid, 'get_station_signal', { station_mac: node.mac, iface: node.iface })
      .map((x) => {
        x.signal = Number(x.signal);
        return x;
      });
  }
  getLocation(sid) {
    return this.call(sid, 'get_location', {});
  }

  changeLocation(sid, location) {
    return this.call(sid, 'set_location', location);
  }

  getHostname(sid) {
    return this.call(sid, 'get_hostname', {});
  }
}


// Websockets services
export default new WebsocketAPI(new WebSocketService());