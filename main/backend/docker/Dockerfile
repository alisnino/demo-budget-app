FROM python:3.12.2-bullseye as dev

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

FROM dev as prod

COPY . .

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]