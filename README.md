# ZisakuQL
A toy scratch implementation query language and runtime like GraphQL.

## Usage
```sh
> deno run --allow-net src/main.ts
# Listening on http://localhost:8000/
```
```sh
curl http://localhost:8000/zisakuql --data"\
  query getTodo(id: 3) {\
   name\
    description\
    dueDate\
    owner {\
      id\
      username\
    }\
 }\
 " | jq
```

## Examples

<img width="704" alt="スクリーンショット 2022-12-04 1 36 25" src="https://user-images.githubusercontent.com/71201308/205452651-e526ebf5-1f1d-4854-9d7e-d896d13b0391.png">

<img width="697" alt="スクリーンショット 2022-12-04 1 38 53" src="https://user-images.githubusercontent.com/71201308/205452679-31fe09f0-75a0-4051-bb03-0a252be050ff.png">


![スクリーンショット 2022-12-04 2 03 33](https://user-images.githubusercontent.com/71201308/205452807-6029eee0-0f1a-4288-95cb-cec6aa29082f.png)
