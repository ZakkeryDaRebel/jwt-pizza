# Integration Testing with Docker Images

## Overview

While writing some of my front end tests, I was running my backend to ensure that everything worked as expected. But then when I had tried to push my code, my ci pipeline failed it because my backend wasn't running. So I had to spend quite some time mocking out the backend so that my front end code can work successfully.

Mocking the backend is a good idea for unit tests and for making sure specific parts of the front end work. But the moment you try to mock a backend, it can no longer be considered integration testing. And so I was curious about if there was a way to include integration testing without mocking.

I recall back in CS 240, my frontend and backend were on the same repository, so I doubt that it would be hard to just run up the ServerMain and then run tests for the front end. But since in CS 329, the frontend and backend were on separate repositories, I was not sure how to do it.

I then met with Dr. Jensen after class one day to ask how it was done, and he told me that it would probably need to use docker images and containers, which I hadn't heard of before. But with the hope in me that there is a way, I started to do my research.

## Docker Images

Since I had never known what a docker image is before, I had to look it up. Turns out, that docker images are basically a copy of your code with all the information needed to run it, such as environment variables, runtime and dependencies all set up.

## Docker Container

The Docker container stores the image and allows the image to be run in it's own environment and is handled all by itself without any human interaction required.

## How this relates to JWT Pizza

In order for my front end integration tests to run and work, they need my backend to run. So for my github workflow, it will need to grab the docker image of my backend, store it in a container, and run that container.

As it is running the container / image, then my front end can run all of it's integration tests and those will all pass thanks to my backend being up and able to process all of the different frontend requests and pass back the correct backend responses.

## Changes to backend

Now, in order for my docker image to be created, I had AI help me create a DockerFile which was used to build the docker image. This docker image chooses the language, shows the dependencies to be installed, copies the code, and allows the code to be run.

Then after I had the DockerFile created, I also added the following lines to my backend ci.yml to create and store the Docker Image:

```yml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build Docker image
  run: |
    docker build -t ghcr.io/zakkerydarebel/jwt-pizza-service-docker-image:${{ github.sha }} .
    docker tag ghcr.io/zakkerydarebel/jwt-pizza-service-docker-image:${{ github.sha }} ghcr.io/zakkerydarebel/jwt-pizza-service-docker-image:latest

- name: Push Docker image to GHCR
  run: |
    docker push ghcr.io/zakkerydarebel/jwt-pizza-service-docker-image:${{ github.sha }}
    docker push ghcr.io/zakkerydarebel/jwt-pizza-service-docker-image:latest
```

Through these steps, as you can read by the name, I login to the GitHub Container Registry (GHCR), build the docker image using the DockerFile, and then push the DockerImge to the GHCR that I had just logged into. This is required because if I didn't store it somewhere, then it would be deleted as soon as the github workflow was finished.

The final change I had made to the ci.yml was with writing the config file. In there, I changed the connection for the database, specifically the host part to: `host: process.env.DB_HOST || '127.0.0.1',`. This means that the backend will normally use the host of 127.0.0.1 unless it has a envionment variable of DB_HOST. This is important because unless we can change the host, then the backend's sql will be impossible to access from the front end, even with a docker file.

What I mean by that is, when I push my backend code through the ci pipeline and github workflow, it will build the mysql backend for those tests. But that is only for when the github workflow / ci pipeline is. Then the docker image expects the backend to still be there when it was taken down after the ci pipeline finished. So when I run my frontend ci pipeline through the github workflow, I had to start up my own mysql and tell the backend to reference that mysql database as a environemt variable so that the backend can run successfully.

## Changes to frontend

As I had stated above, one of the changes I made to the ci was to add the mysql service and pass that as a parameter to the docker image which was also considered one of the services.

```yml
services:
  mysql:
    image: mysql:8.0.29
    env:
      MYSQL_ROOT_PASSWORD: tempdbpassword
      MYSQL_DATABASE: pizza
    ports:
      - "3306:3306"
    options: >-
      --health-cmd "mysqladmin ping -ptempdbpassword"
      --health-interval 10s
      --health-start-period 10s
      --health-timeout 5s
      --health-retries 10
  jwt-pizza-service:
    image: ghcr.io/zakkerydarebel/jwt-pizza-service-docker-image:latest
    ports:
      - 3000:3000
    env:
      DB_HOST: mysql
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      FACTORY_API_KEY: ${{ secrets.FACTORY_API_KEY }}
      NET_ID: ${{ secrets.NET_ID }}
```

With this added to the ci pipeline, it will set up both of the services, the mysql database and the docker image using the mysql database created in the frontend, and then it will do all the other set up before running the tests.

In order for this to work as well, I also had to add some of the backend secrets to the front so that they can be passed to the backend, such as the NET_ID.

# Summary

By having the backend store itself by creating a docker image, it allows it to be used in the ci pipeline github workflow. And in so doing, it allows us to be able to create integration tests that don't need mocking, and allows the Development team to know that their frontend code and backend code work as expected, and allow Quality to be assured as all the user's actions have been tested for.
