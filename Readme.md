# Namechecker Backend


## Authentication
A guard is in place which requires an authentication string to be provided at the time on connection establishment with the server, this is done to make sure only our clientside apps can access the backend \
Also Note the Hashing has to be in done in hex a.k.a hexadecimal.
Auth key format: 
``` js
masterkey = CQIGDwMNCQIFBQgPBAIHCA // this is our unique authentication string, generated randomly copy this into env files\
d = moment().utc().format('DMMYY'); // a  utc timezone date string in the specified format, example = 300819 which is 30th august 2019 \
key = `${masterkey}-${d}` //combined key \
finalkey = sha256(key) // hash of the key generated above in hex format, \
finalkey is our authentication key, server will generate the same using the same procedure above and only when they match socket will establish \
```
``` bash
example: 
CQIGDwMNCQIFBQgPBAIHCA-300819 after hashing gives: 59aaeaa325566a6862ad3f09f8899eab520ab9b862d362b8e4844951c2d6deb0 
```



the finalkey has to sent in websocket request object as the following: client.request._query.masterkey. How exactly to send this is client dependent and has to be figured out with trial and error. \

if Authentication failed you will receive mssg object: \
``` js
{
    message: "Invalid credentials"
    status: "error"
}
```
else the connection will establish

## Websocket Endpoints
``` bash
social search: 'search-social' // to search for social username availability  eg, 'www.youtube/channel/insanenaman'
domain search: 'search-domain' // to search for domain username availability  eg, 'insanenaman.me'
```

### **search-social:**

**request obj**:
``` js
 { username: `usernamestring` } 
```
currently social search doesn't support searching for specific platforms, instead all available platforms data is sent to the client, specific platform availability check is the next major feature to implement so please develop client accordingly.

**response obj**: 
when username available:
``` js
{
    event: "social"
    msg:
        code: "username-available"
        detail: "Username is available as ${platformname} returned 404"
    platform: `${platformname}`
    type: `success`    
}
```

when username unavailable:
``` js
{
    event: "social"
    msg:
        code: "username-unavailable"
        detail: "Username is unavailable as ${platformname} returned 200"
    platform: `${platformname}`
    type: `success`
}
```

when username invalid:
``` js
{
    event: "social"
    msg:
        code: "username-invalid"
        detail: "Username is invalid as ${platformname} regex did not match"
    platform: `${platformname}`
    type: `warning`
}
```

when some error occurred:
``` js
{
    event: "social"
    msg:
        code: "username-unavailable"
        detail: "Username is unavailable as ${platformname} returned an http exception"
    platform: `${platformname}`
    type: `failed`
}
```


### **search-domain:**

**request obj**:
when explicitly mentioning top level domains to be searched.
``` js
  { username: 'username', extension: ['org', 'com', 'io', 'me', 'net', 'co'] }
```
else make first string of extension array 'all' this will return availability for all domains that are listed in backend.
``` js
  { username: 'username', extension: ['all'] }
```
social domain does support searching for specific tlds.
**response obj**: 
when username available:
``` js
{
    event: "domain"
    msg:
        code: "username-available"
        detail: "Username is available as domain"
    platform: `${tld}`
    type: `success`    
}
```

when username unavailable:
``` js
{
    event: "domain"
    msg:
        code: "username-unavailable"
        detail: "Username is unavailable as domain"
    platform: `${tld}`
    type: `success`
}
```

when some error occurred:
``` js
{
    event: "domain"
    msg:
        code: "username-unavailable"
        detail: "domain has no tld specified"
    platform: `${tld}`
    type: `failed`
}
```