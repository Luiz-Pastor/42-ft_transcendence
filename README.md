# ft_transcendence

ft_transcendence is a fullstack web application developed as the final project of the 42 Common Core. It's focused on user experience, with a responsive design and support for three languages. The app includes secure login with two-factor authentication and is built using a microservices architecture.

![Javascript](https://img.shields.io/badge/Javascript-a?style=for-the-badge&logo=javascript&color=grey)
![Typescript](https://img.shields.io/badge/Typescript-a?style=for-the-badge&logo=typescript&color=b7e6ff)
![ReactJS](https://img.shields.io/badge/React-a?style=for-the-badge&logo=react&color=cyan)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![Python](https://img.shields.io/badge/Python-a?style=for-the-badge&logo=python&color=purple)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-20232A?style=for-the-badge&logo=docker&color=b7e6ff)
![Makefile](https://img.shields.io/badge/Makefile-a?style=for-the-badge&logo=monster&logoColor=orange&color=ffc56f)

You can see the subject [**HERE.**](https://github.com/MGuardia10/42cursus/blob/main/subjects/en/transcendence_subject_en.pdf)

## Installing and running the project:

1- Clone this repository
	
	git clone https://github.com/Luiz-Pastor/42-ft_transcendence.git
2- Create a new `.env` file and fill all the variables listed on `.env.example`

3- Navigate to the new directory and run `make`
	
	cd ft_trascendence
   	make

4- Visit https://localhost:8080 and enjoy!

## Compiling the Program
Webserv comes with a Makefile that includes the following rules:

- `all`: check environment, create certs and build containers to run the app.
- `up`: build and run containers.
- `down`: stop and remove containers running.
- `clean_data`: removes datd from databases.
- `certs`: creates certs for HTTPS.
- `check_env`: checks if everything on `.env` file is OK.
