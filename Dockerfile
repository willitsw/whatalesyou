FROM node:18

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV ENVIRONMENT ${ENVIRONMENT}
ENV DJANGO_DEBUG ${DJANGO_DEBUG}
ENV DJANGO_SECRET_KEY ${DJANGO_SECRET_KEY}
ENV PG_NAME ${PG_NAME}
ENV PG_USER ${PG_USER}
ENV PG_PASSWORD ${PG_PASSWORD}
ENV PG_HOST ${PG_HOST}
ENV PG_PORT ${PG_PORT}
ENV GOOGLE_EMAIL_USER ${GOOGLE_EMAIL_USER}
ENV GOOGLE_EMAIL_PASSWORD ${GOOGLE_EMAIL_PASSWORD}
ENV EMAIL_BACKEND ${EMAIL_BACKEND}
ENV CYPRESS_baseUrl ${CYPRESS_baseUrl}

WORKDIR /opt/app

# install python
RUN apt update \
    && apt install python3-launchpadlib -y \
    && apt install software-properties-common -y \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt update \
    && apt install python3.11 -y \
    && apt install python3-pip -y

# install cypress deps
RUN apt install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y

ENV PATH="/opt/app/venv/bin:$PATH"

# Copy project
COPY . .

# backend deps
RUN pip install "poetry==1.3.2" --break-system-packages
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi

# frontend deps and build
RUN npm update
RUN npm ci
RUN npm run build

# collect static files
RUN python3 manage.py collectstatic --noinput

CMD gunicorn whatalesyou.wsgi:application --bind "0.0.0.0:$PORT"
