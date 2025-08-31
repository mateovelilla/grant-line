docker build -t my-mongo .
docker run -d -p 27017:27017 --name my-mongo my-mongo