# ashfield-telephone-tree
Community telephone support for local residents during Corona Virus lockdown

Development setup steps (assumes you already have a firebase project setup)

1. cp functions/data.json.example and fill with real data
2. run ./generateToken.sh 
3. cp sample-env to .env and add the firebase token to this file
4. docker-compose up --build -d
5. ./login.sh to login to the docker containter
6. once you have a shell in the container run yarn install
7. to run the functions locally run yarn serve
8. You now have http functions running on port 5001
9. You can use ngrok to proxy requests through a public hostname if required 
