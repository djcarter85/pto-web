# PTO API

The PTO API is the interface to the backend for this website.

An [OpenAPI spec](./pto.openapi.json) is available, and the API's base path is
`https://api.pto.football`.

Auth is implemented using an AWS Cognito app client, with the following details:

- region `eu-west-2`
- user pool `JwWpg0O8l`
- client ID `2egge4ro1oduqes2bn2q4snrah`

ID tokens are passed to the API in the `Authentication` header (with the
standard `Bearer` prefix).
