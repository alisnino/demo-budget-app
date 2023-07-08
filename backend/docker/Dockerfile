FROM python:3.9.1

WORKDIR /app
COPY files/app/requirements.txt ./

RUN pip install -r requirements.txt
ENV FLASK_APP=app

EXPOSE 5000