
#Use a node js official image
FROM node:20.10.0-alpine3.17
RUN mkdir -p /usr/src/app

#Set the working directory inside the container
WORKDIR /usr/src/app

#Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the rest of our app's source code into the container

#COPY src/ .
COPY . .

# Expose the port the app will run our app
EXPOSE 5501

# The command to run our app
CMD ["npm", "run", "dev"] 