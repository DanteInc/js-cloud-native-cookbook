# Implementing an CRUD BFF

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/bff-graphql-crud --path cncb-bff-graphql-crud
2. cd cncb-bff-graphql-crud
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. curl commands
```
curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"mutation { saveThing(input: { id: \"33333333-1111-1111-1111-000000000000\", name: \"thing1\", description: \"This is thing one of two.\" }) { id } }"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"mutation { saveThing(input: { id: \"33333333-1111-1111-2222-000000000000\", name: \"thing2\", description: \"This is thing two of two.\" }) { id } }"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"query { thing(id: \"33333333-1111-1111-1111-000000000000\") { id name description }}"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"query { things(name: \"thing\") { items { id name } cursor }}"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"query { things(name: \"thing\", limit: 1) { items { id name } cursor }}"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"query { things(name: \"thing\", limit: 1, cursor:\"CURSOR VALUE FROM PREVIOUS RESPONSE\") { items { id name } cursor }}"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"mutation { deleteThing( id: \"33333333-1111-1111-1111-000000000000\" ) { id } }"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"mutation { deleteThing( id: \"33333333-1111-1111-2222-000000000000\" ) { id } }"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H 'Content-Type: application/json' -d '{"query":"query { things(name: \"thing\") { items { id } }}"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

```

7. Try the same commands with graphiql

```
mutation {
  saveThing(input: {
    id: "33333333-1111-1111-1111-000000000000",
    name: "thing1",
    description: "This is thing one of two."
  }) {
    id
  }
}

mutation {
  saveThing(input: {
    id: "33333333-1111-1111-2222-000000000000",
    name: "thing1",
    description: "This is thing two of two."
  }) {
    id
  }
}

query {
  thing(id: "33333333-1111-1111-1111-000000000000") {
    id
    name
    description
  }
}

query {
  things(name: "thing") {
    items {
      id
      name
    }
    cursor
  }
}

query {
  things(name: "thing", limit: 1) {
    items {
      id
      name
    }
    cursor
  }
}

query {
  things(name: "thing", limit: 1, cursor: "CURSOR VALUE FROM PREVIOUS RESPONSE") {
    items {
      id
      name
    }
    cursor
  }
}

mutation {
  deleteThing(
    id: "33333333-1111-1111-1111-000000000000",
  ) {
    id
  }
}

mutation {
  deleteThing(
    id: "33333333-1111-1111-2222-000000000000",
  ) {
    id
  }
}
```

8. sls logs -f trigger -r us-east-1 -s $MY_STAGE
9. npm run rm:lcl -- -s $MY_STAGE
