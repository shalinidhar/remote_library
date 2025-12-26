# Use node version 20 as the base image 
FROM node:20

#This is the starting point
WORKDIR /app

COPY package*.json ./

# Install app dependencies 
RUN npm install 

#Copy rest of the app into the container 
COPY . .

#Set any environment variables (don't have any)

#I am using port 1234 for this project 
EXPOSE 1234

#Run the app 
CMD ["npx", "tsx", "server.ts"]



