#Another attempt at dockerizing frontend


# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY ./p3-frontend .

# Install all the dependencies
#RUN cd ./p3-frontend
RUN npm ci

# Generate the build of the application
RUN npm run build --prod


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# # Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/p3-frontend /usr/share/nginx/html

# # Expose port 80
EXPOSE 80

