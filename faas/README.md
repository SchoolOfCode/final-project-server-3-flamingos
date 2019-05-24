# Report It (server)

#### GET app posts as an [openFaas](https://www.openfaas.com/) function

This posts were really useful:

-   [https://blog.alexellis.io/serverless-databases-with-openfaas-and-mongo/amp/?\_\_twitter_impression=true](https://blog.alexellis.io/serverless-databases-with-openfaas-and-mongo/amp/?__twitter_impression=true)

-   [https://github.com/alexellis/mongodb-function](https://github.com/alexellis/mongodb-function)
-   [https://pusher.com/tutorials/serverless-backend-aws-lambda](https://pusher.com/tutorials/serverless-backend-aws-lambda)

-   [https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose)

---

#### event output

url used: https://j0nn.io/function/event/id?a=number&b=letter

```
{
    body: { },
    headers: {
        host: "event:8080",
        user-agent: "Mozilla/5.0 (X11; CrOS x86_64 11895.95.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/       74.0.3729.125 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8, application/ signed-exchange;v=b3",
        accept-encoding: "gzip, deflate, br",
        accept-language: "en-GB,en;q=0.9",
        dnt: "1",
        upgrade-insecure-requests: "1",
        x-call-id: "920344fe-3e6a-4200-8503-26be495b51df",
        x-forwarded-for: "80.229.8.77",
        x-forwarded-host: "j0nn.io",
        x-forwarded-port: "443",
        x-forwarded-proto: "https",
        x-forwarded-server: "9de1dbf51890",
        x-real-ip: "80.229.8.77",
        x-start-time: "1557688429727002530",
    },
    method: "GET",
    query: {
        a: "number",
        b: "letter",
    },
    path: "/id",
}
```
